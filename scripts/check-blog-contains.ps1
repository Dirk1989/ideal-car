$html = Invoke-WebRequest -Uri 'http://localhost:3000/blog' -TimeoutSec 10 -UseBasicParsing
$containsE2E = $html.Content -like '*E2E Blog*'
$containsHeading = $html.Content -like '*Our Blog*'
Write-Host "Contains 'E2E Blog': $containsE2E"
Write-Host "Contains 'Our Blog': $containsHeading"
