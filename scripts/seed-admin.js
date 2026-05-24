require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

const ADMIN = {
  firstName: 'Quick Send',
  lastName: 'Admin',
  email: 'quickksenddelivery@gmail.com',
  username: 'admin',
  password: 'Boss@king1',
  role: 'admin',
};

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const existing = await User.findOne({ email: ADMIN.email });
  if (existing) {
    console.log('Admin user already exists:', ADMIN.email);
    process.exit(0);
  }

  await User.create(ADMIN);
  console.log('Admin user created successfully');
  console.log('  Email   :', ADMIN.email);
  console.log('  Username:', ADMIN.username);
  console.log('  Password:', ADMIN.password);
  console.log('\nChange the password after first login!');

  await mongoose.disconnect();
  process.exit(0);
})().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
