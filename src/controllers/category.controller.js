import { addCategoryService, deleteCategoryService } from '../services/category.service.js';

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
    const { id } = req.body;
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
