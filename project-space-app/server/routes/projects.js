import express from 'express';

const router = express.Router();
let projects = [];

router.get('/', (req, res) => {
  res.json(projects);
});

router.post('/', (req, res) => {
    const project = req.body;
    projects.push(project);
    res.json(project);
});

export default router;