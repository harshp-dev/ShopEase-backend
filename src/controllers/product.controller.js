import { createProductService, updateProductService } from '../services/product.service.js';

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
