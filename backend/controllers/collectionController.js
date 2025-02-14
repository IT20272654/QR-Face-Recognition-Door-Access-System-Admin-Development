const Door = require('../models/Door');
const User = require('../models/User');
const History = require('../models/History');
const Message = require('../models/Messages');

// Fetch document counts for all collections
const getCollectionCounts = async (req, res) => {
  try {
    const companyId = req.companyId;
    const doorsCount = await Door.countDocuments({ company: companyId });
    const usersCount = await User.countDocuments({ company: companyId });
    const historiesCount = await History.countDocuments({ company: companyId });
    const messagesCount = await Message.countDocuments({ company: companyId });


    res.json([
      { name: 'doors', count: doorsCount },
      { name: 'users', count: usersCount },
      { name: 'histories', count: historiesCount },
      { name: 'contactus', count: messagesCount },
    ]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFilteredHistoriesCount = async (req, res) => {
  try {
    const { entryTime } = req.query; // Get today's date from query parameter
    const companyId = req.companyId;

    // Define start and end of the day
    const startOfDay = new Date(entryTime);
    startOfDay.setUTCHours(0, 0, 0, 0); // 00:00:00.000 UTC
    const endOfDay = new Date(entryTime);
    endOfDay.setUTCHours(23, 59, 59, 999); // 23:59:59.999 UTC

    // Filter histories based on the date range and company ID
    const count = await History.countDocuments({
      company: companyId,
      entryTime: { $gte: startOfDay, $lt: endOfDay },
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUnreadMessageCount = async (req, res) => {
  try {
    const companyId = req.companyId;

    // Count documents where the status is "unread" and company ID matches
    const count = await Message.countDocuments({
      company: companyId,
      status: "unread"
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch active doors count
const getActiveDoorsCount = async (req, res) => {
  try {
    const companyId = req.companyId;
    const activeDoorsCount = await Door.countDocuments({ company: companyId, status: "Active" });

    res.json({ count: activeDoorsCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getCollectionCounts, getFilteredHistoriesCount, getUnreadMessageCount, getActiveDoorsCount };