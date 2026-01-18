#!/bin/bash
# IdealCar SEO Fixes Deployment Script
# Run this on your server to deploy the latest changes

echo "🚀 Deploying IdealCar SEO Fixes..."

# Navigate to your repo (adjust path if needed)
cd /home/ubuntu/ideal-car || cd /root/ideal-car || { echo "Could not find ideal-car folder"; exit 1; }

echo "📥 Pulling latest code from GitHub..."
git pull origin main

echo "📦 Installing dependencies..."
cd frontend
npm ci --production

echo "🔨 Building Next.js app..."
npm run build

echo "🔄 Restarting PM2..."
pm2 restart idealcar || pm2 start npm --name "idealcar" -- start

echo "✅ Deployment complete!"
echo "Waiting for app to start..."
sleep 3

echo "🔍 Checking app status..."
pm2 status

echo ""
echo "✨ SEO fixes deployed! Your site will now:"
echo "   ✓ Block webmail login pages (robots.txt)"
echo "   ✓ Include canonical tags on all pages"
echo "   ✓ Fix duplicate indexing issues"
echo ""
echo "📊 Next: Re-submit sitemap in Google Search Console"
