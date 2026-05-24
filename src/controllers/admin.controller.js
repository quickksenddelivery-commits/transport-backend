const Shipment = require('../models/Shipment');
const { asyncHandler, AppError } = require('../middleware/errorHandler.middleware');
const { generateTrackingNumber, parsePagination, paginationMeta } = require('../utils/helpers');

// ─── Stats ──────────────────────────────────────────────────────────────────

exports.getStats = asyncHandler(async (req, res) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [totalShipments, deliveredToday, inTransit, onTimeTotal, onTimeMet, recentActivity] =
    await Promise.all([
      Shipment.countDocuments({ isDeleted: false }),
      Shipment.countDocuments({ status: 'delivered', deliveredAt: { $gte: todayStart }, isDeleted: false }),
      Shipment.countDocuments({ status: { $in: ['picked_up', 'in_transit', 'out_for_delivery'] }, isDeleted: false }),
      Shipment.countDocuments({ status: 'delivered', eta: { $exists: true }, isDeleted: false }),
      Shipment.countDocuments({ status: 'delivered', $expr: { $lte: ['$deliveredAt', '$eta'] }, isDeleted: false }),
      Shipment.find({ isDeleted: false })
        .sort({ updatedAt: -1 })
        .limit(10)
        .select('trackingNumber status sender.name recipient.name updatedAt service')
        .lean(),
    ]);

  const onTimeRate = onTimeTotal > 0 ? Math.round((onTimeMet / onTimeTotal) * 100) : 100;

  res.json({
    status: 'success',
    data: { totalShipments, deliveredToday, inTransit, onTimeRate, recentActivity },
  });
});

// ─── Shipments List ─────────────────────────────────────────────────────────

exports.getShipments = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const { status, search } = req.query;

  const filter = { isDeleted: false };
  if (status) filter.status = status;
  if (search) {
    const re = { $regex: search, $options: 'i' };
    filter.$or = [
      { trackingNumber: re },
      { 'sender.name': re },
      { 'recipient.name': re },
      { 'sender.city': re },
      { 'recipient.city': re },
    ];
  }

  const [shipments, total] = await Promise.all([
    Shipment.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Shipment.countDocuments(filter),
  ]);

  res.json({
    status: 'success',
    data: { shipments },
    pagination: paginationMeta(total, page, limit),
  });
});

// ─── Single Shipment ─────────────────────────────────────────────────────────

exports.getShipment = asyncHandler(async (req, res, next) => {
  const shipment = await Shipment.findOne({ _id: req.params.id, isDeleted: false }).lean();
  if (!shipment) return next(new AppError('Shipment not found', 404));
  res.json({ status: 'success', data: { shipment } });
});

// ─── Create Shipment ─────────────────────────────────────────────────────────

exports.createShipment = asyncHandler(async (req, res) => {
  const shipment = await Shipment.create({
    trackingNumber: generateTrackingNumber(),
    ...req.body,
  });
  res.status(201).json({ status: 'success', data: { shipment } });
});

// ─── Update Shipment ─────────────────────────────────────────────────────────

exports.updateShipment = asyncHandler(async (req, res, next) => {
  const forbidden = ['trackingNumber', 'isDeleted', 'events'];
  forbidden.forEach((f) => delete req.body[f]);

  if (req.body.status === 'delivered' && !req.body.deliveredAt) {
    req.body.deliveredAt = new Date();
  }

  const shipment = await Shipment.findOneAndUpdate(
    { _id: req.params.id, isDeleted: false },
    req.body,
    { new: true, runValidators: true }
  );

  if (!shipment) return next(new AppError('Shipment not found', 404));
  res.json({ status: 'success', data: { shipment } });
});

// ─── Delete Shipment ─────────────────────────────────────────────────────────

exports.deleteShipment = asyncHandler(async (req, res, next) => {
  const shipment = await Shipment.findOneAndUpdate(
    { _id: req.params.id, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );

  if (!shipment) return next(new AppError('Shipment not found', 404));
  res.json({ status: 'success', message: 'Shipment deleted' });
});

// ─── Add Tracking Event ───────────────────────────────────────────────────────

exports.addEvent = asyncHandler(async (req, res, next) => {
  const { time, date, location, desc, type } = req.body;
  if (!desc) return next(new AppError('Event description is required', 400));

  const shipment = await Shipment.findOneAndUpdate(
    { _id: req.params.id, isDeleted: false },
    { $push: { events: { time, date, location, desc, type } } },
    { new: true }
  );

  if (!shipment) return next(new AppError('Shipment not found', 404));
  const newEvent = shipment.events[shipment.events.length - 1];
  res.status(201).json({ status: 'success', data: { event: newEvent, shipment } });
});
