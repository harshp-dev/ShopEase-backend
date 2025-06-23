import express from 'express';
import {
  changePassword,
  getMe,
  logout,
  refreshToken,
  forgotPasswordController,
  resetPasswordController,
  login,
  register,
  adminLogin,
} from '../controllers/auth.controller.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/forgot-password', forgotPasswordController);
router.post('/reset-password/:token', resetPasswordController);
router.post('/change-password', authenticateUser, changePassword);
router.post('/refresh-token', refreshToken);
router.get('/me', authenticateUser, getMe);
router.post('/login', login);
router.post('/register', register);
router.post('/logout', authenticateUser, logout);
router.post('/admin-login', adminLogin);
export default router;
