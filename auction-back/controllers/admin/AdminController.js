import {deleteTokenExpiredKeys, getErrorResponse, getUserFromRequest} from "../../utils.js";
import {AUTH_DATA_REQUIRED_MSG, AUTH_FAILED_MSG, AUTH_TOKEN_FAILED_MSG} from "../../TextConstant.js";
import AuthService from "../../services/auth/AuthService.js";
import AdminService from "../../services/admin/AdminService.js";
import jwt from "jsonwebtoken";

class AdminController {

    authenticateAdminToken(req, res, next) {
        const token = req.admin_token

        if (token == null) return res.status(401).send({message: AUTH_TOKEN_FAILED_MSG});
        try {
            jwt.verify(token, process.env.TOKEN_ADMIN_SECRET, (err, admin_user) => {
                console.log(`admin_user: `, admin_user)

                if (err) {
                    console.log(err)
                    return res.status(403).send({message: AUTH_FAILED_MSG});
                }

                delete admin_user.password
                delete admin_user.secure_code
                req.user = admin_user
                next()
            })
        } catch (e) {
            console.log(e)
            return res.status(403).send({message: AUTH_FAILED_MSG});
        }
    }

    async login(req, res) {
        const formData = req.body;
        const {login, password, secure_code} = formData

        if (!login || !password || !secure_code) {
            return res.status(400).send({message: AUTH_DATA_REQUIRED_MSG});
        }

        try {
            const admin = await AdminService.handleLogin(req.db, formData);
            await AuthService.sendEmailCode(req.db, admin.email, admin.user_id)
            const mfa_token = await AuthService.generateAccessToken(admin)
            res.status(201).send({msg: "Повідомлення надіслано", token: mfa_token});
        } catch (e) {
            console.error('Error during login:', e);
            getErrorResponse(res, e.message)
        }
    }

    async confirmCode(req, res) {
        try {
            const {user} = getUserFromRequest(req);
            const {user_id, code} = req.body
            await AuthService.verifyCode(req.db, user_id, code)
            deleteTokenExpiredKeys(user)
            const token = await AuthService.generateAccessAdminToken(user);
            const auth_token = await AuthService.generateAccessToken(user);
            const admin_token = await AuthService.generateAccessToken({token: token})
            res.status(202).send({admin_token: admin_token, auth_token: auth_token});
        } catch (e) {
            console.error('Error during confirm code for admin :', e);
            return getErrorResponse(res, e)
        }
    }

    async check(req, res) {
        try {
            const {user} = getUserFromRequest(req);
            const admin = await AdminService.findAdminByUserId(req.db, user.user_id)
            return res.status(admin !== undefined && admin ? 200 : 403).send({});
        } catch (e) {
            console.error('Error during check admin :', e);
            return getErrorResponse(res, e)
        }
    }
}

export default new AdminController()