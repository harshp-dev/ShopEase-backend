import express from 'express';
import { forgotPasswordController, resetPasswordController } from './controllers/auth.controller';

const router = express.Router();

router.post('/forgot-password', forgotPasswordController);
router.post('/reset-password/:token', resetPasswordController);

export default router;
