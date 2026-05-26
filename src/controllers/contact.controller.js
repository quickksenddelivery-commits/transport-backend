const { asyncHandler, AppError } = require('../middleware/errorHandler.middleware');
const emailService = require('../services/email.service');
const logger = require('../utils/logger');
const { env } = require('../config/env');

exports.submit = asyncHandler(async (req, res, next) => {
  const { name, email, company, subject, message } = req.body;

  if (!name || !email || !message) {
    return next(new AppError('Name, email, and message are required', 400));
  }

  const teamEmail = env.CONTACT_EMAIL || env.EMAIL_FROM;

  // Notify team
  await emailService.sendEmail({
    to: teamEmail,
    subject: `Contact Form: ${subject || 'New enquiry'} — ${name}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:8px;font-weight:bold">Name</td><td style="padding:8px">${name}</td></tr>
        <tr><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px">${email}</td></tr>
        ${company ? `<tr><td style="padding:8px;font-weight:bold">Company</td><td style="padding:8px">${company}</td></tr>` : ''}
        <tr><td style="padding:8px;font-weight:bold">Subject</td><td style="padding:8px">${subject || '—'}</td></tr>
        <tr><td style="padding:8px;font-weight:bold">Message</td><td style="padding:8px">${message.replace(/\n/g, '<br>')}</td></tr>
      </table>
    `,
  });

  // Auto-reply to sender
  emailService.sendEmail({
    to: email,
    subject: 'We received your message — Accessiblexpress',
    html: `<p>Hi ${name},</p>
           <p>Thanks for reaching out. We've received your message and will get back to you within 1–2 business days.</p>
           <p>— The Accessiblexpress Team</p>`,
  }).catch((err) => logger.warn(`Contact auto-reply failed: ${err.message}`));

  logger.info(`Contact form submitted by ${email}`);
  res.json({ status: 'success', message: 'Message received. We will get back to you shortly.' });
});
