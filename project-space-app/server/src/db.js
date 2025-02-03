import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Configure dotenv to load environment variables
dotenv.config();

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

export { mongoose };