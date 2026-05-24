const router = require('express').Router();
const { body, param } = require('express-validator');
const adminController = require('../controllers/admin.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');

// All admin routes require a valid JWT
router.use(authenticate);

// Stats
router.get('/stats', adminController.getStats);

// Shipments
router.get('/shipments', adminController.getShipments);

router.post(
  '/shipments',
  [
    body('sender.name').trim().notEmpty().withMessage('Sender name is required'),
    body('recipient.name').trim().notEmpty().withMessage('Recipient name is required'),
    body('weight').isFloat({ min: 0.01 }).withMessage('Weight must be greater than 0'),
    body('service').optional().isIn(['standard', 'express', 'overnight', 'same_day']),
    body('status').optional().isIn(['pending','confirmed','picked_up','in_transit','out_for_delivery','delivered','failed','cancelled','returned']),
  ],
  validate,
  adminController.createShipment
);

router.get('/shipments/:id', param('id').isMongoId(), validate, adminController.getShipment);

router.patch(
  '/shipments/:id',
  param('id').isMongoId(),
  body('status').optional().isIn(['pending','confirmed','picked_up','in_transit','out_for_delivery','delivered','failed','cancelled','returned']),
  validate,
  adminController.updateShipment
);

router.delete('/shipments/:id', param('id').isMongoId(), validate, adminController.deleteShipment);

router.post(
  '/shipments/:id/events',
  param('id').isMongoId(),
  body('desc').trim().notEmpty().withMessage('Event description is required'),
  body('type').optional().isIn(['pickup', 'transit', 'delivery', 'exception', 'info']),
  validate,
  adminController.addEvent
);

module.exports = router;
