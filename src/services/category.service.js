import Category from '../modals/Category.js';
import mongoose from 'mongoose';
import { uploadImage, deleteImage } from '../helpers/cloudinary.js';

export const addCategoryService = async ({ name, fileBuffer }) => {
  if (!name) {
    const error = new Error('Name is required');
    error.statusCode = 400;
    throw error;
  }

  if (!fileBuffer) {
    const error = new Error('Image is required');
    error.statusCode = 400;
    throw error;
  }

  const existing = await Category.findOne({ name });
  if (existing) {
    const error = new Error('Category already exists');
    error.statusCode = 409;
    throw error;
  }

  const imageResult = await uploadImage(fileBuffer, {
    folder: 'categories',
    resource_type: 'image',
  });

  const category = new Category({
    name,
    image: imageResult.secure_url,
  });

  await category.save();

  return {
    id: category._id,
    name: category.name,
    image: category.image,
  };
};

export const deleteCategoryService = async categoryId => {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    const error = new Error('Invalid category id');
    error.statusCode = 400;
    throw error;
  }
  const category = await Category.findById(categoryId);
  if (!category) {
    const error = new Error('Category not found');
    error.statusCode = 404;
    throw error;
  }
  if (category.imagePublicId) {
    await deleteImage(category.imagePublicId);
  }
  await Category.findByIdAndDelete(categoryId);
  return {
    id: category._id,
    name: category.name,
    imageDeleted: !!category.imagePublicId,
  };
};
