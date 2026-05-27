const baseLayout = ({ preheader, headerColor, iconBg, icon, title, subtitle, body, cta, ctaUrl }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <!-- Preheader (hidden preview text) -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌</div>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f1f5f9;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background-color:#0f172a;border-radius:12px 12px 0 0;padding:28px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <span style="font-size:22px;font-weight:800;color:#f59e0b;letter-spacing:-0.5px;">Accessiblexpress</span>
                  </td>
                  <td align="right">
                    <span style="background-color:#1e293b;color:#94a3b8;font-size:11px;font-weight:600;padding:5px 12px;border-radius:20px;letter-spacing:0.5px;text-transform:uppercase;">Shipment Alert</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Status Banner -->
          <tr>
            <td style="background-color:${headerColor};padding:32px 40px;text-align:center;">
              <div style="background-color:${iconBg};width:64px;height:64px;border-radius:50%;margin:0 auto 16px;display:inline-block;line-height:64px;font-size:28px;">${icon}</div>
              <h1 style="margin:0 0 8px;color:#ffffff;font-size:26px;font-weight:800;letter-spacing:-0.5px;">${title}</h1>
              <p style="margin:0;color:rgba(255,255,255,0.85);font-size:15px;font-weight:400;">${subtitle}</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color:#ffffff;padding:36px 40px;">
              ${body}

              ${cta ? `
              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:32px;">
                <tr>
                  <td align="center">
                    <a href="${ctaUrl || '#'}" style="display:inline-block;background-color:#f59e0b;color:#000000;font-size:15px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:8px;letter-spacing:0.3px;">${cta} →</a>
                  </td>
                </tr>
              </table>` : ''}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc;border-top:1px solid #e2e8f0;border-radius:0 0 12px 12px;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 6px;color:#64748b;font-size:12px;">You're receiving this because a shipment is associated with your email address.</p>
              <p style="margin:0;color:#94a3b8;font-size:11px;">© ${new Date().getFullYear()} Accessiblexpress · All rights reserved</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

const shipmentInfoBlock = (shipment) => `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:24px;">
    <tr>
      <td style="padding:20px 24px;">
        <p style="margin:0 0 14px;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Shipment Details</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="padding:5px 0;font-size:13px;color:#64748b;font-weight:600;width:45%;">Tracking Number</td>
            <td style="padding:5px 0;font-size:13px;color:#0f172a;font-weight:700;font-family:monospace;">${shipment.trackingNumber}</td>
          </tr>
          <tr>
            <td style="padding:5px 0;font-size:13px;color:#64748b;font-weight:600;">Service</td>
            <td style="padding:5px 0;font-size:13px;color:#0f172a;font-weight:500;text-transform:capitalize;">${shipment.service.replace('_', ' ')}</td>
          </tr>
          <tr>
            <td style="padding:5px 0;font-size:13px;color:#64748b;font-weight:600;">From</td>
            <td style="padding:5px 0;font-size:13px;color:#0f172a;font-weight:500;">${shipment.sender.city}, ${shipment.sender.country}</td>
          </tr>
          <tr>
            <td style="padding:5px 0;font-size:13px;color:#64748b;font-weight:600;">To</td>
            <td style="padding:5px 0;font-size:13px;color:#0f172a;font-weight:500;">${shipment.recipient.city}, ${shipment.recipient.country}</td>
          </tr>
          ${shipment.eta ? `<tr>
            <td style="padding:5px 0;font-size:13px;color:#64748b;font-weight:600;">Estimated Delivery</td>
            <td style="padding:5px 0;font-size:13px;color:#0f172a;font-weight:500;">${new Date(shipment.eta).toDateString()}</td>
          </tr>` : ''}
        </table>
      </td>
    </tr>
  </table>`;

const routeBlock = (shipment) => `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
    <tr>
      <!-- Sender -->
      <td width="45%" style="background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px 16px;vertical-align:top;">
        <p style="margin:0 0 4px;font-size:10px;font-weight:700;color:#16a34a;text-transform:uppercase;letter-spacing:1px;">From</p>
        <p style="margin:0;font-size:14px;font-weight:700;color:#0f172a;">${shipment.sender.name}</p>
        <p style="margin:2px 0 0;font-size:12px;color:#64748b;">${shipment.sender.city}, ${shipment.sender.country}</p>
      </td>
      <!-- Arrow -->
      <td width="10%" align="center" style="color:#f59e0b;font-size:22px;font-weight:900;">→</td>
      <!-- Recipient -->
      <td width="45%" style="background-color:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:14px 16px;vertical-align:top;">
        <p style="margin:0 0 4px;font-size:10px;font-weight:700;color:#2563eb;text-transform:uppercase;letter-spacing:1px;">To</p>
        <p style="margin:0;font-size:14px;font-weight:700;color:#0f172a;">${shipment.recipient.name}</p>
        <p style="margin:2px 0 0;font-size:12px;color:#64748b;">${shipment.recipient.city}, ${shipment.recipient.country}</p>
      </td>
    </tr>
  </table>`;

// ─── Template: Package Picked Up ────────────────────────────────────────────

exports.pickedUp = (shipment) => baseLayout({
  preheader: `Your package has been collected and is heading your way — Tracking #${shipment.trackingNumber}`,
  headerColor: '#0369a1',
  iconBg: 'rgba(255,255,255,0.15)',
  icon: '📦',
  title: 'Package Picked Up!',
  subtitle: `Your shipment #${shipment.trackingNumber} has been collected by our courier.`,
  cta: 'Track Your Package',
  body: `
    <p style="margin:0 0 24px;font-size:15px;color:#334155;line-height:1.6;">
      Hi <strong>${shipment.recipient.name}</strong>, great news! The package being sent to you has been successfully collected and is now in our care.
    </p>
    ${routeBlock(shipment)}
    ${shipmentInfoBlock(shipment)}
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0f9ff;border-left:4px solid #0369a1;border-radius:0 8px 8px 0;margin-bottom:8px;">
      <tr><td style="padding:14px 18px;font-size:13px;color:#0c4a6e;line-height:1.6;">
        Our courier has collected your package and it is now being processed at our sorting facility. You will receive further updates as your shipment progresses.
      </td></tr>
    </table>`,
});

// ─── Template: In Transit ────────────────────────────────────────────────────

exports.inTransit = (shipment, eventLocation) => baseLayout({
  preheader: `Your package is on the move — Tracking #${shipment.trackingNumber}`,
  headerColor: '#7c3aed',
  iconBg: 'rgba(255,255,255,0.15)',
  icon: '🚚',
  title: 'Package In Transit',
  subtitle: `Your shipment is on its way to ${shipment.recipient.city}.`,
  cta: 'Track Your Package',
  body: `
    <p style="margin:0 0 24px;font-size:15px;color:#334155;line-height:1.6;">
      Hi <strong>${shipment.recipient.name}</strong>, your package is moving through our network and is currently in transit to its destination.
    </p>
    ${routeBlock(shipment)}
    ${shipmentInfoBlock(shipment)}
    ${eventLocation ? `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#faf5ff;border-left:4px solid #7c3aed;border-radius:0 8px 8px 0;margin-bottom:8px;">
      <tr><td style="padding:14px 18px;font-size:13px;color:#4c1d95;line-height:1.6;">
        <strong>Current Location:</strong> ${eventLocation}
      </td></tr>
    </table>` : ''}`,
});

// ─── Template: Out for Delivery ──────────────────────────────────────────────

exports.outForDelivery = (shipment) => baseLayout({
  preheader: `Your package is out for delivery today — Tracking #${shipment.trackingNumber}`,
  headerColor: '#d97706',
  iconBg: 'rgba(255,255,255,0.15)',
  icon: '🛵',
  title: 'Out for Delivery!',
  subtitle: 'Your package will be delivered today. Please be available to receive it.',
  cta: 'Track Your Package',
  body: `
    <p style="margin:0 0 24px;font-size:15px;color:#334155;line-height:1.6;">
      Hi <strong>${shipment.recipient.name}</strong>, exciting news — your package is <strong>out for delivery</strong> and our driver is heading to your address right now!
    </p>
    ${routeBlock(shipment)}
    ${shipmentInfoBlock(shipment)}
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fffbeb;border-left:4px solid #d97706;border-radius:0 8px 8px 0;margin-bottom:8px;">
      <tr><td style="padding:14px 18px;">
        <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#92400e;">What to expect:</p>
        <ul style="margin:0;padding-left:18px;font-size:13px;color:#78350f;line-height:1.8;">
          <li>Delivery to: <strong>${shipment.recipient.street || 'Your registered address'}, ${shipment.recipient.city}</strong></li>
          <li>Please ensure someone is available to receive the package</li>
          <li>Have a valid ID ready if required for signature</li>
        </ul>
      </td></tr>
    </table>`,
});

// ─── Template: Delivered ─────────────────────────────────────────────────────

exports.delivered = (shipment) => baseLayout({
  preheader: `Your package has been delivered successfully — Tracking #${shipment.trackingNumber}`,
  headerColor: '#16a34a',
  iconBg: 'rgba(255,255,255,0.15)',
  icon: '✅',
  title: 'Package Delivered!',
  subtitle: `Delivered on ${new Date(shipment.deliveredAt || Date.now()).toDateString()}`,
  cta: 'View Delivery Details',
  body: `
    <p style="margin:0 0 24px;font-size:15px;color:#334155;line-height:1.6;">
      Hi <strong>${shipment.recipient.name}</strong>, your package has been <strong>successfully delivered</strong>. We hope everything arrived in perfect condition!
    </p>
    ${routeBlock(shipment)}
    ${shipmentInfoBlock(shipment)}
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0fdf4;border-left:4px solid #16a34a;border-radius:0 8px 8px 0;margin-bottom:24px;">
      <tr><td style="padding:14px 18px;font-size:13px;color:#14532d;line-height:1.6;">
        <strong>Delivery Confirmed</strong><br/>
        Delivered to: ${shipment.recipient.street || 'Registered address'}, ${shipment.recipient.city}<br/>
        Date: ${new Date(shipment.deliveredAt || Date.now()).toLocaleString()}
      </td></tr>
    </table>
    <p style="margin:0;font-size:14px;color:#64748b;text-align:center;line-height:1.6;">
      Thank you for choosing <strong style="color:#f59e0b;">Accessiblexpress</strong>. We'd love to serve you again! 🙏
    </p>`,
});

// ─── Template: Delay Alert ───────────────────────────────────────────────────

exports.delayAlert = (shipment, event) => baseLayout({
  preheader: `Important update on your shipment — Tracking #${shipment.trackingNumber}`,
  headerColor: '#dc2626',
  iconBg: 'rgba(255,255,255,0.15)',
  icon: '⚠️',
  title: 'Shipment Delay Alert',
  subtitle: 'An unexpected issue has been flagged on your shipment.',
  cta: 'Track Your Package',
  body: `
    <p style="margin:0 0 24px;font-size:15px;color:#334155;line-height:1.6;">
      Hi <strong>${shipment.recipient.name}</strong>, we want to keep you informed. There has been an unexpected delay with your shipment, and we sincerely apologise for any inconvenience this may cause.
    </p>
    ${routeBlock(shipment)}
    ${shipmentInfoBlock(shipment)}
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fef2f2;border-left:4px solid #dc2626;border-radius:0 8px 8px 0;margin-bottom:24px;">
      <tr><td style="padding:14px 18px;">
        <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#991b1b;">Delay Notice</p>
        <p style="margin:0;font-size:13px;color:#7f1d1d;line-height:1.6;">${event.desc}</p>
        ${event.location ? `<p style="margin:6px 0 0;font-size:12px;color:#991b1b;"><strong>Location:</strong> ${event.location}</p>` : ''}
        ${event.date ? `<p style="margin:4px 0 0;font-size:12px;color:#991b1b;"><strong>Reported:</strong> ${event.date}${event.time ? ' at ' + event.time : ''}</p>` : ''}
      </td></tr>
    </table>
    <p style="margin:0;font-size:13px;color:#64748b;line-height:1.6;text-align:center;">
      Our team is actively working to resolve this issue as quickly as possible. We will send you another update as soon as your shipment is back on track.
    </p>`,
});

// ─── Template: Newsletter Welcome ────────────────────────────────────────────

exports.newsletterWelcome = (email) => baseLayout({
  preheader: `Welcome to Accessiblexpress — you're now part of our community!`,
  headerColor: '#0f172a',
  iconBg: 'rgba(245,158,11,0.2)',
  icon: '🎉',
  title: 'Welcome Aboard!',
  subtitle: "You're now part of the Accessiblexpress family.",
  cta: 'Visit Our Website',
  body: `
    <p style="margin:0 0 20px;font-size:15px;color:#334155;line-height:1.6;">
      Thank you for subscribing! You will be the first to know about:
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
      <tr>
        <td style="padding:10px 0;vertical-align:top;width:44px;">
          <div style="background-color:#fef3c7;width:36px;height:36px;border-radius:8px;text-align:center;line-height:36px;font-size:18px;">📬</div>
        </td>
        <td style="padding:10px 0 10px 12px;vertical-align:top;border-bottom:1px solid #f1f5f9;">
          <p style="margin:0 0 2px;font-size:14px;font-weight:700;color:#0f172a;">Shipping Updates</p>
          <p style="margin:0;font-size:13px;color:#64748b;line-height:1.5;">Real-time news on our delivery network and service improvements.</p>
        </td>
      </tr>
      <tr>
        <td style="padding:10px 0;vertical-align:top;width:44px;">
          <div style="background-color:#fef3c7;width:36px;height:36px;border-radius:8px;text-align:center;line-height:36px;font-size:18px;">🎁</div>
        </td>
        <td style="padding:10px 0 10px 12px;vertical-align:top;border-bottom:1px solid #f1f5f9;">
          <p style="margin:0 0 2px;font-size:14px;font-weight:700;color:#0f172a;">Exclusive Promotions</p>
          <p style="margin:0;font-size:13px;color:#64748b;line-height:1.5;">Special discounts and offers available only to our subscribers.</p>
        </td>
      </tr>
      <tr>
        <td style="padding:10px 0;vertical-align:top;width:44px;">
          <div style="background-color:#fef3c7;width:36px;height:36px;border-radius:8px;text-align:center;line-height:36px;font-size:18px;">🚀</div>
        </td>
        <td style="padding:10px 0 10px 12px;vertical-align:top;border-bottom:1px solid #f1f5f9;">
          <p style="margin:0 0 2px;font-size:14px;font-weight:700;color:#0f172a;">New Services</p>
          <p style="margin:0;font-size:13px;color:#64748b;line-height:1.5;">Be the first to hear when we launch new delivery options.</p>
        </td>
      </tr>
      <tr>
        <td style="padding:10px 0;vertical-align:top;width:44px;">
          <div style="background-color:#fef3c7;width:36px;height:36px;border-radius:8px;text-align:center;line-height:36px;font-size:18px;">📍</div>
        </td>
        <td style="padding:10px 0 10px 12px;vertical-align:top;">
          <p style="margin:0 0 2px;font-size:14px;font-weight:700;color:#0f172a;">Route Expansions</p>
          <p style="margin:0;font-size:13px;color:#64748b;line-height:1.5;">Updates when we open new delivery routes and locations.</p>
        </td>
      </tr>
    </table>
    <p style="margin:0;font-size:13px;color:#94a3b8;text-align:center;line-height:1.6;">
      Not you? You can safely ignore this email — no action needed.<br/>
      Subscribed as: <strong style="color:#64748b;">${email}</strong>
    </p>`,
});

// ─── Shared helpers for document emails ──────────────────────────────────────

const docWrapper = (trackingNumber, recipientName, docType, docRef, accentColor, body) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>${docType} — ${trackingNumber}</title>
</head>
<body style="margin:0;padding:0;background:#e2e8f0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;">Your ${docType} for shipment ${trackingNumber} is attached · Accessiblexpress</div>

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#e2e8f0;padding:24px 0;">
    <tr><td align="center">
      <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;">

        <!-- Top alert banner -->
        <tr><td style="background:${accentColor};border-radius:8px 8px 0 0;padding:12px 24px;">
          <p style="margin:0;font-size:13px;color:#fff;line-height:1.5;">
            Dear <strong>${recipientName}</strong>, your shipment <strong>${trackingNumber}</strong> has been processed.
            &nbsp;<a href="#" style="color:#fff;font-weight:700;text-decoration:underline;">Track Your Package →</a>
          </p>
        </td></tr>

        <!-- Header -->
        <tr><td style="background:#0f172a;padding:20px 28px;">
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
            <td>
              <span style="font-size:20px;font-weight:800;color:#f59e0b;">Accessiblexpress</span><br/>
              <span style="font-size:10px;color:#94a3b8;letter-spacing:1px;text-transform:uppercase;">Global Logistics & Freight</span>
            </td>
            <td align="right">
              <span style="font-size:18px;font-weight:700;color:#ffffff;">${docType}</span><br/>
              <span style="font-size:10px;color:${accentColor};">${docRef}</span>
            </td>
          </tr></table>
        </td></tr>

        <!-- Body -->
        ${body}

        <!-- Footer -->
        <tr><td style="background:#0f172a;border-radius:0 0 8px 8px;padding:16px 28px;text-align:center;">
          <p style="margin:0 0 4px;font-size:11px;color:#64748b;">
            Accessiblexpress · Fast. Secure. Reliable. · <a href="https://accessiblexpress.com" style="color:#f59e0b;text-decoration:none;">accessiblexpress.com</a>
          </p>
          <p style="margin:0;font-size:10px;color:#475569;">This is an automated receipt. Please do not reply to this email.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

const partyRow = (label, p) => `
  <td style="width:50%;padding:14px 16px;vertical-align:top;">
    <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:0.5px;">${label}</p>
    <p style="margin:0 0 3px;font-size:14px;font-weight:700;color:#fff;">${p.name || '—'}</p>
    ${p.street ? `<p style="margin:0 0 2px;font-size:12px;color:rgba(255,255,255,0.8);">${p.street}</p>` : ''}
    ${p.city || p.state ? `<p style="margin:0 0 2px;font-size:12px;color:rgba(255,255,255,0.8);">${[p.city, p.state].filter(Boolean).join(', ')}</p>` : ''}
    ${p.country ? `<p style="margin:0 0 2px;font-size:12px;color:rgba(255,255,255,0.8);">${p.country}</p>` : ''}
    ${p.email ? `<p style="margin:4px 0 2px;font-size:12px;color:rgba(255,255,255,0.75);">Email: <a href="mailto:${p.email}" style="color:#f59e0b;">${p.email}</a></p>` : ''}
    ${p.phone ? `<p style="margin:0;font-size:12px;color:rgba(255,255,255,0.75);">Contact: ${p.phone}</p>` : ''}
  </td>`;

const detailRow = (label, value, highlight) => `
  <tr style="border-bottom:1px solid #e2e8f0;">
    <td style="padding:9px 16px;font-size:13px;font-weight:600;color:#64748b;width:45%;">${label}</td>
    <td style="padding:9px 16px;font-size:13px;font-weight:700;color:${highlight || '#0f172a'};">${value || '—'}</td>
  </tr>`;

const sectionHeader = (text, bg) => `
  <tr><td colspan="2" style="padding:0;">
    <p style="margin:0;background:${bg || '#0f172a'};color:#fff;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:8px 16px;">${text}</p>
  </td></tr>`;

const trackingHero = (trackingNumber, accentColor) => `
  <tr><td style="background:#0f172a;padding:28px;text-align:center;">
    <p style="margin:0 0 8px;font-size:10px;font-weight:700;color:#94a3b8;letter-spacing:2px;text-transform:uppercase;">Tracking Number</p>
    <p style="margin:0;font-size:28px;font-weight:900;color:#ffffff;letter-spacing:4px;font-family:monospace;">${trackingNumber}</p>
    <div style="width:60px;height:3px;background:${accentColor};margin:10px auto 0;border-radius:2px;"></div>
  </td></tr>`;

// ─── AWB Email ────────────────────────────────────────────────────────────────

exports.awbEmail = (shipment) => {
  const dims = shipment.dimensions
    ? `${shipment.dimensions.length||'—'} × ${shipment.dimensions.width||'—'} × ${shipment.dimensions.height||'—'} cm`
    : '—';

  const body = `
    <!-- Sender / Recipient -->
    <tr><td style="padding:0;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="background:#1e3a5f;width:50%;padding:0;">${partyRow('Sender', shipment.sender)}</td>
          <td style="background:#7f1d1d;width:50%;padding:0;">${partyRow('Recipient', shipment.recipient)}</td>
        </tr>
      </table>
    </td></tr>

    <!-- Shipment details -->
    <tr><td style="background:#fff;padding:0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;">
        ${sectionHeader('Shipment Details', '#0f172a')}
        ${detailRow('Tracking ID', shipment.trackingNumber)}
        ${detailRow('Status', (shipment.status||'').replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase()), '#16a34a')}
        ${detailRow('Service Type', (shipment.service||'').replace(/_/g,' ').toUpperCase())}
        ${detailRow('Date Created', new Date(shipment.createdAt).toDateString())}
        ${detailRow('Estimated Delivery', shipment.eta ? new Date(shipment.eta).toDateString() : 'TBD')}
        ${detailRow('Origin', `${shipment.sender.city||''}, ${shipment.sender.country||''}`)}
        ${detailRow('Destination', `${shipment.recipient.city||''}, ${shipment.recipient.country||''}`)}
      </table>
    </td></tr>

    <!-- Package details -->
    <tr><td style="background:#fff;padding:0;border-top:1px solid #e2e8f0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;">
        ${sectionHeader('Package Details', '#1e3a5f')}
        <tr style="background:#f8fafc;">
          <th style="padding:8px 12px;font-size:11px;color:#64748b;text-align:left;font-weight:600;border-bottom:1px solid #e2e8f0;">Description</th>
          <th style="padding:8px 12px;font-size:11px;color:#64748b;text-align:left;font-weight:600;border-bottom:1px solid #e2e8f0;">Weight (kg)</th>
          <th style="padding:8px 12px;font-size:11px;color:#64748b;text-align:left;font-weight:600;border-bottom:1px solid #e2e8f0;">Dimensions</th>
          <th style="padding:8px 12px;font-size:11px;color:#64748b;text-align:left;font-weight:600;border-bottom:1px solid #e2e8f0;">Declared Value</th>
        </tr>
        <tr>
          <td style="padding:10px 12px;font-size:13px;color:#0f172a;">${shipment.contents || 'General Cargo'}</td>
          <td style="padding:10px 12px;font-size:13px;color:#0f172a;font-weight:700;">${shipment.weight} kg</td>
          <td style="padding:10px 12px;font-size:13px;color:#0f172a;">${dims}</td>
          <td style="padding:10px 12px;font-size:13px;color:#0f172a;">$${Number(shipment.declaredValue||0).toFixed(2)}</td>
        </tr>
      </table>
    </td></tr>

    <!-- Tracking hero -->
    ${trackingHero(shipment.trackingNumber, '#f59e0b')}

    <!-- Signature row -->
    <tr><td style="background:#f8fafc;padding:20px 28px;border-top:1px solid #e2e8f0;">
      <table width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="width:50%;text-align:center;border-right:1px solid #e2e8f0;">
          <p style="margin:0 0 20px;font-size:12px;color:#64748b;font-weight:600;">Shipper Signature</p>
          <div style="height:1px;background:#94a3b8;width:80%;margin:0 auto;"></div>
        </td>
        <td style="width:50%;text-align:center;">
          <p style="margin:0 0 20px;font-size:12px;color:#64748b;font-weight:600;">Carrier Signature</p>
          <div style="height:1px;background:#94a3b8;width:80%;margin:0 auto;"></div>
        </td>
      </tr></table>
    </td></tr>`;

  return docWrapper(shipment.trackingNumber, shipment.recipient.name, 'Waybill Receipt', `AWB-${shipment.trackingNumber}`, '#dc2626', body);
};

// ─── Invoice Email ────────────────────────────────────────────────────────────

exports.invoiceEmail = (shipment) => {
  const unitVal = Number(shipment.declaredValue || 0);

  const body = `
    <!-- Sender / Recipient -->
    <tr><td style="padding:0;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="background:#14532d;width:50%;padding:0;">${partyRow('Exporter / Seller', shipment.sender)}</td>
          <td style="background:#1e3a5f;width:50%;padding:0;">${partyRow('Importer / Buyer', shipment.recipient)}</td>
        </tr>
      </table>
    </td></tr>

    <!-- Invoice meta -->
    <tr><td style="background:#fff;padding:0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;">
        ${sectionHeader('Invoice Details', '#0f172a')}
        ${detailRow('Invoice Number', `INV-${shipment.trackingNumber}`)}
        ${detailRow('Invoice Date', new Date(shipment.createdAt).toDateString())}
        ${detailRow('Currency', 'USD')}
        ${detailRow('Incoterms', 'DAP')}
        ${detailRow('Country of Origin', shipment.sender.country || '—')}
        ${detailRow('Country of Destination', shipment.recipient.country || '—')}
        ${detailRow('Gross Weight', `${shipment.weight} kg`)}
        ${detailRow('Service', (shipment.service||'').replace(/_/g,' ').toUpperCase())}
      </table>
    </td></tr>

    <!-- Line items -->
    <tr><td style="background:#fff;padding:0;border-top:1px solid #e2e8f0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;">
        ${sectionHeader('Line Items', '#14532d')}
        <tr style="background:#f8fafc;">
          <th style="padding:8px 12px;font-size:11px;color:#64748b;text-align:left;font-weight:600;border-bottom:1px solid #e2e8f0;">Description of Goods</th>
          <th style="padding:8px 12px;font-size:11px;color:#64748b;text-align:center;font-weight:600;border-bottom:1px solid #e2e8f0;">Qty</th>
          <th style="padding:8px 12px;font-size:11px;color:#64748b;text-align:right;font-weight:600;border-bottom:1px solid #e2e8f0;">Unit Value</th>
          <th style="padding:8px 12px;font-size:11px;color:#64748b;text-align:right;font-weight:600;border-bottom:1px solid #e2e8f0;">Total</th>
        </tr>
        <tr>
          <td style="padding:10px 12px;font-size:13px;color:#0f172a;">${shipment.contents || 'General Cargo'}</td>
          <td style="padding:10px 12px;font-size:13px;color:#0f172a;text-align:center;">1</td>
          <td style="padding:10px 12px;font-size:13px;color:#0f172a;text-align:right;">$${unitVal.toFixed(2)}</td>
          <td style="padding:10px 12px;font-size:13px;font-weight:700;color:#0f172a;text-align:right;">$${unitVal.toFixed(2)}</td>
        </tr>
        <tr style="background:#0f172a;">
          <td colspan="2" style="padding:12px;font-size:13px;font-weight:700;color:#fff;">TOTAL DECLARED VALUE</td>
          <td colspan="2" style="padding:12px;font-size:16px;font-weight:900;color:#f59e0b;text-align:right;">USD $${unitVal.toFixed(2)}</td>
        </tr>
      </table>
    </td></tr>

    <!-- Tracking hero -->
    ${trackingHero(shipment.trackingNumber, '#16a34a')}

    <!-- Declaration -->
    <tr><td style="background:#f0fdf4;padding:16px 28px;border:1px solid #bbf7d0;">
      <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#14532d;text-transform:uppercase;letter-spacing:0.5px;">Declaration</p>
      <p style="margin:0;font-size:12px;color:#166534;line-height:1.6;">
        I declare that the information on this invoice is true and correct and that the contents and value of this shipment are as stated above.
      </p>
      <p style="margin:12px 0 0;font-size:11px;color:#64748b;">Authorised Signature: ___________________________</p>
    </td></tr>`;

  return docWrapper(shipment.trackingNumber, shipment.recipient.name, 'Commercial Invoice', `INV-${shipment.trackingNumber}`, '#16a34a', body);
};

// ─── Packing List Email ───────────────────────────────────────────────────────

exports.packingListEmail = (shipment) => {
  const dims = shipment.dimensions
    ? `${shipment.dimensions.length||'—'} × ${shipment.dimensions.width||'—'} × ${shipment.dimensions.height||'—'} cm`
    : '—';

  const body = `
    <!-- Sender / Recipient -->
    <tr><td style="padding:0;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="background:#4c1d95;width:50%;padding:0;">${partyRow('Shipped From', shipment.sender)}</td>
          <td style="background:#1e3a5f;width:50%;padding:0;">${partyRow('Ship To', shipment.recipient)}</td>
        </tr>
      </table>
    </td></tr>

    <!-- Reference details -->
    <tr><td style="background:#fff;padding:0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;">
        ${sectionHeader('Packing List Details', '#0f172a')}
        ${detailRow('Packing List Ref.', `PKL-${shipment.trackingNumber}`)}
        ${detailRow('Date Prepared', new Date(shipment.createdAt).toDateString())}
        ${detailRow('Status', (shipment.status||'').replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase()), '#7c3aed')}
        ${detailRow('Origin', `${shipment.sender.city||''}, ${shipment.sender.country||''}`)}
        ${detailRow('Destination', `${shipment.recipient.city||''}, ${shipment.recipient.country||''}`)}
        ${detailRow('Service', (shipment.service||'').replace(/_/g,' ').toUpperCase())}
        ${detailRow('Est. Delivery', shipment.eta ? new Date(shipment.eta).toDateString() : 'TBD')}
      </table>
    </td></tr>

    <!-- Package contents table -->
    <tr><td style="background:#fff;padding:0;border-top:1px solid #e2e8f0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;">
        ${sectionHeader('Package Contents', '#4c1d95')}
        <tr style="background:#f8fafc;">
          <th style="padding:8px 10px;font-size:11px;color:#64748b;text-align:left;font-weight:600;border-bottom:1px solid #e2e8f0;">Description</th>
          <th style="padding:8px 10px;font-size:11px;color:#64748b;text-align:center;font-weight:600;border-bottom:1px solid #e2e8f0;">Qty</th>
          <th style="padding:8px 10px;font-size:11px;color:#64748b;text-align:center;font-weight:600;border-bottom:1px solid #e2e8f0;">Weight</th>
          <th style="padding:8px 10px;font-size:11px;color:#64748b;text-align:center;font-weight:600;border-bottom:1px solid #e2e8f0;">Dimensions</th>
          <th style="padding:8px 10px;font-size:11px;color:#64748b;text-align:center;font-weight:600;border-bottom:1px solid #e2e8f0;">Condition</th>
        </tr>
        <tr>
          <td style="padding:10px;font-size:13px;color:#0f172a;">${shipment.contents || 'General Cargo'}</td>
          <td style="padding:10px;font-size:13px;color:#0f172a;text-align:center;">1</td>
          <td style="padding:10px;font-size:13px;font-weight:700;color:#0f172a;text-align:center;">${shipment.weight} kg</td>
          <td style="padding:10px;font-size:13px;color:#0f172a;text-align:center;">${dims}</td>
          <td style="padding:10px;font-size:13px;color:#16a34a;font-weight:700;text-align:center;">Good</td>
        </tr>
        <tr style="background:#0f172a;">
          <td style="padding:10px 12px;font-size:13px;font-weight:700;color:#fff;">TOTALS</td>
          <td style="padding:10px;font-size:13px;font-weight:700;color:#fff;text-align:center;">1 pkg</td>
          <td style="padding:10px;font-size:13px;font-weight:700;color:#f59e0b;text-align:center;">${shipment.weight} kg</td>
          <td colspan="2"></td>
        </tr>
      </table>
    </td></tr>

    <!-- Notes -->
    ${shipment.notes ? `
    <tr><td style="background:#faf5ff;padding:14px 28px;border:1px solid #e9d5ff;border-top:none;">
      <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#6d28d9;text-transform:uppercase;">Special Instructions</p>
      <p style="margin:0;font-size:13px;color:#4c1d95;line-height:1.6;">${shipment.notes}</p>
    </td></tr>` : ''}

    <!-- Tracking hero -->
    ${trackingHero(shipment.trackingNumber, '#7c3aed')}

    <!-- Prepared by -->
    <tr><td style="background:#f8fafc;padding:16px 28px;border-top:1px solid #e2e8f0;">
      <table width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="font-size:12px;color:#64748b;"><strong>Prepared by:</strong> Accessiblexpress Ltd.</td>
        <td style="font-size:12px;color:#64748b;text-align:right;"><strong>Email:</strong> logistics@accessiblexpress.com</td>
      </tr></table>
    </td></tr>`;

  return docWrapper(shipment.trackingNumber, shipment.recipient.name, 'Packing List', `PKL-${shipment.trackingNumber}`, '#7c3aed', body);
};
