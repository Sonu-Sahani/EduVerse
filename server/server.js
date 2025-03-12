import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/mongodb.js';
import { clerkWebhooks } from './controllers/webhooks.js';

// Initialize Express
const app = express();

// Function to start the server
const startServer = async () => {
    try {
        // Connect to the database
        await connectDB();
        console.log("✅ Database connected successfully");

        // Middlewares
        app.use(cors());
        app.use(express.json()); // Move this to global middleware

        // Routes
        app.get('/', (req, res) => res.send("API Working"));
        app.post('/clerk', clerkWebhooks);

        // Port
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });

    } catch (error) {
        console.error("❌ Database connection failed:", error.message);
        process.exit(1); // Exit process if DB connection fails
    }
};

// Start the server
startServer();
