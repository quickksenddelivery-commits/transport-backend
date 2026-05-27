const router = require('express').Router();
const documentController = require('../controllers/document.controller');

router.get('/:trackingId/awb', documentController.downloadAWB);
router.get('/:trackingId/invoice', documentController.downloadInvoice);
router.get('/:trackingId/packing-list', documentController.downloadPackingList);

module.exports = router;
