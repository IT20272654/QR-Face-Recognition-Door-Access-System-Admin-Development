const User = require('../models/User');
const Company = require('../models/Company');
const Door = require('../models/Door');

const getGrowthData = async (Model) => {
  return await Model.aggregate([
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        month: "$_id.month",
        year: "$_id.year",
        count: 1
      }
    },
    { $sort: { "year": 1, "month": 1 } }
  ]);
};

// Fetch user growth data
const getUserGrowthData = async (req, res) => {
  try {
    const userGrowthData = await getGrowthData(User);
    res.status(200).json(userGrowthData);
  } catch (error) {
    console.error('Error fetching user growth data:', error);
    res.status(500).json({ error: 'Error fetching user growth data' });
  }
};

// Fetch company growth data
const getCompanyGrowthData = async (req, res) => {
  try {
    const companyGrowthData = await getGrowthData(Company);
    res.status(200).json(companyGrowthData);
  } catch (error) {
    console.error('Error fetching company growth data:', error);
    res.status(500).json({ error: 'Error fetching company growth data' });
  }
};

// Fetch door growth data
const getDoorGrowthData = async (req, res) => {
  try {
    const doorGrowthData = await getGrowthData(Door);
    res.status(200).json(doorGrowthData);
  } catch (error) {
    console.error('Error fetching door growth data:', error);
    res.status(500).json({ error: 'Error fetching door growth data' });
  }
};

module.exports = { getUserGrowthData, getCompanyGrowthData, getDoorGrowthData };