import jwt from "jsonwebtoken";
import {generateCode, getRowsOrThrowException} from "../../utils.js";
import EmailService from "../email/EmailService.js";
import {
    DELETE_VERIFICATION_CODE,
    INSERT_VERIFICATION_CODE,
    SELECT_VERIFICATION_CODE
} from "../../databaseSQL/user_code/UserCodeSqlQuery.js";
import Error422 from "../../exceptions/Error422.js";
import {INCORRECT_VERIFY_CODE} from "../../TextConstant.js";

class AuthService {

    generateAccessToken(username) {
        return jwt.sign(username, process.env.TOKEN_SECRET, {expiresIn: '30d'});
    }

    generateAccessAdminToken(username) {
        return jwt.sign(username, process.env.TOKEN_ADMIN_SECRET, {expiresIn: '30d'});
    }

    async sendEmailCode(db, email, userId) {
        const code = generateCode();
        const result = await db.query(INSERT_VERIFICATION_CODE, [code, userId]);

        getRowsOrThrowException(result, "Не змогли створити тимчасовий код для користувача")
        await new EmailService().sendConfirmIdentity(email, code)
    }

    async verifyCode(db, user_id, code) {
        const result = await db.query(SELECT_VERIFICATION_CODE, [user_id, code]);

        if (result.rows.length === 0) {
            throw new Error422(INCORRECT_VERIFY_CODE);
        }

        await db.query(DELETE_VERIFICATION_CODE, [user_id, code])
        return true;
    }

}

export default new AuthService();