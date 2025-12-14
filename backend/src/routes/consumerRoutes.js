import express from "express";
import { getMyProfile, updateMyProfile } from "../controllers/consumerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes (consumers only)
router.get("/me/profile", protect, getMyProfile);
router.put("/me/profile", protect, updateMyProfile);

export default router;