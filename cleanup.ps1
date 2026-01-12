# Pre-Launch Cleanup Script
Write-Host "Starting Pre-Launch Cleanup..." -ForegroundColor Green
Write-Host ""

# Backup existing data
Write-Host "Creating backups..." -ForegroundColor Yellow
$timestamp = Get-Date -Format 'yyyy-MM-dd_HH-mm-ss'
$backupDir = ".\frontend\data\backup_$timestamp"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
Copy-Item .\frontend\data\*.json $backupDir\

Write-Host "Backup created at: $backupDir" -ForegroundColor Green
Write-Host ""

# Clean data files
Write-Host "Cleaning data files..." -ForegroundColor Yellow
Set-Content -Path .\frontend\data\vehicles.json -Value "[]"
Set-Content -Path .\frontend\data\dealers.json -Value "[]"
Set-Content -Path .\frontend\data\blogs.json -Value "[]"
Set-Content -Path .\frontend\data\leads.json -Value "[]"

Write-Host "vehicles.json - CLEANED (0 vehicles)" -ForegroundColor Green
Write-Host "dealers.json - CLEANED (0 dealers)" -ForegroundColor Green
Write-Host "blogs.json - CLEANED (0 blogs)" -ForegroundColor Green
Write-Host "leads.json - CLEANED (0 leads)" -ForegroundColor Green
Write-Host ""

# Verify site.json
Write-Host "Verifying site settings..." -ForegroundColor Yellow
$siteJson = Get-Content .\frontend\data\site.json | ConvertFrom-Json
Write-Host "   Site Name: $($siteJson.siteName)" -ForegroundColor Cyan
Write-Host "   Tagline: $($siteJson.tagline)" -ForegroundColor Cyan
Write-Host "   Email: $($siteJson.contact.email)" -ForegroundColor Cyan
Write-Host "   Phone: $($siteJson.contact.phone)" -ForegroundColor Cyan
Write-Host "   Business: $($siteJson.contact.businessName)" -ForegroundColor Cyan
Write-Host "Site settings preserved" -ForegroundColor Green
Write-Host ""

# Ask about uploads
Write-Host "Upload Management" -ForegroundColor Yellow
Write-Host "Current uploads folder contains test images." -ForegroundColor White
$clearUploads = Read-Host "Clear ALL test uploads? (y/n)"

if ($clearUploads -eq 'y') {
    Write-Host "Backing up and clearing uploads..." -ForegroundColor Yellow
    $timestamp2 = Get-Date -Format 'yyyy-MM-dd_HH-mm-ss'
    $uploadsBackup = ".\frontend\public\uploads_backup_$timestamp2"
    Copy-Item -Recurse .\frontend\public\uploads $uploadsBackup -ErrorAction SilentlyContinue
    Remove-Item .\frontend\public\uploads\* -Force -Recurse -ErrorAction SilentlyContinue
    New-Item -ItemType Directory -Path .\frontend\public\uploads -Force | Out-Null
    Write-Host "Uploads cleared (backup at $uploadsBackup)" -ForegroundColor Green
} else {
    Write-Host "Keeping uploads folder as-is" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Gray
Write-Host "Cleanup Complete!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Gray
Write-Host ""
Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "   Vehicles: 0" -ForegroundColor White
Write-Host "   Dealers: 0" -ForegroundColor White
Write-Host "   Blogs: 0" -ForegroundColor White
Write-Host "   Leads: 0" -ForegroundColor White
Write-Host "   Site settings: Preserved" -ForegroundColor White
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Verify site.json contact info above is correct" -ForegroundColor White
Write-Host "   2. Change admin password in frontend/app/admin/page.tsx" -ForegroundColor White
Write-Host "   3. Run: cd frontend; npm run build" -ForegroundColor White
Write-Host "   4. Test locally at http://localhost:3000" -ForegroundColor White
Write-Host "   5. Deploy to Hetzner using HETZNER_SETUP.md" -ForegroundColor White
Write-Host ""
Write-Host "IMPORTANT: Change admin password from 'idealcar2026' before deploying!" -ForegroundColor Red
Write-Host ""
