import {
  getCartService,
  updateCartItemService,
  removeCartItemService,
  addToCartService,
} from '../services/cart.service.js';

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await getCartService(userId);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    // Validation
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    if (quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    const cart = await addToCartService(userId, productId, quantity);
    res.status(201).json({
      message: 'Item added to cart successfully',
      cart,
    });
  } catch (error) {
    if (error.message === 'Product not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Valid quantity is required' });
    }
    const cart = await updateCartItemService(userId, productId, quantity);
    res.status(200).json({
      message: 'Cart updated successfully',
      cart,
    });
  } catch (error) {
    if (error.message === 'Product not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'Cart not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

export const deleteCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;
    const cart = await removeCartItemService(userId, productId);
    res.status(200).json({
      message: 'Item removed from cart successfully',
      cart,
    });
  } catch (error) {
    if (error.message === 'Cart not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};
