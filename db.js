const mongoose = require('mongoose');

// Define the MongoDB connection URL
const mongoURL = 'mongodb://localhost:27017/hotels'; // Replace 'mydatabase' with your database name

// Set Up MongoDb Connection
mongoose.connect(mongoURL, {
    
});

const db = mongoose.connection;

// Define event listeners for database connection
db.on('connected', () => {
    console.log("Connected to MongoDB Server");
});

db.on('error', (err) => {
    console.log("MongoDB connection error: ", err);
});

db.on('disconnected', () => {
    console.log("MongoDB disconnected");
});

// Export the database connection
module.exports = db;
