// Central configuration file for API endpoint
// Update this IP address when your network changes
export const API_CONFIG = {
  HOST: '192.168.1.21',
  PORT: '5000',
  get BASE_URL() {
    return `http://${this.HOST}:${this.PORT}`;
  }
};

// Quick guide: How to update IP when it changes
// 1. Find your PC's IP: Run `ipconfig` in terminal (Windows) or `ifconfig` (Mac/Linux)
// 2. Update the HOST value above
// 3. Update android/app/src/main/res/xml/network_security_config.xml with the new IP
// 4. Rebuild the app: npx react-native run-android
// 5. Restart backend: cd backend && npm run dev
