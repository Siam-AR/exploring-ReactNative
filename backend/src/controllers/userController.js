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

    console.log("✅ User registered:", { email, role });
    res.json({ 
      message: `${role} registered successfully`,
      user: { name: user.name, email: user.email, role }
    });
  } catch (err) {
    console.error("❌ Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔐 === LOGIN ATTEMPT ===");
    console.log("📧 Email from request:", email);
    console.log("🔑 Password received:", password ? "YES (length: " + password.length + ")" : "NO");
    console.log("📦 Request body:", JSON.stringify(req.body));

    if (!email || !password) {
      console.log("❌ Missing email or password");
      return res.status(400).json({ message: "Email and password required" });
    }

    // Try finding user in both collections
    let user = await Helper.findOne({ email });
    let role = "Helper";
    
    if (!user) {
      user = await Consumer.findOne({ email });
      role = "Consumer";
    }

    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("✅ User found:", email, "| Role:", role);
    console.log("🔑 Stored password hash:", user.password ? user.password.substring(0, 20) + "..." : "NO PASSWORD");

    // Check if password field exists in database
    if (!user.password) {
      console.error("❌ CRITICAL: User password field is missing in database for:", email);
      return res.status(500).json({ message: "Account data corrupted. Please contact support." });
    }

    const valid = await bcrypt.compare(password, user.password);
    console.log("🔐 Password comparison result:", valid);
    
    if (!valid) {
      console.log("❌ Wrong password for:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: role }, 
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("✅ Login successful:", { email, role });

    res.json({
      message: "Login successful",
      token,
      user: { 
        id: user._id,
        name: user.name, 
        email: user.email,
        role: role 
      },
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};