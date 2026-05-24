const { validationResult } = require('express-validator');
const { AppError } = require('./errorHandler.middleware');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => ({ field: e.path, message: e.msg }));
    return res.status(422).json({
      status: 'fail',
      message: 'Validation failed',
      errors: messages,
    });
  }
  next();
};

module.exports = { validate };
