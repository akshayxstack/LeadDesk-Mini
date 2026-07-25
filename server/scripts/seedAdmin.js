require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (_) {}

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const AdminUser = require('../src/models/AdminUser');

const seedAdmin = async () => {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/leaddesk_mini';
  const username = process.argv[2] || 'admin';
  const rawPassword = process.argv[3] || 'AdminPass123!';

  console.log(`Connecting to MongoDB at: ${MONGODB_URI}`);

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Database connected.');

    const existingAdmin = await AdminUser.findOne({ username });
    if (existingAdmin) {
      console.log(`Admin user "${username}" already exists.`);
      process.exit(0);
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(rawPassword, saltRounds);

    const admin = new AdminUser({
      username,
      passwordHash,
      createdAt: new Date()
    });

    await admin.save();
    console.log(`Successfully created admin user: "${username}"`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error.message);
    process.exit(1);
  }
};

seedAdmin();
