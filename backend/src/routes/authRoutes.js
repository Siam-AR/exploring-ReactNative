import express from "express";
import { loginUser, registerUser } from "../controllers/userController.js";

const router = express.Router();

console.log("Loading authRoutes...");
console.log("loginUser:", typeof loginUser);
console.log("registerUser:", typeof registerUser);

if (typeof loginUser !== "function") {
  console.error("ERROR: loginUser is not a function! Check userController.js exports");
}

if (typeof registerUser !== "function") {
  console.error("ERROR: registerUser is not a function! Check userController.js exports");
}

router.post("/login", (req, res, next) => {
  console.log("POST /api/auth/login received");
  loginUser(req, res, next);
});

router.post("/register", (req, res, next) => {
  console.log("POST /api/auth/register received");
  registerUser(req, res, next);
});

export default router;