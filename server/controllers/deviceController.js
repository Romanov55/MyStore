import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { Device, DeviceInfo, DeviceImage } from '../models/models.js';
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
            const { images } = req.files;

            // Проверка на обязательные поля
            if (!name || !price || !brandId || !typeId) {
                return next(ApiError.badRequest('Основные поля должны быть заполнены'));
            }

            // Проверка на наличие изображения
            if (!images) {
                return next(ApiError.badRequest('Изображение не загружено'));
            }

            // Генерируем уникальное имя файлов с помощью uuid
            const imageUrls = [];
            if (Array.isArray(images)) {
                // images - это массив изображений
                for (const image of images) {
                    const fileName = uuidv4() + path.extname(image.name);
                    image.mv(path.resolve(__dirname, '..', 'static', fileName));
                    imageUrls.push(fileName);
                }
            } else {
                // images - это единственное изображение
                const fileName = uuidv4() + path.extname(images.name);
                images.mv(path.resolve(__dirname, '..', 'static', fileName));
                imageUrls.push(fileName);
            }
            
            const device = await Device.create({ name, price, brandId, typeId });
            
            for (const imageUrl of imageUrls) {
                // Создайте запись в таблице DeviceImage
                await DeviceImage.create({ deviceId: device.id, url: imageUrl });
            }

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
        try {
            // ... ваш код запроса к базе данных ...
            let { brandId, typeId, limit, page } = req.query;
            page = page || 1;
            limit = limit || 10;
            let offset = page * limit - limit;

            let devices;

            // Получаем устройства в зависимости от параметров запроса, включая DeviceImage
            const includeOptions = [
                { model: DeviceInfo, as: 'device_infos',  },
                { model: DeviceImage, as: 'device_images' }
            ];

            // Получаем устройства в зависимости от параметров запроса
            if (!brandId && !typeId) {
                devices = await Device.findAndCountAll({ limit, offset, include: includeOptions });
            } else if (brandId && !typeId) {
                devices = await Device.findAndCountAll({ where: { brandId }, limit, offset, include: includeOptions });
            } else if (!brandId && typeId) {
                devices = await Device.findAndCountAll({ where: { typeId }, limit, offset, include: includeOptions });
            } else {
                devices = await Device.findAndCountAll({ where: { typeId, brandId }, limit, offset, include: includeOptions });
            }

            return res.json(devices);
        } catch (error) {
            console.error('Ошибка при получении устройств:', error);
            return next(ApiError.internal('Ошибка при получении устройств'));
        }
    }

    // Метод для получения информации о конкретном устройстве
    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const device = await Device.findOne({
                where: { id },
                include: [
                    { model: DeviceInfo, as: 'device_infos',  },
                    { model: DeviceImage, as: 'device_images' }
                ]
            });

            // Проверка на существование устройства
            if (!device) {
                return next(ApiError.badRequest('Продукт не найден'));
            }

            return res.json(device);
        } catch (error) {
            console.error('Ошибка при получении устройства', error);
            return next(ApiError.internal('Ошибка при получении устройства'));
        }
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
    
            // Получаем список связанных изображений
            const deviceImages = await DeviceImage.findAll({ where: { deviceId: device.id } });
    
            // Удаляем файлы изображений
            for (const deviceImage of deviceImages) {
                const imagePath = path.resolve(__dirname, '..', 'static', deviceImage.url);
                fs.unlinkSync(imagePath);
            }
    
            // Удалить связанные изображения из базы данных
            await DeviceImage.destroy({ where: { deviceId: device.id } });
    
            // Удалите само устройство
            await device.destroy();
    
            return res.json({ message: "Устройство и связанные изображения успешно удалены" });
        } catch (error) {
            console.error('Ошибка при удалении устройства', error);
            next(ApiError.internal(error.message));
        }
    }

    async update(req, res, next) {
        
        try {
            const { id } = req.params;
            const { name, price, brandId, typeId, info, images_old } = req.body;
            const { images_new } = req.files || {};
            
            if (!id) {
                return next(ApiError.badRequest("Не указан ID устройства"));
            }
    
            const device = await Device.findByPk(id);
    
            if (!device) {
                return next(ApiError.notFound("Устройство не найдено"));
            }
    
            // Обновление свойств устройства
            if (name) {
                device.name = name;
            }
    
            if (price) {
                device.price = price;
            }
    
            if (brandId) {
                device.brandId = brandId;
            }
    
            if (typeId) {
                device.typeId = typeId;
            }
    
            if (info) {
                const parsedInfo = JSON.parse(info);
                await DeviceInfo.destroy({ where: { deviceId: id } });
    
                parsedInfo.forEach(i => 
                    DeviceInfo.create({
                        title: i.title,
                        description: i.description,
                        deviceId: device.id
                    })
                );
            }

            if (images_old) {
                const existingImages = await DeviceImage.findAll({
                    where: { deviceId: device.id }
                });
            
                // Получите массив существующих id изображений
                const existingImageIds = existingImages.map(image => image.id);
            
                for (const id of existingImageIds) {
                    // Если id изображения не существует в переданных images_old, удалите его
                    if (!images_old.includes(id)) {
                        const deviceImg = await DeviceImage.findByPk(id);
                        if (deviceImg) {
                            const imagePath = path.resolve(__dirname, '..', 'static', deviceImg.url);
                            fs.unlinkSync(imagePath);
                            await deviceImg.destroy();
                        }
                    }
                }
            }
        
            if (images_new) {
                // Генерируем уникальное имя файлов с помощью uuid
                const imageUrls = [];
                if (Array.isArray(images_new)) {
                    // images - это массив изображений
                    for (const image of images_new) {
                        const fileName = uuidv4() + path.extname(image.name);
                        image.mv(path.resolve(__dirname, '..', 'static', fileName));
                        imageUrls.push(fileName);
                    }
                } else {
                    // images_new - это единственное изображение
                    const fileName = uuidv4() + path.extname(images_new.name);
                    images_new.mv(path.resolve(__dirname, '..', 'static', fileName));
                    imageUrls.push(fileName);
                }
                
                for (const imageUrl of imageUrls) {
                    // Создайте запись в таблице DeviceImage
                    await DeviceImage.create({ deviceId: device.id, url: imageUrl });
                }
            }
            
    
            // Сохраните обновленное устройство
            await device.save();
    
            return res.json(device);
        } catch (error) {
            console.error('Ошибка при обновлении устройства', error);
            next(ApiError.internal(error.message));
        }
    }
}

export default new DeviceController();
