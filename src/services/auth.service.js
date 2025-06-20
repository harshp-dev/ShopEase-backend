import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../modals/User';
import sendEmail from '../helpers/sendMail';
import config from '../constants/config';

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
