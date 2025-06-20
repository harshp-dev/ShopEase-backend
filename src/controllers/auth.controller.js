import { loginUser, registerUser } from '../services/auth.services.js';

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
  }
};
