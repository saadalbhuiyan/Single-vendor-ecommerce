const mongoose = require('mongoose');

/**
 * Establishes a connection to MongoDB using the connection string
 * specified in the environment variable MONGO_URI.
 *
 * Exits the process with failure code if the connection fails.
 */
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,       // Use the new URL parser (recommended)
            useUnifiedTopology: true,    // Use the new Server Discover and Monitoring engine
        });
        console.log('MongoDB connection established successfully.');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
