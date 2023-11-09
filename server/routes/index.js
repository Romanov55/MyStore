import { Router } from "express";
const router = new Router();

// Импортируем роутеры для разных частей приложения
import deviceRouter from './deviceRouter.js';
import userRouter from './userRouter.js';
import typeRouter from './typeRouter.js';
import brandRouter from './brandRouter.js';
import bannerRouter from './bannerRouter.js';

// Используем роутеры для разных маршрутов
router.use('/user', userRouter); // Маршрут для пользователей
router.use('/type', typeRouter); // Маршрут для типов устройств
router.use('/brand', brandRouter); // Маршрут для брендов устройств
router.use('/device', deviceRouter); // Маршрут для устройств
router.use('/banner', bannerRouter); // Маршрут для баннеров

export default router;
