import { uploadImage, deleteImage } from '../helpers/cloudinary.js';
import Category from '../modals/Category.js';
import Product from '../modals/Product.js';
import Cart from '../modals/Cart.js';

export const createProductService = async (data, files = []) => {
  const uploadedImages = [];

  for (const file of files) {
    const result = await uploadImage(file.buffer, {
      folder: 'products',
    });
    uploadedImages.push({
      url: result.secure_url,
      publicId: result.public_id,
    });
  }

  const product = await Product.create({ ...data, images: uploadedImages });
  return product;
};

export const updateProductService = async (id, data, files = []) => {
  const product = await Product.findById(id);
  if (!product) throw new Error('Product not found');

  if (files.length > 0) {
    for (const img of product.images) {
      if (img?.publicId) {
        await deleteImage(img.publicId);
      }
    }

    const uploadedImages = [];
    for (const file of files) {
      const result = await uploadImage(file.buffer, {
        folder: 'products',
      });
      uploadedImages.push({
        url: result.secure_url,
        publicId: result.public_id,
      });
    }

    product.images = uploadedImages;
  }

  Object.assign(product, data);
  await product.save();

  return product;
};

export const getProductByIdService = async id => {
  const product = await Product.findById(id).populate('category');
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};

export const getProducts = async ({ category, searchQuery, page = 1, limit = 10 }) => {
  const filter = {};

  //category id is passed
  if (category) {
    const categoryDoc = await Category.findOne({
      name: { $regex: `^${category}$`, $options: 'i' },
    });
    if (!categoryDoc) {
      return {
        products: [],
        totalCount: 0,
        currentPage: Number(page),
        totalPages: 0,
      };
    }

    filter.category = categoryDoc._id;
  }
  //searchQuery is passed
  if (searchQuery) {
    filter.name = { $regex: searchQuery, $options: 'i' };
  }
  const skip = (page - 1) * limit;

  const [products, totalCount] = await Promise.all([
    Product.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('category', 'name')
      .lean(),
    Product.countDocuments(filter),
  ]);
  return {
    products,
    totalCount,
    currentPage: Number(page),
    totalPages: Math.ceil(totalCount / limit),
  };
};

export const deleteProductById = async productId => {
  const product = await Product.findById(productId);
  if (!product) {
    const error = new Error('Sorry, the product is not found');
    error.statusCode = 404;
    throw error;
  }
  await Product.findByIdAndDelete(productId);
  const carts = await Cart.find({ 'items.product': productId });
  for (const cart of carts) {
    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
    await cart.save();
  }
  return {
    message: 'The product and its references in carts were deleted successfully',
  };
};
