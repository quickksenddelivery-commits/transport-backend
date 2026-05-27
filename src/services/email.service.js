const { Resend } = require('resend');
const logger = require('../utils/logger');
const { env } = require('../config/env');
const templates = require('./email.templates');
const documentService = require('./document.service');

const resend = new Resend(env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html, text }) => {
  if (process.env.NODE_ENV !== 'production') {
    logger.info(`[DEV] Email skipped — would have sent to ${to}`, { subject });
    return { id: 'dev-skipped' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `Accessiblexpress <${env.EMAIL_FROM}>`,
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
    html: `<h2>Welcome to Accessiblexpress, ${user.firstName}!</h2>
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

// ─── Shipment Alert Emails ────────────────────────────────────────────────────

const sendPickedUpAlert = (shipment) =>
  sendEmail({
    to: shipment.recipient.email,
    subject: `📦 Package Picked Up — #${shipment.trackingNumber}`,
    html: templates.pickedUp(shipment),
  });

const sendInTransitAlert = (shipment, eventLocation) =>
  sendEmail({
    to: shipment.recipient.email,
    subject: `🚚 Your Package is In Transit — #${shipment.trackingNumber}`,
    html: templates.inTransit(shipment, eventLocation),
  });

const sendOutForDeliveryAlert = (shipment) =>
  sendEmail({
    to: shipment.recipient.email,
    subject: `🛵 Out for Delivery Today — #${shipment.trackingNumber}`,
    html: templates.outForDelivery(shipment),
  });

const sendDeliveredAlert = (shipment) =>
  sendEmail({
    to: shipment.recipient.email,
    subject: `✅ Package Delivered — #${shipment.trackingNumber}`,
    html: templates.delivered(shipment),
  });

const sendDelayAlert = (shipment, event) =>
  sendEmail({
    to: shipment.recipient.email,
    subject: `⚠️ Shipment Delay Notice — #${shipment.trackingNumber}`,
    html: templates.delayAlert(shipment, event),
  });

const sendNewsletterWelcome = (email) =>
  sendEmail({
    to: email,
    subject: '🎉 Welcome to Accessiblexpress!',
    html: templates.newsletterWelcome(email),
  });

const sendShipmentDocuments = async (shipment) => {
  if (!shipment.recipient?.email) return;

  if (process.env.NODE_ENV !== 'production') {
    logger.info(`[DEV] Shipment documents emails skipped — would have sent 3 emails to ${shipment.recipient.email}`, {
      trackingNumber: shipment.trackingNumber,
      emails: ['Waybill Receipt', 'Commercial Invoice', 'Packing List'],
    });
    return;
  }

  const { awb, invoice, packingList } = await documentService.generateAllToBuffers(shipment);
  const to = shipment.recipient.email;
  const tn = shipment.trackingNumber;

  const sendOne = async ({ subject, html, filename, content }) => {
    const { data, error } = await resend.emails.send({
      from: `Accessiblexpress <${env.EMAIL_FROM}>`,
      to,
      subject,
      html,
      attachments: [{ filename, content: content.toString('base64') }],
    });
    if (error) throw new Error(error.message);
    logger.info(`Document email sent [${filename}] to ${to}: ${data.id}`);
    return data;
  };

  // Sequential — Resend allows max 2 req/sec
  await sendOne({ subject: `🛫 Your Waybill Receipt — #${tn}`,      html: templates.awbEmail(shipment),         filename: `AWB-${tn}.pdf`,         content: awb });
  await sendOne({ subject: `🧾 Your Commercial Invoice — #${tn}`,   html: templates.invoiceEmail(shipment),     filename: `Invoice-${tn}.pdf`,     content: invoice });
  await sendOne({ subject: `📦 Your Packing List — #${tn}`,         html: templates.packingListEmail(shipment), filename: `PackingList-${tn}.pdf`, content: packingList });
};

module.exports = {
  sendEmail,
  sendShipmentCreated,
  sendDeliveryConfirmation,
  sendPasswordReset,
  sendEmailVerification,
  sendOTP,
  sendPickedUpAlert,
  sendInTransitAlert,
  sendOutForDeliveryAlert,
  sendDeliveredAlert,
  sendDelayAlert,
  sendNewsletterWelcome,
  sendShipmentDocuments,
};
