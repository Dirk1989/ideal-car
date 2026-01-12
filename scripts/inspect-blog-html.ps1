try {
  $u = 'http://localhost:3001/blog'
  $resp = Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec 10
  $html = $resp.Content
  $cards = [regex]::Matches($html, 'bg-white rounded-2xl shadow-lg overflow-hidden').Count
  $hidden = [regex]::Matches($html, '(?:hidden|opacity-0|invisible|sr-only)').Count
  Write-Host "CardMatches: $cards"
  Write-Host "HiddenClassMatches: $hidden"

  $gridIndex = $html.IndexOf('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8')
  if ($gridIndex -ge 0) {
    $snippetStart = [Math]::Max(0, $gridIndex - 200)
    $snippetLen = [Math]::Min(1200, $html.Length - $snippetStart)
    Write-Host '--- Grid snippet ---'
    Write-Host $html.Substring($snippetStart, $snippetLen)
  } else {
    Write-Host 'Grid container not found'
  }
} catch {
  Write-Host 'ERR:' $_.Exception.Message
}
