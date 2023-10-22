import ApiError from '../error/ApiError.js'

export default function (err, req, res, next) {
    if(err instanceof ApiError) {
        return res.status(err.status).json({message:err.message})
    }
    next(ApiError.internal('Не предвиденная ошибка' + err.message))
}