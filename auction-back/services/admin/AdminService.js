import {SELECT_ADMIN_BY_LOGIN, SELECT_ADMIN_BY_USER_ID} from "../../databaseSQL/admin/AdminSqlQuery.js";
import bcrypt from "bcrypt";
import Error503 from "../../exceptions/Error503.js";

class AdminService {
    async handleLogin(db, form_data) {
        const {login, password, secure_code} = form_data;
        const admin = await this.findAdminByLogin(db, login);

        if (!admin) {
            throw new Error503("Не знайшли адміністратора")
        }

        const passwordMatch = await bcrypt.compare(password, admin.admin_password);
        if (!passwordMatch) {
            throw new Error503("Паролі не збігаються")
        }

        const secureCodeMatch = await bcrypt.compare(secure_code, admin.secure_code);
        if (!secureCodeMatch) {
            throw new Error503("Захисний код неправильний")
        }
        delete admin.admin_password;
        delete admin.secure_code
        delete admin.user_password
        delete admin.login
        return admin;
    }

    async findAdminByLogin(db, login) {
        try {
            const result = await db.query(SELECT_ADMIN_BY_LOGIN, [login]);
            return result.rows[0]
        } catch (e) {
            console.error('Error find admin by login:', e.message);
            return null;
        }
    }

    async findAdminByUserId(db, user_id) {
        try {
            const result = await db.query(SELECT_ADMIN_BY_USER_ID, [user_id]);
            return result.rows[0]
        } catch (e) {
            console.error('Error find admin by login:', e.message);
            return null;
        }
    }
}

export default new AdminService();