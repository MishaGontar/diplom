import {INSERT_NEW_USER, SELECT_USER_BY_USERNAME_OR_EMAIL_WITH_EMAIL} from "../../databaseSQL/user/UserSqlQuery.js";
import bcrypt from "bcrypt";
import {USER_IS_ALREADY_EXIST} from "../../TextConstant.js";
import Error401 from "../../exceptions/Error401.js";
import {getRowsOrThrowException} from "../../utils.js";

class RegistrationService {
    async handleRegistrationUser(db, {username, email, password}) {
        let result = await db.query(SELECT_USER_BY_USERNAME_OR_EMAIL_WITH_EMAIL, [username, email]);
        if (result.rows.length !== 0) {
            throw new Error401(USER_IS_ALREADY_EXIST);
        }

        const hashedPassword = await bcrypt.hash(password, +process.env.AUTH_SALT_ROUND);

        result = await db.query(INSERT_NEW_USER, [username, email, hashedPassword]);
        return getRowsOrThrowException(result, "Не змогли зареєструвати користувача")[0];
    }
}

export default new RegistrationService()