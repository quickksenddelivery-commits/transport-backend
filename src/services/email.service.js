const nodemailer = require('nodemailer');
const logger = require('../utils/logger');
const { env } = require('../config/env');

let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    });
  }
  return transporter;
};

const sendEmail = async ({ to, subject, html, text }) => {
  if (process.env.NODE_ENV !== 'production') {
    logger.info(`[DEV] Email skipped — would have sent to ${to}`, { subject });
    return { messageId: 'dev-skipped' };
  }

  try {
    const info = await getTransporter().sendMail({
      from: `"Quick Send Delivery" <${env.EMAIL_FROM}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]+>/g, ''),
    });
    logger.info(`Email sent to ${to}: ${info.messageId}`);
    return info;
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
           <p><strong>From:</strong> ${shipment.origin.city}, ${shipment.origin.country}</p>
           <p><strong>To:</strong> ${shipment.destination.city}, ${shipment.destination.country}</p>
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
