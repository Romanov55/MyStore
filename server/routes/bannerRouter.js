import { Router } from "express";
import bannerController from "../controllers/bannerController.js";
import checkRole from '../middleware/checkRoleMiddleware.js'


const router = new Router();


router.post('/', checkRole('ADMIN'), bannerController.create)
router.get('/', bannerController.getAll)
router.delete('/:id', bannerController.delete)

export default router;
