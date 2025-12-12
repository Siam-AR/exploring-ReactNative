# Quick IP Update Script for MiNi Bangladesh
# Run this when your IP address changes

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  MiNi Bangladesh - IP Update Helper" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Get current IP
Write-Host "Finding your current IP address...`n" -ForegroundColor Yellow
$ipAddress = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Wi-Fi*" -ErrorAction SilentlyContinue | Where-Object {$_.IPAddress -like "192.168.*"}).IPAddress

if (-not $ipAddress) {
    $ipAddress = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -like "192.168.*"} | Select-Object -First 1).IPAddress
}

if ($ipAddress) {
    Write-Host "Current IP detected: $ipAddress" -ForegroundColor Green
    $useDetected = Read-Host "`nUse this IP? (y/n)"
    
    if ($useDetected -ne "y") {
        $ipAddress = Read-Host "Enter your IP address (e.g., 192.168.1.21)"
    }
} else {
    Write-Host "Could not auto-detect IP." -ForegroundColor Red
    $ipAddress = Read-Host "Enter your IP address (e.g., 192.168.1.21)"
}

Write-Host "`nUpdating configuration files...`n" -ForegroundColor Yellow

# Update config.js
$configFile = "config.js"
$configContent = Get-Content $configFile -Raw
$newConfigContent = $configContent -replace "HOST: '[^']*'", "HOST: '$ipAddress'"
Set-Content $configFile $newConfigContent
Write-Host "✓ Updated: config.js" -ForegroundColor Green

# Update network_security_config.xml
$xmlFile = "android\app\src\main\res\xml\network_security_config.xml"
$xmlContent = Get-Content $xmlFile -Raw
$newXmlContent = $xmlContent -replace '<domain includeSubdomains="true">192\.168\.\d+\.\d+</domain>', "<domain includeSubdomains=`"true`">$ipAddress</domain>"
Set-Content $xmlFile $newXmlContent
Write-Host "✓ Updated: network_security_config.xml" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Configuration Updated Successfully!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Rebuild the app: npx react-native run-android" -ForegroundColor White
Write-Host "2. Restart backend: cd backend && npm run dev`n" -ForegroundColor White

Read-Host "Press Enter to exit"
