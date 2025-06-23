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
} from '../controllers/auth.controller.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';
import {
  registrationSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from '../Validate/validationSchema.js';
import { validate } from '../middlewares/validator.js';
const router = express.Router();

router.post('/forgot-password', validate(forgotPasswordSchema), forgotPasswordController);
router.post('/reset-password/:token', validate(resetPasswordSchema), resetPasswordController);
router.post('/change-password', validate(changePasswordSchema), authenticateUser, changePassword);
router.post('/refresh-token', refreshToken);
router.get('/me', authenticateUser, getMe);
router.post('/login', validate(loginSchema), login);
router.post('/register', validate(registrationSchema), register);
router.post('/logout', authenticateUser, logout);
export default router;
