const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/employeeSchema');

// Authentication using passport
passport.use(
    new LocalStrategy(
        { usernameField: 'email', passReqToCallback: true },
        function (req, email, password, done) {
            // Finding user by email in the database
            User.findOne({ email }, function (error, user) {
                if (error) {
                    console.log(`Error in finding employee`);
                    return done(error);
                }
                // Check if user does not exist or password is incorrect
                if (!user || user.password !== password) {
                    console.log(`Invalid Credentials`);
                    return done(null, false);
                }
                // User authenticated successfully
                return done(null, user);
            });
        }
    )
);

// Serialize user
passport.serializeUser(function (user, done) {
    // Saving user.id in the session
    done(null, user.id);
});

// Deserialize user
passport.deserializeUser(function (id, done) {
    // Finding user by id in the database
    User.findById(id, function (error, user) {
        if (error) {
            console.log(`Error in finding user -> passport`);
            return done(error);
        }
        // User found and deserialized successfully
        return done(null, user);
    });
});

// Check if user is authenticated
passport.checkAuthentication = function (req, res, next) {
    if (req.isAuthenticated()) {
        // If user is authenticated, proceed to the next middleware
        return next();
    }
    // Redirect to sign-in page if user is not authenticated
    return res.redirect('/employee/signin');
};

// Check for admin
passport.checkAdmin = function (req, res, next) {
    if (!req.user.isAdmin) {
        console.log(`Employees are not allowed to access this resource`);
        // Redirect back if the user is not an admin
        return res.redirect('back');
    }
    // Proceed to the next middleware if the user is an admin
    return next();
};

// Set authenticated user for views
passport.setAuthenticatedUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        // Set user in locals for views if authenticated
        res.locals.user = req.user;
    }
    next();
};

// Export the configured passport
module.exports = passport;
