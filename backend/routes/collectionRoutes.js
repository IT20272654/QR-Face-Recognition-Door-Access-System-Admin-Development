const express = require("express");
const { getCollectionCounts, getFilteredHistoriesCount, getUnreadMessageCount, getActiveDoorsCount } = require("../controllers/collectionController");
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Route to fetch document counts
router.get("/counts", authMiddleware, roleMiddleware(['Admin']), getCollectionCounts);

// Route to fetch filtered history
router.get("/history", authMiddleware, roleMiddleware(['Admin']), getFilteredHistoriesCount);

// Route to fetch unread message counts
router.get('/unread-count', authMiddleware, roleMiddleware(['Admin']), getUnreadMessageCount);

// Route to fetch active doors count
router.get('/active-doors', authMiddleware, roleMiddleware(['Admin']), getActiveDoorsCount);

module.exports = router;