import pg from "pg";
import path from "path";
import fs from "node:fs";

export default async function setupDB() {
    const db = process.env.POSTGRES_URL
        ? new pg.Pool({
            connectionString: process.env.POSTGRES_URL + "?sslmode=require",
        })
        : new pg.Client({
            user: process.env.POSTGRES_USER,
            host: process.env.POSTGRES_HOST,
            database: process.env.POSTGRES_DB,
            password: process.env.POSTGRES_PASSWORD,
            port: process.env.POSTGRES_PORT
        })
    db.connect()

    if (process.env.SET_UP_SQL_SCRIPT) {
        console.warn("Set up sql script")
        const __dirname = path.resolve(path.dirname(''));
        const setupSQL = fs.readFileSync(path.resolve(__dirname, "./databaseSQL/setup.sql"), "utf8");
        await db.query(setupSQL);
    }
    return db
}