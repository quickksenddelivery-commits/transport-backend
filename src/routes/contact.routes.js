const router = require('express').Router();
const { body } = require('express-validator');
const contactController = require('../controllers/contact.controller');
const { validate } = require('../middleware/validate.middleware');
const rateLimit = require('express-rate-limit');

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { status: 'fail', message: 'Too many contact submissions. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post(
  '/',
  contactLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
  ],
  validate,
  contactController.submit
);

module.exports = router;
