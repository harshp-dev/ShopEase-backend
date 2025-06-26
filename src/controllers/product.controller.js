import {
  createProductService,
  getProductByIdService,
  updateProductService,
} from '../services/product.service.js';
import { deleteProductById, getProducts } from '../services/product.service.js';

export const createProduct = async (req, res) => {
  try {
    const data = req.body;
    const files = req.files;
    const product = await createProductService(data, files);
    res.status(201).json({ message: 'Product created', product });
  } catch (error) {
    console.log(error);
    res.status(error.statusCode || 500).json({
      message: error.message || 'Server Error',
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const data = req.body;
    const files = req.files;
    const product = await updateProductService(productId, data, files);
    res.status(200).json({ message: 'Product updated', product });
  } catch (error) {
    console.log(error);
    res.status(error.statusCode || 500).json({
      message: error.message || 'Server Error',
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getProductByIdService(id);
    res.status(200).json({ product });
  } catch (error) {
    console.log(error);
    res.status(error.statusCode || 500).json({
      message: error.message || 'Server Error',
    });
  }
};

export const fetchProducts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;

    const data = await getProducts({
      category,
      searchQuery: search,
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
