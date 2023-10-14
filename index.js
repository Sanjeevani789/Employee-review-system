// Import required modules
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const dotenv = require('dotenv');
const db = require('./config/mogoose'); // Assuming there's a typo, should be mongoose instead of mogoose
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport');

// Load environment variables from the .env file
dotenv.config({ path: 'config/.env' });

// Initialize Express
const app = express();

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(expressLayouts);

// Configure session middleware
app.use(
  session({
    secret: process.env.SECRET_KEY, // Use the secret from environment variables
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 100, // Set the cookie expiration time
    },
  })
);

// Extract styles and scripts from layouts
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Use passport for authentication
const port = process.env.PORT || 8000;
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

// Use the routes defined in the './routes' module
app.use('/', require('./routes'));

// Start the server
app.listen(port, function (error) {
  if (error) {
    console.log(`Error in connecting to server: ${error}`);
    return;
  }
  console.log(`App live on http://127.0.0.1:${port}`);
});
