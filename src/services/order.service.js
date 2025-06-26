import Order from '../modals/Order.js';
import { v4 as uuidv4 } from 'uuid';
import Product from '../modals/Product.js';

const generatePaymentId = () => {
  return `PAY-${uuidv4()}`;
};

export const createOrderService = async data => {
  const { userId, address, mobileNumber, products } = data;

  if (!userId || !address || !mobileNumber || !products || !Array.isArray(products)) {
    throw new Error('Missing or invalid order fields');
  }

  const totalQuantity = products.reduce((sum, item) => sum + item.quantity, 0);

  let totalAmount = 0;
  for (const item of products) {
    const productData = await Product.findById(item.product);
    if (!productData) {
      throw new Error(`Product not found: ${item.product}`);
    }
    totalAmount += productData.price * item.quantity;
  }

  const paymentId = generatePaymentId();

  const newOrder = new Order({
    user: userId,
    address,
    mobileNumber,
    products,
    totalQuantity,
    totalAmount,
    paymentId,
  });

  return await newOrder.save();
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

  return {
    orders,
    totalOrders: total,
    page: parseInt(page),
    totalPages: Math.ceil(total / limit),
  };
};

export const getUserOrdersService = async ({ userId, page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const query = { user: userId };

  const orders = await Order.find(query)
    .populate('products.product', 'name price images')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Order.countDocuments(query);

  return {
    orders,
    totalOrders: total,
    page: parseInt(page),
    totalPages: Math.ceil(total / limit),
  };
};
