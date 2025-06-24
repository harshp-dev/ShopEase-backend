import express from 'express';
import { createProduct, getProductById, updateProduct } from '../controllers/product.controller.js';
import upload from '../middlewares/multer.js';
import { validate } from '../middlewares/validator.js';
import { productSchema } from '../Validate/validationSchema.js';
import { roles } from '../constants/roles.js';
import { authorizerole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:id', getProductById);
router.post(
  '/',
  upload.array('images'),
  authorizerole(roles.ADMIN),
  validate(productSchema),
  createProduct,
);
router.put(
  '/:id',
  upload.array('images'),
  authorizerole(roles.ADMIN),
  validate(productSchema),
  updateProduct,
);

export default router;
