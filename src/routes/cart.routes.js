import express from 'express';
import { roles } from '../constants/roles.js';
import {
  getCart,
  addToCart,
  updateCart,
  deleteCart,
  clearCart,
} from '../controllers/cart.controller.js';
import { authenticateUser, authorizerole } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Routes for user
router.get('/', authenticateUser, authorizerole(roles.USER), getCart);
router.post('/', authenticateUser, authorizerole(roles.USER), addToCart);
router.put('/:id', authenticateUser, authorizerole(roles.USER), updateCart);
router.delete('/clear', authenticateUser, authorizerole(roles.USER), clearCart);
router.delete('/:id', authenticateUser, authorizerole(roles.USER), deleteCart);

export default router;
