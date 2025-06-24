import { Router } from 'express';
import AuthRouter from './auth.routes.js';
import CategoryRouter from './category.routes.js';
import ProductRouter from './product.routes.js';

const router = Router();
router.use('/auth', AuthRouter);
router.use('/category', CategoryRouter);
router.use('/product', ProductRouter);

export default router;
