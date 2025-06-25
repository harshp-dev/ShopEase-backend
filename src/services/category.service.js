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

export const getCategoriesService = async ({ page = 1, limit = 10, search }) => {
  try {
    const query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const categories = await Category.find(query)
      .select('name image')
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Category.countDocuments(query);

    return {
      categories,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    };
  } catch (error) {
    const err = new Error('Failed to fetch categories', error);
    err.statusCode = 500;
    throw err;
  }
};

export const getCategoryByIdService = async id => {
  try {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      const error = new Error('Invalid category ID');
      error.statusCode = 400;
      throw error;
    }

    const category = await Category.findById(id).select('name image').lean();
    if (!category) {
      const error = new Error('Category not found');
      error.statusCode = 404;
      throw error;
    }

    return category;
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Failed to fetch category';
    }
    throw error;
  }
};

export const updateCategoryService = async (id, { name, file }) => {
  try {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      const error = new Error('Invalid category ID');
      error.statusCode = 400;
      throw error;
    }

    const category = await Category.findById(id);
    if (!category) {
      const error = new Error('Category not found');
      error.statusCode = 404;
      throw error;
    }
    category.name = name || category.name;
    const path = new URL(category.image).pathname;
    const publicId = path.split('/').slice(4).join('/').replace('.jpg', '');
    if (file) {
      await deleteImage(publicId);
      const imageResult = await uploadImage(file.buffer, {
        folder: 'categories',
        resource_type: 'image',
      });
      category.image = imageResult.secure_url;
    }

    const updatedCategory = await category.save();

    return updatedCategory;
  } catch (error) {
    if (error.code === 11000) {
      const err = new Error('Category name already exists');
      err.statusCode = 409;
      throw err;
    }
    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Failed to update category';
    }
    throw error;
  }
};
