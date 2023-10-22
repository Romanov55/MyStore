import { BasketDevice } from "../models/models.js";
import ApiError from "../error/ApiError.js";

class BasketDeviceController {
    // Метод для добавления товара в корзину
    async addToBasket(req, res, next) {
        try {
            const { userId, deviceId } = req.body;

            if (!userId || !deviceId) {
                return next(ApiError.badRequest("Недостаточно данных для добавления товара в корзину"));
            }

            const basketDeviceItem = await BasketDevice.create({ userId, deviceId });
            return res.json(basketDeviceItem); // Вернуть успешный результат (товар в корзине)
        } catch (error) {
            console.error('Ошибка при добавлении товара в корзину', error);
            next(ApiError.internal(error.message));
        }
    }

    // Метод для получения товаров в корзине пользователя
    async getBasketDeviceItems(req, res, next) {
        try {
            const { userId } = req.params;

            if (!userId) {
                return next(ApiError.badRequest("Не указан ID пользователя"));
            }

            const basketDeviceItems = await BasketDevice.findAll({
                where: { userId },
                include: [] // Может быть нужно добавить связанные модели (например, информацию о товаре)
            });

            return res.json(basketDeviceItems); // Вернуть список товаров в корзине
        } catch (error) {
            console.error('Ошибка при получении товаров в корзине', error);
            next(ApiError.internal(error.message));
        }
    }

    // Метод для удаления товара из корзины
    async removeFromBasket(req, res, next) {
        try {
            const { userId, deviceId } = req.body;

            if (!userId || !deviceId) {
                return next(ApiError.badRequest("Недостаточно данных для удаления товара из корзины"));
            }

            await BasketDevice.destroy({
                where: { userId, deviceId }
            });

            return res.json({ message: "Товар успешно удален из корзины" });
        } catch (error) {
            console.error('Ошибка при удалении товара из корзины', error);
            next(ApiError.internal(error.message));
        }
    }
}

export default new BasketDeviceController();
