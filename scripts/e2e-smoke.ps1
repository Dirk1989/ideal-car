$base = 'http://localhost:3000'
$img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII='
try {
  Write-Host '--- E2E SMOKE TEST START ---'

  Write-Host 'POST /api/vehicles (with image)'
  $vehBody = @{ title='E2E Vehicle Img'; price=45000; year=2012; mileage=90000; fuelType='Petrol'; transmission='Manual'; location='Testcity'; features=@(); isFeatured=$false; imagesBase64=@($img) } | ConvertTo-Json -Depth 6
  $veh = Invoke-RestMethod -Uri "$base/api/vehicles" -Method Post -ContentType 'application/json' -Body $vehBody
  Write-Host "Vehicle created: ID=$($veh.id)"

  Write-Host 'GET /api/vehicles count'
  $vs = Invoke-RestMethod -Uri "$base/api/vehicles" -Method Get -TimeoutSec 10
  Write-Host "Vehicles total: $($vs.Count)"

  Write-Host 'POST /api/blogs (with image)'
  $blogBody = @{ title='E2E Blog Img'; excerpt='Excerpt'; content='Content body'; category='Testing'; author='E2E'; status='published'; readTime='2 min'; imageBase64=$img } | ConvertTo-Json -Depth 6
  $blog = Invoke-RestMethod -Uri "$base/api/blogs" -Method Post -ContentType 'application/json' -Body $blogBody
  Write-Host "Blog created: ID=$($blog.id)"

  Write-Host 'GET /api/blogs count'
  $bs = Invoke-RestMethod -Uri "$base/api/blogs" -Method Get -TimeoutSec 10
  Write-Host "Blogs total: $($bs.Count)"

  Write-Host 'POST /api/leads'
  $leadBody = @{ name='E2E Lead Test'; phone='0712345678'; email='lead@test.co'; carMake='Ford'; carModel='Fiesta'; carYear='2014'; carMileage='120000'; carLocation='Testville'; preferredContact='email'; additionalInfo='Testing lead'; urgency='within_week' } | ConvertTo-Json -Depth 6
  $lead = Invoke-RestMethod -Uri "$base/api/leads" -Method Post -ContentType 'application/json' -Body $leadBody
  Write-Host "Lead created: ID=$($lead.id)"

  Write-Host 'GET /api/leads count'
  $ls = Invoke-RestMethod -Uri "$base/api/leads" -Method Get -TimeoutSec 10
  Write-Host "Leads total: $($ls.Count)"

  Write-Host 'POST /api/site update (logo + hero)'
  $siteBody = @{ siteName='IdealCar E2E'; tagline='E2E Tagline'; logoBase64=$img; heroImagesBase64=@($img,$img) } | ConvertTo-Json -Depth 8
  $siteRes = Invoke-RestMethod -Uri "$base/api/site" -Method Post -ContentType 'application/json' -Body $siteBody
  Write-Host 'Site updated'

  Write-Host 'VERIFY site GET'
  $siteGet = Invoke-RestMethod -Uri "$base/api/site" -Method Get -TimeoutSec 10
  Write-Host "Site name: $($siteGet.siteName)"

  Write-Host 'Now deleting created resources'
  if ($veh.id) { Invoke-RestMethod -Uri "$base/api/vehicles" -Method Delete -ContentType 'application/json' -Body (@{ id = $veh.id } | ConvertTo-Json); Write-Host "Deleted vehicle $($veh.id)" }
  if ($blog.id) { Invoke-RestMethod -Uri "$base/api/blogs" -Method Delete -ContentType 'application/json' -Body (@{ id = $blog.id } | ConvertTo-Json); Write-Host "Deleted blog $($blog.id)" }
  if ($lead.id) { Invoke-RestMethod -Uri "$base/api/leads" -Method Delete -ContentType 'application/json' -Body (@{ id = $lead.id } | ConvertTo-Json); Write-Host "Deleted lead $($lead.id)" }

  Write-Host 'Final GETs for verification'
  $vs2 = Invoke-RestMethod -Uri "$base/api/vehicles" -Method Get -TimeoutSec 10
  $bs2 = Invoke-RestMethod -Uri "$base/api/blogs" -Method Get -TimeoutSec 10
  $ls2 = Invoke-RestMethod -Uri "$base/api/leads" -Method Get -TimeoutSec 10
  Write-Host "Vehicles after: $($vs2.Count)"
  Write-Host "Blogs after: $($bs2.Count)"
  Write-Host "Leads after: $($ls2.Count)"

  Write-Host '--- E2E SMOKE TEST COMPLETE ---'
} catch {
  Write-Host 'E2E script failed:'
  Write-Host $_.Exception.ToString()
  exit 1
}
