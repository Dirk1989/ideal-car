$html = (Invoke-WebRequest -Uri 'http://localhost:3000/blog' -TimeoutSec 10 -UseBasicParsing).Content
$titles = @('E2E Blog','hero','hi')
foreach ($t in $titles) {
  $i = $html.IndexOf($t)
  if ($i -ge 0) {
    $start = [Math]::Max(0, $i - 200)
    $len = [Math]::Min(400, $html.Length - $start)
    $snippet = $html.Substring($start, $len)
    Write-Host "--- Snippet for '$t' ---"
    Write-Host $snippet
  } else { Write-Host "Title '$t' not found" }
}
