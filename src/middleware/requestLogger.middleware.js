const logger = require('../utils/logger');

const SENSITIVE_KEYS = new Set(['password', 'currentPassword', 'newPassword', 'token', 'secret', 'authorization']);

const maskSensitive = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  const masked = {};
  for (const [key, value] of Object.entries(obj)) {
    masked[key] = SENSITIVE_KEYS.has(key.toLowerCase()) ? '***' : value;
  }
  return masked;
};

const requestLogger = (req, res, next) => {
  const startAt = process.hrtime();

  const logRequest = () => {
    const diff = process.hrtime(startAt);
    const responseTimeMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);

    const log = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      responseTime: `${responseTimeMs}ms`,
      ip: req.ip || req.socket?.remoteAddress,
      userAgent: req.headers['user-agent'] || '-',
    };

    if (Object.keys(req.query).length) log.query = req.query;
    if (req.body && Object.keys(req.body).length) log.body = maskSensitive(req.body);
    if (req.user) log.user = { id: req.user._id, role: req.user.role };

    const level = res.statusCode >= 500 ? 'error'
                : res.statusCode >= 400 ? 'warn'
                : 'info';

    logger[level](`${req.method} ${req.originalUrl}`, log);
  };

  res.on('finish', logRequest);
  next();
};

module.exports = { requestLogger };
