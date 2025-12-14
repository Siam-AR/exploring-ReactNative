import express from "express";
import { 
  getAllHelpers, 
  getHelperById, 
  getMyProfile, 
  updateMyProfile 
} from "../controllers/helperController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllHelpers);
router.get("/:id", getHelperById);

// Protected routes (helpers only)
router.get("/me/profile", protect, getMyProfile);
router.put("/me/profile", protect, updateMyProfile);

export default router;
