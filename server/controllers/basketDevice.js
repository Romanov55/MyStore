import { Basket } from "../models/models.js";
import ApiError from "../error/ApiError.js";

class BasketController {
    // Метод для создания корзины для нового пользователя
    async createBasket(req, res, next) {
        try {
            const { userId } = req.body;

            if (!userId) {
                return next(ApiError.badRequest("Недостаточно данных для создания корзины"));
            }

            const basket = await Basket.create({ userId });
            return res.json(basket); // Вернуть успешный результат (созданная корзина)
        } catch (error) {
            console.error('Ошибка при создании корзины', error);
            next(ApiError.internal(error.message));
        }
    }

    // Метод для получения информации о корзине пользователя
    async getBasketInfo(req, res, next) {
        try {
            const { userId } = req.params;

            if (!userId) {
                return next(ApiError.badRequest("Не указан ID пользователя"));
            }

            const basket = await Basket.findOne({
                where: { userId },
                include: [] // Может быть нужно добавить связанные модели (например, товары в корзине)
            });

            return res.json(basket); // Вернуть информацию о корзине
        } catch (error) {
            console.error('Ошибка при получении информации о корзине', error);
            next(ApiError.internal(error.message));
        }
    }
}

export default new BasketController();
