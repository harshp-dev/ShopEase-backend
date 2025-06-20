import express from 'express';
import {
  changePassword,
  getMe,
  logout,
  refreshToken,
  forgotPasswordController,
  resetPasswordController,
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/forgot-password', forgotPasswordController);
router.post('/reset-password/:token', resetPasswordController);
router.post('/change-password', changePassword);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.post('/me', getMe);

export default router;
