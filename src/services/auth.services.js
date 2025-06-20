import User from '../modals/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../constants/config.js';

const generateAccessToken = user => {
  return jwt.sign({ userId: user._id, role: user.role }, config.ACCESS_TOKEN_SECRET, {
    expiresIn: config.ACCESS_TOKEN_EXPIRES_IN,
  });
};

const generateRefreshToken = user => {
  return jwt.sign({ userId: user._id, role: user.role }, config.REFRESH_TOKEN_SECRET, {
    expiresIn: config.REFRESH_TOKEN_EXPIRES_IN,
  });
};

export const loginUser = async (username, password) => {
  if (!username || !password) {
    const error = new Error('All fields are required');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({
    $or: [{ email: username }, { username: username }],
  });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await User.findOneAndUpdate({ _id: user._id }, { refreshToken: refreshToken }, { new: true });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  };
};

export const registerUser = async ({ username, email, password }) => {
  if (!username || !email || !password) {
    const error = new Error('All fields are required');
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    const error = new Error('Username or email already exists');
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  await newUser.save();

  return {
    id: newUser._id,
    username: newUser.username,
    email: newUser.email,
  };
};
