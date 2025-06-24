import Product from '../modals/Product.js';

export const getProducts = async ({ category, searchQuery, page = 1, limit = 10 }) => {
  const filter = {};

  //category id is passed
  if (category) {
    filter.category = category;
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

export const deleteProductById = async productid => {
  const product = await Product.findById(productid);
  if (!product) {
    const error = new Error('Sorry the Product is not found');
    error.statusCode = 404;
    throw error;
  }
  await Product.findByIdAndDelete(productid);
  return {
    message: 'The Product deleted successfully',
  };
};
