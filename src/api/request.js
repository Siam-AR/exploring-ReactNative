import axios from "axios";
import { API_CONFIG } from "../../config.js";

const API_BASE = API_CONFIG.BASE_URL;

export const createRequest = async (token, data) => {
  try {
    const res = await axios.post(`${API_BASE}/api/requests`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Network error" };
  }
};

export const getRequests = async (token) => {
  try {
    const res = await axios.get(`${API_BASE}/api/requests`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Network error" };
  }
};
