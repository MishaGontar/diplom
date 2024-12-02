import fs from 'fs';
import ImageService from '../../services/image/ImageService.js';
import {getErrorResponse} from "../../utils.js";
import Error404 from "../../exceptions/Error404.js";

class ImageController {
    async getUploadImage(req, res) {
        const {filename} = req.params;
        try {
            try {
                const imagePath = await ImageService.getImageUploadPath(filename);
                await fs.access(imagePath, fs.constants.F_OK, (err) => {
                    if (err) {
                        throw Error404("Файл не знайдено в файловій системі.");
                    }
                });
                res.sendFile(imagePath);
            } catch (err) {
                console.warn("Спробуємо отримати байти");

                const photo = await ImageService.getImageBytes(req.db, filename);
                const split_img = photo.image_url.split(".");
                const extension = split_img[split_img.length - 1].toLowerCase();

                const type = extension === "jpg" ? "jpeg" : extension;
                res.writeHead(200, {'Content-Type': `image/${type}`});
                res.end(photo.photo_data);
            }
        } catch (e) {
            console.error(e);
            return getErrorResponse(res, e)
        }
    }
}

export default new ImageController();
