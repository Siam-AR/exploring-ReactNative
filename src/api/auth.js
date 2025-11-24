import axios from "axios";

const API_BASE = "http://192.168.1.22:5000";
// Use your PC's IPv4 address for physical device testing
// const API_BASE = "http://192.168.1.22:5000";
// For Android emulator use 10.0.2.2
// For iOS: http://localhost:5000

export const registerUser = async (userData) => {
  return await axios.post(`${API_BASE}/api/users/register`, userData);
};

export const loginUser = async (userData) => {
  return await axios.post(`${API_BASE}/api/users/login`, userData);
};

