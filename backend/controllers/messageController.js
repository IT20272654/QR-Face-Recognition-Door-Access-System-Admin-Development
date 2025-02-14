const ContactUs = require("../models/Messages");
const AdminUser = require("../models/AdminUser");

// Fetch messages by company ID
const getMessagesByCompanyId = async (req, res) => {
  try {
    const adminUser = await AdminUser.findById(req.user.userId).populate('company' );
    if (!adminUser || !adminUser.company) {
      return res.status(400).json({ success: false, message: "Admin user or company not found." });
    }

    const messages = await ContactUs.find({ company: adminUser.company._id }).populate('user.objId', 'firstName lastName userId').sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// Toggle read state
const toggleReadState = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedMessage = await ContactUs.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('user.objId');  // Populate user detailss

    if (!updatedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.status(200).json(updatedMessage);
  } catch (error) {
    console.error("Error toggling message status:", error);
    res.status(500).json({ error: "Failed to toggle message status" });
  }
};

// Update reply and set userstatus to 'unread'
const updateUserStatusOnReply = async (req, res) => {
  const { id } = req.params;
  const { reply } = req.body;

  try {
    const updatedMessage = await ContactUs.findByIdAndUpdate(
      id,
      { reply, userstatus: "unread" },
      { new: true }
    ).populate('user.objId');  // Populate user detailss;

    if (!updatedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.status(200).json(updatedMessage);
  } catch (error) {
    console.error("Error updating userstatus on reply:", error);
    res.status(500).json({ error: "Failed to update userstatus on reply" });
  }
};

module.exports = { getMessagesByCompanyId, toggleReadState, updateUserStatusOnReply };