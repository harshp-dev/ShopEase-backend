import Cart from '../modals/Cart.js';
import Product from '../modals/Product.js';

export const getCartService = async userId => {
  let cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart) {
    cart = new Cart({ user: userId, items: [], totalPrice: 0 });
    await cart.save();
  }
  return cart;
};

export const addToCartService = async (userId, productId, quantity) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error('Product not found');
  }
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = new Cart({ user: userId, items: [], totalPrice: 0 });
  }

  // Check if product already exists in cart
  const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);

  if (existingItemIndex > -1) {
    // Product already exists, increase quantity
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    // Add new item to cart
    cart.items.push({
      product: productId,
      quantity: quantity,
      price: product.price,
    });
  }

  // Recalculate total price
  cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

  await cart.save();
  return cart.populate('items.product');
};

export const updateCartItemService = async (userId, productId, quantity) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new Error('Cart not found');
  }

  const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
  if (itemIndex > -1) {
    // Update existing item
    cart.items[itemIndex].quantity = quantity;
  } else {
    // Add new item
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    cart.items.push({
      product: productId,
      quantity: quantity,
      price: product.price,
    });
  }

  // Update totalPrice
  cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
  await cart.save();
  return cart.populate('items.product');
};

export const removeCartItemService = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new Error('Cart not found');
  }

  // Check if item exists in cart before removing
  const itemExists = cart.items.some(item => item.product.toString() === productId);
  if (!itemExists) {
    throw new Error('Item not found in cart');
  }

  cart.items = cart.items.filter(item => item.product.toString() !== productId);
  // Update totalPrice
  cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
  await cart.save();
  return cart.populate('items.product');
};
