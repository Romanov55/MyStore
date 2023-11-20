import { fileURLToPath } from 'url';
import { Banner } from "../models/models.js";
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import ApiError from "../error/ApiError.js";
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


class BannerController {
    // Метод для создания нового баннера
    async create(req, res, next) {
        try {
            const { banner }  = req.files || {};

            // Проверка на наличие изображения
            if (!banner) {
                return next(ApiError.badRequest('Изображение не загружено'));
            }

            const fileName = uuidv4() + path.extname(banner.name);
            banner.mv(path.resolve(__dirname, '..', 'static', fileName));

            await Banner.create({ url: fileName });
            
            return res.json({ message: 'Баннер добавлен', bannerUrl: fileName });
        } catch (error) {
            console.error('Ошибка при создании баннера', error);
            next(ApiError.internal(error.message))
        }
    }

    // Метод для получения всех баннеров
    async getAll(req, res, next) {
        try {
            const banners = await Banner.findAll();
            return res.json(banners);
        } catch (error) {
            console.error('Ошибка при получении баннеров', error);
            next(ApiError.internal(error.message))
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;

            if (!id) {
                return next(ApiError.badRequest("Не указан ID баннера"));
            }

            const banner = await Banner.findByPk(id);

            if (!banner) {
                return next(ApiError.notFound("Баннер не найден"));
            }

            const imagePath = path.resolve(__dirname, '..', 'static', banner.url);
            fs.unlinkSync(imagePath);

            await banner.destroy();

            return res.json({ message: "Баннер успешно удален" });
        } catch (error) {
            console.error('Ошибка при удалении баннера', error);
            next(ApiError.internal(error.message));
        }
    }
}

export default new BannerController();
