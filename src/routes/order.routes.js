import express from 'express';
import { addOrder, getAllUserOrders, getUserOrders } from '../controllers/order.controller.js';
import { authenticateUser, authorizerole } from '../middlewares/authMiddleware.js';
const router = express.Router();
router.post('/add', authenticateUser, addOrder);
router.get('/orderall', authenticateUser, authorizerole('ADMIN'), getAllUserOrders);
router.get('/orderlist', authenticateUser, getUserOrders);

export default router;
