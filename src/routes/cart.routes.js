import express from 'express';
import { roles } from '../constants/roles.js';
import { getCart, addToCart, updateCart, deleteCart } from '../controllers/cart.controller.js';
import { authenticateUser, authorizerole } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Routes for user
router.get('/', authenticateUser, authorizerole(roles.USER), getCart);
router.post('/', authenticateUser, authorizerole(roles.USER), addToCart);
router.put('/:id', authenticateUser, authorizerole(roles.USER), updateCart);
router.delete('/:id', authenticateUser, authorizerole(roles.USER), deleteCart);

export default router;
