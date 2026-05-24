const rateLimit = require('express-rate-limit');
const { RATE_LIMITS } = require('../utils/constants');

const createLimiter = ({ windowMs, max, message }) =>
  rateLimit({
    windowMs,
    max,
    message: { status: 'fail', message: message || 'Too many requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
  });

const authLimiter = createLimiter({
  ...RATE_LIMITS.AUTH,
  message: 'Too many auth attempts. Try again in 15 minutes',
});

const adminLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many admin login attempts. Try again in 15 minutes',
});

const apiLimiter = createLimiter(RATE_LIMITS.API);

const otpLimiter = createLimiter({
  ...RATE_LIMITS.OTP,
  message: 'Too many OTP requests. Try again in 1 minute',
});

module.exports = { authLimiter, adminLimiter, apiLimiter, otpLimiter };
