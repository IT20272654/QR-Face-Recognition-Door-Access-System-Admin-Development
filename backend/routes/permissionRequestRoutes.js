const express = require('express');
const router = express.Router();
const {
  makePermissionRequest,
  createPermissionRequest,
  getPermissionRequestsByUserId,
  approvePermissionRequest,
  rejectPermissionRequest,
  getPendingRequests,
  getRejectedRequestsByUserId,
} = require('../controllers/permissionRequestController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

//give permission to user to access the door
router.post('/make', makePermissionRequest);

// Route to create a new permission request
router.post('/create', createPermissionRequest);

// Route to get permission requests by user ID
router.get('/user/:userId', getPermissionRequestsByUserId);

// Route to approve a permission request
router.put('/:id/approve', approvePermissionRequest);

// Route to reject a permission request
router.put('/:id/reject', rejectPermissionRequest);

// Route to fetch pending requests
router.get('/pending-requests', authMiddleware, roleMiddleware(['Admin']), getPendingRequests);

// Route to fetch rejected requests by user ID
router.get('/rejected-requests/:userId', authMiddleware, roleMiddleware(['Admin']), getRejectedRequestsByUserId);


module.exports = router;