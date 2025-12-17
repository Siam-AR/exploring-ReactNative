import axios from "axios";
import { API_CONFIG } from "../../config.js";

const API_BASE = API_CONFIG.BASE_URL;

// GET ALL HELPERS with optional filters
export const getHelpers = async (filters = {}) => {
  try {
    const { service, location } = filters;
    const params = new URLSearchParams();
    
    if (service) params.append('service', service);
    if (location) params.append('location', location);
    
    const queryString = params.toString();
    const url = `${API_BASE}/api/helpers${queryString ? '?' + queryString : ''}`;
    
    console.log(" Fetching helpers:", url);
    const res = await axios.get(url);
    console.log(` Fetched ${res.data.length} helpers`);
    return res.data;
  } catch (err) {
    console.log(" Get Helpers Error:", err.message);
    throw err.response?.data || { message: "Network error" };
  }
};

// GET HELPER BY ID
export const getHelperById = async (id) => {
  try {
    console.log(" Fetching helper:", id);
    const res = await axios.get(`${API_BASE}/api/helpers/${id}`);
    console.log(" Helper fetched");
    return res.data;
  } catch (err) {
    console.log(" Get Helper Error:", err.message);
    throw err.response?.data || { message: "Network error" };
  }
};

// GET MY PROFILE (Protected - Helper only)
export const getMyProfile = async (token) => {
  try {
    console.log(" Fetching my helper profile");
    const res = await axios.get(`${API_BASE}/api/helpers/me/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(" My profile fetched");
    return res.data;
  } catch (err) {
    console.log(" Get My Profile Error:", err.message);
    throw err.response?.data || { message: "Network error" };
  }
};

// UPDATE MY PROFILE (Protected - Helper only)
export const updateMyProfile = async (token, data) => {
  try {
    console.log(" Updating my helper profile:", data);
    const res = await axios.put(`${API_BASE}/api/helpers/me/profile`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(" My profile updated successfully");
    return res.data;
  } catch (err) {
    console.log(" Update My Profile Error:", err.message);
    throw err.response?.data || { message: "Network error" };
  }
};
