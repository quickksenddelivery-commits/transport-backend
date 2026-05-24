const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { env } = require('../config/env');
const { AppError } = require('./errorHandler.middleware');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('Authentication required', 401));
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return next(new AppError('User no longer exists', 401));
    if (!user.isActive) return next(new AppError('Account deactivated', 403));

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') return next(new AppError('Token expired', 401));
    if (error.name === 'JsonWebTokenError') return next(new AppError('Invalid token', 401));
    next(error);
  }
};

module.exports = { authenticate };
