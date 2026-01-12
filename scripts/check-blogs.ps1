try {
  $r = Invoke-RestMethod -Uri 'http://localhost:3000/api/blogs' -Method Get -TimeoutSec 10
  $r | ConvertTo-Json -Depth 5
} catch {
  Write-Host 'ERR:' ($_.Exception.ToString())
}
