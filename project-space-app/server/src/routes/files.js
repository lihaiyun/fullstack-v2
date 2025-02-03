import express from 'express';

import { validateToken } from '../middlewares/auth.js';
import { uploadImage } from '../middlewares/upload.js';

const router = express.Router();

router.post('/upload', validateToken, uploadImage.single('file'), (req, res) => {
    try {
        console.log(req.file);
        // Return the uploaded file URL
        res.json({
            file: req.file
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;