# Pre-Launch Cleanup Script

## 🎯 Goal
Remove all test/mock data before going live in production.

---

## Option 1: Clean Everything (Fresh Start)

**Run these commands to reset all data:**

```powershell
# Navigate to frontend data directory
cd C:\Users\dirkl\ideal-car\frontend\data

# Backup current data (just in case)
mkdir backup
Copy-Item vehicles.json backup/
Copy-Item dealers.json backup/
Copy-Item blogs.json backup/
Copy-Item leads.json backup/

# Reset to empty arrays
echo "[]" > vehicles.json
echo "[]" > dealers.json
echo "[]" > blogs.json
echo "[]" > leads.json

# Keep site.json (has your real contact info)
# Just verify the content is correct
Get-Content site.json
```

**Reset uploads folder:**
```powershell
# Backup uploads
cd C:\Users\dirkl\ideal-car\frontend\public
Copy-Item -Recurse uploads uploads_backup

# Clear test images
Remove-Item uploads/* -Force -Recurse
```

**Result:** Completely clean slate!

---

## Option 2: Selective Cleanup (Keep Some Data)

**If you want to keep site settings but remove test data:**

### Clean Vehicles:
```powershell
cd C:\Users\dirkl\ideal-car\frontend\data
echo "[]" > vehicles.json
```

### Clean Dealers:
```powershell
echo "[]" > dealers.json
```

### Clean Blogs:
```powershell
echo "[]" > blogs.json
```

### Clean Leads:
```powershell
echo "[]" > leads.json
```

### Keep Site Settings (logo, contact info):
```powershell
# Leave site.json as-is - already has real data
```

---

## Option 3: Manual Cleanup via Admin Panel

**If you want to do it manually:**

1. **Go to admin panel**
   ```
   http://localhost:3000/admin
   ```

2. **Delete test vehicles:**
   - Click "Cars" tab
   - Delete: GWM, Test Transfer Vehicle, Dealer Test Vehicle
   - Click trash icon for each

3. **Delete test dealers:**
   - Click "Dealers" tab  
   - Delete: Dirk Lensley, Piet

4. **Delete test blogs:**
   - Click "Blogs" tab
   - Delete all test blogs

5. **Delete test leads:**
   - Click "Leads" tab
   - Delete E2E test leads

6. **Verify site settings:**
   - Click "Site Settings" tab
   - Check contact info is correct
   - Check logo looks good

---

## 📋 Pre-Launch Checklist

Run this before deploying to production:

### Data Cleanup:
- [ ] All test vehicles removed
- [ ] Test dealers removed  
- [ ] Test blogs removed
- [ ] Test leads removed
- [ ] Site settings verified (name, contact info, logo)
- [ ] Test uploads cleared from /public/uploads

### Code Cleanup:
- [ ] Admin password changed from default
- [ ] No console.log() statements in production code
- [ ] Error messages don't expose sensitive info

### Final Verification:
- [ ] Run `npm run build` - no errors
- [ ] Test all pages load correctly
- [ ] Upload a real car - verify it works
- [ ] Submit contact form - verify email works
- [ ] Check mobile view

---

## 🚀 Automated Cleanup Script

**Save this as `cleanup.ps1` in your project root:**

```powershell
# Pre-Launch Cleanup Script
Write-Host "🧹 Starting Pre-Launch Cleanup..." -ForegroundColor Green

# Backup existing data
Write-Host "📦 Creating backups..." -ForegroundColor Yellow
$backupDir = ".\frontend\data\backup_$(Get-Date -Format 'yyyy-MM-dd_HH-mm-ss')"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
Copy-Item .\frontend\data\*.json $backupDir\

Write-Host "✅ Backup created at: $backupDir" -ForegroundColor Green

# Clean data files
Write-Host "🗑️ Cleaning data files..." -ForegroundColor Yellow
Set-Content -Path .\frontend\data\vehicles.json -Value "[]"
Set-Content -Path .\frontend\data\dealers.json -Value "[]"
Set-Content -Path .\frontend\data\blogs.json -Value "[]"
Set-Content -Path .\frontend\data\leads.json -Value "[]"

Write-Host "✅ Data files cleaned" -ForegroundColor Green

# Verify site.json
Write-Host "🔍 Verifying site settings..." -ForegroundColor Yellow
$siteJson = Get-Content .\frontend\data\site.json | ConvertFrom-Json
Write-Host "Site Name: $($siteJson.siteName)" -ForegroundColor Cyan
Write-Host "Contact Email: $($siteJson.contact.email)" -ForegroundColor Cyan
Write-Host "Contact Phone: $($siteJson.contact.phone)" -ForegroundColor Cyan

# Ask about uploads
$clearUploads = Read-Host "Clear test uploads? (y/n)"
if ($clearUploads -eq 'y') {
    Write-Host "🗑️ Backing up and clearing uploads..." -ForegroundColor Yellow
    $uploadsBackup = ".\frontend\public\uploads_backup_$(Get-Date -Format 'yyyy-MM-dd_HH-mm-ss')"
    Copy-Item -Recurse .\frontend\public\uploads $uploadsBackup
    Remove-Item .\frontend\public\uploads\* -Force -Recurse -ErrorAction SilentlyContinue
    Write-Host "✅ Uploads cleared (backup at $uploadsBackup)" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Cleanup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Review site.json contact info" -ForegroundColor White
Write-Host "2. Change admin password in app/admin/page.tsx" -ForegroundColor White
Write-Host "3. Run: npm run build" -ForegroundColor White
Write-Host "4. Test locally" -ForegroundColor White
Write-Host "5. Deploy to Hetzner" -ForegroundColor White
```

**Run it:**
```powershell
cd C:\Users\dirkl\ideal-car
.\cleanup.ps1
```

---

## 🔄 What Happens When You Deploy Fresh

**On Hetzner server:**

1. **Upload clean code** (after running cleanup)
2. **JSON files are empty** - no test data
3. **Add your first real car** via admin
4. **Site goes live** with only real inventory

**No database migrations, no schema issues, no complexity!**

---

## ⚠️ Important Notes

### Site Settings:
Your `site.json` has real data:
```json
{
  "siteName": "IdealCar",
  "tagline": "we sell cars",
  "contact": {
    "phone": "072 324 8098",
    "email": "info@idealbiz.co.za",
    "address": "71 Ironwood Street, Wonderboom, Pretoria, 0182",
    "businessName": "IdealBiz Pty Ltd"
  }
}
```

**Verify this is correct before deploying!**

### Uploads Folder:
Currently has test images:
- 1768228851616-0.jpeg (GWM test)
- 1768212468758.jpeg (site logo)
- hero images

**Decision:**
- Keep logo and hero images if they're real
- Delete test car images
- Or clear everything and re-upload

---

## 🎯 Recommended Approach

**Before deploying to Hetzner:**

1. **Run cleanup script** (backs up + clears data)
2. **Verify site.json** contact info is correct
3. **Keep logo/hero** if they're production-ready
4. **Change admin password** in code
5. **Build and test** locally
6. **Deploy to Hetzner** with clean data
7. **Add first real car** via admin on production

**Result:** Clean, professional site with no test data!

---

## 📞 Questions to Answer Before Launch

- [ ] Is site.json contact info correct?
- [ ] Is current logo production-ready?
- [ ] Are hero images production-ready?
- [ ] Do you have real cars to add immediately?
- [ ] Is admin password changed from default?
- [ ] Are blog posts real or placeholders?

---

**Want me to create the cleanup script for you?** Just say the word and I'll make it ready to run! 🚀
