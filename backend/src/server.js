import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import helperRoutes from "./routes/helperRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/helpers", helperRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  console.log("Root endpoint hit");
  res.send("API running...");
});

// 404 handler
app.use((req, res) => {
  console.log("404 - Route not found:", req.method, req.path);
  res.status(404).json({ message: "Route not found", path: req.path });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err.message);
  res.status(500).json({ message: "Server error", error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Connect from frontend: http://192.168.1.21:${PORT}`);
});