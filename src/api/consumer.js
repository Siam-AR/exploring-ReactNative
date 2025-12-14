import axios from "axios";

const API_BASE = "http://192.168.1.21:5000";

export const getMyConsumerProfile = async (token) => {
  try {
    console.log("📡 Fetching my consumer profile");
    const res = await axios.get(`${API_BASE}/api/consumers/me/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✅ Consumer profile fetched");
    return res.data;
  } catch (err) {
    console.log("❌ Get Consumer Profile Error:", err.message);
    throw err.response?.data || { message: "Network error" };
  }
};

export const updateMyConsumerProfile = async (token, data) => {
  try {
    console.log("📝 Updating my consumer profile:", data);
    const res = await axios.put(`${API_BASE}/api/consumers/me/profile`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✅ Consumer profile updated successfully");
    return res.data;
  } catch (err) {
    console.log("❌ Update Consumer Profile Error:", err.message);
    throw err.response?.data || { message: "Network error" };
  }
};