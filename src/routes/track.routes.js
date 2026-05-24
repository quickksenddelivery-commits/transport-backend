const router = require('express').Router();
const trackController = require('../controllers/track.controller');

router.get('/:trackingId', trackController.trackShipment);

module.exports = router;
