const express = require('express');
const { loginAdminUser, getCurrentAdminUser, updateCurrentAdminUser, changePassword, getAllAdminUsers, getAdminUserById, updateAdminUserById, deleteAdminUserById } = require('../controllers/adminAuthController');
const { createCompany, createAdminUser,getDoorsByAdmin,getUsersByAdmin  } = require('../controllers/superAdminController');
const { getCompaniesWithAdmins, getCompanies, getCompanyById, updateCompany, deleteCompany, addLocation, deleteLocation, checkCompanyNameAndAddressUnique } = require('../controllers/companyController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

// Login an admin user
router.post('/login', loginAdminUser);

// Get current admin user
router.get('/me', authMiddleware, getCurrentAdminUser);

// Get all admin users (SuperAdmin only)
router.get('/admin-users', authMiddleware, roleMiddleware(['SuperAdmin']), getAllAdminUsers);

// Get an admin user by ID
router.get('/admin-users/:id', authMiddleware, getAdminUserById);

// Fetch users created by admin
router.get('/admin-users/:adminId/users', authMiddleware, roleMiddleware(['SuperAdmin']), getUsersByAdmin);

// Fetch doors created by admin
router.get('/admin-users/:adminId/doors', authMiddleware, roleMiddleware(['SuperAdmin']), getDoorsByAdmin);

// Update an admin user by ID
router.put('/admin-users/:id', authMiddleware, updateAdminUserById);

// Delete an admin user by ID
router.delete('/admin-users/:id', authMiddleware, deleteAdminUserById);

// Update current admin user
router.put('/me', authMiddleware, updateCurrentAdminUser);

// Change password
router.put('/change-password', authMiddleware, changePassword);

// Create a new company (SuperAdmin only)
router.post('/create-company', authMiddleware, roleMiddleware(['SuperAdmin']), createCompany);

// Get all companies with their admins
router.get('/companies-with-admins', authMiddleware, getCompaniesWithAdmins);

// Get all companies
router.get('/companies', authMiddleware, getCompanies);

// Check if company name and address combination is unique
router.get('/companies/check-name-address-update', authMiddleware, checkCompanyNameAndAddressUnique);

// Get a company by ID
router.get('/companies/:id', authMiddleware, getCompanyById);

// Update a company
router.put('/companies/:id', authMiddleware, updateCompany);

// Delete a company
router.delete('/companies/:id', authMiddleware, deleteCompany);

// Add a location to a company
router.post('/add-location', authMiddleware, addLocation);

//delete a location
router.delete('/delete-location',authMiddleware, deleteLocation)

// Create a new admin user (SuperAdmin only)
router.post('/create-admin', authMiddleware, roleMiddleware(['SuperAdmin']), createAdminUser);

module.exports = router;