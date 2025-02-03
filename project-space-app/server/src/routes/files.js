import express from "express";

import { validateToken } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";
import { cloudinary } from "../cloudinary.js";

const router = express.Router();

router.post("/upload", validateToken, upload, async (req, res) => {
  try {
    // Convert the file buffer to a base64 string
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    // Upload the file to Cloudinary
    const cldRes = await cloudinary.uploader.upload(dataURI, {
      resource_type: "auto"
    });
    console.log(cldRes);

    // Return the uploaded file URL
    res.json({
      file: cldRes.secure_url
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;