const User = require('../models/User');
const Door = require('../models/Door');
const History = require('../models/History');
const PermissionRequest = require('../models/PermissionRequest');
const { hashPassword } = require('../helper/auth');

// Register User
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, userId, profilePicture } = req.body;
    console.log('Registering user:', req.body); // Log the request body

    // Check name
    if (!firstName || !lastName) {
      return res.json({
        error: 'First name and last name are required',
      });
    }

    // Check email
    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({
        error: 'Email is already taken',
      });
    }

    // Check userId
    const userIdExist = await User.findOne({ userId });
    if (userIdExist) {
      return res.json({
        error: 'User ID is already taken',
      });
    }

    // Check password
    if (!password || password.length < 6) {
      return res.json({
        error: 'Password is required and should be min 6 characters long',
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user in database
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      userId,
      profilePicture,
      company: req.companyId, // Attach company ID to the new user
      admin : req.adminUserId // Attach admin ID to the new user
    });

    console.log('User created:', user); // Log the created user
    return res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error registering user' });
  }
};


// Check email uniqueness
const checkEmailUnique = async (req, res) => {
  const { email } = req.query;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(200).json({ isUnique: false });
    }
    res.status(200).json({ isUnique: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Check userId uniqueness
const checkUserIdUnique = async (req, res) => {
  const { userId } = req.query;
  try {
    const user = await User.findOne({ userId });
    if (user) {
      return res.status(200).json({ isUnique: false });
    }
    res.status(200).json({ isUnique: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const checkEmailUniqueForUpdate = async (req, res) => {
  const { email, userId } = req.query;
  try {
    const user = await User.findOne({ email });
    if (user && user.userId !== userId) {
      return res.status(200).json({ isUnique: false });
    }
    res.status(200).json({ isUnique: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ company: req.companyId }); // Filter by company ID
    console.log('Fetched users:', users); // Log the fetched users
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error fetching users' });
  }
};

// Get user by _id
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching user with id:', id); // Log the id

    // Find the user and populate the pending requests and doorAccess
    const user = await User.findOne({ _id: id, company: req.companyId }).populate({
      path: 'pendingRequests',
      match: { status: 'Pending' },
      populate: { path: 'door' }
    }).populate({
      path: 'doorAccess.door',
      select: 'doorCode roomName location'
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('Fetched user:', user); // Log the fetched user
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error fetching user' });
  }
};

const removeDoorAccess = async (req, res) => {
  try {
    const { userId, doorAccessId } = req.params;
    console.log(`Removing door access with id: ${doorAccessId} for user with id: ${userId}`); // Log the ids

    // Find the user and update the doorAccess array
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the door access object to be removed
    const doorAccess = user.doorAccess.id(doorAccessId);
    if (!doorAccess) {
      return res.status(404).json({ error: 'Door access not found' });
    }

    // Remove the door access from the user's doorAccess array
    user.doorAccess.pull({ _id: doorAccessId });

    // Save the updated user
    await user.save();

    // Remove the user from the list of approved users in the Door collection
    await Door.findByIdAndUpdate(doorAccess.door, {
      $pull: { approvedUsers: userId }
    });

    // Find and delete the corresponding permission request
    await PermissionRequest.findOneAndDelete({ user: userId, door: doorAccess.door });

    console.log('Updated user:', user); // Log the updated user
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error removing door access' });
  }
};
// Update user by _id
const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, userId } = req.body;
    console.log('Updating user with id:', id); // Log the id

    // Check userId uniqueness
    const userIdExist = await User.findOne({ userId });
    if (userIdExist && userIdExist._id.toString() !== id) {
      return res.status(400).json({ error: 'User ID is already taken' });
    }

    const user = await User.findOneAndUpdate({ _id: id, company: req.companyId }, { firstName, lastName, email, userId }, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    console.log('Updated user:', user); // Log the updated user
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error updating user' });
  }
};

// Delete user by _id
const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Deleting user with id:', id); // Log the id
    const user = await User.findOneAndDelete({ _id: id, company: req.companyId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    console.log('Deleted user:', user); // Log the deleted user
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error deleting user' });
  }
};

module.exports = { registerUser, getAllUsers, getUserById, updateUserById, deleteUserById,removeDoorAccess, checkEmailUnique, checkUserIdUnique,checkEmailUniqueForUpdate };