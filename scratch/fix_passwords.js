const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
let uri = '';
env.split('\n').forEach(l => {
  const [k, ...v] = l.split('=');
  if (k && k.trim() === 'MONGODB_URI') {
    uri = v.join('=').trim().replace(/^["']|["']$/g, '');
  }
});

async function fix() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  const superAdminHash = await bcrypt.hash("SuperAdmin@123", 10);
  const adminHash = await bcrypt.hash("Admin@123", 10);
  const studentHash = await bcrypt.hash("Student@123", 10);

  // Update superadmin
  await db.collection('users').updateMany(
    { email: "superadmin@keralahostels.in" },
    {
      $set: {
        passwordHash: superAdminHash,
        password: superAdminHash,
        role: "superadmin"
      }
    }
  );

  // Update admin accounts
  await db.collection('users').updateMany(
    { email: { $regex: /^admin\./ } },
    {
      $set: {
        passwordHash: adminHash,
        password: adminHash,
        role: "admin"
      }
    }
  );

  // Update any other admins
  await db.collection('users').updateMany(
    { email: "athullal@webcastle.in" },
    {
      $set: {
        passwordHash: adminHash,
        password: adminHash,
        role: "admin"
      }
    }
  );

  // Update student users
  await db.collection('users').updateMany(
    { email: { $regex: /student/ } },
    {
      $set: {
        passwordHash: studentHash,
        password: studentHash,
        role: "user"
      }
    }
  );

  const users = await db.collection('users').find({}, { projection: { email: 1, role: 1 } }).toArray();
  console.log("Updated users in DB:", users);

  // Verify bcrypt check for superadmin
  const superUser = await db.collection('users').findOne({ email: "superadmin@keralahostels.in" });
  const checkPass = await bcrypt.compare("SuperAdmin@123", superUser.passwordHash);
  console.log("SuperAdmin Password verification check:", checkPass ? "✅ PASS" : "❌ FAIL");

  await mongoose.disconnect();
}

fix();
