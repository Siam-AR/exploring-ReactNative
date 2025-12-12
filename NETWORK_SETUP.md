# Network Configuration Guide

## What I Fixed

The error occurred because Android blocks HTTP traffic by default for security. Your app was trying to connect to `192.168.1.21:5000`, but Android's network security configuration only allowed the old IP `192.168.1.13`.

### Files Changed:
1. **android/app/src/main/res/xml/network_security_config.xml** - Whitelisted the new IP for HTTP traffic
2. **config.js** (NEW) - Centralized IP configuration 
3. **src/api/auth.js** - Now uses centralized config
4. **src/api/networkTest.js** - Now uses centralized config

## When Your IP Changes (Step-by-Step)

### Step 1: Find Your New IP Address
```bash
# On Windows PowerShell/CMD:
ipconfig

# Look for "IPv4 Address" under your active network adapter
# Example: 192.168.1.XX
```

### Step 2: Update Configuration Files (2 files only)

#### File 1: `config.js` (Root directory)
```javascript
export const API_CONFIG = {
  HOST: '192.168.1.XX',  // ← Update this line
  PORT: '5000',
  get BASE_URL() {
    return `http://${this.HOST}:${this.PORT}`;
  }
};
```

#### File 2: `android/app/src/main/res/xml/network_security_config.xml`
```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">192.168.1.XX</domain>  <!-- Update this -->
        <domain includeSubdomains="true">localhost</domain>
    </domain-config>
</network-security-config>
```

### Step 3: Rebuild Android App
```bash
# The network security config requires a full rebuild
npx react-native run-android
```

### Step 4: Restart Backend (if needed)
```bash
cd backend
npm run dev
```

## Quick Checklist

When IP changes, update:
- [ ] `config.js` - Line 3: HOST value
- [ ] `android/app/src/main/res/xml/network_security_config.xml` - Line 4: domain IP
- [ ] Rebuild app: `npx react-native run-android`
- [ ] Restart backend: `cd backend && npm run dev`

## Why This Happens

Your computer's local IP address changes when:
- You reconnect to WiFi
- Your router restarts
- You switch networks
- DHCP lease renews

## Alternative: Use Static IP (Optional)

To avoid frequent changes, you can set a static IP on your PC:
1. Go to Windows Settings → Network & Internet → WiFi → Properties
2. Edit IP settings → Manual
3. Set a static IP like `192.168.1.100`
4. Set Subnet prefix: `24`
5. Gateway: Your router IP (usually `192.168.1.1`)
6. DNS: `8.8.8.8` or your router IP

After setting static IP, follow the update steps above once, and your IP won't change anymore.

## Testing Connection

After updating, test if everything works:
```bash
# From your phone/emulator browser, visit:
http://192.168.1.XX:5000

# Should show: "API running..."
```

## Troubleshooting

If still getting network errors after update:
1. Verify PC and phone are on same WiFi network
2. Disable Windows Firewall temporarily to test
3. Check backend is running: `cd backend && npm run dev`
4. Verify IP is correct: `ipconfig` command
5. Make sure you rebuilt the Android app after XML changes
