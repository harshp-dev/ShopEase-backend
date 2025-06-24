import express from 'express';
import upload from '../middlewares/multer.js';
import {
  addCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from '../controllers/category.controller.js';
import { roles } from '../constants/roles.js';
import { authenticateUser, authorizerole } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validator.js';
import { updateCategorySchema } from '../Validate/validationSchema.js';

const router = express.Router();
router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.post(
  '/add',
  upload.single('image'),
  authenticateUser,
  authorizerole(roles.ADMIN),
  addCategory,
);
router.put(
  '/:id',
  authenticateUser,
  authorizerole(roles.ADMIN),
  upload.single('image'),
  validate(updateCategorySchema),
  updateCategory,
);
router.delete('/delete/:id', authenticateUser, authorizerole(roles.ADMIN), deleteCategory);

export default router;
