// Import packages
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Configure dotenv to load environment variables
dotenv.config();

// Create an Express application
const app = express();

// Middleware
app.use(cors(
    { origin: process.env.CLIENT_URL }
));
app.use(express.json());

// Define routes
app.get('/', (req, res) => {
  res.send('Welcome to the project space!');
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
