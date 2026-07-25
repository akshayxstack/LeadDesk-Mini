require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const dns = require('dns');
// Set public DNS servers to resolve MongoDB Atlas SRV records on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.log('Could not set custom DNS servers:', e.message);
}

const mongoose = require('mongoose');
const AdminUser = require('../src/models/AdminUser');
const Lead = require('../src/models/Lead');
const bcrypt = require('bcryptjs');

async function testAtlas() {
  const uri = process.env.MONGODB_URI;
  console.log('Connecting to Atlas URI:', uri.replace(/:([^@]+)@/, ':****@'));

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log('Successfully connected to MongoDB Atlas!');

    // 1. Seed Admin User
    const username = 'admin';
    const password = 'AdminPass123!';
    let admin = await AdminUser.findOne({ username });
    if (!admin) {
      const passwordHash = await bcrypt.hash(password, 10);
      admin = new AdminUser({ username, passwordHash, createdAt: new Date() });
      await admin.save();
      console.log('Admin user created successfully in Atlas database.');
    } else {
      console.log('Admin user already exists in Atlas database.');
    }

    // 2. Submit Test Lead
    const testLeadData = {
      name: 'Atlas Verified Lead',
      email: 'atlas.verification@example.com',
      budgetRange: '10k+',
      message: 'This is a genuine end-to-end test lead submitted directly to MongoDB Atlas cluster.',
      status: 'New'
    };

    const newLead = new Lead(testLeadData);
    await newLead.save();
    console.log('\n--- PERSISTED LEAD DOCUMENT PROOF FROM MONGODB ATLAS ---');
    console.log(JSON.stringify(newLead.toJSON(), null, 2));

    // 3. Query back from Atlas to confirm
    const queriedLead = await Lead.findById(newLead._id);
    console.log('\n--- QUERIED DIRECTLY BACK FROM ATLAS CLUSTER ---');
    console.log(JSON.stringify(queriedLead.toJSON(), null, 2));

    await mongoose.disconnect();
    console.log('\nAtlas verification completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Atlas connection error:', err.message);
    process.exit(1);
  }
}

testAtlas();
