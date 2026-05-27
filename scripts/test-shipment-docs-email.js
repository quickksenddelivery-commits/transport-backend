require('dotenv').config();
process.env.NODE_ENV = 'production'; // force real send
const mongoose = require('mongoose');
const Shipment = require('../src/models/Shipment');
const { sendShipmentDocuments } = require('../src/services/email.service');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const shipment = await Shipment.findOne({ isDeleted: false }).lean();

  // Override recipient email to test address
  shipment.recipient.email = 'quickksenddelivery@gmail.com';

  console.log('Sending documents for:', shipment.trackingNumber);
  console.log('Recipient:', shipment.recipient.email);

  const result = await sendShipmentDocuments(shipment);
  console.log('All 3 document emails sent successfully!');

  await mongoose.disconnect();
}).catch((err) => {
  console.error('Failed:', err.message);
  process.exit(1);
});
