import {deleteRequestFiles, deleteTokenExpiredKeys, getErrorResponse, getUserFromRequest} from "../../utils.js";
import LotBetService from "../../services/lot/LotBetService.js";
import UserService from "../../services/user/UserService.js";
import AuctionService from "../../services/auction/AuctionService.js";
import ImageService from "../../services/image/ImageService.js";
import Error403 from "../../exceptions/Error403.js";
import authService from "../../services/auth/AuthService.js";
import SellerService from "../../services/seller/SellerService.js";

class UserController {
    async getUser(req, res) {
        try {
            const {user} = req;
            await UserService.throwIfUserBlocked(req.db, user.user_id)

            let current_user = await SellerService.findSellerByUserId(req.db, user.user_id);
            if (!current_user) {
                current_user = await UserService.getUserByUsernameOrEmail(req.db, user.username);
            }
            delete current_user.password;
            return res.status(200).send(current_user)
        } catch (e) {
            console.log("Error during getUsername ", e)
            return res.status(400).send({message: 'Не змогли отримати користувача'})
        }
    }

    async getUserBets(req, res) {
        const {user} = getUserFromRequest(req)
        try {
            const bets = await LotBetService.getBetsForUser(req.db, user.user_id)
            res.status(200).send({bets: bets || null})
        } catch (e) {
            console.error(`getUserBets error: `, e)
            return getErrorResponse(res, e)
        }
    }

    async deleteUserById(req, res) {
        const {user_id, seller_id} = req.user;
        try {
            if (seller_id) {
                const auctions = await AuctionService.getAuctionsBySellerId(req.db, seller_id);
                for (const auction of auctions) {
                    await AuctionService.deleteAuction(req.db, auction)
                }
            }
            const user = await UserService.deleteUserById(req.db, user_id)
            return res.status(200).send({message: 'Користувач видалився', user: user})
        } catch (e) {
            console.error(`deleteUserById `, e)
            return getErrorResponse(res, e)
        }
    }

    async deleteUserByUrl(req, res) {
        req.user.user_id = +req.params.id
        req.user.seller_id = +req.params.sellerId
        console.log(req.user)
        await new UserController().deleteUserById(req, res)
    }

    async getAllUsers(req, res) {
        try {
            const users = await UserService.getAllUsers(req.db)
            return res.status(200).send({users: users})
        } catch (e) {
            console.error(`getAllUsers `, e)
            return getErrorResponse(res, e)
        }
    }

    async updateUserPhoto(req, res) {
        try {
            if (!req.file) {
                throw new Error403("Не вибрано зображення")
            }

            const new_img = await ImageService.createImage(req.db, req.file);
            const data = {
                user_id: req.user.user_id,
                image_id: new_img.id
            }
            await UserService.updatePhoto(req.db, data)
            const new_user = req.user;
            new_user.image_url = new_img.image_url;
            deleteTokenExpiredKeys(new_user)
            const token = authService.generateAccessToken(new_user)
            return res.status(200).send({token: token, image_url: new_img.image_url})
        } catch (e) {
            console.error(`updateUserPhoto `, e)
            deleteRequestFiles(req)
            return getErrorResponse(res, e)
        }
    }

    async blockUserById(req, res) {
        try {
            const user_id = req.params.id
            await UserService.blockUserById(req.db, user_id)
            return res.status(202).send({});
        } catch (e) {
            console.error('Error during block user :', e);
            return getErrorResponse(res, e)
        }
    }

    async unblockUserById(req, res) {
        try {
            const user_id = req.params.id
            await UserService.unblockUserById(req.db, user_id)
            return res.status(202).send({});
        } catch (e) {
            console.error('Error during unblock user :', e);
            return getErrorResponse(res, e)
        }
    }

    async getAllBlockedUsers(req, res) {
        try {
            const users = await UserService.getAllBlockedUsers(req.db)
            return res.status(200).send(users)
        } catch (e) {
            console.error('Error during get all blocked users :', e);
            return getErrorResponse(res, e)
        }
    }
}

export default new UserController()