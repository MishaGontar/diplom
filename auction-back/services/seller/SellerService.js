import {
    INSERT_SELLER,
    SELECT_ALL_SELLER_STATUS,
    SELECT_SELLER_BY_ID,
    SELECT_SELLER_BY_USER_ID,
    SELECT_SELLERS,
    UPDATE_STATUS_ID
} from "../../databaseSQL/seller/SellerSqlQuery.js";
import {getRowsOrThrowException} from "../../utils.js";
import Error401 from "../../exceptions/Error401.js";
import {SELLER_IS_ALREADY_EXIST} from "../../TextConstant.js";

class SellerService {
    async handleSellerForm(db, formData) {
        const seller = await this.findSellerByUserId(db, formData.user_id);
        if (seller) {
            throw new Error401(SELLER_IS_ALREADY_EXIST)
        }

        return await this.createSeller(db, formData)
    }

    async findSellerById(db, sellerId) {
        const result = await db.query(SELECT_SELLER_BY_ID, [sellerId])
        return getRowsOrThrowException(result, "Не знайшли продавця")[0]
    }

    async findSellerByUserId(db, user_id) {
        try {
            const result = await db.query(SELECT_SELLER_BY_USER_ID, [user_id]);
            return result.rows[0]
        } catch (e) {
            console.error('Cannot find seller:', e.message);
            return null;
        }
    }

    async createSeller(db, formData) {
        const result = await db.query(INSERT_SELLER, [
            formData.user_id,
            formData.full_name,
            formData.social_media,
            formData.address ?? null,
            formData.phone_number ?? null,
            formData.description
        ]);
        return getRowsOrThrowException(result, "Не змогли створити продавця")[0];
    }

    async getAllSellers(db) {
        const result = await db.query(SELECT_SELLERS)
        return result.rows
    }

    async acceptSeller(db, seller_id) {
        const result = await db.query(UPDATE_STATUS_ID, [2, seller_id])
        return getRowsOrThrowException(result, "Не змогли оновити статус")[0]
    }

    async rejectSeller(db, seller_id) {
        const result = await db.query(UPDATE_STATUS_ID, [3, seller_id])
        return getRowsOrThrowException(result, "Не змогли оновити статус")[0]
    }

    async getSellerStatus(db) {
        const result = await db.query(SELECT_ALL_SELLER_STATUS)
        return getRowsOrThrowException(result,"Не знайти статуси продавця")
    }
}

export default new SellerService()