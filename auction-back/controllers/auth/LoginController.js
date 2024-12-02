import {AUTH_DATA_REQUIRED_MSG} from "../../TextConstant.js";
import LoginService from "../../services/auth/LoginService.js";
import AuthService from "../../services/auth/AuthService.js";
import {getErrorResponse} from "../../utils.js";
import UserService from "../../services/user/UserService.js";

class LoginController {
    async login(req, res) {
        const {login, password} = req.body;
        if (!login || !password) {
            return res.status(400).send({message: AUTH_DATA_REQUIRED_MSG});
        }

        try {
            const user = await LoginService.handleLogin(req.db, req.body);
            await UserService.throwIfUserBlocked(req.db, user.user_id)
            await AuthService.sendEmailCode(req.db, user.email, user.user_id)
            const mfa_token = await AuthService.generateAccessToken(user)
            res.status(201).send({msg: "Email sent", token: mfa_token});
        } catch (e) {
            console.error('Error during login:', e);
            getErrorResponse(res, e)
        }
    }
}

export default new LoginController()