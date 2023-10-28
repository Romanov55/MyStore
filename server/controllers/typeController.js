import { Type } from "../models/models.js";
import ApiError from "../error/ApiError.js";

class TypeController {
    async create(req, res, next) {
        try {
            const { name } = req.body;
            const type = await Type.create({ name });
            return res.json(type);
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }

    async getAll(req, res, next) {
        try {
            const types = await Type.findAll();
            return res.json(types);
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;

            if (!id) {
                return next(ApiError.badRequest("Не указан ID типа"));
            }

            const type = await Type.findByPk(id);

            if (!type) {
                return next(ApiError.notFound("Тип не найден"));
            }

            await type.destroy();

            return res.json({ message: "Тип успешно удален" });
        } catch (error) {
            console.error('Ошибка при удалении типа', error);
            next(ApiError.internal(error.message));
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { name } = req.body;
            

            if (!id) {
                return next(ApiError.badRequest("Не указан ID категории"));
            }

            if (!name) {
                return next(ApiError.badRequest("Требуется название"));
            }

            const type = await Type.findByPk(id);


            if (!type) {
                return next(ApiError.notFound("Категория не найдена"));
            }

            type.name = name; // Обновляем значение имени бренда
            await type.save(); // Сохраняем изменения

            return res.json(type); // Вернуть успешный результат (измененный бренд)
        } catch (error) {
            console.error('Ошибка при изменении категории', error);
            next(ApiError.internal(error.message));
        }
    }
}

export default new TypeController();
