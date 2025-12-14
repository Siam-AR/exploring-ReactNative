import axios from "axios";

const API_BASE = "http://192.168.1.21:5000";

export const getStats = async () => {
  try {
    console.log("📊 Fetching stats from:", `${API_BASE}/api/stats`);
    const res = await axios.get(`${API_BASE}/api/stats`);
    console.log("✅ Stats fetched:", res.data);
    return res.data;
  } catch (err) {
    console.log("❌ Get Stats Error:", err.message);
    throw err.response?.data || { message: "Failed to fetch stats" };
  }
};