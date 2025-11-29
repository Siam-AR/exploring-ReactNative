import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createRequest, getAllRequests } from "../controllers/requestController.js";

const router = express.Router();

router.post("/", protect, createRequest);
router.get("/", protect, getAllRequests);

export default router;
