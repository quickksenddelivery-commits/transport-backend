const USER_ROLES = {
  ADMIN: 'admin',
  CUSTOMER: 'customer',
  DISPATCHER: 'dispatcher',
};

const SHIPMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PICKED_UP: 'picked_up',
  IN_TRANSIT: 'in_transit',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  RETURNED: 'returned',
};

const PRIORITY = {
  STANDARD: 'standard',
  EXPRESS: 'express',
  OVERNIGHT: 'overnight',
  SAME_DAY: 'same_day',
};

const RATE_LIMITS = {
  AUTH: { windowMs: 15 * 60 * 1000, max: 10 },
  API: { windowMs: 15 * 60 * 1000, max: 200 },
  OTP: { windowMs: 60 * 1000, max: 3 },
};

module.exports = {
  USER_ROLES,
  SHIPMENT_STATUS,
  PRIORITY,
  RATE_LIMITS,
};
