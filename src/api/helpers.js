import axios from "axios";

const API_BASE = "http://192.168.1.13:5000";

// GET ALL HELPERS
export const getHelpers = async () => {
  try {
    const res = await axios.get(`${API_BASE}/api/helpers`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Network error" };
  }
};
