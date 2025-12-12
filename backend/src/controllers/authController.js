// backend/src/controllers/authController.js
import Helper from "../models/helper.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerHelper = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Please provide all fields" });

    const existing = await Helper.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const helper = await Helper.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: helper._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { name: helper.name, email: helper.email, id: helper._id } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginHelper = async (req, res) => {
  try {
    const { email, password } = req.body;
    const helper = await Helper.findOne({ email });
    if (!helper) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, helper.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: helper._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { name: helper.name, email: helper.email, id: helper._id } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
