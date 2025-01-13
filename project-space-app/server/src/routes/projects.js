import express from "express";

import Project from "../models/project.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, description, dueDate, status } = req.body;
  const newProject = new Project({
    name,
    description,
    dueDate,
    status,
  });

  try {
    const savedProject = await newProject.save();
    res.json(savedProject);
  } catch (err) {
    if (err.name === "ValidationError") {
      // Send validation error messages if validation fails
      res.status(400).json({ message: err.message });
    } else {
      // Handle other errors
      res.status(500).json({ message: "Server error" });
    }
  }
});

router.get("/", async (req, res) => {
  let findQuery = {};
  // Search projects by name or description
  if (req.query.search) {
    findQuery = {
      $or: [
        { name: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
      ],
    };
  }
  // Filter projects by status
  if (req.query.status) {
    findQuery.status = req.query.status;
  }

  let projects = await Project.find(findQuery).sort({ dueDate: 1 });
  res.json(projects);
});

export default router;