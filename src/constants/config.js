import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
dotenv.config();
const config = {
  PORT: process.env.PORT || 5000,
  MONGO_URL: process.env.MONGO_URL,
  RATE_LIMIT_TIME: process.env.RATE_LIMIT_TIME || 5,
  RATE_LIMIT_REQUEST: process.env.RATE_LIMIT_REQUEST || 1000,
  FRONTEND_URL: process.env.FRONTEND_URL,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN || '1h',
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

export const corsOptions = {
  origin: config.FRONTEND_URL,
  credentials: true,
};

export const limiter = rateLimit({
  windowMs: 60 * 1000 * config.RATE_LIMIT_TIME,
  max: config.RATE_LIMIT_REQUEST,
});

export default config;
