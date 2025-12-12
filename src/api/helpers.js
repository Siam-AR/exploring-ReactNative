import axios from "axios";
import { API_CONFIG } from "../../config.js";

const API_BASE = API_CONFIG.BASE_URL;

// GET ALL HELPERS
export const getHelpers = async () => {
  try {
    const res = await axios.get(`${API_BASE}/api/helpers`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Network error" };
  }
};
