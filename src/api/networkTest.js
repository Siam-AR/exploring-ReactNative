import axios from "axios";
import { API_CONFIG } from "../../config.js";

export const testNetworkConnection = async () => {
  try {
    console.log(`🌐 Testing network connection to ${API_CONFIG.BASE_URL}`);
    
    const res = await axios.get(API_CONFIG.BASE_URL, {
      timeout: 5000,
    });
    
    console.log("✅ Network OK:", res.status);
    return true;
  } catch (err) {
    console.log("❌ Network FAILED:", err.message);
    console.log("Error Code:", err.code);
    return false;
  }
};