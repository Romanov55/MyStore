import { Router } from "express";
const router = new Router()
import typeController from "../controllers/typeController.js";
import checkRole from '../middleware/checkRoleMiddleware.js'



router.post('/', checkRole('ADMIN'), typeController.create)
router.get('/', typeController.getAll)
router.delete('/:id', typeController.delete)

export default router;