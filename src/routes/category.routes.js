import express from 'express';
import upload from '../middlewares/multer.js';
import { addCategory, deleteCategory } from '../controllers/category.controller.js';
const router = express.Router();
router.post('/add', upload.single('image'), addCategory);
router.delete('/delete', deleteCategory);

export default router;
