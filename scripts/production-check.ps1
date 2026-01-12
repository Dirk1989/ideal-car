# Production Readiness Check
# Comprehensive validation of IdealCar application

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "IdealCar Production Readiness Check" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000"
$allPassed = $true

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET",
        [object]$Body = $null
    )
    
    Write-Host "Testing: $Name..." -NoNewline
    try {
        $params = @{
            Uri = "$baseUrl$Url"
            Method = $Method
            TimeoutSec = 5
            UseBasicParsing = $true
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json)
            $params.ContentType = "application/json"
        }
        
        $response = Invoke-WebRequest @params
        Write-Host " [PASS]" -ForegroundColor Green
        return $true
    } catch {
        Write-Host " [FAIL] ($($_.Exception.Message))" -ForegroundColor Red
        return $false
    }
}

Write-Host "1. API Endpoints" -ForegroundColor Yellow
Write-Host "----------------" -ForegroundColor Yellow
$script:allPassed = (Test-Endpoint "GET /api/vehicles" "/api/vehicles") -and $allPassed
$script:allPassed = (Test-Endpoint "GET /api/dealers" "/api/dealers") -and $allPassed
$script:allPassed = (Test-Endpoint "GET /api/blogs" "/api/blogs") -and $allPassed
$script:allPassed = (Test-Endpoint "GET /api/leads" "/api/leads") -and $allPassed
$script:allPassed = (Test-Endpoint "GET /api/site" "/api/site") -and $allPassed
Write-Host ""

Write-Host "2. Public Pages" -ForegroundColor Yellow
Write-Host "---------------" -ForegroundColor Yellow
$script:allPassed = (Test-Endpoint "Home Page" "/") -and $allPassed
$script:allPassed = (Test-Endpoint "Vehicles Page" "/vehicles") -and $allPassed
$script:allPassed = (Test-Endpoint "About Page" "/about") -and $allPassed
$script:allPassed = (Test-Endpoint "Contact Page" "/contact") -and $allPassed
$script:allPassed = (Test-Endpoint "Sell Car Page" "/sell-car") -and $allPassed
$script:allPassed = (Test-Endpoint "Blog Page" "/blog") -and $allPassed
$script:allPassed = (Test-Endpoint "Gauteng Cars" "/gauteng-cars") -and $allPassed
$script:allPassed = (Test-Endpoint "Privacy Policy" "/privacy") -and $allPassed
$script:allPassed = (Test-Endpoint "Terms" "/terms") -and $allPassed
Write-Host ""

Write-Host "3. Admin Pages" -ForegroundColor Yellow
Write-Host "--------------" -ForegroundColor Yellow
$script:allPassed = (Test-Endpoint "Admin Dashboard" "/admin") -and $allPassed
$script:allPassed = (Test-Endpoint "Admin Login" "/admin/login") -and $allPassed
Write-Host ""

Write-Host "4. File Integrity" -ForegroundColor Yellow
Write-Host "-----------------" -ForegroundColor Yellow
$files = @(
    "data\vehicles.json",
    "data\dealers.json",
    "data\blogs.json",
    "data\leads.json",
    "data\site.json"
)

foreach ($file in $files) {
    $path = Join-Path "c:\Users\dirkl\ideal-car\frontend" $file
    Write-Host "Checking: $file..." -NoNewline
    if (Test-Path $path) {
        try {
            $content = Get-Content $path -Raw | ConvertFrom-Json
            Write-Host " [PASS] (Valid JSON)" -ForegroundColor Green
        } catch {
            Write-Host " [FAIL] (Invalid JSON)" -ForegroundColor Red
            $script:allPassed = $false
        }
    } else {
        Write-Host " [FAIL] (File not found)" -ForegroundColor Red
        $script:allPassed = $false
    }
}
Write-Host ""

Write-Host "5. Critical Features Test" -ForegroundColor Yellow
Write-Host "-------------------------" -ForegroundColor Yellow

# Test vehicle creation with dealer
Write-Host "Testing: Create Dealer..." -NoNewline
try {
    $dealerBody = @{
        name = "Test Dealer $(Get-Random)"
        owner = "Test Owner"
        phone = "0712345678"
        email = "test@dealer.com"
        address = "123 Test St"
        notes = "Test"
    }
    
    $response = Invoke-RestMethod -Uri "$baseUrl/api/dealers" -Method POST -Body ($dealerBody | ConvertTo-Json) -ContentType "application/json"
    $dealerId = $response.id
    Write-Host " [PASS] (ID: $dealerId)" -ForegroundColor Green
    
    # Test vehicle with dealer
    Write-Host "Testing: Create Vehicle with Dealer..." -NoNewline
    $vehicleBody = @{
        title = "Test Vehicle $(Get-Random)"
        price = 50000
        year = 2023
        mileage = 10000
        fuelType = "Petrol"
        transmission = "Automatic"
        color = "Blue"
        location = "Johannesburg"
        features = @("GPS")
        isFeatured = $false
        dealerId = $dealerId
    }
    
    $vehicle = Invoke-RestMethod -Uri "$baseUrl/api/vehicles" -Method POST -Body ($vehicleBody | ConvertTo-Json) -ContentType "application/json"
    Write-Host " [PASS] (ID: $($vehicle.id), DealerId: $($vehicle.dealerId))" -ForegroundColor Green
    
    # Test vehicle update
    Write-Host "Testing: Update Vehicle..." -NoNewline
    $updateBody = @{
        id = $vehicle.id
        title = "Updated Vehicle"
        price = 55000
    }
    $updated = Invoke-RestMethod -Uri "$baseUrl/api/vehicles" -Method PUT -Body ($updateBody | ConvertTo-Json) -ContentType "application/json"
    Write-Host " [PASS]" -ForegroundColor Green
    
    # Cleanup
    Write-Host "Cleaning up test data..." -NoNewline
    Invoke-RestMethod -Uri "$baseUrl/api/vehicles" -Method DELETE -Body (@{id=$vehicle.id} | ConvertTo-Json) -ContentType "application/json" | Out-Null
    Invoke-RestMethod -Uri "$baseUrl/api/dealers" -Method DELETE -Body (@{id=$dealerId} | ConvertTo-Json) -ContentType "application/json" | Out-Null
    Write-Host " [DONE]" -ForegroundColor Green
} catch {
    Write-Host " [FAIL] ($($_.Exception.Message))" -ForegroundColor Red
    $script:allPassed = $false
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Summary" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

if ($allPassed) {
    Write-Host "[PASS] All checks passed! Application is production ready." -ForegroundColor Green
    exit 0
} else {
    Write-Host "[FAIL] Some checks failed. Please review the errors above." -ForegroundColor Red
    exit 1
}
