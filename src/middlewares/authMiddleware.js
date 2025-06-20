import jwt from 'jsonwebtoken';
import config from '../constants/config';
export const authenticateUser = (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized:No token provided' });
    }
    const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET);
    req.user = { id: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
    const errmsg =
      error.name === 'TokenExpiredError'
        ? 'Unauthorized:Token expired'
        : 'Unauthorized :Invalid Token';
    return res.status(401).json({ error: errmsg });
  }
};

export const authorizerole = role => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: 'Access denied:Insufficient permissions' });
    }
    next();
  };
};
