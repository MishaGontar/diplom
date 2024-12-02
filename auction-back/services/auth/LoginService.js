import UserService from "../user/UserService.js";
import bcrypt from "bcrypt";
import {UPDATE_USER_ACTIVATION_STATUS} from "../../databaseSQL/user/UserSqlQuery.js";
import {INCORRECT_DATA} from "../../TextConstant.js";
import Error401 from "../../exceptions/Error401.js";
import {getRowsOrThrowException} from "../../utils.js";

class LoginService {
    async handleLogin(db, {login, password}) {
        const user = await UserService.getUserByUsernameOrEmail(db, login);
        if (!user) {
            throw new Error401(INCORRECT_DATA);
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new Error401(INCORRECT_DATA);
        }

        return user;
    }

    async activateAccount(db, login) {
        const user = await UserService.getUserByUsernameOrEmail(db, login);
        const result = await db.query(UPDATE_USER_ACTIVATION_STATUS, [true, user.user_id]);
        return getRowsOrThrowException(result, "Не вдалось активувати акаунт")[0]
    }
}

export default new LoginService()