import { v4 as uuidv4 } from 'uuid';
import Order from '../modals/Order.js';
import Product from '../modals/Product.js';

const generatePaymentId = () => `PAY-${uuidv4()}`;

export const createOrderService = async data => {
  const { userId, address, mobileNumber, products } = data;

  if (!userId || !address || !mobileNumber || !products || !Array.isArray(products)) {
    throw { message: 'Missing or invalid order fields', status: 400 };
  }

  const totalQuantity = products.reduce((sum, item) => sum + item.quantity, 0);
  let totalAmount = 0;

  for (const item of products) {
    const productData = await Product.findById(item.product);
    if (!productData) throw { message: `Product not found: ${item.product}`, status: 404 };
    if (productData.stock < item.quantity) {
      throw { message: `Insufficient stock for product ${productData.name}`, status: 400 };
    }
    totalAmount += productData.price * item.quantity;
  }

  const newOrder = new Order({
    user: userId,
    address,
    mobileNumber,
    products,
    totalQuantity,
    totalAmount,
    paymentId: generatePaymentId(),
  });

  try {
    const savedOrder = await newOrder.save();
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock -= item.quantity;
        await product.save();
      }
    }
    return savedOrder;
  } catch (error) {
    if (newOrder._id)
      await Order.findByIdAndDelete(newOrder._id).catch(err =>
        console.error('Rollback failed:', err),
      );
    throw { message: error.message || 'Server error', status: 500, orderId: newOrder._id };
  }
};

export const getAllUserOrdersService = async ({ search = '', page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const query = {
    $or: [
      { mobileNumber: { $regex: search, $options: 'i' } },
      { 'address.city': { $regex: search, $options: 'i' } },
      { 'address.street': { $regex: search, $options: 'i' } },
      { paymentId: { $regex: search, $options: 'i' } },
    ],
  };
  const orders = await Order.find(query)
    .populate('user', 'name email username')
    .populate('products.product', 'name price images')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });
  const total = await Order.countDocuments(query);
  return { orders, totalOrders: total, page, totalPages: Math.ceil(total / limit) };
};

export const getUserOrdersService = async ({ userId, page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const orders = await Order.find({ user: userId })
    .populate('products.product', 'name price images')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });
  const total = await Order.countDocuments({ user: userId });
  return { orders, totalOrders: total, page, totalPages: Math.ceil(total / limit) };
};
