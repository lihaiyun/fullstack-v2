// Import packages
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routers
import projectsRouter from './routes/projects.js';

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

app.use('/projects', projectsRouter);

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
