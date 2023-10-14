// Importing the mongoose library for MongoDB interactions
const mongoose = require('mongoose');

// Importing the dotenv library to load environment variables from a .env file
require('dotenv').config();

// Connecting to MongoDB using the connection string provided in the environment variables
mongoose.connect(process.env.MongoURL, {
    useNewUrlParser: true,          // Use new URL parser
    useUnifiedTopology: true,      // Use the new server discovery and monitoring engine
});

// Getting the default connection
const db = mongoose.connection;

// Setting up event listeners for database connection events

// Event listener for any errors during the connection
db.on(
    'error',
    console.error.bind(console.error, 'Error in connecting to MongoDB')
);

// Event listener for the 'open' event, indicating a successful connection
db.once('open', function () {
    console.log('Connected to Database :: Mongodb');
});

// Exporting the connection for use in other modules
exports.module = db;
