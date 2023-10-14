const Review = require('../models/reviewSchema');
const User = require('../models/employeeSchema');
const moment = require('moment');

// Render the view for reviewing feedback
module.exports.viewReview = async function (req, res) {
    try {
        // Fetch all reviews, sorted by createdAt, and populate the 'from' and 'to' fields
        const reviews = await Review.find({})
            .sort('-createdAt')
            .populate('from')
            .populate('to');

        // Render the 'view-review' page with reviews and the moment library
        return res.render('view-review', {
            title: 'View Review',
            reviews,
            moment
        });
    } catch (error) {
        console.log(`Error in showing records: ${error}`);
        res.redirect('back');
    }
};

// Render the page to add a new review
module.exports.addReview = async function (req, res) {
    try {
        // Fetch all users to populate the dropdown for selecting the employee to review
        const users = await User.find({});
        return res.render('add_review', {
            title: 'Add Review',
            users
        });
    } catch (error) {
        console.log(`Error in adding review: ${error}`);
        res.redirect('back');
    }
};

// Delete a review
module.exports.deleteReview = async function (req, res) {
    try {
        // Find the review to be deleted and extract relevant user IDs
        let review = await Review.findById(req.params.id);
        let employeeId = review.to;
        let reviewerId = review.from;

        // Remove the review document
        review.remove();

        // Remove the review from the user's 'myReviews' array
        let user = User.findByIdAndUpdate(employeeId, { $pull: { myReviews: reviewerId } });

        res.redirect('back');
    } catch (error) {
        console.log(`Error in deleting Review: ${error}`);
        res.redirect('back');
    }
};

// Render the update review view
module.exports.updateReview = async function (req, res) {
    try {
        // Fetch the review to be updated and populate the 'to' field
        const review = await Review.findById(req.params.id).populate('to');
        return res.render('update_review', {
            title: 'Update Review',
            review
        });
    } catch (error) {
        console.log(`Error in updating review: ${error}`);
        res.redirect('back');
    }
};

// Update review action
module.exports.updateReviewAction = async function (req, res) {
    try {
        // Update the review with the new content
        await Review.findByIdAndUpdate(req.params.id, {
            review: req.body.review
        });
        return res.redirect('/admin/view-review');
    } catch (error) {
        console.log(`Error in updating review: ${error}`);
        res.redirect('back');
    }
};

// Create a new review
module.exports.createReview = async function (req, res) {
    const { id } = req.params;
    const { employee, review } = req.body;

    try {
        // Find the user to be reviewed and the reviewing user
        const toUser = await User.findById(id ?? employee);
        const fromUser = req.user;

        // Create a new review document
        await Review.create({
            review: review,
            from: fromUser,
            to: toUser,
        });

        // If the review is created for a specific employee, remove it from the user's 'myEvaluations'
        if (id) {
            const idx = req.user.myEvaluations.indexOf(id);
            req.user.myEvaluations.splice(idx, 1);
            req.user.save();
            return res.redirect('back');
        }

        return res.redirect('/admin/view-review');
    } catch (error) {
        console.log(`Error in creating review: ${error}`);
        res.redirect('back');
    }
};
