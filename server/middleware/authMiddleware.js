import ApiError from '../error/ApiError.js'
import jwt from 'jsonwebtoken'

export default function (req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1] // Bearer asdfsdfsdas
        if (!token) {
            next(ApiError.unauthorized('Токен отсутствует'))
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        
        req.user = decoded
        next()
    } catch (e) {
        next(ApiError.unauthorized('Ошибка авторизации', e))
    }
}
