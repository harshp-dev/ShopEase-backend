import { createOrderService } from '../services/order.service.js';
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
      message: 'order placed successfully',
      order: newOrder,
    });
  } catch (error) {
    console.error('Order Error:', error.message);
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};
