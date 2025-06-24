import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../modals/User.js';
import config from '../constants/config.js';
import { roles } from '../constants/roles.js';

const seedAdmin = async () => {
  try {
    await mongoose.connect(config.MONGO_URL);
    console.log('Connected to DB');

    const existingAdmin = await User.findOne({ role: roles.ADMIN });

    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('admin', 10);

    const admin = new User({
      username: 'jbl', // your admin user's username
      email: 'limbanijeet@gmail.com', // your admin user email

      password: hashedPassword, // your admin user password
      role: roles.ADMIN,
    });

    await admin.save();
    console.log('✅ Admin user created');
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to seed admin:', err);
    process.exit(1);
  }
};

seedAdmin();
