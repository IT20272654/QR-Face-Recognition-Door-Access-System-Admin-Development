const PermissionRequest = require("../models/PermissionRequest");
const User = require("../models/User");
const Door = require("../models/Door");
const AdminUser = require("../models/AdminUser");

const makePermissionRequest = async (req, res) => {
  try {
    const { door, date, inTime, outTime, message } = req.body;
    const userId = req.body.user;

    // Get user with company information
    const user = await User.findById(userId).populate('company');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get door information
    const doorInfo = await Door.findById(door).populate('company');
    if (!doorInfo) {
      return res.status(404).json({ error: 'Door not found' });
    }

    // Verify company match
    if (user.company._id.toString() !== doorInfo.company._id.toString()) {
      return res.status(403).json({ error: 'Door does not belong to user company' });
    }

    // Create permission request
    const newRequest = new PermissionRequest({
      user: userId,
      company: user.company._id,
      door: doorInfo._id,
      name: `${user.firstName} ${user.lastName}`,
      location: doorInfo.location,
      roomName: doorInfo.roomName,
      inTime,
      outTime,
      date: new Date(date),
      message,
      status: "Approved"
    });

    const savedRequest = await newRequest.save();

    // Update user's pending requests
    user.pendingRequests.push(savedRequest._id);

    user.doorAccess.push({
      door: doorInfo._id,
      inTime,
      outTime,
      date: new Date(date)
    });

    await user.save();
    
    res.status(201).json({
      _id: savedRequest._id,
      door: doorInfo.doorCode,
      roomName: doorInfo.roomName,
      location: doorInfo.location,
      date: savedRequest.date,
      inTime: savedRequest.inTime,
      outTime: savedRequest.outTime,
      message: savedRequest.message,
      status: savedRequest.status
    });

  } catch (error) {
    console.error('Error creating permission request:', error);
    res.status(500).json({ 
      error: 'Error creating permission request',
      details: error.message
    });
  }
};

const createPermissionRequest = async (req, res) => {
  const { userId, doorId, name, roomName, inTime, outTime, date, message } = req.body;

  try {
    // Fetch the user's details using the userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newRequest = new PermissionRequest({
      user: user._id, // Use the MongoDB ObjectId
      door: doorId,
      name,
      roomName,
      inTime,
      outTime,
      date,
      message,
      status,
    });

    const savedRequest = await newRequest.save();

    // Update the user's pendingRequests array
    user.pendingRequests.push(savedRequest._id);
    await user.save();

    res.status(201).json(savedRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPermissionRequestsByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const requests = await PermissionRequest.find({ user: userId }).populate("door");
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const approvePermissionRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const request = await PermissionRequest.findById(id).populate('door');
    if (!request) {
      return res.status(404).json({ error: "Permission request not found" });
    }

    request.status = "Approved";
    await request.save();

    // Fetch the user's details
    const user = await User.findById(request.user).populate('doorAccess.door');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user's doorAccess array with permission details
    user.doorAccess.push({
      door: request.door._id,
      doorCode: request.door.doorCode,
      roomName: request.door.roomName,
      location: request.door.location,
      inTime: request.inTime,
      outTime: request.outTime,
      date: request.date
    });

    // Remove the request from the user's pendingRequests array
    user.pendingRequests = user.pendingRequests.filter(reqId => reqId.toString() !== id);

    await user.save();

    // Update the door's approvedUsers array
    await Door.findByIdAndUpdate(request.door._id, {
      $push: { approvedUsers: request.user }
    });

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const rejectPermissionRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const request = await PermissionRequest.findById(id);
    if (!request) {
      return res.status(404).json({ error: "Permission request not found" });
    }

    request.status = "Rejected";
    await request.save();

    // Remove the request from the user's pendingRequests array
    await User.findByIdAndUpdate(request.user, {
      $pull: { pendingRequests: request._id }
    });

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch pending requests filtered by company ID
const getPendingRequests = async (req, res) => {
  try {
    const adminUser = await AdminUser.findById(req.user.userId).populate('company');
    if (!adminUser || !adminUser.company) {
      return res.status(400).json({ success: false, message: "Admin user or company not found." });
    }

    const pendingRequests = await PermissionRequest.find({ company: adminUser.company._id, status: 'Pending' })
      .populate('user', 'firstName lastName userId')
      .populate('door', 'doorCode roomName location')
      .sort({ requestTime: -1 });

    res.json(pendingRequests);
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    res.status(500).json({ error: 'Error fetching pending requests' });
  }
};

// Fetch rejected requests by user ID
const getRejectedRequestsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const rejectedRequests = await PermissionRequest.find({
      user: userId,
      status: 'Rejected'
    }).populate('door', 'doorCode roomName location');

    res.status(200).json(rejectedRequests);
  } catch (error) {
    console.error('Error fetching rejected requests:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  makePermissionRequest,
  createPermissionRequest,
  getPermissionRequestsByUserId,
  approvePermissionRequest,
  rejectPermissionRequest,
  getPendingRequests,
  getRejectedRequestsByUserId,
};