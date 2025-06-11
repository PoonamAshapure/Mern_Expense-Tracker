import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddelware.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs"; // Required for unlinkSync

import {
  registerUser,
  loginUser,
  getUserInfo,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getUser", protect, getUserInfo);

router.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "user-profiles",
    });

    fs.unlinkSync(req.file.path); // Remove local temp file

    res.status(200).json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error("Image upload error:", error);
    res
      .status(500)
      .json({ message: "Cloudinary upload failed", error: error.message });
  }
});

export default router;
