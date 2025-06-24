import { deleteProductById, getProducts } from '../services/product.service.js';

export const fetchProducts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;

    const data = await getProducts({
      category,
      search,
      page: parseInt(page),
      limit: parseInt(limit),
    });

    res.status(200).json({
      message: 'Products fetched successfully',
      ...data,
    });
  } catch (error) {
    console.error('Error in fetching products:', error);
    res.status(error.statusCode || 500).json({
      message: error.message || 'Server Error',
    });
  }
};

export const deleteProductbyId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    const result = await deleteProductById(id);

    if (result) {
      res.status(200).json({ message: 'Product is deleted successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error in deleting product:', error);
    res.status(error.statusCode || 500).json({
      message: error.message || 'Server Error',
    });
  }
};
