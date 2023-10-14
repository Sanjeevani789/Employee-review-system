// Import required modules
const express = require('express');
const router = express.Router();
const passport = require('passport');
const employeeController = require('../controllers/employeeController');

// Routes for signing up and signing in
router.get('/signup', employeeController.signUp);
router.get('/signin', employeeController.signIn);

// Routes for creating a new employee and creating a session after authentication
router.post('/create', employeeController.createEmployee);
router.post(
    '/create-session',
    // Authenticate using local strategy with failure redirect
    passport.authenticate('local', { failureRedirect: '/employee/signin' }),
    employeeController.createSession
);

// Route for signing out, requires authentication
router.get(
    '/signout',
    passport.checkAuthentication, // Check if the user is authenticated
    employeeController.signout
);

// Export the router
module.exports = router;
