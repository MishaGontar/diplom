import {AUTH_DATA_REQUIRED_MSG} from "../../TextConstant.js";
import RegistrationService from "../../services/auth/RegistrationService.js";
import AuthService from "../../services/auth/AuthService.js";
import {getErrorResponse} from "../../utils.js";

class RegistrationController {
    async registrationUser(req, res) {
        const {username, email, password} = req.body;
        if (!username || !password || !email) {
            return res.status(400).send({message: AUTH_DATA_REQUIRED_MSG});
        }
        const {db} = req;
        try {
            const user = await RegistrationService.handleRegistrationUser(db, req.body);
            await AuthService.sendEmailCode(db, email, user.user_id)
            const mfa_token = await AuthService.generateAccessToken(user)
            res.status(201).send({token: mfa_token});
        } catch (e) {
            console.error('Error during registration as user:', e);
            return getErrorResponse(res, e)
        }
    }
}

export default new RegistrationController()