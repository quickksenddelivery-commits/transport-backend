require('dotenv').config();
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

(async () => {
  console.log('Sending test email...');

  const { data, error } = await resend.emails.send({
    from: `Quick Send Delivery <${process.env.EMAIL_FROM}>`,
    to: 'quickksenddelivery@gmail.com',
    subject: 'Quick Send Delivery — Test Email',
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:24px">
        <h2 style="color:#f59e0b">Quick Send Delivery</h2>
        <p>This is a test email confirming your Resend integration with <strong>${process.env.EMAIL_FROM}</strong> is working correctly.</p>
        <p style="color:#6b7280;font-size:13px">Sent at: ${new Date().toISOString()}</p>
        <p>— The Quick Send Team</p>
      </div>
    `,
  });

  if (error) {
    console.error('Failed:', error);
    process.exit(1);
  }

  console.log('Success! Email ID:', data.id);
  console.log('From:', process.env.EMAIL_FROM);
  console.log('To: quickksenddelivery@gmail.com');
})();
