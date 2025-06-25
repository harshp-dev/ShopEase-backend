import { Router } from 'express';
import AuthRouter from './auth.routes.js';
import CategoryRouter from './category.routes.js';
import OrderRouter from './order.routes.js'

const router = Router();

router.use('/auth', AuthRouter);
router.use('/category',CategoryRouter)
router.use('/order',OrderRouter)

export default router;
