const Shipment = require('../models/Shipment');
const { asyncHandler, AppError } = require('../middleware/errorHandler.middleware');

const maskName = (name = '') => {
  const parts = name.trim().split(' ');
  return parts.map((p) => (p.length > 1 ? `${p[0]}${'*'.repeat(p.length - 1)}` : p)).join(' ');
};

const maskEmail = (email = '') => {
  if (!email) return '';
  const [user, domain] = email.split('@');
  return `${user.slice(0, 2)}***@${domain}`;
};

exports.trackShipment = asyncHandler(async (req, res, next) => {
  const shipment = await Shipment.findOne({
    trackingNumber: req.params.trackingId.toUpperCase(),
  })
    .select('-isDeleted -notes -declaredValue')
    .lean();

  if (!shipment) return next(new AppError('Tracking number not found', 404));

  // Mask personal details for public response
  const masked = {
    trackingNumber: shipment.trackingNumber,
    status: shipment.status,
    service: shipment.service,
    eta: shipment.eta,
    deliveredAt: shipment.deliveredAt,
    createdAt: shipment.createdAt,
    sender: {
      name: maskName(shipment.sender.name),
      city: shipment.sender.city,
      country: shipment.sender.country,
    },
    recipient: {
      name: maskName(shipment.recipient.name),
      city: shipment.recipient.city,
      country: shipment.recipient.country,
      email: maskEmail(shipment.recipient.email),
    },
    weight: shipment.weight,
    events: shipment.events.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
  };

  res.json({ status: 'success', data: { shipment: masked } });
});
