const express = require("express");
const router = express.Router();
const {
  getMessagesByCompanyId,
  toggleReadState,
  updateUserStatusOnReply,
} = require("../controllers/messageController");
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

// Get messages by company ID
router.get("/messages", authMiddleware, roleMiddleware(['Admin']), getMessagesByCompanyId);

// Toggle read state
router.patch("/messages/:id/toggle-read", authMiddleware, roleMiddleware(['Admin']), toggleReadState);

// Reply and update userstatus
router.patch("/messages/:id/reply", authMiddleware, roleMiddleware(['Admin']), updateUserStatusOnReply);

module.exports = router;