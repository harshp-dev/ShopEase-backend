import { Router } from 'express';
const router = Router();

router.use('/auth', authRoute);
import AuthRouter from './auth.route.js';

const router = Router();

router.use('/auth', AuthRouter);

export default router;
