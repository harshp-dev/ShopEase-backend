import { Router } from 'express';
import AuthRouter from './auth.routes.js';
import CategoryRouter from './category.routes.js';
import CartRouter from './cart.routes.js';
import OrderRouter from './order.routes.js'
import ProductRouter from './product.routes.js'

const router = Router();

router.use('/auth', AuthRouter);
router.use('/category',CategoryRouter)
router.use('/order',OrderRouter)
router.use('/products',ProductRouter)
router.use('/cart', CartRouter);

export default router;
