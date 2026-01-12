# Test Runner for IdealCar Application
# This script installs dependencies, starts the dev server, runs tests, and reports results

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "IdealCar Test Suite" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if running in frontend directory
if (!(Test-Path "package.json")) {
    Write-Host "Error: Must run from frontend directory" -ForegroundColor Red
    exit 1
}

# Install test dependencies
Write-Host "Installing test dependencies..." -ForegroundColor Yellow
npm install --save-dev @jest/globals @types/jest jest ts-jest @types/nodemailer

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "Dependencies installed successfully!" -ForegroundColor Green
Write-Host ""

# Check if dev server is running
Write-Host "Checking if dev server is running..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 2 -UseBasicParsing 2>$null
    Write-Host "Dev server is already running!" -ForegroundColor Green
    $serverStarted = $false
} catch {
    Write-Host "Dev server not running. Starting..." -ForegroundColor Yellow
    $serverProcess = Start-Process -FilePath "npm" -ArgumentList "run", "dev" -PassThru -WindowStyle Hidden
    $serverStarted = $true
    Write-Host "Waiting for server to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    
    # Verify server started
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -UseBasicParsing
        Write-Host "Dev server started successfully!" -ForegroundColor Green
    } catch {
        Write-Host "Failed to start dev server" -ForegroundColor Red
        if ($serverStarted) {
            Stop-Process -Id $serverProcess.Id -Force
        }
        exit 1
    }
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Running API Tests" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Run tests
$env:TEST_URL = "http://localhost:3000"
npm test

$testResult = $LASTEXITCODE

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Test Results" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

if ($testResult -eq 0) {
    Write-Host "All tests passed! ✓" -ForegroundColor Green
} else {
    Write-Host "Some tests failed! ✗" -ForegroundColor Red
}

# Cleanup - stop server if we started it
if ($serverStarted) {
    Write-Host ""
    Write-Host "Stopping dev server..." -ForegroundColor Yellow
    Stop-Process -Id $serverProcess.Id -Force
    Write-Host "Dev server stopped." -ForegroundColor Green
}

Write-Host ""
Write-Host "Test run completed!" -ForegroundColor Cyan

exit $testResult
