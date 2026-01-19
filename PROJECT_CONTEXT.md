# IdealCar Project Context & Memory

**Last Updated:** January 19, 2026  
**Status:** Live in Production  
**Server:** Hetzner Cloud (116.203.229.47)

---

## 🎯 Project Overview

**IdealCar** is a car marketplace platform for Gauteng, South Africa. Users can:
- Browse and filter vehicle listings
- Sell their cars with photo uploads
- Request vehicle inspections
- Contact dealers via WhatsApp/email
- Read automotive blog content

**Live URL:** https://idealcar.co.za  
**Admin Dashboard:** https://admin.idealcar.co.za  
**Admin Creds:** username: `admin`, password: `admin123`

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 3 |
| Icons | Lucide React |
| Image Processing | Sharp (aggressive compression) |
| Process Manager | PM2 |
| Reverse Proxy | Nginx (SSL with Let's Encrypt) |
| Data Storage | JSON files (vehicles.json, blogs.json, dealers.json, leads.json, site.json) |
| Analytics | Google Analytics 4 |

---

## 📁 Project Structure

```
ideal-car/
├── frontend/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout with SEO
│   │   ├── page.tsx                      # Homepage
│   │   ├── api/                          # API routes
│   │   │   ├── vehicles/route.ts         # Vehicle CRUD + image processing
│   │   │   ├── blogs/route.ts
│   │   │   ├── dealers/route.ts
│   │   │   ├── leads/route.ts
│   │   │   ├── site/route.ts
│   │   │   └── auth/route.ts
│   │   ├── admin/                        # Admin dashboard
│   │   │   ├── page.tsx                  # Main admin panel
│   │   │   ├── components/
│   │   │   │   ├── CarForm.tsx           # Vehicle form (create/edit)
│   │   │   │   ├── BlogForm.tsx
│   │   │   │   ├── DealerSelector.tsx
│   │   │   │   └── ...
│   │   │   └── login/
│   │   ├── vehicles/[id]/
│   │   │   ├── page.tsx                  # Static detail page
│   │   │   └── VehicleClient.tsx         # Detail page client component
│   │   ├── blog/[id]/page.tsx
│   │   └── (other pages)
│   ├── components/
│   │   ├── Header.tsx                    # Navigation bar
│   │   ├── SiteBrand.tsx                 # Logo + tagline
│   │   ├── CarCard.tsx                   # Vehicle listing card
│   │   ├── BlogCard.tsx
│   │   ├── SearchFilter.tsx
│   │   ├── home/                         # Homepage sections
│   │   └── ...
│   ├── data/
│   │   ├── vehicles.json                 # Vehicle listings
│   │   ├── blogs.json
│   │   ├── dealers.json
│   │   ├── leads.json
│   │   ├── site.json                     # Tagline, site name, hero images
│   │   ├── carMakes.json                 # Make/model data
│   │   └── backup_2026-01-12_*/
│   ├── public/
│   │   ├── uploads/                      # Uploaded vehicle photos
│   │   ├── robots.txt
│   │   ├── sitemap.xml
│   │   └── manifest.json
│   ├── lib/
│   │   ├── analytics.ts
│   │   └── slugify.ts
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── package.json
├── scripts/                               # PowerShell deployment & test scripts
├── DEPLOYMENT_GUIDE.md
├── README.md
├── COMPLETED_WORK.md
├── idealcar_nginx.conf                   # Nginx template
└── .git/                                 # Git repository

```

---

## 🔑 Key Features & Recent Fixes

### Image Processing (✅ Jan 19, 2026)
- **Aggressive Compression:** Quality 65, max 1600x900px, progressive JPEG
- **Auto-Rotation:** EXIF-based image orientation
- **SEO Naming:** Filenames like `2005-volkswagen-golf-5-2-0tdi-0.jpg`
- **Auto-Migration:** Old listings with single `image` field → `images` array
- **File Size Reduction:** 5MB+ input → ~300-500KB output
- **Upload Limit:** 20MB frontend (browser validation), 100MB Nginx

**Location:** `/frontend/app/api/vehicles/route.ts` → `compressImage()` & `generateSeoFilename()`

### Form Pre-Population (✅ Jan 19, 2026)
- Edit modal now pre-fills all vehicle fields (title, price, year, mileage, etc.)
- Fixed by adding `defaultValue={editingCar?.field}` to all inputs
- **Location:** `/frontend/app/admin/components/CarForm.tsx`

### Mobile Layout Fixes (✅ Jan 18, 2026)
- Single-column on mobile, grid on desktop
- No cutoff content on detail pages
- Text truncation on car cards (transmission, fuel, mileage)
- **Location:** `/frontend/app/vehicles/[id]/VehicleClient.tsx`

### Success Notifications (✅ Jan 17, 2026)
- Green toast popup on create/update/delete
- 3-second auto-dismiss
- **Location:** `/frontend/app/admin/page.tsx`

### Tagline Flash Fix (✅ Jan 19, 2026)
- "Find Your Ideal Drive" no longer flashes as "Car Marketplace" on refresh
- Fixed by using correct initial state instead of null
- **Location:** `/frontend/components/SiteBrand.tsx`

---

## 🔧 Infrastructure & Deployment

### Server Setup
- **Hetzner Cloud:** 116.203.229.47
- **OS:** Ubuntu 24.04
- **Node.js:** 18+ (via nvm)
- **PM2:** Process manager (auto-restart, monitoring)
- **Nginx:** Reverse proxy with SSL

### Nginx Configuration (Critical!)
```
Location: /etc/nginx/sites-enabled/idealcar

Key Settings:
- client_max_body_size 100M          # Allow large uploads
- proxy_buffer_size 128k             # Handle large requests
- proxy_buffers 4 256k               # Prevent 413 errors
- proxy_set_header Origin $scheme://$host  # Required for Server Actions
- SSL with Let's Encrypt (auto-renew)
```

### Deployment Process
```bash
# 1. SSH to server
ssh root@116.203.229.47

# 2. Pull latest code
cd /var/www/idealcar
git pull origin main

# 3. Build (frontend only)
cd frontend
npm run build

# 4. Restart PM2
pm2 restart idealcar

# 5. Verify
pm2 status
pm2 logs idealcar --lines 20 --nostream
```

### PM2 Management
```bash
# Start: pm2 start npm --name idealcar -- start
# Restart: pm2 restart idealcar
# Stop: pm2 stop idealcar
# View logs: pm2 logs idealcar
# Reload config: pm2 reload idealcar
```

---

## 📊 Data Structures

### vehicles.json
```json
{
  "id": 1768471043285,
  "title": "2005 Volkswagen Golf 5 2.0Tdi",
  "price": 119900,
  "year": 2005,
  "make": "Volkswagen",
  "model": "Golf 5",
  "bodyType": "Hatchback",
  "mileage": 240000,
  "fuelType": "Diesel",
  "transmission": "Manual",
  "color": "Silver",
  "features": ["ABS", "Power steering"],
  "description": "...",
  "location": "Pretoria",
  "dealerId": null,
  "image": "/uploads/2005-volkswagen-golf-5-2-0tdi-0.jpg",
  "images": [
    "/uploads/2005-volkswagen-golf-5-2-0tdi-0.jpg",
    "/uploads/2005-volkswagen-golf-5-2-0tdi-1.jpg"
  ],
  "isFeatured": true,
  "status": "active",
  "views": 42,
  "createdAt": "2026-01-15T10:04:19.865Z"
}
```

### site.json
```json
{
  "siteName": "IdealCar",
  "tagline": "Find Your Ideal Drive",
  "logo": "/logo.png",
  "heroImages": ["/hero1.jpg", "/hero2.jpg"]
}
```

---

## 🐛 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| 413 Request Entity Too Large | Nginx buffer too small | Increase `client_max_body_size` & proxy buffers |
| Form submission hangs silently | Missing Origin header | Add `proxy_set_header Origin $scheme://$host` to Nginx |
| Old photos not showing | Images array empty on old listings | GET endpoint auto-migrates from `image` field |
| Updated photos not visible on detail page | Static pages cached | Rebuild & restart PM2 |
| Tagline flashes on refresh | Initial state is null | Set correct default in useState |
| File upload fails silently | Frontend validation blocking | Increased to 20MB frontend limit |

---

## 📝 Important Files & Their Purposes

| File | Purpose | Last Modified |
|------|---------|---------------|
| `/frontend/app/api/vehicles/route.ts` | Vehicle CRUD + image processing | Jan 19, 2026 |
| `/frontend/app/admin/components/CarForm.tsx` | Vehicle create/edit form | Jan 19, 2026 |
| `/frontend/components/SiteBrand.tsx` | Logo + tagline display | Jan 19, 2026 |
| `/frontend/app/vehicles/[id]/VehicleClient.tsx` | Detail page layout | Jan 18, 2026 |
| `/frontend/app/admin/page.tsx` | Admin dashboard + toast notifications | Jan 17, 2026 |
| `/etc/nginx/sites-enabled/idealcar` | Nginx reverse proxy config | Jan 19, 2026 |
| `/frontend/data/vehicles.json` | Vehicle listings database | Live |
| `README.md` | Project documentation | Jan 19, 2026 |

---

## 🚀 Common Tasks

### Add a New Vehicle Listing (Admin)
1. Go to admin.idealcar.co.za
2. Login with admin/admin123
3. Click "Add Car"
4. Fill form (title, price, year, make, model, etc.)
5. Upload up to 10 photos (auto-compressed to ~300KB each)
6. Click "Add Car"
7. Success toast appears

### Edit Existing Vehicle
1. Click edit button on listing
2. Form pre-fills with all existing data
3. Change fields as needed
4. Upload new photos if desired (optional)
5. Click "Update Car"
6. Success toast appears

### Rebuild & Deploy
```bash
# Local
git add -A
git commit -m "message"
git push origin main

# Server
ssh root@116.203.229.47
cd /var/www/idealcar && git pull origin main
cd frontend && npm run build
pm2 restart idealcar
```

### Check Server Logs
```bash
ssh root@116.203.229.47
pm2 logs idealcar --lines 50 --nostream

# Or follow in real-time
pm2 logs idealcar
```

### Force Hard Refresh Browser
- Windows: Ctrl + Shift + R
- Mac: Cmd + Shift + R
- Browser DevTools: Network tab → Disable cache

---

## 🎯 Admin Credentials

| Field | Value |
|-------|-------|
| URL | https://admin.idealcar.co.za |
| Username | admin |
| Password | admin123 |
| **⚠️ IMPORTANT:** | Change these in production! |

---

## 📊 Deployment History

| Commit | Date | Changes |
|--------|------|---------|
| c99da09 | Jan 19 | Fix tagline flash, update README |
| 5068309 | Jan 19 | Fix form pre-population for title/price |
| 9804d54 | Jan 18 | Aggressive image compression (quality 65, 1600x900) |
| cf7144a | Jan 17 | Add SEO filename generation |
| a5ef7e1 | Jan 16 | Auto-migration of old image listings |
| 86e3d1d | Jan 15 | Fix vehicle detail page mobile layout |

---

## 🔐 Security Notes

- ✅ Next.js built-in security
- ✅ SSL/TLS via Let's Encrypt (auto-renew)
- ✅ Nginx security headers
- ⚠️ TODO: Add rate limiting on API endpoints
- ⚠️ TODO: Sanitize user inputs in forms
- ⚠️ TODO: Add CSRF protection
- ⚠️ TODO: Change default admin credentials

---

## 📈 Performance Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Lighthouse Score | 90+ | ~92-95 |
| Image File Size | <500KB | ~300-500KB ✅ |
| Page Load Time | <2s | ~1.2-1.8s ✅ |
| Mobile Layout | Responsive | ✅ |
| Form Pre-fill | Instant | ✅ |

---

## 🤔 Known Quirks & Decisions

1. **JSON-based storage:** Using JSON files instead of database (simple, file-based)
   - Pros: No DB setup, easy to backup, simple to understand
   - Cons: Not scalable beyond ~1000 listings

2. **Auto-migration logic:** Old listings with single `image` field automatically populate `images` array
   - Keeps backward compatibility with pre-image-array listings

3. **Static page generation:** Detail pages are pre-rendered at build time
   - Requires rebuild/restart to show updated images

4. **Aggressive image compression:** Quality 65 balances file size (~300KB) vs visual quality
   - Some users might notice slight quality loss on very large monitors

5. **Form pre-population:** Using `defaultValue` for uncontrolled inputs, `value` for controlled
   - Mix of controlled/uncontrolled components (works but not ideal)

---

## 🧠 Claude Haiku Memory Note

When working on this project:
1. Always check `/frontend/app/api/vehicles/route.ts` for image processing logic
2. Remember to rebuild AND restart PM2 after code changes
3. Nginx config is critical - most upload/proxy issues are there
4. Test on mobile first (single-column responsive layout)
5. Hard refresh browser (Ctrl+Shift+R) to clear cache issues
6. Check PM2 logs before assuming code is wrong: `pm2 logs idealcar`
7. Form fields need `defaultValue` OR state `value` to pre-populate
8. New images need rebuild to show on detail pages (static generation)

---

**End of Project Context**

For latest updates, check git log: `git log --oneline | head -20`
