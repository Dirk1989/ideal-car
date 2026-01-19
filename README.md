# IdealCar - Car Marketplace Platform

**Premier car listing and vehicle inspection platform for Gauteng, South Africa**

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)](https://tailwindcss.com/)

## 🚀 Features

### For Buyers
- **Browse Vehicles**: Search and filter thousands of car listings
- **Gauteng Focused**: Specialized listings for Johannesburg, Pretoria, and surrounding areas
- **Vehicle Inspections**: Professional pre-purchase inspection services
- **Detailed Information**: Comprehensive vehicle details, photos, and seller contact info
- **Mobile Optimized**: Perfect single-column layout on mobile, grid on desktop

### For Sellers
- **List Your Car**: Easy-to-use car listing interface with form pre-population for editing
- **Lead Management**: Receive inquiries directly from interested buyers
- **Fast Sales**: Quick quote system for urgent sellers
- **Free Listings**: No upfront costs to list your vehicle
- **Photo Upload**: Upload up to 10 photos per vehicle (auto-compressed from 5MB+ to ~300-500KB)
- **SEO Auto-Naming**: Photos automatically named with vehicle details (e.g., `2005-volkswagen-golf-0.jpg`)

### Platform Features
- **Admin Dashboard**: Complete management system for listings, blogs, and leads with success notifications
- **Blog System**: SEO-optimized blog for automotive content
- **Responsive Design**: Mobile-first, works perfectly on all devices
- **Performance Optimized**: Fast loading times and excellent Core Web Vitals
- **SEO Ready**: Comprehensive meta tags, structured data, and sitemaps
- **Smart Image Handling**: Auto-migration of old listings, progressive JPEG compression, EXIF auto-rotation

## 📋 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Analytics**: Google Analytics 4
- **Deployment**: Vercel (recommended) or any Node.js hosting

## 🛠️ Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ideal-car.git
cd ideal-car/frontend
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SITE_URL=https://idealcar.co.za
NEXT_PUBLIC_PHONE=+27 11 234 5678
NEXT_PUBLIC_EMAIL=info@idealcar.co.za
```

4. **Run development server**
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
frontend/
├── app/                      # Next.js app directory
│   ├── about/               # About page
│   ├── admin/               # Admin dashboard
│   │   └── login/          # Admin login
│   ├── api/                # API routes
│   │   ├── blogs/
│   │   ├── leads/
│   │   ├── site/
│   │   └── vehicles/
│   ├── blog/               # Blog listing & detail pages
│   ├── contact/            # Contact page
│   ├── other-services/     # Inspection services
│   ├── privacy/            # Privacy policy
│   ├── sell-car/           # Sell car form
│   ├── terms/              # Terms of service
│   ├── vehicles/           # Vehicle browsing
│   ├── layout.tsx          # Root layout with SEO
│   └── page.tsx            # Homepage
├── components/             # Reusable components
│   ├── home/              # Homepage sections
│   ├── Analytics.tsx      # Analytics tracking
│   ├── BlogCard.tsx
│   ├── CarCard.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── SearchFilter.tsx
│   └── WhatsAppButton.tsx
├── data/                   # JSON data files
│   ├── blogs.json
│   ├── leads.json
│   ├── site.json
│   └── vehicles.json
├── lib/                    # Utility functions
│   └── analytics.ts       # Analytics helpers
├── public/                 # Static assets
│   ├── robots.txt
│   ├── sitemap.xml
│   └── manifest.json
└── next.config.js         # Next.js configuration
```

## 🎨 Key Pages

- `/` - Homepage with hero, featured cars, and blog
- `/vehicles` - Browse all vehicles with filters
- `/sell-car` - Sell your car form
- `/other-services` - Vehicle inspection services
- `/blog` - Blog listing
- `/blog/[id]` - Individual blog posts
- `/about` - About IdealCar
- `/contact` - Contact form
- `/admin` - Admin dashboard
- `/admin/login` - Admin login

## 🔐 Admin Access

**Development Credentials:**
- Username: `admin`
- Password: `admin123`

**Important:** Change these credentials in production!

## 📊 SEO Features

✅ **Metadata**: Comprehensive meta tags on all pages  
✅ **Open Graph**: Social media sharing optimization  
✅ **Structured Data**: JSON-LD schema for search engines  
✅ **Sitemap**: XML sitemap for search engine crawling  
✅ **Robots.txt**: Proper crawler directives  
✅ **Analytics**: Google Analytics 4 integration  
✅ **Performance**: Optimized images and code splitting  
✅ **Accessibility**: ARIA labels and semantic HTML  

## 🚀 Deployment

### Current Production Setup

**Live at:** https://idealcar.co.za

**Server:** Hetzner Cloud (116.203.229.47)  
**Process Manager:** PM2  
**Reverse Proxy:** Nginx (SSL with Let's Encrypt)  
**Max Upload:** 100MB (client-side 20MB limit for safety)  

### Deployment Steps

1. **SSH to server**
```bash
ssh root@116.203.229.47
```

2. **Pull latest code**
```bash
cd /var/www/idealcar
git pull origin main
```

3. **Build frontend**
```bash
cd frontend
npm run build
```

4. **Restart PM2**
```bash
pm2 restart idealcar
```

### Nginx Configuration

Key settings in `/etc/nginx/sites-enabled/idealcar`:
- `client_max_body_size 100M` - Allows large uploads through proxy
- `proxy_buffer_size 128k` - Handles large request bodies
- `proxy_set_header Origin $scheme://$host` - Required for Next.js Server Actions
- SSL certificates: Let's Encrypt (auto-renewal via certbot)

### Vercel (Alternative)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID | No |
| `NEXT_PUBLIC_SITE_URL` | Your site URL | Yes |
| `NEXT_PUBLIC_PHONE` | Contact phone | Yes |
| `NEXT_PUBLIC_EMAIL` | Contact email | Yes |
| `NEXT_PUBLIC_WHATSAPP` | WhatsApp number | No |

## ✨ Recent Updates (January 2026)

### Image Processing
- ✅ Aggressive JPEG compression (quality: 65, max: 1600x900, progressive)
- ✅ EXIF auto-rotation for proper image orientation
- ✅ SEO-friendly filenames: `{year}-{make}-{model}-{index}.jpg`
- ✅ Auto-migration for old listings (restores photos from single `image` field)
- ✅ File size reduction: 5MB+ → ~300-500KB per image

### Admin Features
- ✅ Form field pre-population when editing vehicles
- ✅ Success toast notifications on create/update/delete
- ✅ Support for up to 10 images per vehicle
- ✅ 20MB frontend upload limit (auto-compressed on server)

### Mobile Optimization
- ✅ Single-column layout on mobile (photos, specs, features, contact)
- ✅ Responsive grid on desktop (2-3 columns)
- ✅ Text truncation on car cards (transmission, fuel, mileage)
- ✅ Touch-friendly modal dialogs

### Infrastructure
- ✅ Nginx proxy buffer optimization for large uploads
- ✅ Origin header forwarding (fixes Server Actions)
- ✅ 100MB client_max_body_size for flex
- ✅ PM2 process management with auto-restart

## 🔧 Configuration

### Google Analytics
1. Create GA4 property at [analytics.google.com](https://analytics.google.com)
2. Copy your Measurement ID (G-XXXXXXXXXX)
3. Add to `.env.local`

### Google Search Console
1. Verify ownership at [search.google.com/search-console](https://search.google.com/search-console)
2. Add verification code to `app/layout.tsx`
3. Submit sitemap: `https://yoursite.com/sitemap.xml`

## 📱 Progressive Web App

The site includes PWA support with:
- Manifest file
- Offline capability (with service worker)
- Install prompts
- App icons

## 🎯 Performance

- **Lighthouse Score**: 90+ across all metrics
- **Core Web Vitals**: Optimized for Google ranking
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic route-based splitting
- **Compression**: Gzip/Brotli enabled

## 📞 Support

For questions or issues:
- Email: info@idealcar.co.za
- Phone: +27 11 234 5678

## 📄 License

Copyright © 2026 IdealCar. All rights reserved.

## 🙏 Credits

Developed by **idealbiz**

---

**Ready to launch!** 🚗💨
