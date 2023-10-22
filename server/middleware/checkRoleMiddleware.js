import jwt from 'jsonwebtoken'
import ApiError from '../error/ApiError.js'

export default function (role) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            next()
        }
        try {
            const token = req.headers.authorization.split(' ')[1] // Bearer asdfsdfsdas
            if (!token) {
                next(ApiError.forbidden('Не авторизован'))
            }
            const decoded = jwt.verify(token, process.env.SECRET_KEY)
            if (decoded.role !== role) {
                next(ApiError.forbidden('Нет доступа'))
            }
            req.user = decoded
            next()
        } catch (e) {
            next(ApiError.forbidden('Не авторизован'))
        }
    }
}