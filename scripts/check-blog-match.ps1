$blogs = Invoke-RestMethod -Uri 'http://localhost:3000/api/blogs' -Method Get -TimeoutSec 10
$html = (Invoke-WebRequest -Uri 'http://localhost:3000/blog' -TimeoutSec 10 -UseBasicParsing).Content
foreach ($b in $blogs) {
  $found = $html -like "*${($b.title)}*"
  Write-Host "Title: $($b.title) -> Present on /blog: $found"
}
