const express = require('express');
const { getDashboardMetrics } = require('../controllers/dashboardController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Route to fetch dashboard metrics
router.get('/metrics', authMiddleware, roleMiddleware(['SuperAdmin']), getDashboardMetrics);

module.exports = router;