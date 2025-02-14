const express = require('express');
const { getUserGrowthData, getCompanyGrowthData, getDoorGrowthData } = require('../controllers/growthController');
const router = express.Router();

router.get('/user-growth', getUserGrowthData);
router.get('/company-growth', getCompanyGrowthData);
router.get('/door-growth', getDoorGrowthData);

module.exports = router;