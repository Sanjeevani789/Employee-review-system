const User = require('../models/employeeSchema');
const Review = require('../models/reviewSchema');

// Controller for rendering the home page after login
module.exports.home = async function (req, res) {
    try {
        // Check if the user is authenticated
        if (!req.isAuthenticated()) {
            return res.redirect('/employee/signin');
        }

        // Find the logged-in user by their ID
        const user = await User.findById(req.user._id);

        // Array to store users that the current user needs to review
        let toReview = [];

        // Loop through the evaluations of the current user
        for (let i = 0; i < user.myEvaluations.length; i++) {
            let id = user.myEvaluations[i];
            let review = await User.findById(id);
            if (!review) {
                continue; // Skip if user not found
            }
            toReview.push(review);
        }

        // Find all reviews received by the current user
        let allReviews = await Review.find({ to: req.user._id });

        // Array to store reviews written by the current user
        let myReviews = [];

        // Loop through all received reviews
        for (let i = 0; i < allReviews.length; i++) {
            let id = allReviews[i].from;
            let reviewer = await User.findById(id);
            if (!reviewer) {
                continue; // Skip if reviewer not found
            }
            // Create an object with reviewer's name and the review content
            let obj = {
                name: reviewer.name,
                review: allReviews[i].review,
            };
            myReviews.push(obj);
        }

        // Render the home page with the gathered data
        return res.render('home', {
            title: 'Home',
            toReview,
            myReviews
        });
    } catch (error) {
        console.log(`Error in rendering home: ${error}`);
        return res.redirect('back');
    }
};
