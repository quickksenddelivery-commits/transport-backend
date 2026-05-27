require('dotenv').config();
const mongoose = require('mongoose');
const Shipment = require('../src/models/Shipment');
const { generateTrackingNumber } = require('../src/utils/helpers');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB\n');

  const shipments = await Shipment.find({});
  let updated = 0;

  for (const shipment of shipments) {
    const oldNumber = shipment.trackingNumber;
    if (oldNumber.startsWith('AXP')) {
      console.log(`  SKIP  ${oldNumber} (already AXP)`);
      continue;
    }

    const newNumber = generateTrackingNumber();
    shipment.trackingNumber = newNumber;
    await shipment.save();
    console.log(`  UPDATED  ${oldNumber}  →  ${newNumber}`);
    updated++;
  }

  console.log(`\n${updated} tracking number(s) updated.`);
  await mongoose.disconnect();
  process.exit(0);
})().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
