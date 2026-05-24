const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const generateTrackingNumber = () => {
  const prefix = 'RCH';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

const generateOTP = (length = 6) => {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
};

const hashOTP = (otp) => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

const generateReference = () => {
  return `PAY-${uuidv4().replace(/-/g, '').slice(0, 16).toUpperCase()}`;
};

const paginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

const parsePagination = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

const calcShippingCost = ({ weight, distance, priority = 'standard', dimensions = {} }) => {
  const BASE_RATE = 5.0;
  const WEIGHT_RATE = 0.5;
  const DISTANCE_RATE = 0.1;
  const PRIORITY_MULTIPLIER = {
    standard: 1.0,
    express: 1.5,
    overnight: 2.0,
    same_day: 2.5,
  };

  const volumetricWeight = dimensions.length && dimensions.width && dimensions.height
    ? (dimensions.length * dimensions.width * dimensions.height) / 5000
    : 0;

  const chargeableWeight = Math.max(weight, volumetricWeight);
  const cost =
    (BASE_RATE + chargeableWeight * WEIGHT_RATE + distance * DISTANCE_RATE) *
    (PRIORITY_MULTIPLIER[priority] || 1.0);

  return Math.round(cost * 100) / 100;
};

const sanitizePhone = (phone) => {
  return phone.replace(/\D/g, '');
};

const maskEmail = (email) => {
  const [user, domain] = email.split('@');
  return `${user.slice(0, 2)}***@${domain}`;
};

module.exports = {
  generateTrackingNumber,
  generateOTP,
  hashOTP,
  generateReference,
  paginationMeta,
  parsePagination,
  calcShippingCost,
  sanitizePhone,
  maskEmail,
};
