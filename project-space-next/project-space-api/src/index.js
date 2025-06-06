// Import packages
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

// Import routers
import projectsRouter from "./routes/projects.js";
import usersRouter from "./routes/users.js";
import filesRouter from "./routes/files.js";

// Import database connection
import { connectToDatabase } from "./utils/db.js";

// Configure dotenv to load environment variables
dotenv.config();

// Create an Express application
const app = express();
app.use(express.json());
app.use(cookieParser());

// Set up CORS to allow requests from the frontend URL
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

// Define routes
app.get("/", (req, res) => {
  res.send("Welcome to the project space!");
});

// Use the routers
app.use("/projects", projectsRouter);
app.use("/users", usersRouter);
app.use("/files", filesRouter);

// Use async function to connect to the database
const startServer = async () => {
  try {
    // Connect to the database
    await connectToDatabase();

    // Start the Express server after successful connection
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

// Call the function to start the server
startServer();
