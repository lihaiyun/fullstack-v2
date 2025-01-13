import express from 'express';
import yup from 'yup';
import dayjs from 'dayjs';

import { connectToDatabase } from '../db.js';

const router = express.Router();
const db = await connectToDatabase();

const projectSchema = yup.object().shape({
  name: yup.string().trim()
    .required('Name is required')
    .max(100, 'Name must be at most 100 characters'),
  description: yup.string().trim()
    .max(500, 'Description must be at most 500 characters'),
  status: yup.string().trim()
    .required('Status is required')
    .oneOf(['pending', 'in-progress', 'completed'], 'Invalid status'),
  dueDate: yup.string().trim()
    .required('Due date is required')  
    .test('valid-date', 'Invalid date format', value => {
        return dayjs(value, 'YYYY-MM-DD', true).isValid();
      })
});

router.post('/', async (req, res) => {
  const data = req.body;

  // Validate the project data
  try {
    let project = await projectSchema.validate(data, { abortEarly: false });
    let result = await db.collection('projects').insertOne(project);
    res.json(result);
  } catch (error) {
    return res.status(400).json({ errors: error.errors });
  }
});

router.get('/', async (req, res) => {
  let findQuery = {};
  // Search projects by name or description
  if (req.query.search) {
    findQuery = {
      $or: [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ]
    };
  }
  // Filter projects by status
  if (req.query.status) {
    findQuery.status = req.query.status;
  }

  let projects = await db.collection('projects')
    .find(findQuery)
    .sort({ dueDate: 1 })
    .toArray();
  res.json(projects);
});

export default router;