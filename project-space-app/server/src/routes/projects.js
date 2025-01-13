import express from 'express';

import { connectToDatabase } from '../db.js';

const router = express.Router();
const db = await connectToDatabase();

router.get('/', async (req, res) => {
  let projects = await db.collection('projects').find().toArray();
  res.json(projects);
});

router.post('/', async (req, res) => {
    const project = req.body;
    let result = await db.collection('projects').insertOne(project);
    res.json(result);
});

export default router;