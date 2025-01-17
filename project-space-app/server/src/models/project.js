import mongoose from 'mongoose';

// Define the Project schema
const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true
  }
}, {
  versionKey: false, // Don't add __v to a new document
  timestamps: true  // Enables `createdAt` and `updatedAt`
});

// Create and export the Project model
const Project = mongoose.model("Project", projectSchema);

export default Project;