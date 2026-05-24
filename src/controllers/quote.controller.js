const { asyncHandler, AppError } = require('../middleware/errorHandler.middleware');

const SERVICE_OPTIONS = [
  { key: 'standard',  label: 'Standard Delivery',  days: '5–7 business days', multiplier: 1.0 },
  { key: 'express',   label: 'Express Delivery',   days: '2–3 business days', multiplier: 1.6 },
  { key: 'overnight', label: 'Overnight Delivery',  days: 'Next business day', multiplier: 2.2 },
  { key: 'same_day',  label: 'Same Day Delivery',   days: 'Same day',          multiplier: 3.0 },
];

const BASE_RATE   = 8.0;
const WEIGHT_RATE = 1.2;   // per kg
const VOL_DIVISOR = 5000;  // cm³ → kg (standard volumetric divisor)

exports.calculate = asyncHandler(async (req, res, next) => {
  const { from, to, weight, length, width, height, service } = req.body;

  if (!from || !to) return next(new AppError('Origin and destination are required', 400));
  if (!weight || weight <= 0) return next(new AppError('Weight must be greater than 0', 400));

  const volumetricWeight = (length && width && height)
    ? (length * width * height) / VOL_DIVISOR
    : 0;

  const chargeableWeight = Math.max(parseFloat(weight), volumetricWeight);
  const basePrice = Math.round((BASE_RATE + chargeableWeight * WEIGHT_RATE) * 100) / 100;

  const options = SERVICE_OPTIONS.map(({ key, label, days, multiplier }) => ({
    key,
    label,
    days,
    price: Math.round(basePrice * multiplier * 100) / 100,
  }));

  // If a specific service was requested, highlight it
  const selected = service ? options.find((o) => o.key === service) : null;

  res.json({
    status: 'success',
    data: {
      basePrice,
      chargeableWeight,
      from,
      to,
      options,
      ...(selected && { selected }),
    },
  });
});
