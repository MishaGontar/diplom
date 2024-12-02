import path from "path";
import fs from "node:fs";
import {
    DELETE_IMAGE_BY_ID,
    DELETE_IMAGE_BY_URL,
    GET_IMAGE_BY_FILENAME,
    INSERT_IMAGE
} from "../../databaseSQL/image/ImageSqlQuery.js";
import {deleteFileByPath, getRowsOrThrowException} from "../../utils.js";
import {DELETE_LOT_IMAGES_BY_LOT_ID, INSERT_LOT_IMAGE} from "../../databaseSQL/lot/LotSqlQuery.js";
import Error404 from "../../exceptions/Error404.js";

class ImageService {
    async createImageLot(db, files, lot_id) {
        for (const file of files) {
            const img_db = await this.createImage(db, file)
            if (!img_db) {
                throw new Error("Not create image")
            }
            const img_lot_db = await db.query(INSERT_LOT_IMAGE, [lot_id, img_db.id])
            if (!img_lot_db) {
                throw new Error("Not create lot image")
            }
        }
        return true
    }

    async createImage(db, file) {
        const {filename} = file;
        const url = `/images/${filename}`
        const fileBytes = fs.readFileSync(file.path);
        const result = await db.query(INSERT_IMAGE, [filename, url, fileBytes]);
        return getRowsOrThrowException(result, "Не змогли створити зображення")[0];
    }

    async deleteImageByUrl(db, url) {
        const result = await db.query(DELETE_IMAGE_BY_URL, [url]);
        if (!result) {
            console.warn(`Can't delete image by url: ${url}`)
            return;
        }
        await this.deleteImageByFileName(result.rows[0].name)
        console.log(`Delete successful by url : ${url}`)
    }

    async deleteImageById(db, id) {
        const result = await db.query(DELETE_IMAGE_BY_ID, [id]);
        if (!result) {
            console.warn(`Can't delete image by id: ${id}`)
            return;
        }
        await this.deleteImageByFileName(result.rows[0].name)
        console.log(`Delete successful by id : ${id}`)
    }

    async deleteImageByFileName(filename) {
        const imag_path = await this.getImageUploadPath(filename);
        deleteFileByPath(imag_path)
    }

    async getImageUploadPath(filename) {
        return await this.getImagePath(filename, '/images/uploads')
    }

    async getImageBytes(db,filename) {
        const result = await db.query(GET_IMAGE_BY_FILENAME, [filename]);
        return getRowsOrThrowException(result, "Не змогли знайти зображення")[0]
    }

    async getImagePath(filename, fileDir) {
        const __dirname = path.resolve(path.dirname(''));
        const imagePath = path.join(__dirname, fileDir, filename);

        try {
            await fs.promises.access(imagePath, fs.constants.F_OK)
            console.log(`File exist ${imagePath}`)
            return imagePath;
        } catch (e) {
            throw new Error404(`Не знайшли файл по ${imagePath}`);
        }
    }

    async deleteImagesByLotId(db, lotId) {
        const image_delete_result = await db.query(DELETE_LOT_IMAGES_BY_LOT_ID, [lotId])
        if (image_delete_result.rows.length === 0) {
            console.warn(`Can't delete lot_images ${lotId}`)
        }
        for (const image of image_delete_result.rows) {
            await this.deleteImageById(db, image.img_id)
        }
    }
}

export default new ImageService();