import express from "express";
import yup from "yup";

import Project from "../models/project.js";

const router = express.Router();

const projectSchema = yup.object().shape({
  name: yup.string().trim()
    .required('Name is required')  
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must be at most 100 characters'),
  description: yup.string()
    .max(200, 'Description must be at most 500 characters'),
  dueDate: yup.date()
    .required('Due date is required'),
  status: yup.string()
    .required('Status is required')
    .oneOf(['not-started', 'in-progress', 'completed'], 'Invalid status'),
});

router.post("/", async (req, res) => {
  let data = req.body;
  try {
    data = await projectSchema.validate(data, { abortEarly: false });
    //console.log(data);
  } catch (err) {
    return res.status(400).json({ message: err.errors.join(", ") });
  }

  const { name, description, dueDate, status } = data;
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
    console.error(err);
    res.status(500).json({ message: "Failed to save project" });
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

router.get("/:id", async (req, res) => {
  let project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }
  res.json(project);
});

router.put("/:id", async (req, res) => {
  let data = req.body;
  try {
    data = await projectSchema.validate(data, { abortEarly: false });
  } catch (err) {
    return res.status(400).json({ message: err.errors.join(", ") });
  }

  const { name, description, dueDate, status } = data;
  let project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  project.name = name;
  project.description = description;
  project.dueDate = dueDate;
  project.status = status;

  try {
    const savedProject = await project.save();
    res.json(savedProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save project" });
  }
});

router.delete("/:id", async (req, res) => {
  const result = await Project.deleteOne({ _id: req.params.id });
  res.json(result);
});

export default router;