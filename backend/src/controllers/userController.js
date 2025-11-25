import Helper from "../models/helper.js";
import Consumer from "../models/consumer.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      role,
      bloodGroup,
      address,
    } = req.body;

    // Basic validation
    if (!name || !email || !password || !confirmPassword || !role) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check user exists in either collection
    const existingHelper = await Helper.findOne({ email });
    const existingConsumer = await Consumer.findOne({ email });

    if (existingHelper || existingConsumer) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    let user;

    if (role === "Helper") {
      user = await Helper.create({
        name,
        email,
        password: hashedPassword,
        bloodGroup,
        address,
      });
    } else if (role === "Consumer") {
      user = await Consumer.create({
        name,
        email,
        password: hashedPassword,
        bloodGroup,
        address,
      });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    res.json({ message: `${role} created successfully` });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Try finding user in both collections
    let user =
      (await Helper.findOne({ email })) ||
      (await Consumer.findOne({ email }));

    if (!user) return res.status(400).json({ message: "Invalid email" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({
      message: "Login successful",
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
