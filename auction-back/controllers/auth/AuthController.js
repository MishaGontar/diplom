import jwt from "jsonwebtoken";
import AuthService from "../../services/auth/AuthService.js";
import {AUTH_FAILED_MSG, AUTH_TOKEN_FAILED_MSG, NEED_CONFIRM_EMAIL_MSG} from "../../TextConstant.js";
import LoginService from "../../services/auth/LoginService.js";
import {deleteTokenExpiredKeys, getErrorResponse} from "../../utils.js";
import SellerService from "../../services/seller/SellerService.js";

class AuthController {
    authenticateToken(req, res, next) {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (token == null) return res.status(401).send({message: AUTH_TOKEN_FAILED_MSG});

        try {
            jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
                console.log(`user: `, user)

                if (err) {
                    console.log(err)
                    return res.status(403).send({message: AUTH_FAILED_MSG});
                }
                if (user.is_activated !== undefined && !user.is_activated)
                    return res.status(403).send({message: NEED_CONFIRM_EMAIL_MSG});

                delete user.password
                if (user.token != null) {
                    req.admin_token = user.token;
                    next()
                    return
                }
                req.user = user
                next()
            })
        } catch (e) {
            console.log(e)
            return res.status(403).send({message: AUTH_FAILED_MSG});
        }
    }


    async confirmCode(req, res) {
        try {
            const {db, user} = req;

            await AuthService.verifyCode(db, user.user_id, req.body.code)
            let updatedUser = user;
            if (!user.is_activated) {
                updatedUser = await LoginService.activateAccount(db, user.username);
            }

            const seller = user.is_activated
                ? await SellerService.findSellerByUserId(db, user.user_id)
                : null;
            const send_user = seller || updatedUser;
            deleteTokenExpiredKeys(send_user)
            const token = await AuthService.generateAccessToken(send_user)
            res.status(202).send({token: token});
        } catch (e) {
            console.error('Error during confirm code :', e);
            return getErrorResponse(res, e)
        }
    }

    getToken(req) {
        const authHeader = req.headers['authorization']
        return authHeader && authHeader.split(' ')[1]
    }

    getUserByToken(req) {
        const token = this.getToken(req)
        return token !== "undefined" ? jwt.verify(token, process.env.TOKEN_SECRET) : null
    }
}

export default new AuthController();