const mongoose = require('mongoose');

/**
 * Establish connection to MongoDB using Mongoose.
 * Exits process on failure.
 */
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB connection established successfully.');

        // Optional: Listen to connection events for detailed logging
        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB connection lost.');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected.');
        });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
