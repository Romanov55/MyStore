import { Router } from "express";
import brandController from "../controllers/brandController.js";
import checkRole from '../middleware/checkRoleMiddleware.js'


const router = new Router();


router.post('/', checkRole('ADMIN'), brandController.create)
router.get('/', brandController.getAll)
router.delete('/:id', brandController.delete)

export default router;
