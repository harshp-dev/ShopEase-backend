import express from 'express';
import { deleteProductbyId, fetchProducts } from '../controllers/product.controller.js';
import { authenticateUser, authorizerole } from '../middlewares/authMiddleware.js';
import { roles } from '../constants/roles.js';

const router = express.Router();

router.get('/products', authenticateUser, fetchProducts);
router.delete(
  '/products/:productId',
  authenticateUser,
  authorizerole(roles.ADMIN),
  deleteProductbyId,
);

export default router;
