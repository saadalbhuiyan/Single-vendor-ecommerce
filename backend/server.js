// Import required modules
import express from 'express';         // Express framework for building the server
import dotenv from 'dotenv';           // Loads environment variables from a .env file
import cors from 'cors';               // Enables Cross-Origin Resource Sharing
import helmet from 'helmet';           // Adds security-related HTTP headers
import authRoutes from './routes/authRoutes.js'; // Import authentication related routes
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import adminAuthRoutes from './routes/adminAuthRoutes.js';

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();

// Import the MongoDB connection function
import { connectDB } from './config/db.js';

// Middleware setup
app.use(cors());          // Enable CORS for all routes and origins
app.use(helmet());        // Add security headers to HTTP responses
app.use(express.json());  // Parse incoming JSON requests automatically

// Set the port number from environment variable or fallback to 5000
const PORT = process.env.PORT || 5000;

// Connect to MongoDB database
connectDB();

// Define route for authentication APIs
app.use('/api/admin', adminAuthRoutes);

app.use('/api/auth', authRoutes);

app.use('/api/users', userRoutes);

app.use('/api/products', productRoutes);


// Start the server and listen on the defined port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
