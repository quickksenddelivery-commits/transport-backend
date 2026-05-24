const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { env } = require('../config/env');
const { AppError, asyncHandler } = require('../middleware/errorHandler.middleware');
const logger = require('../utils/logger');

const signToken = (id) =>
  jwt.sign({ id }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });

exports.login = asyncHandler(async (req, res, next) => {
  const { email, username, password } = req.body;
  const identifier = email || username;

  if (!identifier || !password) {
    return next(new AppError('Email/username and password are required', 400));
  }

  // Optional extra security layer — enforced only when ADMIN_SECRET is set in .env
  if (env.ADMIN_SECRET) {
    const providedSecret = req.headers['x-admin-secret'];
    if (!providedSecret || providedSecret !== env.ADMIN_SECRET) {
      logger.warn(`Admin login blocked — missing/invalid x-admin-secret — IP: ${req.ip}`);
      return next(new AppError('Invalid credentials', 401));
    }
  }

  const query = identifier.includes('@') ? { email: identifier } : { username: identifier };
  const user = await User.findOne(query).select('+password +loginAttempts +lockUntil');

  if (!user) {
    logger.warn(`Login failed: user not found — identifier: ${identifier} — IP: ${req.ip}`);
    return next(new AppError('Invalid credentials', 401));
  }

  if (user.isLocked) return next(new AppError('Account temporarily locked. Try again later', 423));

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    await user.incLoginAttempts();
    logger.warn(`Login failed: wrong password — identifier: ${identifier} — IP: ${req.ip}`);
    return next(new AppError('Invalid credentials', 401));
  }

  if (!user.isActive) return next(new AppError('Account deactivated. Contact support', 403));

  await user.updateOne({ loginAttempts: 0, $unset: { lockUntil: 1 }, lastLogin: new Date() });

  const token = signToken(user._id);
  user.password = undefined;

  logger.info(`Admin login — identifier: ${identifier} — IP: ${req.ip}`);
  res.json({ status: 'success', token, data: { user } });
});

exports.logout = asyncHandler(async (req, res) => {
  res.json({ status: 'success', message: 'Logged out successfully' });
});

exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ status: 'success', data: { user } });
});
