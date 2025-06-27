import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import config from '../constants/config.js';
import User from '../modals/User.js';
import sendEmail from '../helpers/sendMail.js';
import { isAdmin } from '../utils/roleUtils.js';

export const forgotPasswordService = async email => {
  const user = await User.findOne({ email });

  if (!user) throw new Error('User not found.');

  if (isAdmin(user)) throw new Error('Email not found.');

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

export const logoutService = async (req, res) => {
  try {
    const { accessToken, refreshToken } = req.cookies;

    // Edge Case 1: No tokens at all
    if (!accessToken && !refreshToken) {
      // Clear any potential cookies and consider it a successful logout
      clearAuthCookies(res);
      return { message: 'Already logged out' };
    }

    let userId = null;

    // Try to get userId from access token first (if valid)
    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, config.ACCESS_TOKEN_SECRET);
        userId = decoded.userId;
      } catch (error) {
        // Access token is invalid/expired, we'll try refresh token
        console.log('Access token invalid during logout:', error.message);
      }
    }

    // If we couldn't get userId from access token, try refresh token
    if (!userId && refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET);
        userId = decoded.userId;
      } catch (error) {
        // Both tokens are invalid - clear cookies and logout anyway
        console.log('Refresh token also invalid during logout:', error.message);
        clearAuthCookies(res);
        return { message: 'Logged out (tokens were invalid)' };
      }
    }

    // Edge Case 2: We have userId, now clean up database
    if (userId) {
      try {
        // Remove refresh token from database
        await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } }, { new: true });
        console.log(`Refresh token removed for user: ${userId}`);
      } catch (dbError) {
        // Even if DB update fails, we should clear cookies
        console.error('Failed to update user in database during logout:', dbError);
        // Don't throw error here - we still want to clear cookies
      }
    }

    // Always clear cookies regardless of token validity
    clearAuthCookies(res);

    return { message: 'Logged out successfully' };
  } catch (error) {
    // Edge Case 3: Unexpected errors - still try to clear cookies
    console.error('Unexpected error during logout:', error);
    clearAuthCookies(res);
    throw new Error('Logout completed with errors');
  }
};

// Helper function to clear authentication cookies
const clearAuthCookies = res => {
  res.clearCookie('accessToken', {
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production', // Only secure in production
    httpOnly: false, // Access token cookie is not httpOnly in your current setup
  });

  res.clearCookie('refreshToken', {
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  });
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

  const user = await User.findOne({ username: username });

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

export const loginAdminUser = async (username, password) => {
  if (!username || !password) {
    const error = new Error('All fields are required');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ username: username });

  if (!user || !isAdmin(user)) {
    const error = new Error('Admin user not found or unauthorized');
    error.statusCode = 403;
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

  await User.findByIdAndUpdate(user._id, { refreshToken });

  return {
    accessToken,
    refreshToken,
  };
};
