import axios from "axios";

// IMPORTANT: Change ONLY this if your IP changes
const API_BASE = "http://192.168.1.13:5000";

// REGISTER USER
export const registerUser = async (userData) => {
  try {
    const res = await axios.post(`${API_BASE}/api/users/register`, userData);
    return res;
  } catch (err) {

    throw err.response?.data || { message: "Network error" };
  }
};

// LOGIN USER
export const loginUser = async (userData) => {
  try {
    const res = await axios.post(`${API_BASE}/api/users/login`, userData);
    return res;
  } catch (err) {

    throw err.response?.data || { message: "Network error" };
  }
};

// COMMUNITY STATES
export const getStats = async () => {
  try {
    const res = await axios.get(`${API_BASE}/api/stats`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Network error" };
  }
};

