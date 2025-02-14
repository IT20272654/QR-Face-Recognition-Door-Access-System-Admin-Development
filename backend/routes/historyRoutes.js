const express = require('express');
const { getRecentAccessDoors } = require('../controllers/historyController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

// Get recent access doors
router.get('/recent-access', authMiddleware, roleMiddleware(['Admin']), getRecentAccessDoors);


module.exports = router;