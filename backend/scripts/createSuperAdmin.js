const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const AdminUser = require('../models/AdminUser');

// Load environment variables from .env file
dotenv.config({ path: '../.env' });

const createSuperAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in the .env file');
    }

    await mongoose.connect(mongoUri);
    console.log('DB connection successful');

    const hashedPassword = await bcrypt.hash('superadminpassword', 10);

    const superAdmin = new AdminUser({
      firstName: 'Super',
      lastName: 'Admin',
      email: 'superadmin@gmail.com',
      password: hashedPassword,
      role: 'SuperAdmin',
    });

    await superAdmin.save();
    console.log('Super Admin user created successfully');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error creating Super Admin user:', error);
    mongoose.disconnect();
  }
};

createSuperAdmin();