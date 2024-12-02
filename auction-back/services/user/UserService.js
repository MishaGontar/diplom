import {
    BLOCK_USER_BY_ID,
    BLOCK_USER_FOR_SELLER_BY_ID,
    DELETE_INACTIVE_OR_MARKED_USERS,
    DELETE_USER_BY_ID,
    SELECT_ALL_USERS,
    SELECT_BLOCK_SELLER_USERS,
    SELECT_BLOCK_SELLER_USERS_BY_SELLER_ID,
    SELECT_BLOCK_USER_BY_ID,
    SELECT_BLOCK_USERS,
    SELECT_USER_BY_ID,
    SELECT_USER_BY_USERNAME_OR_EMAIL,
    UNBLOCK_USER_BY_ID,
    UNBLOCK_USER_FOR_SELLER_BY_ID,
    UPDATE_USER_PHOTO
} from "../../databaseSQL/user/UserSqlQuery.js";
import Error400 from "../../exceptions/Error400.js";
import {getRowsOrThrowException} from "../../utils.js";
import ImageService from "../image/ImageService.js";
import Error403 from "../../exceptions/Error403.js";

class UserService {
    async getUserByUsernameOrEmail(db, login) {
        const result = await db.query(SELECT_USER_BY_USERNAME_OR_EMAIL, [login]);
        return result.rows[0];
    }

    async getAllUsers(db) {
        const result = await db.query(SELECT_ALL_USERS);
        return result.rows;
    }

    async deleteUserById(db, id) {
        if (!id) {
            throw new Error400();
        }
        const result = await db.query(DELETE_USER_BY_ID, [id]);
        return result.rows[0];
    }

    async updatePhoto(db, {user_id, image_id}) {
        if (!user_id || !image_id) {
            throw new Error400();
        }
        const result_user = await db.query(SELECT_USER_BY_ID, [user_id]);
        const user = getRowsOrThrowException(result_user, "Не змогли знайти користувача")[0];

        const result = await db.query(UPDATE_USER_PHOTO, [image_id, user_id]);
        const new_user = getRowsOrThrowException(result, "Не змогли оновити фото користувача")[0]
        try {
            if (user.image_id !== 1) {
                console.warn("Need to delete old avatar");
                await ImageService.deleteImageById(db, user.image_id);
            } else {
                console.log("It`s standard avatar");
            }
        } catch (e) {
            console.error(e);
            console.warn("Can`t delete old avatar");
        }
        return new_user;
    }

    async blockUserForSeller(db, user_id, seller_id) {
        if (!user_id || !seller_id) {
            throw new Error400();
        }
        const result = await db.query(BLOCK_USER_FOR_SELLER_BY_ID, [seller_id, user_id]);
        return getRowsOrThrowException(result, "Не змогли заблокувати користувача.")[0];
    }

    async unblockUserForSeller(db, user_id, seller_id) {
        if (!user_id || !seller_id) {
            throw new Error400();
        }
        const result = await db.query(UNBLOCK_USER_FOR_SELLER_BY_ID, [seller_id, user_id]);
        return getRowsOrThrowException(result, "Не змогли розблокувати користувача.")[0];
    }

    async getAllBlockedUsersBySeller(db, seller_id) {
        if (!seller_id) {
            throw new Error400();
        }
        const result = await db.query(SELECT_BLOCK_SELLER_USERS);
        return result.rows;
    }

    async blockUserById(db, user_id) {
        if (!user_id) {
            throw new Error400();
        }
        const result = await db.query(BLOCK_USER_BY_ID, [user_id]);
        return getRowsOrThrowException(result, "Не змогли заблокувати користувача в системі.")[0];
    }

    async unblockUserById(db, user_id) {
        if (!user_id) {
            throw new Error400();
        }
        const result = await db.query(UNBLOCK_USER_BY_ID, [user_id]);
        return getRowsOrThrowException(result, "Не змогли розблокувати користувача в системі.")[0];
    }

    async getAllBlockedUsers(db) {
        const result = await db.query(SELECT_BLOCK_USERS);
        return result.rows;
    }

    async isBlockedUserBySeller(db, user_id, seller_id) {
        if (!user_id) {
            throw new Error400();
        }
        const result = await db.query(SELECT_BLOCK_SELLER_USERS_BY_SELLER_ID, [user_id, seller_id]);
        return result.rows.length > 0;
    }

    async isBlockedUserBySystem(db, user_id) {
        if (!user_id) {
            throw new Error400();
        }
        const result = await db.query(SELECT_BLOCK_USER_BY_ID, [user_id]);
        return result.rows.length > 0;
    }

    async throwIfUserBlocked(db, user_id) {
        const isBlocked = await this.isBlockedUserBySystem(db, user_id)
        if (isBlocked) {
            throw new Error403("Користувач заблокований")
        }
    }

    async deleteInactiveOrMarkedUsers(db) {
        console.log("Deleting inactive or marked users");
        const result = await db.query(DELETE_INACTIVE_OR_MARKED_USERS);
        return result.rows
    }
}

export default new UserService();