const mongoose = require('mongoose');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
let uri = '';
env.split('\n').forEach(l => {
  const [k, ...v] = l.split('=');
  if (k && k.trim() === 'MONGODB_URI') {
    uri = v.join('=').trim().replace(/^["']|["']$/g, '');
  }
});

async function check() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  const hostels = await db.collection('hostels').countDocuments();
  const rooms = await db.collection('rooms').countDocuments();
  const users = await db.collection('users').countDocuments();
  const enquiries = await db.collection('enquiries').countDocuments();
  const reviews = await db.collection('reviews').countDocuments();
  console.log("Database Stats:", { hostels, rooms, users, enquiries, reviews });
  
  const allHostels = await db.collection('hostels').find({}, { projection: { name: 1, slug: 1, startingPrice: 1, phone: 1, approved: 1 } }).toArray();
  console.log('Hostels List:', allHostels);

  const adminUsers = await db.collection('users').find({ role: { $in: ['admin', 'superadmin'] } }, { projection: { name: 1, email: 1, role: 1, hostelId: 1 } }).toArray();
  console.log('Admin Accounts:', adminUsers);

  await mongoose.disconnect();
}
check();
