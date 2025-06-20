import { forgotPasswordService, resetPasswordService } from '../services/auth.service';

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
