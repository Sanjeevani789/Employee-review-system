// Importing employee schema as User to avoid confusion
const User = require('../models/employeeSchema');
const Review = require('../models/reviewSchema');

// Render sign up page
module.exports.signUp = function (req, res) {
    // Redirect to the home page if the user is already authenticated
    if (req.isAuthenticated()) {
        return res.redirect('back');
    }
    // Render the sign-up page
    return res.render('signup', {
        title: 'Sign Up'
    });
};

// Render sign in page
module.exports.signIn = function (req, res) {
    // Redirect to the home page if the user is already authenticated
    if (req.isAuthenticated()) {
        return res.redirect('back');
    }
    // Render the sign-in page
    return res.render('signin', {
        title: 'Sign In'
    });
};

// Create a new employee
module.exports.createEmployee = async function (req, res) {
    const { name, email, password, confirmPassword } = req.body;
    try {
        // Check if passwords match
        if (password != confirmPassword) {
            return res.redirect('back');
        }
        // Check if the email already exists
        const employee = await User.findOne({ email });
        if (employee) {
            console.log('Email already exists');
            return res.redirect('back');
        }
        // Create a new employee with the provided details
        const newEmployee = await User.create({
            name,
            email,
            password,
            isAdmin: false,
        });
        await newEmployee.save();
        if (!newEmployee) {
            console.log(`Error in creating employee`);
            return res.redirect('back');
        }
        // Redirect to the sign-in page after successful employee creation
        return res.redirect('/employee/signin');
    } catch (error) {
        console.log(`Error in creating Employee: ${error}`);
        res.redirect('back');
    }
};

// Create a session for the user
module.exports.createSession = function (req, res) {
    console.log(`Session created successfully`);
    // Redirect to the home page
    return res.redirect('/');
};

// Sign out the user
module.exports.signout = function (req, res) {
    // Log the user out and redirect to the sign-in page
    req.logout(function(err){
        if(err){
            console.log(err);
        }
    });
    return res.redirect('/employee/signin');
};
