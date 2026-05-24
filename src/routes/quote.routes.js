const router = require('express').Router();
const { body } = require('express-validator');
const quoteController = require('../controllers/quote.controller');
const { validate } = require('../middleware/validate.middleware');

router.post(
  '/calculate',
  [
    body('from').notEmpty().withMessage('Origin is required'),
    body('to').notEmpty().withMessage('Destination is required'),
    body('weight').isFloat({ min: 0.01 }).withMessage('Weight must be greater than 0'),
  ],
  validate,
  quoteController.calculate
);

module.exports = router;
