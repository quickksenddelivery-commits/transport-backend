require('dotenv').config();
const mongoose = require('mongoose');
const Shipment = require('../src/models/Shipment');

const generateTrackingNumber = () =>
  'QSD' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();

const shipments = [
  {
    trackingNumber: generateTrackingNumber(),
    status: 'in_transit',
    service: 'express',
    sender: {
      name: 'James Okafor',
      phone: '+234 801 234 5678',
      email: 'james.okafor@gmail.com',
      street: '14 Broad Street',
      city: 'Lagos',
      state: 'Lagos',
      country: 'Nigeria',
      postalCode: '100001',
    },
    recipient: {
      name: 'Amina Bello',
      phone: '+234 802 987 6543',
      email: 'amina.bello@gmail.com',
      street: '7 Ahmadu Bello Way',
      city: 'Abuja',
      state: 'FCT',
      country: 'Nigeria',
      postalCode: '900001',
    },
    weight: 3.5,
    dimensions: { length: 30, width: 20, height: 15 },
    contents: 'Electronics — Laptop accessories',
    declaredValue: 150000,
    price: 8500,
    eta: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    events: [
      { time: '09:00', date: '2026-05-24', location: 'Lagos Hub', desc: 'Shipment picked up from sender', type: 'pickup' },
      { time: '14:30', date: '2026-05-24', location: 'Lagos Sorting Centre', desc: 'Package sorted and dispatched', type: 'transit' },
      { time: '07:15', date: '2026-05-25', location: 'Abuja Distribution Centre', desc: 'Arrived at destination hub', type: 'transit' },
    ],
  },
  {
    trackingNumber: generateTrackingNumber(),
    status: 'delivered',
    service: 'standard',
    sender: {
      name: 'Chidi Nwosu',
      phone: '+234 803 456 7890',
      email: 'chidi.nwosu@yahoo.com',
      street: '22 Onitsha Road',
      city: 'Enugu',
      state: 'Enugu',
      country: 'Nigeria',
      postalCode: '400001',
    },
    recipient: {
      name: 'Fatima Usman',
      phone: '+234 805 321 0987',
      email: 'fatima.usman@gmail.com',
      street: '5 Kano Road',
      city: 'Kano',
      state: 'Kano',
      country: 'Nigeria',
      postalCode: '700001',
    },
    weight: 1.2,
    dimensions: { length: 20, width: 15, height: 10 },
    contents: 'Clothing & Accessories',
    declaredValue: 45000,
    price: 4200,
    eta: new Date('2026-05-20'),
    deliveredAt: new Date('2026-05-20T11:30:00'),
    events: [
      { time: '08:00', date: '2026-05-16', location: 'Enugu Hub', desc: 'Package collected from sender', type: 'pickup' },
      { time: '16:00', date: '2026-05-17', location: 'Enugu Sorting Centre', desc: 'In transit to Kano', type: 'transit' },
      { time: '09:45', date: '2026-05-19', location: 'Kano Distribution Centre', desc: 'Package arrived at Kano hub', type: 'transit' },
      { time: '10:00', date: '2026-05-20', location: 'Kano', desc: 'Out for delivery', type: 'delivery' },
      { time: '11:30', date: '2026-05-20', location: 'Kano', desc: 'Package delivered successfully. Signed by recipient.', type: 'delivery' },
    ],
  },
  {
    trackingNumber: generateTrackingNumber(),
    status: 'pending',
    service: 'same_day',
    sender: {
      name: 'Ngozi Eze',
      phone: '+234 806 654 3210',
      email: 'ngozi.eze@company.com',
      street: '3 Allen Avenue',
      city: 'Ikeja',
      state: 'Lagos',
      country: 'Nigeria',
      postalCode: '100271',
    },
    recipient: {
      name: 'Tunde Adeyemi',
      phone: '+234 807 111 2222',
      email: 'tunde.adeyemi@gmail.com',
      street: '9 Victoria Island',
      city: 'Lagos',
      state: 'Lagos',
      country: 'Nigeria',
      postalCode: '101241',
    },
    weight: 0.8,
    dimensions: { length: 25, width: 10, height: 8 },
    contents: 'Documents — Legal papers',
    declaredValue: 10000,
    price: 6000,
    eta: new Date(Date.now() + 8 * 60 * 60 * 1000),
    events: [
      { time: '10:00', date: '2026-05-24', location: 'Ikeja, Lagos', desc: 'Order placed and awaiting pickup', type: 'info' },
    ],
  },
  {
    trackingNumber: generateTrackingNumber(),
    status: 'out_for_delivery',
    service: 'overnight',
    sender: {
      name: 'Emeka Obi',
      phone: '+234 808 777 8888',
      email: 'emeka.obi@business.ng',
      street: '11 Trans-Amadi',
      city: 'Port Harcourt',
      state: 'Rivers',
      country: 'Nigeria',
      postalCode: '500001',
    },
    recipient: {
      name: 'Halima Garba',
      phone: '+234 809 444 5555',
      email: 'halima.garba@gmail.com',
      street: '18 Maiduguri Road',
      city: 'Kaduna',
      state: 'Kaduna',
      country: 'Nigeria',
      postalCode: '800001',
    },
    weight: 5.0,
    dimensions: { length: 40, width: 30, height: 25 },
    contents: 'Industrial spare parts',
    declaredValue: 320000,
    price: 18000,
    eta: new Date(Date.now() + 4 * 60 * 60 * 1000),
    events: [
      { time: '18:00', date: '2026-05-23', location: 'Port Harcourt Hub', desc: 'Package received and dispatched overnight', type: 'pickup' },
      { time: '23:30', date: '2026-05-23', location: 'Abuja Transit Hub', desc: 'In transit via overnight route', type: 'transit' },
      { time: '06:00', date: '2026-05-24', location: 'Kaduna Distribution Centre', desc: 'Arrived at Kaduna hub, out for delivery', type: 'delivery' },
    ],
  },
];

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB\n');

  for (const data of shipments) {
    const shipment = await Shipment.create(data);
    console.log(`Created: ${shipment.trackingNumber} | ${shipment.service.padEnd(10)} | ${shipment.status}`);
  }

  console.log('\n4 shipments seeded successfully.');
  await mongoose.disconnect();
  process.exit(0);
})().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
