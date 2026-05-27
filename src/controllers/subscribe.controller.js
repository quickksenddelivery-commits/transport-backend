const Subscriber = require('../models/Subscriber');
const { asyncHandler, AppError } = require('../middleware/errorHandler.middleware');
const emailService = require('../services/email.service');
const logger = require('../utils/logger');

exports.subscribe = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const existing = await Subscriber.findOne({ email });

  if (existing) {
    if (existing.isActive) {
      return res.json({ status: 'success', message: 'You are already subscribed.' });
    }
    // Re-subscribe if they had previously unsubscribed
    existing.isActive = true;
    await existing.save();
  } else {
    await Subscriber.create({ email });
  }

  // Send welcome email (non-blocking)
  emailService.sendNewsletterWelcome(email)
    .catch((err) => logger.warn(`Newsletter welcome email failed: ${err.message}`));

  logger.info(`New subscriber: ${email}`);
  res.status(201).json({ status: 'success', message: 'Successfully subscribed. Check your inbox!' });
});

exports.unsubscribe = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const subscriber = await Subscriber.findOneAndUpdate(
    { email },
    { isActive: false },
    { returnDocument: 'after' }
  );

  if (!subscriber) return next(new AppError('Email not found in our subscriber list', 404));

  logger.info(`Unsubscribed: ${email}`);
  res.json({ status: 'success', message: 'You have been unsubscribed.' });
});

// Admin — list all subscribers
exports.getSubscribers = asyncHandler(async (req, res) => {
  const { active } = req.query;
  const filter = {};
  if (active !== undefined) filter.isActive = active === 'true';

  const subscribers = await Subscriber.find(filter).sort({ createdAt: -1 }).lean();
  res.json({ status: 'success', data: { total: subscribers.length, subscribers } });
});
