import {
    DELETE_LOT_BY_ID,
    INSERT_LOT,
    INSERT_WINNER_LOT,
    SELECT_ALL_LOTS,
    SELECT_AUCTION_LOTS,
    SELECT_LOT_BY_ID,
    SELECT_LOT_IMAGES_BY_LOT_ID,
    SELECT_WINNER_BY_LOT_ID,
    UPDATE_LOT_BY_ID,
    UPDATE_LOT_STATUS
} from "../../databaseSQL/lot/LotSqlQuery.js";
import {getRowsOrThrowException} from "../../utils.js";
import ImageService from "../image/ImageService.js";
import LotBetService from "./LotBetService.js";
import Error400 from "../../exceptions/Error400.js";
import Error403 from "../../exceptions/Error403.js";

class LotService {
    async createLot(db, data) {
        if (!data.name || !data.description || !data.seller_id || !data.auction_id || !data.status_id || !data.amount) {
            throw new Error('Missing required fields');
        }
        const result = await db.query(INSERT_LOT, [
            data.name,
            data.description,
            +data.seller_id,
            +data.auction_id,
            +data.status_id,
            +data.amount,
            data.bank_card_number ?? null,
            data.monobank_link ?? null
        ])

        return getRowsOrThrowException(result, "Не змогли створити лот")[0]
    }

    async getAuctionLots(db, auction_id) {
        if (!auction_id) {
            throw new Error400();
        }
        const result = await db.query(SELECT_AUCTION_LOTS, [auction_id])
        return result.rows
    }

    async getLotById(db, lot_id) {
        if (!lot_id) {
            throw new Error400();
        }
        const result = await db.query(SELECT_LOT_BY_ID, [lot_id])
        return getRowsOrThrowException(result, "Не знайшли лот")[0]
    }

    async getLotImagesByLotId(db, lot_id) {
        if (!lot_id) {
            throw new Error400();
        }
        const result = await db.query(SELECT_LOT_IMAGES_BY_LOT_ID, [lot_id])
        return getRowsOrThrowException(result, "Не знайшли зображень")
    }


    async deleteLot(db, lot_id) {
        if (!lot_id) {
            throw new Error400();
        }
        await ImageService.deleteImagesByLotId(db, lot_id)
        const result = await db.query(DELETE_LOT_BY_ID, [lot_id])
        return getRowsOrThrowException(result, "Не змогли видалити лот")[0]
    }

    async isLotOwner(req, lotId) {
        const lot = await this.getLotById(req.db, lotId)

        if (!req.admin_token && req.user.seller_id !== lot.seller_id) {
            throw new Error403("Ти не власник лота");
        }
    }

    async createWinner(db, lotId) {
        if (!lotId) {
            throw new Error400();
        }
        const bets = await LotBetService.getLotBetsByLotId(db, lotId)
        const winnerResult = await db.query(INSERT_WINNER_LOT, [lotId, bets[0].bet_id]);
        return getRowsOrThrowException(winnerResult, "Не змогли створити переможця")[0]
    }

    async getWinnerByLotId(db, lotId) {
        if (!lotId) {
            throw new Error400();
        }
        const result = await db.query(SELECT_WINNER_BY_LOT_ID, [lotId])
        return result.rows
    }

    async updateLotStatus(db, lotId, status_id) {
        if (!lotId || !status_id) {
            throw new Error400();
        }
        await db.query(UPDATE_LOT_STATUS, [lotId, status_id])
    }

    async finishLot(db, lotId) {
        await this.createWinner(db, lotId)
        await this.updateLotStatus(db, lotId, 4)
    }

    async updateLotById(db, data) {
        if (!data.name || !data.description || !data.status_id) {
            throw new Error400();
        }

        const result = await db.query(UPDATE_LOT_BY_ID, [
            data.lotId,
            data.name,
            data.description,
            +data.status_id,
            data.monobank_link ?? null,
            data.bank_card_number ?? null
        ])

        return getRowsOrThrowException(result, "Не змогли оновити лот")[0]
    }

    async getAllLots(db) {
        const result = await db.query(SELECT_ALL_LOTS)
        for (const lot of result.rows) {
            if (lot.lot_status_id === 4) {
                const winners = await this.getWinnerByLotId(db, lot.lot_id)
                lot.winner = winners[0]
            }
            lot.images = await this.getLotImagesByLotId(db, lot.lot_id)
        }
        return result.rows
    }
}

export default new LotService()