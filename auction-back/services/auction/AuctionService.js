import {
    DELETE_AUCTION_BY_ID,
    INSERT_AUCTION,
    SELECT_ALL_AUCTION,
    SELECT_ALL_AUCTION_STATUS,
    SELECT_AUCTION_BY_ID,
    SELECT_AUCTION_BY_SELLER_ID,
    SELECT_ONLY_AUCTION_CREATE_STATUS,
    UPDATE_AUCTION_BY_ID,
    UPDATE_AUCTION_BY_ID_WITHOUT_IMG,
    UPDATE_FINISHED_AUCTION
} from "../../databaseSQL/auction/AuctionSqlQuery.js";
import {getRowsOrThrowException} from "../../utils.js";
import LotService from "../lot/LotService.js";
import ImageService from "../image/ImageService.js";

class AuctionService {
    async createAuction(db, formData) {
        const {name, description, seller_id, status_id, img_id} = formData;
        const result = await db.query(INSERT_AUCTION, [name, description, seller_id, status_id, img_id]);
        return getRowsOrThrowException(result, "Не вдалося створити аукціон")[0];
    }

    async getAuctionsBySellerId(db, sellerId) {
        const result = await db.query(SELECT_AUCTION_BY_SELLER_ID, [sellerId])
        return result.rows
    }

    async getAuctionById(db, id) {
        const result = await db.query(SELECT_AUCTION_BY_ID, [id])
        return getRowsOrThrowException(result, "Не змогли найти аукціон")[0]
    }

    async getAuctionStatuses(db) {
        const result = await db.query(SELECT_ALL_AUCTION_STATUS)
        return getRowsOrThrowException(result, "Не змогли найти статуси продавців")
    }

    async getOnlyAuctionCreateStatus(db) {
        const result = await db.query(SELECT_ONLY_AUCTION_CREATE_STATUS)
        return getRowsOrThrowException(result, "Не змогли найти статуси аукціону")
    }

    async updateAuction(db, form) {
        const {auction_id, auction_name, auction_description, auction_status_id, new_img_id} = form

        const sqlQuery = new_img_id
            ? UPDATE_AUCTION_BY_ID
            : UPDATE_AUCTION_BY_ID_WITHOUT_IMG;

        const values = [
            auction_name,
            auction_description,
            +auction_status_id,
            ...(new_img_id ? [new_img_id] : []),
            auction_id
        ];

        const result = await db.query(sqlQuery, values);
        if (+auction_status_id === 5) {
            await db.query(UPDATE_FINISHED_AUCTION, [auction_id])
        }
        return getRowsOrThrowException(result, "Не вдалося оновити аукціон")[0]
    }

    async deleteAuction(db, {auction_id, auction_img_path}) {
        const lots = await LotService.getAuctionLots(db, auction_id);
        if (lots.length === 0) {
            console.warn(`Not found lots for auction ${auction_id}`)
        }

        for (const lot of lots) {
            await LotService.deleteLot(db, lot.id)
        }

        const query_result = await db.query(DELETE_AUCTION_BY_ID, [auction_id])
        const result = getRowsOrThrowException(query_result, "Not delete auction")[0]
        await ImageService.deleteImageByUrl(db, auction_img_path)
        return result
    }

    async getAllAuctions(db) {
        const result = await db.query(SELECT_ALL_AUCTION)
        return result.rows
    }
}

export default new AuctionService()