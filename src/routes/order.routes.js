import express from 'express';
import { addOrder } from '../controllers/order.controller.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';
const router=express.Router()
router.post('/add', authenticateUser, addOrder);
export default router;