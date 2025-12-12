import axios from "axios";
import { API_CONFIG } from "../../config.js";

const API_BASE = API_CONFIG.BASE_URL;

// Create axios instance with better error handling
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const loginUser = async (email, password) => {
  try {
    console.log("🔐 === LOGIN REQUEST START ===");
    console.log("📍 URL:", `${API_BASE}/api/auth/login`);
    console.log("📧 Email:", email);
    console.log("⏱️ Timeout: 15s");

    const res = await apiClient.post("/api/auth/login", {
      email,
      password,
    });

    console.log("✅ LOGIN SUCCESS");
    console.log("📦 Response Data:", JSON.stringify(res.data, null, 2));
    console.log("🔐 === LOGIN REQUEST END ===");
    
    return res.data;
  } catch (err) {
    console.log("❌ === LOGIN ERROR DEBUG ===");
    console.log("❌ Error Code:", err.code);
    console.log("❌ Error Message:", err.message);
    
    if (err.response) {
      // Server responded with error
      console.log("❌ Response Status:", err.response.status);
      console.log("❌ Response Data:", JSON.stringify(err.response.data, null, 2));
      console.log("❌ === LOGIN ERROR END ===");
      throw err.response.data;
    } else if (err.request) {
      // Request made but no response
      console.log("⚠️ No response from server - Request made but no response received");
      console.log("❌ === LOGIN ERROR END ===");
      throw { message: "No response from server - Is backend running at " + API_BASE + "?" };
    } else {
      // Error in request setup
      console.log("❌ Request setup error:", err.message);
      console.log("❌ === LOGIN ERROR END ===");
      throw { message: err.message || "Network error" };
    }
  }
};

export const registerUser = async (userData) => {
  try {
    console.log("📝 === REGISTER REQUEST START ===");
    console.log("📍 URL:", `${API_BASE}/api/auth/register`);
    console.log("📝 Data:", { ...userData, password: "***", confirmPassword: "***" });

    const res = await apiClient.post("/api/auth/register", userData);

    console.log("✅ REGISTER SUCCESS");
    console.log("📦 Response Data:", JSON.stringify(res.data, null, 2));
    console.log("📝 === REGISTER REQUEST END ===");
    
    return res.data;
  } catch (err) {
    console.log("❌ === REGISTER ERROR DEBUG ===");
    console.log("❌ Error Code:", err.code);
    console.log("❌ Error Message:", err.message);
    
    if (err.response) {
      console.log("❌ Response Status:", err.response.status);
      console.log("❌ Response Data:", JSON.stringify(err.response.data, null, 2));
      console.log("❌ === REGISTER ERROR END ===");
      throw err.response.data;
    } else if (err.request) {
      console.log("⚠️ No response from server");
      console.log("❌ === REGISTER ERROR END ===");
      throw { message: "No response from server - Is backend running at " + API_BASE + "?" };
    } else {
      console.log("❌ Request setup error:", err.message);
      console.log("❌ === REGISTER ERROR END ===");
      throw { message: err.message || "Network error" };
    }
  }
};