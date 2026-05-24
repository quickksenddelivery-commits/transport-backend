const router = require('express').Router();
const { body } = require('express-validator');
const subscribeController = require('../controllers/subscribe.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const rateLimit = require('express-rate-limit');

const subscribeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { status: 'fail', message: 'Too many subscription requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const emailRule = body('email').isEmail().normalizeEmail().withMessage('Valid email is required');

// Public
router.post('/', subscribeLimiter, emailRule, validate, subscribeController.subscribe);
router.post('/unsubscribe', emailRule, validate, subscribeController.unsubscribe);

// Admin only
router.get('/', authenticate, subscribeController.getSubscribers);

module.exports = router;
