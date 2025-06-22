import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../modals/User.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URL;

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB');

    const existingAdmin = await User.findOne({ role: 'admin' });

    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('admin', 10);

    const admin = new User({
      username: 'admin', // your admin user's username
      email: 'hp673315@gmail.com', // your admin user email
      password: hashedPassword, // your admin user password
      role: 'admin',
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
