import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import config from '../constants/config.js';
import User from '../modals/User.js';
import sendEmail from '../helpers/sendMail.js';
export const forgotPasswordService = async email => {
  const user = await User.findOne({ email });
  if (!user) return;
  if (user.role === 'admin') {
    throw new Error('Email not found.');
  }

  const token = jwt.sign({ userId: user._id }, config.ACCESS_TOKEN_SECRET, {
    expiresIn: config.ACCESS_TOKEN_EXPIRES_IN,
  });

  const url = `${config.FRONTEND_URL}/reset-password/${token}`;

  await sendEmail({
    to: email,
    subject: 'Reset your ShopEase Password',
    html: `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password (valid for 15 minutes):</p>
      <a href="${url}" style="background-color: blue; color: white; padding: 10px 20px; border: none; border-radius: 5px; text-decoration: none; cursor: pointer; display: inline-block;">
        Reset Password
      </a>
    `,
  });
};

export const resetPasswordService = async (token, newPassword) => {
  let decoded;
  try {
    decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET);
  } catch {
    throw new Error('Invalid or Expired token.');
  }

  const user = await User.findById(decoded.userId);
  if (!user) throw new Error('User not found.');

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  await user.save();
};

export const changePasswordService = async (userId, oldPassword, newPassword) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw new Error('Incorrect old password');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  user.password = hashedPassword;
  await user.save();

  return true;
};

export const refreshTokenService = async refreshToken => {
  try {
    const decoded = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new Error('Invalid refresh token');
    }

    const accessToken = generateAccessToken(user);

    return { accessToken };
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid refresh token');
    }
    throw error;
  }
};

export const logoutService = async (userId, res) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  return true;
};

export const getMeService = async userId => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

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
