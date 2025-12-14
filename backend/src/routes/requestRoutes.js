import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createRequest, getAllRequests, getMyRequests, getRequestById } from "../controllers/requestController.js";

const router = express.Router();

router.post("/", protect, createRequest);
router.get("/", protect, getAllRequests);
router.get("/my-requests", protect, getMyRequests);
router.get("/:id", protect, getRequestById);

export default router;