import express from "express";
import { getAllHelpers } from "../controllers/helperController.js";

const router = express.Router();

router.get("/", getAllHelpers);

export default router;
