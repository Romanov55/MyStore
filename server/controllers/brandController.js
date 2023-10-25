import { Brand } from "../models/models.js";
import ApiError from "../error/ApiError.js";

class BrandController {
    // Метод для создания нового бренда
    async create(req, res, next) {
        try {
            const { name } = req.body;

            if (!name) {
                return next(ApiError.badRequest("Требуется название"));
            }

            const brand = await Brand.create({ name });
            return res.json(brand); // Вернуть успешный результат (бренд)
        } catch (error) {
            console.error('Ошибка при создании бренда', error);
            next(ApiError.internal(error.message))
        }
    }

    // Метод для получения всех брендов
    async getAll(req, res, next) {
        try {
            const brands = await Brand.findAll();
            return res.json(brands); // Вернуть список брендов
        } catch (error) {
            console.error('Ошибка при получении брендов', error);
            next(ApiError.internal(error.message))
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;

            if (!id) {
                return next(ApiError.badRequest("Не указан ID бренда"));
            }

            const brand = await Brand.findByPk(id);

            if (!brand) {
                return next(ApiError.notFound("Бренд не найден"));
            }

            await brand.destroy();

            return res.json({ message: "Бренд успешно удален" });
        } catch (error) {
            console.error('Ошибка при удалении бренда', error);
            next(ApiError.internal(error.message));
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { name } = req.body;

            if (!id) {
                return next(ApiError.badRequest("Не указан ID бренда"));
            }

            if (!name) {
                return next(ApiError.badRequest("Требуется название"));
            }

            const brand = await Brand.findByPk(id);

            if (!brand) {
                return next(ApiError.notFound("Бренд не найден"));
            }

            brand.name = name; // Обновляем значение имени бренда
            await brand.save(); // Сохраняем изменения

            return res.json(brand); // Вернуть успешный результат (измененный бренд)
        } catch (error) {
            console.error('Ошибка при изменении бренда', error);
            next(ApiError.internal(error.message));
        }
    }
}

export default new BrandController();
