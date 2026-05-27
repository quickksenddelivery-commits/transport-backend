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
    logger.info(`[DEV] Shipment documents email skipped — would have sent to ${shipment.recipient.email}`, {
      trackingNumber: shipment.trackingNumber,
      attachments: ['AWB', 'Invoice', 'Packing List'],
    });
    return { id: 'dev-skipped' };
  }

  const { awb, invoice, packingList } = await documentService.generateAllToBuffers(shipment);

  const { data, error } = await resend.emails.send({
    from: `Accessiblexpress <${env.EMAIL_FROM}>`,
    to: shipment.recipient.email,
    subject: `📄 Your Shipment Documents — #${shipment.trackingNumber}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
      <body style="margin:0;padding:0;background:#f1f5f9;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f1f5f9;padding:32px 0;">
          <tr><td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

              <!-- Header -->
              <tr><td style="background:#0f172a;border-radius:12px 12px 0 0;padding:28px 40px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
                  <td><span style="font-size:22px;font-weight:800;color:#f59e0b;">Accessiblexpress</span></td>
                  <td align="right"><span style="background:#1e293b;color:#94a3b8;font-size:11px;font-weight:600;padding:5px 12px;border-radius:20px;">SHIPMENT DOCUMENTS</span></td>
                </tr></table>
              </td></tr>

              <!-- Banner -->
              <tr><td style="background:#0369a1;padding:28px 40px;text-align:center;">
                <div style="font-size:36px;margin-bottom:12px;">📄</div>
                <h1 style="margin:0 0 8px;color:#fff;font-size:24px;font-weight:800;">Your Documents Are Ready</h1>
                <p style="margin:0;color:rgba(255,255,255,0.85);font-size:15px;">Shipment #${shipment.trackingNumber}</p>
              </td></tr>

              <!-- Body -->
              <tr><td style="background:#fff;padding:36px 40px;">
                <p style="margin:0 0 20px;font-size:15px;color:#334155;line-height:1.6;">
                  Hi <strong>${shipment.recipient.name}</strong>, your shipment has been created. Please find your shipping documents attached to this email.
                </p>

                <!-- Doc list -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
                  <tr>
                    <td style="padding:12px 16px;background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px 8px 0 0;border-bottom:none;">
                      <span style="font-size:16px;">🛫</span>
                      <span style="font-size:14px;font-weight:700;color:#0369a1;margin-left:10px;">Air Waybill (AWB)</span>
                      <span style="float:right;font-size:12px;color:#64748b;">AWB-${shipment.trackingNumber}.pdf</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:12px 16px;background:#f0fdf4;border:1px solid #bbf7d0;border-bottom:none;">
                      <span style="font-size:16px;">🧾</span>
                      <span style="font-size:14px;font-weight:700;color:#16a34a;margin-left:10px;">Commercial Invoice</span>
                      <span style="float:right;font-size:12px;color:#64748b;">Invoice-${shipment.trackingNumber}.pdf</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:12px 16px;background:#faf5ff;border:1px solid #e9d5ff;border-radius:0 0 8px 8px;">
                      <span style="font-size:16px;">📦</span>
                      <span style="font-size:14px;font-weight:700;color:#7c3aed;margin-left:10px;">Packing List</span>
                      <span style="float:right;font-size:12px;color:#64748b;">PackingList-${shipment.trackingNumber}.pdf</span>
                    </td>
                  </tr>
                </table>

                <!-- Shipment summary -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:24px;">
                  <tr><td style="padding:16px 20px;">
                    <p style="margin:0 0 12px;font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:1px;text-transform:uppercase;">Shipment Summary</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:4px 0;font-size:13px;color:#64748b;font-weight:600;width:45%;">Tracking Number</td>
                        <td style="padding:4px 0;font-size:13px;color:#0f172a;font-weight:700;font-family:monospace;">${shipment.trackingNumber}</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;font-size:13px;color:#64748b;font-weight:600;">Service</td>
                        <td style="padding:4px 0;font-size:13px;color:#0f172a;font-weight:500;text-transform:capitalize;">${(shipment.service||'').replace(/_/g,' ')}</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;font-size:13px;color:#64748b;font-weight:600;">From</td>
                        <td style="padding:4px 0;font-size:13px;color:#0f172a;">${shipment.sender.city}, ${shipment.sender.country}</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;font-size:13px;color:#64748b;font-weight:600;">To</td>
                        <td style="padding:4px 0;font-size:13px;color:#0f172a;">${shipment.recipient.city}, ${shipment.recipient.country}</td>
                      </tr>
                      ${shipment.eta ? `<tr>
                        <td style="padding:4px 0;font-size:13px;color:#64748b;font-weight:600;">Est. Delivery</td>
                        <td style="padding:4px 0;font-size:13px;color:#0f172a;">${new Date(shipment.eta).toDateString()}</td>
                      </tr>` : ''}
                    </table>
                  </td></tr>
                </table>

                <p style="margin:0;font-size:13px;color:#94a3b8;text-align:center;line-height:1.6;">
                  Keep these documents safe — you may need them for customs and delivery.<br/>
                  Questions? Contact us at <strong style="color:#64748b;">logistics@accessiblexpress.com</strong>
                </p>
              </td></tr>

              <!-- Footer -->
              <tr><td style="background:#f8fafc;border-top:1px solid #e2e8f0;border-radius:0 0 12px 12px;padding:20px 40px;text-align:center;">
                <p style="margin:0 0 4px;color:#64748b;font-size:12px;">© ${new Date().getFullYear()} Accessiblexpress · All rights reserved</p>
                <p style="margin:0;color:#94a3b8;font-size:11px;">accessiblexpress.com</p>
              </td></tr>

            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `,
    attachments: [
      { filename: `AWB-${shipment.trackingNumber}.pdf`,         content: awb.toString('base64') },
      { filename: `Invoice-${shipment.trackingNumber}.pdf`,     content: invoice.toString('base64') },
      { filename: `PackingList-${shipment.trackingNumber}.pdf`, content: packingList.toString('base64') },
    ],
  });

  if (error) {
    logger.error(`Shipment documents email failed to ${shipment.recipient.email}: ${error.message}`);
    throw new Error(error.message);
  }

  logger.info(`Shipment documents sent to ${shipment.recipient.email}: ${data.id}`);
  return data;
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
