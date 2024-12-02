import SellerService from "../../services/seller/SellerService.js";
import {deleteRequestFiles, deleteTokenExpiredKeys, getErrorResponse, getUserFromRequest} from "../../utils.js";
import AuthService from "../../services/auth/AuthService.js";
import EmailService from "../../services/email/EmailService.js";
import AuctionService from "../../services/auction/AuctionService.js";
import Error404 from "../../exceptions/Error404.js";
import UserService from "../../services/user/UserService.js";

class SellerController {
    async handleSellerForm(req, res) {
        try {
            const {user, formData} = getUserFromRequest(req)
            const auction = await SellerService.handleSellerForm(req.db, formData)
            const new_user = {
                ...user,
                ...auction
            }
            deleteTokenExpiredKeys(new_user)
            const token = AuthService.generateAccessToken(new_user);
            res.status(200).send({new_token: token})
        } catch (e) {
            console.error('Error during handleAuctionForm :', e);
            return getErrorResponse(res, e)
        }
    }

    async getSellerByUserId(req, res) {
        try {
            const seller = await SellerService.findSellerByUserId(req.db, req.user.user_id)
            res.status(200).send({seller: seller})
        } catch (e) {
            console.error('Error during handleAuctionForm :', e);
            return getErrorResponse(res, e)
        }
    }

    async getSellers(req, res) {
        try {
            const sellers = await SellerService.getAllSellers(req.db)
            res.status(200).send({sellers: sellers})
        } catch (e) {
            console.error('Error during getSellers :', e);
            return getErrorResponse(res, e)
        }
    }

    async acceptSeller(req, res) {
        try {
            const {seller_id, email} = req.body
            await SellerService.acceptSeller(req.db, seller_id)
            await new EmailService().sendAcceptSellerMessage(email)
            res.status(200).send({})
        } catch (e) {
            console.error('Error during acceptSeller :', e);
            return getErrorResponse(res, e)
        }
    }

    async rejectSeller(req, res) {
        try {
            const {seller_id, email} = req.body
            await SellerService.rejectSeller(req.db, seller_id)
            await new EmailService().sendRejectSellerMessage(email)
            res.status(200).send({})
        } catch (e) {
            console.error('Error during rejectSeller :', e);
            return getErrorResponse(res, e)
        }
    }

    async getSellersStatuses(req, res) {
        try {
            const status = await SellerService.getSellerStatus(req.db)
            res.status(200).send({status: status})
        } catch (e) {
            console.error('Error during getSellersStatus :', e);
            return getErrorResponse(res, e)
        }
    }

    async checkSellerIds(req, res, next) {
        const seller_id = req.user.seller_id
        const auction_seller_id = +req.body.seller_id

        if (seller_id !== auction_seller_id) {
            deleteRequestFiles(req)
            res.status(403).send({message: "Ти не власник"})
            return;
        }
        next()
    }

    async getSellerInfoById(req, res) {
        try {
            const sellerId = +req.params.id
            if (!sellerId) {
                throw new Error404("Не змогли знайти продавця")
            }
            const seller = await SellerService.findSellerById(req.db, sellerId)
            if (seller.status_id !== 2) {
                throw new Error404("Не змогли знайти продавця")
            }
            const auctions = await AuctionService.getAuctionsBySellerId(req.db, sellerId)
            res.status(200).send({seller, auctions})
        } catch (e) {
            console.error('Error during getSellerById :', e);
            return getErrorResponse(res, e)
        }
    }

    async blockUserById(req, res) {
        try {
            const user_id = req.params.id
            await UserService.blockUserForSeller(req.db, user_id, req.user.seller_id)
            return res.status(202).send({message: "Користувач заблокований"})
        } catch (e) {
            console.error('Error during block user by seller :', e);
            return getErrorResponse(res, e)
        }
    }

    async unblockUserById(req, res) {
        try {
            const user_id = req.params.id
            await UserService.unblockUserForSeller(req.db, user_id, req.user.seller_id)
            return res.status(202).send({message: "Користувач розблакований"})
        } catch (e) {
            console.error('Error during unblock user :', e);
            return getErrorResponse(res, e)
        }
    }

    async getAllBlockUsers(req, res) {
        try {
            const users = await UserService.getAllBlockedUsersBySeller(req.db, req.user.seller_id)
            return res.status(200).send({users: users})
        } catch (e) {
            console.error('Error during get all blocked users :', e);
            return getErrorResponse(res, e)
        }
    }

}

export default new SellerController()