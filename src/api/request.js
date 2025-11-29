import axios from "axios";

const API_BASE = "http://192.168.1.13:5000";

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
