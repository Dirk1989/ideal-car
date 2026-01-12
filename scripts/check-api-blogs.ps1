try {
  $b = Invoke-RestMethod -Uri 'http://localhost:3001/api/blogs' -Method Get -TimeoutSec 10
  Write-Host "API blogs count: $($b.Count)"
  foreach ($item in $b) { Write-Host "- $($item.id): $($item.title)" }
} catch {
  Write-Host 'ERR:' $_.Exception.Message
}
