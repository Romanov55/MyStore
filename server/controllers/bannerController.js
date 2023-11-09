import { Banner } from "../models/models.js";
import ApiError from "../error/ApiError.js";

class BannerController {
    // Метод для создания нового баннера
    async create(req, res, next) {
        try {
            const { banner } = req.files|| {};
            console.log(banner)

            // Проверка на наличие изображения
            if (!banner) {
                return next(ApiError.badRequest('Изображение не загружено'));
            }
            
             // Генерируем уникальное имя файлов с помощью uuid
            const bannerUrl = [];

            // banners - это единственное изображение
            const fileName = uuidv4() + path.extname(banner.name);
            banner.mv(path.resolve(__dirname, '..', 'static', fileName));
            bannerUrl.push(fileName);

            await Banner.create({ url: bannerUrl });
            
            return res.json({ message: 'Баннер добавлен', bannerUrl: bannerUrl });
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

            await banner.destroy();

            return res.json({ message: "Баннер успешно удален" });
        } catch (error) {
            console.error('Ошибка при удалении баннера', error);
            next(ApiError.internal(error.message));
        }
    }
}

export default new BannerController();
