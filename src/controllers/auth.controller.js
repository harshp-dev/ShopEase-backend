
import {
  forgotPasswordService,
  resetPasswordService,
  changePasswordService,
  getMeService,
  logoutService,
  refreshTokenService,
  loginUser,
  registerUser
} from '../services/auth.service.js';

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    await loginUser(username, password);

    res.status(200).json({
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login Controller Error:', error);
    res.status(error.statusCode || 500).json({ message: error.message || 'Server Error' });
  }
};

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = await registerUser({ username, email, password });

    res.status(201).json({
      message: 'User registered successfully',
      user,
    });
  } catch (error) {
    console.error('Register Controller Error:', error);
    res.status(error.statusCode || 500).json({
      message: error.message || 'Server Error',
    });

export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ status: 'ERROR', message: 'Email is required.' });

    await forgotPasswordService(email);

    return res
      .status(200)
      .json({ status: 'SUCCESS', message: 'Password reset link sent to your email.' });
  } catch (err) {
    return res.status(500).json({ status: 'ERROR', message: err.message });
  }
};

export const resetPasswordController = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password)
      return res
        .status(400)
        .json({ status: 'ERROR', message: 'Token and new password are required.' });

    await resetPasswordService(token, password);

    return res
      .status(200)
      .json({ status: 'SUCCESS', message: 'Password has been reset successfully!' });
  } catch (err) {
    return res.status(500).json({ status: 'ERROR', message: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    await changePasswordService(userId, oldPassword, newPassword);
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Something went wrong' });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    const { accessToken, newRefreshToken } = await refreshTokenService(refreshToken);
    res.status(200).json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Something went wrong' });
  }
};

export const getMe = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await getMeService(userId);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await logoutService(userId, res);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};
