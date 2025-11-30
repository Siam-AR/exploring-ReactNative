import express from "express";
import Helper from "../models/helper.js";

const router = express.Router();

// GET ALL HELPERS
router.get("/", async (req, res) => {
  try {
    const helpers = await Helper.find();
    res.json(helpers);
  } catch (err) {
    console.error("Get Helpers Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
