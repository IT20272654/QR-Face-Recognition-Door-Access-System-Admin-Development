const History = require('../models/History');
const User = require('../models/User');

// Fetch recent access doors
const getRecentAccessDoors = async (req, res) => {
  try {
    console.log('Fetching recent access doors'); // Log the action

    // Find the recent access records for the admin's company and populate user details
    const recentAccess = await History.find({ company: req.companyId })
      .sort({ entryTime: -1 })
      .limit(50)
      .populate('user', 'firstName lastName'); // Populate user with first name and last name

    if (!recentAccess) {
      return res.status(404).json({ error: 'No recent access records found' });
    }

    console.log('Fetched recent access doors:', recentAccess); // Log the fetched records
    res.status(200).json(recentAccess);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error fetching recent access doors' });
  }
};

module.exports = { getRecentAccessDoors };