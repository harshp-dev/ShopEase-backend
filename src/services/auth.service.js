import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import config from '../constants/config.js';
import User from '../modals/User.js';

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
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error('Invalid refresh token');
    }

    const accessToken = jwt.sign({ id: user._id, email: user.email }, config.ACCESS_TOKEN_SECRET, {
      expiresIn: config.ACCESS_TOKEN_EXPIRES_IN,
    });

    const newRefreshToken = jwt.sign({ id: user._id }, config.REFRESH_TOKEN_SECRET, {
      expiresIn: config.REFRESH_TOKEN_EXPIRES_IN,
    });

    return { accessToken, newRefreshToken };
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

  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: 'strict',
  });

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
