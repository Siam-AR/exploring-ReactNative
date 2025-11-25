// import axios from "axios";

// const API_BASE = "http://192.168.1.16:5000";
// // Use your PC's IPv4 address for physical device testing
// // const API_BASE = "http://192.168.1.22:5000";
// // For Android emulator use 10.0.2.2
// // For iOS: http://localhost:5000

// export const registerUser = async (userData) => {
//   return await axios.post(`${API_BASE}/api/users/register`, userData);
// };

// export const loginUser = async (userData) => {
//   return await axios.post(`${API_BASE}/api/users/login`, userData);
// };



import axios from "axios";

// IMPORTANT: Change ONLY this if your IP changes
const API_BASE = "http://192.168.1.16:5000";

// REGISTER USER
export const registerUser = async (userData) => {
  try {
    const res = await axios.post(`${API_BASE}/api/users/register`, userData);
    return res;
  } catch (err) {
    // Forward backend error message
    throw err.response?.data || { message: "Network error" };
  }
};

// LOGIN USER
export const loginUser = async (userData) => {
  try {
    const res = await axios.post(`${API_BASE}/api/users/login`, userData);
    return res;
  } catch (err) {
    // Forward backend error message
    throw err.response?.data || { message: "Network error" };
  }
};
