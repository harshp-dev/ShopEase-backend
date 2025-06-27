import {
  createOrderService,
  getAllUserOrdersService,
  getUserOrdersService,
} from '../services/order.service.js';

export const addOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderData = { ...req.body, userId };
    const newOrder = await createOrderService(orderData);
    res.status(201).json({ success: true, message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message, orderId: error.orderId });
  }
};

export const getAllUserOrders = async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;
    const result = await getAllUserOrdersService({ search, page, limit });
    res
      .status(200)
      .json({ success: true, message: 'All user orders fetched successfully', ...result });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const result = await getUserOrdersService({ userId, page, limit });
    res.status(200).json({ success: true, message: 'User orders fetched successfully', ...result });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};
