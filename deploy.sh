#!/bin/bash
# IdealCar Production Deployment Script
# Deploy latest changes to live server

set -e

echo "🚀 IdealCar Production Deployment"
echo "=================================="
echo ""
echo "📍 Deploying to: 116.203.229.47"
echo "📦 Deploying from: main branch"
echo ""

# Navigate to deployment directory
cd /var/www/idealcar
echo "📂 Current directory: $(pwd)"
echo ""

# Pull latest code
echo "📥 Pulling latest code from GitHub..."
git pull origin main
echo "✅ Code pulled successfully"
echo ""

# Navigate to frontend
cd frontend
echo "📂 Frontend directory: $(pwd)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production
echo "✅ Dependencies installed"
echo ""

# Build Next.js app
echo "🔨 Building Next.js application..."
npm run build
echo "✅ Build completed successfully"
echo ""

# Restart PM2
echo "🔄 Restarting application with PM2..."
pm2 restart idealcar 2>/dev/null || pm2 start npm --name "idealcar" -- start
sleep 2
echo "✅ Application restarted"
echo ""

# Show status
echo "📊 Application Status:"
pm2 status
echo ""

# Show logs (last 20 lines)
echo "📋 Recent logs:"
pm2 logs idealcar --lines 20 --nostream || echo "Logs not available yet"
echo ""

echo "✅ Deployment complete!"
echo ""
echo "🌐 Visit: https://idealcar.co.za"
