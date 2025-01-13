import mongoose from 'mongoose';

// Define the Project schema
const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    minlength: [3, 'Project name must be at least 3 characters long'],
    maxlength: [100, 'Project name must be less than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description must be less than 500 characters']
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  status: {
    type: String,
    enum: {
      values: ['in-progress', 'completed', 'pending'],
      message: 'Status must be one of the following: pending, in-progress, completed'
    },
    default: 'pending'
  }
}, {
  timestamps: true  // Enables `createdAt` and `updatedAt`
});

// Create and export the Project model
const Project = mongoose.model("Project", projectSchema);

export default Project;