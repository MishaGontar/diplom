import cors from "cors";
import bodyParser from "body-parser";

export function applyMiddlewares(app, db) {
    app.use(cors());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use((req, res, next) => {
        req.db = db;
        next();
    });
}