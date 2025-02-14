const express = require('express');
const router = express.Router();
const doorController = require('../controllers/doorController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

// Route to create a new door
router.post('/create', authMiddleware, roleMiddleware(['Admin']), doorController.createDoor);

// Route to get a door by ID
router.get('/:id', authMiddleware, roleMiddleware(['Admin']), doorController.getDoorById);

// Route to get all doors
router.get('/', authMiddleware, roleMiddleware(['SuperAdmin', 'Admin']), doorController.getAllDoors);

// Route to update a door by ID
router.put('/:id', authMiddleware, roleMiddleware(['Admin']), doorController.updateDoor);

// Route to delete a door by ID
router.delete('/:id', authMiddleware, roleMiddleware(['Admin']), doorController.deleteDoor);

//set door status
router.put('/:id/status', doorController.setdoorstatus);

module.exports = router;