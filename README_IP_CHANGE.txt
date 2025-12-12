═══════════════════════════════════════════════════════════════
  QUICK GUIDE: When Your IP Address Changes
═══════════════════════════════════════════════════════════════

PROBLEM FIXED:
--------------
Your app was getting "Network Error" because Android was blocking
HTTP connections to the new IP (192.168.1.21). The old IP 
(192.168.1.13) was whitelisted but not the new one.

WHAT WAS CHANGED:
-----------------
✓ Created centralized config file (config.js) - All API files now use this
✓ Updated Android network security to allow new IP (192.168.1.21)
✓ Updated all API files (auth.js, helpers.js, request.js, networkTest.js)
✓ Created automated update script (update-ip.ps1)
✓ Created this guide (README_IP_CHANGE.txt & NETWORK_SETUP.md)


═══════════════════════════════════════════════════════════════
  WHEN IP CHANGES - DO THIS (2 METHODS)
═══════════════════════════════════════════════════════════════

METHOD 1: Automated Script (Recommended)
-----------------------------------------
1. Open PowerShell in project root
2. Run: .\update-ip.ps1
3. Follow the prompts
4. Rebuild app: npx react-native run-android
5. Restart backend: cd backend && npm run dev

METHOD 2: Manual Update
-----------------------
Only need to edit 2 files:

FILE 1: config.js (line 3)
   Change: HOST: '192.168.1.21',
   To:     HOST: '192.168.1.XX',  (your new IP)

FILE 2: android/app/src/main/res/xml/network_security_config.xml (line 4)
   Change: <domain includeSubdomains="true">192.168.1.21</domain>
   To:     <domain includeSubdomains="true">192.168.1.XX</domain>

Then:
   - Rebuild: npx react-native run-android
   - Restart backend: cd backend && npm run dev


═══════════════════════════════════════════════════════════════
  HOW TO FIND YOUR IP ADDRESS
═══════════════════════════════════════════════════════════════

Windows:
   1. Open PowerShell or CMD
   2. Type: ipconfig
   3. Look for "IPv4 Address" under Wi-Fi adapter
   4. Should be like: 192.168.1.XX

Mac/Linux:
   1. Open Terminal
   2. Type: ifconfig
   3. Look for inet address under active network


═══════════════════════════════════════════════════════════════
  WHY THIS HAPPENS
═══════════════════════════════════════════════════════════════

Your local IP changes when:
• You reconnect to WiFi
• Router restarts
• You switch networks
• DHCP lease renews


═══════════════════════════════════════════════════════════════
  AVOID IP CHANGES (Optional)
═══════════════════════════════════════════════════════════════

Set a Static IP on Your PC:
1. Windows Settings → Network & Internet → Wi-Fi → Properties
2. Edit IP settings → Manual
3. IP: 192.168.1.100 (pick any number 2-254 not in use)
4. Subnet: 255.255.255.0 (or prefix: 24)
5. Gateway: 192.168.1.1 (your router IP)
6. DNS: 8.8.8.8

After setting static IP, run the update process ONE TIME and
your IP won't change anymore!


═══════════════════════════════════════════════════════════════
  TROUBLESHOOTING
═══════════════════════════════════════════════════════════════

Still getting errors after update?
□ Check PC and phone are on SAME WiFi network
□ Verify backend is running (cd backend && npm run dev)
□ Test in browser: http://192.168.1.XX:5000 (should show "API running")
□ Did you rebuild the app? (Must rebuild after XML changes)
□ Disable Windows Firewall temporarily to test
□ Check IP is correct: run ipconfig


═══════════════════════════════════════════════════════════════
  QUICK REFERENCE
═══════════════════════════════════════════════════════════════

Current IP: 192.168.1.21
Backend Port: 5000
API Endpoint: http://192.168.1.21:5000

Files that control IP:
• config.js (main config)
• android/app/src/main/res/xml/network_security_config.xml

Files that auto-read from config:
• src/api/auth.js
• src/api/helpers.js
• src/api/request.js
• src/api/networkTest.js


═══════════════════════════════════════════════════════════════
For detailed documentation, see: NETWORK_SETUP.md
═══════════════════════════════════════════════════════════════
