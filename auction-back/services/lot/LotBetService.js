import {getRowsOrThrowException} from "../../utils.js";
import _ from 'lodash';
import {
    DELETE_LOT_BET_BY_ID_AND_LOT_BET_ID,
    INSERT_LOT_BET,
    SELECT_LOT_BET_BY_LOT_ID,
    SELECT_LOT_BETS_BY_USER_ID,
    SELECT_WINNER_LOTS_BY_LOT_BET_ID,
} from "../../databaseSQL/lot/LotBetSqlQuery.js";
import LotService from "./LotService.js";
import Error400 from "../../exceptions/Error400.js";
import Error422 from "../../exceptions/Error422.js";

class LotBetService {
    async getLotBetsByLotId(db, lot_id) {
        if (!lot_id) {
            throw new Error400();
        }
        const result = await db.query(SELECT_LOT_BET_BY_LOT_ID, [lot_id])
        return result.rows
    }

    async bet(db, {lot_id, user_id, amount, is_owner}) {
        if (!lot_id || !amount) {
            throw new Error400();
        }

        console.log(`New amount is ${amount}`)

        if (is_owner) {
            console.warn("Owner create lot bet")
            return await this.createBetLot(db, lot_id, null, amount);
        }

        const the_most_bet = await this.getLotBetsByLotId(db, lot_id)
        if (the_most_bet.length > 0 && the_most_bet[0].amount > amount) {
            throw new Error422("Сума має бути більше ніж теперішня ставка")
        }

        console.warn("User create lot bet")
        return await this.createBetLot(db, lot_id, user_id, amount)
    }

    async getBetsForUser(db, userId) {
        const bets = await this.getBetsByUserId(db, userId);
        if (!bets) {
            return undefined;
        }

        const groupedByLotId = _.groupBy(bets, 'lot_id');
        const maxBets = Object.values(groupedByLotId).map((group) => _.maxBy(group, 'amount'));

        for (const bet of maxBets) {
            const winnerLot = await this.getWinnerBetsByLotBetId(db, bet.bet_id);
            bet.images = await LotService.getLotImagesByLotId(db, bet.lot_id)
            bet.is_winner = !!winnerLot
        }

        return maxBets;
    }

    async getWinnerBetsByLotBetId(db, lotBetId) {
        if (!lotBetId) {
            throw new Error400();
        }
        const result = await db.query(SELECT_WINNER_LOTS_BY_LOT_BET_ID, [lotBetId])
        return result.rows.length > 0 ? result.rows : undefined
    }

    async getBetsByUserId(db, userId) {
        if (!userId) {
            throw new Error400();
        }
        const result = await db.query(SELECT_LOT_BETS_BY_USER_ID, [userId])
        return result.rows.length > 0 ? result.rows : undefined
    }

    async createBetLot(db, lot_id, user_id, amount) {
        if (!lot_id || !amount) {
            throw new Error400();
        }
        const result = await db.query(INSERT_LOT_BET, [lot_id, user_id, amount])
        return getRowsOrThrowException(result, "Не змогли створити ставку для лоту")[0]
    }

    async deleteBetLotByIdAndLotId(db, bet_id, lot_id) {
        if (!bet_id || !lot_id) {
            throw new Error400();
        }

        const result = await db.query(DELETE_LOT_BET_BY_ID_AND_LOT_BET_ID, [bet_id, lot_id])
        return getRowsOrThrowException(result, "Не змогли видалити ставку")[0]
    }
}

export default new LotBetService()