import {
  addCategoryService,
  deleteCategoryService,
  getCategoriesService,
  getCategoryByIdService,
  updateCategoryService,
} from '../services/category.service.js';

// add category
export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const file = req.file;

    const result = await addCategoryService({
      name,
      fileBuffer: file?.buffer,
    });

    res.status(201).json({
      message: 'Category created successfully',
      category: result,
    });
  } catch (error) {
    console.error('Add Category Error:', error.message);
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};

// delete category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'category id is a required' });
    }
    const result = await deleteCategoryService(id);
    res.status(200).json({ message: 'Category deleted successfully', result });
  } catch (error) {
    console.error('Delete category error:', error.message);
    res.status(error.statusCode || 500).json({ message: error.message || 'Server Error' });
  }
};

export const getCategories = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const data = await getCategoriesService({ page, limit, search });
    res.status(200).json(data);
  } catch (error) {
    console.error('Get Categories Error:', error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await getCategoryByIdService(id);
    res.status(200).json(category);
  } catch (error) {
    console.error('Get Category By ID Error:', error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image } = req.body;
    const updatedCategory = await updateCategoryService(id, { name, image });
    res.status(200).json({
      message: 'Category updated successfully',
      category: updatedCategory,
    });
  } catch (error) {
    console.error('Update Category Error:', error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};