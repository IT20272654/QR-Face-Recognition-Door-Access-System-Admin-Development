const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Attach company ID to the request for admin users
    if (req.user.role === 'Admin') {
      const adminUser = await AdminUser.findById(req.user.userId).populate('company');
      if (adminUser) {
        req.companyId = adminUser.company._id;
        req.adminUserId = adminUser._id;
      } else {
        return res.status(401).json({ error: 'User not found' });
      }
    }

    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

const roleMiddleware = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};

module.exports = { authMiddleware, roleMiddleware };