const router = require('express').Router();
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { authLimiter } = require('../middleware/rateLimit.middleware');

router.post(
  '/login',
  authLimiter,
  [
    body('password').notEmpty().withMessage('Password is required'),
    body().custom((_, { req }) => {
      if (!req.body.email && !req.body.username) {
        throw new Error('Email or username is required');
      }
      return true;
    }),
  ],
  validate,
  authController.login
);

router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getMe);

module.exports = router;
