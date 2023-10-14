// Import required modules
const express = require('express');
const passport = require('passport');
const router = express.Router();

// Import the review controller
const reviewController = require('../controllers/reviewController');

// Route for creating a review, requires authentication
router.post(
    '/create-review/:id',
    passport.checkAuthentication, // Check if the user is authenticated
    reviewController.createReview
);

// Export the router
module.exports = router;
