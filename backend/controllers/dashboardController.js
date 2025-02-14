const User = require('../models/User');
const AdminUser = require('../models/AdminUser');
const Company = require('../models/Company');
const Door = require('../models/Door');
const History = require('../models/History');
const Message = require('../models/Messages');

// Fetch dashboard metrics
const getDashboardMetrics = async (req, res) => {
  try {
    const totalUsersCount = await User.countDocuments();
    const totalAdminUsersCount = await AdminUser.countDocuments();
    const totalCompaniesCount = await Company.countDocuments();
    const totalDoorsCount = await Door.countDocuments();
    const totalHistoriesCount = await History.countDocuments();
    const totalMessagesCount = await Message.countDocuments();

    res.json({
      totalUsersCount,
      totalAdminUsersCount,
      totalCompaniesCount,
      totalDoorsCount,
      totalHistoriesCount,
      totalMessagesCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = { getDashboardMetrics };