try {
  $resp = Invoke-WebRequest -Uri 'http://localhost:3000/blog' -TimeoutSec 10
  $html = $resp.Content
  $html.Substring(0, [Math]::Min(4000, $html.Length))
} catch {
  Write-Host 'ERR:' ($_.Exception.ToString())
}
