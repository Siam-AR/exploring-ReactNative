# Auto-detect and update IP address for React Native project
# Run this script whenever you change WiFi networks

Write-Host "`n Auto-detecting your PC's IP address..." -ForegroundColor Cyan

# Collect candidate IPv4 addresses with default gateway (active network)
$ipCandidates = @()
$netConfigs = Get-NetIPConfiguration | Where-Object { $_.IPv4DefaultGateway -and $_.IPv4Address }
foreach ($cfg in $netConfigs) {
    foreach ($addr in $cfg.IPv4Address) {
        $ipCandidates += [pscustomobject]@{
            IPAddress      = $addr.IPAddress
            InterfaceAlias = $cfg.InterfaceAlias
            IsWiFi         = ($cfg.InterfaceAlias -like '*Wi-Fi*' -or $cfg.InterfaceAlias -like '*Wireless*')
            IsVirtual      = ($cfg.InterfaceAlias -like '*vEthernet*' -or $cfg.InterfaceAlias -like '*Virtual*' -or $cfg.InterfaceAlias -like '*VMware*' -or $cfg.InterfaceAlias -like '*Hyper-V*')
        }
    }
}

# Fallback: any non-loopback, non-APIPA
if (-not $ipCandidates) {
    $fallback = Get-NetIPAddress -AddressFamily IPv4 |
        Where-Object { $_.IPAddress -notlike '169.254.*' -and $_.IPAddress -ne '127.0.0.1' }
    foreach ($f in $fallback) {
        $ipCandidates += [pscustomobject]@{
            IPAddress      = $f.IPAddress
            InterfaceAlias = $f.InterfaceAlias
            IsWiFi         = ($f.InterfaceAlias -like '*Wi-Fi*' -or $f.InterfaceAlias -like '*Wireless*')
            IsVirtual      = ($f.InterfaceAlias -like '*vEthernet*' -or $f.InterfaceAlias -like '*Virtual*' -or $f.InterfaceAlias -like '*VMware*' -or $f.InterfaceAlias -like '*Hyper-V*')
        }
    }
}

# Choose best candidate: prefer Wi-Fi, exclude virtual adapters
$ip = $ipCandidates |
    Where-Object { -not $_.IsVirtual -and $_.IPAddress -notlike '169.254.*' -and $_.IPAddress -ne '127.0.0.1' } |
    Sort-Object @{Expression = { -not $_.IsWiFi }}, InterfaceAlias |
    Select-Object -First 1 -ExpandProperty IPAddress

if (-not $ip) {
    Write-Host " Could not detect IP. Please check your network connection." -ForegroundColor Red
    exit 1
}

Write-Host " Detected IP: $ip" -ForegroundColor Green

# Update config.js
$configPath = "$PSScriptRoot\config.js"
if (Test-Path $configPath) {
    $configContent = Get-Content $configPath -Raw
    $configContent = $configContent -replace "HOST: '[0-9.]+',", "HOST: '$ip',"
    $configContent | Set-Content $configPath -Encoding UTF8 -NoNewline
    Write-Host " Updated config.js" -ForegroundColor Green
} else {
    Write-Host "  config.js not found" -ForegroundColor Yellow
}

Write-Host "`n Next steps:" -ForegroundColor Cyan
Write-Host "   1. Restart Metro Bundler (press 'r' or restart terminal)" -ForegroundColor White
Write-Host "   2. Reload app on device (shake device  Reload)" -ForegroundColor White
Write-Host "   3. Make sure device is on same WiFi network" -ForegroundColor White
Write-Host "`n All done! Your app will use: http://${ip}:5000`n" -ForegroundColor Green
