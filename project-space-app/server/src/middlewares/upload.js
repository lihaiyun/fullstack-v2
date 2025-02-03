import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "cloudinary";
import dotenv from 'dotenv';

// Configure dotenv to load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

//console.log(process.env.CLOUDINARY_API_SECRET);

// Cloudinary Storage Setup for project images
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "projects", // Cloudinary folder
    format: async (req, file) => "png", // Convert to PNG
    // transformation: [
    //     { width: 1600, height: 900, crop: "fill" }, // Resize and crop
    //     { quality: "auto" }, // Optimize quality
    //     { fetch_format: "auto" }, // Convert to best format
    //   ],
  },
});

const uploadImage = multer({ storage });

export { uploadImage };
