import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { Device, DeviceInfo } from '../models/models.js';
import ApiError from '../error/ApiError.js';
import fs from 'fs';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DeviceController {
    // Метод для создания нового устройства
    async create(req, res, next) {
        try {
            // Извлекаем данные из запроса
            let { name, price, brandId, typeId, info } = req.body;
            const { img } = req.files;

            // Проверка на обязательные поля
            if (!name || !price || !brandId || !typeId) {
                return next(ApiError.badRequest('Основные поля должны быть заполнены'));
            }

            // Проверка на наличие изображения
            if (!img) {
                return next(ApiError.badRequest('Изображение не загружено'));
            }

            // Генерируем уникальное имя файла с помощью uuid
            let fileName = uuidv4() + ".jpg";
            img.mv(path.resolve(__dirname, '..', 'static', fileName));
            const device = await Device.create({ name, price, brandId, typeId, img: fileName });

            // Если есть информация о устройстве, добавляем ее
            if (info) {
                info = JSON.parse(info);
                info.forEach(i => 
                    DeviceInfo.create({
                        title: i.title,
                        description: i.description,
                        deviceId: device.id
                    })
                );
            }

            // Возвращаем данные об устройстве в ответе
            return res.json(device);
        } catch (e) {
            // Если произошла ошибка, передаем ее обработчику ошибок
            next(ApiError.badRequest(e.message));
        }
    }

    // Метод для получения списка устройств
    async getAll(req, res, next) {
        let { brandId, typeId, limit, page } = req.query;
        page = page || 1;
        limit = limit || 9;
        let offset = page * limit - limit;

        let devices;

        // Получаем устройства в зависимости от параметров запроса
        if (!brandId && !typeId) {
            devices = await Device.findAndCountAll({ limit, offset });
        } else if (brandId && !typeId) {
            devices = await Device.findAndCountAll({ where: { brandId }, limit, offset });
        } else if (!brandId && typeId) {
            devices = await Device.findAndCountAll({ where: { typeId }, limit, offset });
        } else {
            devices = await Device.findAndCountAll({ where: { typeId, brandId }, limit, offset });
        }

        return res.json(devices);
    }

    // Метод для получения информации о конкретном устройстве
    async getOne(req, res, next) {
        const { id } = req.params;
        const device = await Device.findOne({
            where: { id },
            include: [{ model: DeviceInfo, as: 'device_infos' }]
        });

        // Проверка на существование устройства
        if (!device) {
            return next(ApiError.badRequest('Продукт не найден'));
        }

        return res.json(device);
    }

    // Метод для удаления устройства
    async delete(req, res, next) {
        try {
            const { id } = req.params;

            if (!id) {
                return next(ApiError.badRequest("Не указан ID устройства"));
            }

            const device = await Device.findByPk(id);

            if (!device) {
                return next(ApiError.notFound("Устройство не найдено"));
            }

            // Удалите файл изображения (если это необходимо)
            const imagePath = path.resolve(__dirname, '..', 'static', device.img);
            fs.unlinkSync(imagePath);

            await device.destroy();

            return res.json({ message: "Устройство успешно удалено" });
        } catch (error) {
            console.error('Ошибка при удалении устройства', error);
            next(ApiError.internal(error.message));
        }
    }

}

export default new DeviceController();
