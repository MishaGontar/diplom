import multer from "multer";
import fs from "node:fs";

const storageTemp = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = 'images/uploads/'
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, `${dir}/`);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = `${uniqueSuffix}-${file.originalname}`;
        cb(null, filename);
    },
});
export const uploadTemp = multer({storage: storageTemp});