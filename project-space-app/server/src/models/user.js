import mongoose from 'mongoose';

// Define the User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  versionKey: false, // Don't add __v to a new document
  timestamps: true  // Enables `createdAt` and `updatedAt`
});

// Create and export the User model
const User = mongoose.model("User", userSchema);

export default User;