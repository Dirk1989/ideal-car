# scripts/restart-dev.ps1
# Kill all node processes, start Next dev in frontend, and poll /api/vehicles on ports 3000-3003
Try {
    Write-Host "Killing node processes (if any)..."
    taskkill /IM node.exe /F -ErrorAction SilentlyContinue | Out-Null
} Catch {
    Write-Host "No node processes to kill or failed to kill."
}
Start-Sleep -Seconds 1
Write-Host "Starting Next dev in frontend..."
Start-Process -FilePath npm -ArgumentList 'run','dev' -WorkingDirectory 'C:\Users\dirkl\ideal-car\frontend' -NoNewWindow
Start-Sleep -Seconds 3
$found = $false
for ($i = 0; $i -lt 30 -and -not $found; $i++) {
    foreach ($p in 3000..3003) {
        try {
            $r = Invoke-RestMethod -Uri "http://localhost:$p/api/vehicles" -Method Get -TimeoutSec 2 -UseBasicParsing
            if ($r) {
                Write-Host "OK:$p"
                $found = $true
                break
            }
        } catch {
            # ignore
        }
    }
    Start-Sleep -Seconds 1
}
if (-not $found) {
    Write-Host "NOT_READY"
    exit 1
}
