import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/requests", requestRoutes);

app.get("/", (req, res) => res.send("API running..."));

app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${process.env.PORT}`);
});
