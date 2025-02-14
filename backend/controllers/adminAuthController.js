const AdminUser = require('../models/AdminUser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const loginAdminUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await AdminUser.findOne({ email }).populate('company');
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: user.role, company: user.company ? user.company.name : null });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getCurrentAdminUser = async (req, res) => {
  try {
    const user = await AdminUser.findById(req.user.userId).populate('company').select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getAllAdminUsers = async (req, res) => {
  try {
    const adminUsers = await AdminUser.find().populate('company', 'name address').select('-password');
    res.json(adminUsers);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getAdminUserById = async (req, res) => {
  try {
    const user = await AdminUser.findById(req.params.id).populate('company').select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Admin user not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const updateAdminUserById = async (req, res) => {
  try {
    const { firstName, lastName, email, companyId } = req.body;
    const user = await AdminUser.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'Admin user not found' });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (companyId) user.company = companyId;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteAdminUserById = async (req, res) => {
  try {
    const user = await AdminUser.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'Admin user not found' });
    }

    await user.deleteOne({ _id: req.params.id });
    res.json({ message: 'Admin user deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const updateCurrentAdminUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const user = await AdminUser.findById(req.user.userId);

    if (user.role === 'SuperAdmin') {
      return res.status(403).json({ error: 'Super Admins are not allowed to update their profile' });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await AdminUser.findById(req.user.userId);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { loginAdminUser, getCurrentAdminUser, updateCurrentAdminUser, changePassword, getAllAdminUsers, getAdminUserById, updateAdminUserById, deleteAdminUserById };