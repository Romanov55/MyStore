import dotenv from 'dotenv';
import express from 'express';
import sequelize from './db.js';
import { User, Basket, BasketDevice, Device, Type, Brand, Rating, TypeBrand, DeviceInfo } from './models/models.js';
import cors from 'cors'
import fileUpload from 'express-fileupload'
import router from './routes/index.js';
import errorHandler from './middleware/ErrorHandingMiddleware.js'
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Определяем переменные __filename и __dirname, используя import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)

// Обработка ошибок. последний Middleware
app.use(errorHandler)




const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (e) {
        console.error('Sequelize error:', e);
    }
    
};

start();
