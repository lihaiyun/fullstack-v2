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
      folder: "projects",
      // Transformation to resize the image
      transformation: [
        { width: 1600, height: 900, crop: "fill" }, // Resize the image
        { quality: "auto" }, // Automatic quality
        { fetch_format: "auto" }, // Automatic file format
      ],
    });
    console.log(cldRes);

    // Return the public ID and URL of the uploaded image
    res.json({
      imageId: cldRes.public_id,
      imageUrl: cldRes.secure_url,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
