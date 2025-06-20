import express from 'express';
import { changePassword, getMe, logout, refreshToken } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/change-password', changePassword);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.post('/me', getMe);

export default router;
