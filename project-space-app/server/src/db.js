import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let db;

async function connectToDatabase() {
    if (!db) {
        try {
            await client.connect();  // Connect to MongoDB once
            console.log('Connected to MongoDB');
            db = client.db('project-space');  // Get the database
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            throw error;
        }
    }
    return db;  // Return the same connection on subsequent requests
}

export { connectToDatabase };
