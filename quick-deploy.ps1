#!/usr/bin/env pwsh
# IdealCar SEO Fixes - Quick Deploy Script
# Run this script to deploy SEO fixes to your live server

$ServerIP = "116.203.229.47"
$ServerUser = "ubuntu"
$DeployPath = "/var/www/idealcar"
$SSHPassword = "J@nineJ@nine9560"

Write-Host "🚀 IdealCar SEO Fixes Deployment" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Commands to run on server
$DeployCommands = @"
cd $DeployPath
echo "📥 Pulling latest code..."
git pull origin main

cd frontend
echo "📦 Installing dependencies..."
npm ci --production

echo "🔨 Building Next.js app..."
npm run build

echo "🔄 Restarting PM2..."
pm2 restart idealcar || pm2 start npm --name "idealcar" -- start

sleep 3
echo ""
echo "✅ Deployment complete!"
pm2 status
"@

Write-Host "Commands to run on server:" -ForegroundColor Yellow
Write-Host $DeployCommands
Write-Host ""
Write-Host "📋 Copy the commands above and paste them in SSH terminal:" -ForegroundColor Green
Write-Host "   ssh ubuntu@$ServerIP" -ForegroundColor Cyan
Write-Host ""
Write-Host "Then paste the deployment commands." -ForegroundColor Yellow
