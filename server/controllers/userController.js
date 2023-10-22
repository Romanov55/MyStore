import ApiError from "../error/ApiError.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User, Basket } from '../models/models.js'
import dotenv from 'dotenv';

dotenv.config();

const generateJwt = (id, email, role) => {
    return jwt.sign(
        { id, email, role },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
    )
}

class UserController {
    // Метод для регистрации нового пользователя
    async registration(req, res, next) {
        try {
            const { email, password, role } = req.body

            if (!email || !password) {
                return next(ApiError.badRequest('Некорректный email или password'))
            }
            const candidate = await User.findOne({ where: { email } })
            if (candidate) {
                return next(ApiError.badRequest('Пользователь с таким email уже существует'))
            }
            const hashPassword = await bcrypt.hash(password, 5)
            const user = await User.create({ email, role, password: hashPassword })
            const basket = await Basket.create({ userId: user.id })
            const token = generateJwt(user.id, user.email, user.role)

            return res.json({ token })
        } catch (error) {
            console.log('Ошибка при регистрации пользователя', error)
            next(ApiError.internal(error.message))
        }
    }

    // Метод для входа пользователя в систему
    async login(req, res, next) {
        try {
            const { email, password } = req.body
            const user = await User.findOne({ where: { email } })
            if (!user) {
                return next(ApiError.internal('Пользователь не найден'))
            }
            let comparePassword = bcrypt.compareSync(password, user.password)
            if (!comparePassword) {
                return next(ApiError.internal('Указан неверный пароль'))
            }
            const token = generateJwt(user.id, user.email, user.role)
            return res.json({ token })
        } catch (error) {
            console.log('Ошибка при входе в систему', error)
            next(ApiError.internal(error.message))
        }
    }

    // Метод для проверки аутентификации и генерации нового токена
    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role)
        res.json({ token })
    }
}

export default new UserController();
