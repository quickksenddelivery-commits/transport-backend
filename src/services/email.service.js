const { Resend } = require('resend');
const logger = require('../utils/logger');
const { env } = require('../config/env');

const resend = new Resend(env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html, text }) => {
  if (process.env.NODE_ENV !== 'production') {
    logger.info(`[DEV] Email skipped — would have sent to ${to}`, { subject });
    return { id: 'dev-skipped' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `Quick Send Delivery <${env.EMAIL_FROM}>`,
      to,
      subject,
      html,
      text: text || undefined,
    });

    if (error) {
      logger.error(`Email send failed to ${to}: ${error.message}`);
      throw new Error(error.message);
    }

    logger.info(`Email sent to ${to}: ${data.id}`);
    return data;
  } catch (error) {
    logger.error(`Email send failed to ${to}: ${error.message}`);
    throw error;
  }
};

const sendShipmentCreated = (user, shipment) =>
  sendEmail({
    to: user.email,
    subject: `Shipment Created — Tracking #${shipment.trackingNumber}`,
    html: `<h2>Hi ${user.firstName},</h2>
           <p>Your shipment has been created successfully.</p>
           <p><strong>Tracking Number:</strong> ${shipment.trackingNumber}</p>
           <p><strong>Status:</strong> ${shipment.status}</p>`,
  });

const sendDeliveryConfirmation = (user, shipment) =>
  sendEmail({
    to: user.email,
    subject: `Package Delivered — Tracking #${shipment.trackingNumber}`,
    html: `<h2>Hi ${user.firstName},</h2>
           <p>Your shipment has been delivered successfully!</p>
           <p><strong>Tracking Number:</strong> ${shipment.trackingNumber}</p>
           <p><strong>Delivered At:</strong> ${new Date().toLocaleString()}</p>`,
  });

const sendPasswordReset = (user, resetUrl) =>
  sendEmail({
    to: user.email,
    subject: 'Password Reset Request',
    html: `<h2>Hi ${user.firstName},</h2>
           <p>You requested a password reset. Click the link below (valid for 10 minutes):</p>
           <a href="${resetUrl}" style="background:#007bff;color:#fff;padding:10px 20px;text-decoration:none;border-radius:4px">Reset Password</a>
           <p>If you didn't request this, ignore this email.</p>`,
  });

const sendEmailVerification = (user, verifyUrl) =>
  sendEmail({
    to: user.email,
    subject: 'Verify Your Email',
    html: `<h2>Welcome to Quick Send Delivery, ${user.firstName}!</h2>
           <p>Please verify your email address:</p>
           <a href="${verifyUrl}" style="background:#28a745;color:#fff;padding:10px 20px;text-decoration:none;border-radius:4px">Verify Email</a>`,
  });

const sendOTP = (user, otp) =>
  sendEmail({
    to: user.email,
    subject: 'Your OTP Code',
    html: `<h2>Hi ${user.firstName},</h2>
           <p>Your one-time passcode is:</p>
           <h1 style="letter-spacing:8px;font-size:40px">${otp}</h1>
           <p>Valid for 10 minutes. Do not share this code.</p>`,
  });

module.exports = {
  sendEmail,
  sendShipmentCreated,
  sendDeliveryConfirmation,
  sendPasswordReset,
  sendEmailVerification,
  sendOTP,
};
