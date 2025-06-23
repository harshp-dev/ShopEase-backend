import { Router } from 'express';
import AuthRouter from './auth.routes.js';
import CategoryRouter from './category.routes.js';

const router = Router();
router.use('/auth', AuthRouter);
router.use('/category',CategoryRouter)

export default router;
