// Import required modules
const express = require('express');
const router = express.Router();

// Import controllers and routes
const homeController = require('../controllers/homeController');
const employeeRoute = require('./employeeRoute');
const adminRoute = require('./adminRoutes');
const reviewRoute = require('./reviewRoute');

// Route for the home page
router.get('/', homeController.home);

// Use the employee, admin, and review routes
router.use('/employee', employeeRoute);
router.use('/admin', adminRoute);
router.use('/review', reviewRoute);

// Export the router
module.exports = router;
