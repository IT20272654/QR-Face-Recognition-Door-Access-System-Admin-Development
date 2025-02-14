const AdminUser = require('../models/AdminUser');
const Company = require('../models/Company');
const Door = require('../models/Door');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const createCompany = async (req, res) => {
  const { name, address } = req.body;
  try {
    const company = new Company({ name, address });
    await company.save();
    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const createAdminUser = async (req, res) => {
  const { firstName, lastName, email, password, companyId } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const adminUser = new AdminUser({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: 'Admin',
      company: companyId,
    });
    await adminUser.save();

    // Add the admin user to the company
    const company = await Company.findById(companyId);
    company.admins.push(adminUser._id);
    await company.save();

    res.status(201).json(adminUser);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getDoorsByAdmin = async (req, res) => {
  try {
    const doors = await Door.find({ admin: req.params.adminId });
    res.status(200).json(doors);
  } catch (error) {
    console.error('Error fetching doors:', error);
    res.status(500).json({ error: 'Error fetching doors' });
  }
};

const getUsersByAdmin = async (req, res) => {
  try {
    const users = await User.find({ admin: req.params.adminId });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
};
module.exports = { createCompany, createAdminUser,getDoorsByAdmin, getUsersByAdmin };