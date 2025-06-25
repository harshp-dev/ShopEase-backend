import {
  createOrderService,
  getAllUserOrdersService,
  getUserOrdersService,
} from '../services/order.service.js';

export const addOrder = async (req, res) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    if (role !== 'USER') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Only users can place orders',
      });
    }

    const orderData = { ...req.body, userId };
    const newOrder = await createOrderService(orderData);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: newOrder,
    });
  } catch (error) {
    console.error('Order Error:', error.message);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

export const getAllUserOrders = async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;

    const result = await getAllUserOrdersService({ search, page, limit });

    res.status(200).json({
      success: true,
      message: 'All user orders fetched successfully',
      ...result,
    });
  } catch (error) {
    console.error('Admin Get Orders Error:', error.message);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    if (role === 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Only users can view their own orders',
      });
    }
    const { page = 1, limit = 10 } = req.query;

    const result = await getUserOrdersService({ userId, page, limit });

    res.status(200).json({
      success: true,
      message: 'User orders fetched successfully',
      ...result,
    });
  } catch (error) {
    console.error('Get User Orders Error:', error.message);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};
