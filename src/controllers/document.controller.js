const Shipment = require('../models/Shipment');
const { asyncHandler, AppError } = require('../middleware/errorHandler.middleware');
const { generateAWB, generateInvoice, generatePackingList } = require('../services/document.service');

const getShipment = async (trackingId) => {
  const shipment = await Shipment.findOne({
    trackingNumber: trackingId.toUpperCase(),
  }).lean();
  return shipment;
};

exports.downloadAWB = asyncHandler(async (req, res, next) => {
  const shipment = await getShipment(req.params.trackingId);
  if (!shipment) return next(new AppError('Tracking number not found', 404));
  generateAWB(shipment, res);
});

exports.downloadInvoice = asyncHandler(async (req, res, next) => {
  const shipment = await getShipment(req.params.trackingId);
  if (!shipment) return next(new AppError('Tracking number not found', 404));
  generateInvoice(shipment, res);
});

exports.downloadPackingList = asyncHandler(async (req, res, next) => {
  const shipment = await getShipment(req.params.trackingId);
  if (!shipment) return next(new AppError('Tracking number not found', 404));
  generatePackingList(shipment, res);
});
