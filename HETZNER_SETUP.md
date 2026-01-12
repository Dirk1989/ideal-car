# Hetzner Cloud VPS - Complete Setup Guide

## 🚀 Quick Overview

**Time to deploy:** 30-45 minutes (just copy/paste commands)
**Cost:** €4.51/month (~R90)
**Result:** Admin panel works on production - edit cars live!

---

## Step 1: Create Hetzner Account (10 minutes)

1. Go to https://www.hetzner.com/cloud
2. Click "Sign Up" (top right)
3. Fill in your details
4. Verify email
5. Add payment method (credit card or PayPal)
   - They'll charge €4.51/month
   - First month might be prorated

---

## Step 2: Create Your VPS Server (5 minutes)

1. **Login to Hetzner Cloud Console**
   - Go to https://console.hetzner.cloud

2. **Create New Project**
   - Click "New Project"
   - Name it: "IdealCar"

3. **Add Server**
   - Click "Add Server"
   
4. **Select Location:**
   - Choose: **Nuremberg** (closest to South Africa with good connectivity)

5. **Select Image:**
   - Click "Ubuntu"
   - Select: **Ubuntu 22.04**

6. **Select Type:**
   - Click "Shared vCPU" tab
   - Select: **CX11** (2 vCPU, 2GB RAM, 20GB SSD)
   - Price shown: €4.51/month

7. **Networking:**
   - Keep defaults (IPv4 enabled)

8. **SSH Keys:**
   - Click "Add SSH Key" → "Create new SSH key"
   - **IMPORTANT:** Copy and save the private key they show you!
   - Name it: "idealcar-key"
   - OR skip this and use password (easier for beginners)

9. **Name Your Server:**
   - Name: "idealcar-prod"

10. **Click "Create & Buy Now"**

11. **Wait 30 seconds** - server will be created

12. **Copy the IP address** that appears (example: 157.90.123.45)

---

## Step 3: Connect to Your Server (2 minutes)

### Option A: Using Password (Easier)

Hetzner will email you the root password.

**On Windows (PowerShell):**
```powershell
ssh root@YOUR_SERVER_IP
# Type 'yes' when asked about fingerprint
# Paste password from email
```

**First login will ask you to change password:**
- Enter old password (from email)
- Enter new password (save this!)
- Confirm new password

### Option B: Using SSH Key

If you created SSH key:
```powershell
ssh -i path\to\private-key root@YOUR_SERVER_IP
```

---

## Step 4: Automated Server Setup (15 minutes)

Once connected via SSH, copy/paste this entire script:

```bash
#!/bin/bash
echo "🚀 Starting IdealCar VPS Setup..."

# Update system
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install Node.js 18.x
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install PM2 (process manager)
echo "📦 Installing PM2..."
npm install -g pm2

# Install Nginx (web server)
echo "📦 Installing Nginx..."
apt install -y nginx

# Install Git
echo "📦 Installing Git..."
apt install -y git

# Configure firewall
echo "🔒 Configuring firewall..."
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw --force enable

# Create app directory
echo "📁 Creating app directory..."
mkdir -p /var/www/idealcar
cd /var/www/idealcar

echo "✅ Server setup complete!"
echo ""
echo "Next steps:"
echo "1. Upload your code to /var/www/idealcar"
echo "2. Install dependencies and build"
echo "3. Configure Nginx"
echo ""
```

**Copy this entire script, paste in SSH terminal, and press Enter.**

Wait for it to complete (5-10 minutes).

---

## Step 5: Upload Your Code (5 minutes)

### Option A: Using Git (Recommended)

**If your code is on GitHub:**

```bash
cd /var/www/idealcar
git clone https://github.com/YOUR_USERNAME/ideal-car.git .
cd frontend
```

### Option B: Upload from Local Machine

**On your Windows machine (new PowerShell window):**

```powershell
# Navigate to your project
cd C:\Users\dirkl\ideal-car

# Upload to server using SCP
scp -r frontend root@YOUR_SERVER_IP:/var/www/idealcar/
```

---

## Step 6: Build and Run Your App (5 minutes)

**Back in SSH terminal:**

```bash
cd /var/www/idealcar/frontend

# Install dependencies (production only)
echo "📦 Installing dependencies..."
npm ci --production

# Build the Next.js app
echo "🔨 Building app..."
npm run build

# Start with PM2
echo "🚀 Starting app..."
pm2 start npm --name "idealcar" -- start

# Configure PM2 to auto-start on server reboot
pm2 startup systemd
pm2 save

# Check if running
pm2 status
```

You should see:
```
┌────┬────────────┬─────────┬─────────┐
│ id │ name       │ status  │ restart │
├────┼────────────┼─────────┼─────────┤
│ 0  │ idealcar   │ online  │ 0       │
└────┴────────────┴─────────┴─────────┘
```

**Test it:**
```bash
curl localhost:3000
# Should see HTML output
```

---

## Step 7: Configure Nginx (10 minutes)

**Create Nginx configuration:**

```bash
# Create config file
nano /etc/nginx/sites-available/idealcar
```

**Paste this configuration:**

```nginx
server {
    listen 80;
    server_name YOUR_SERVER_IP;  # Replace with your IP or domain

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Increase timeout for large file uploads
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Increase max upload size for images
    client_max_body_size 50M;
}
```

**Save and exit:**
- Press `Ctrl + X`
- Press `Y` (yes)
- Press `Enter`

**Enable the site:**

```bash
# Create symbolic link
ln -s /etc/nginx/sites-available/idealcar /etc/nginx/sites-enabled/

# Remove default site
rm /etc/nginx/sites-enabled/default

# Test configuration
nginx -t

# Should see:
# nginx: configuration file /etc/nginx/nginx.conf test is successful

# Restart Nginx
systemctl restart nginx

# Enable Nginx to start on boot
systemctl enable nginx
```

---

## Step 8: Test Your Site (2 minutes)

**Open browser and visit:**
```
http://YOUR_SERVER_IP
```

You should see your IdealCar site!

**Test admin panel:**
```
http://YOUR_SERVER_IP/admin
```

Try uploading a car - it should work!

---

## Step 9: Point Your Domain (10 minutes)

### If you have a domain (e.g., idealcar.co.za):

1. **Login to your domain registrar** (where you bought domain)

2. **Find DNS settings** (might be called "DNS Management" or "Name Servers")

3. **Add/Edit A Record:**
   ```
   Type: A
   Name: @ (or leave blank for root domain)
   Value: YOUR_SERVER_IP
   TTL: 3600
   ```

4. **Add/Edit A Record for www:**
   ```
   Type: A
   Name: www
   Value: YOUR_SERVER_IP
   TTL: 3600
   ```

5. **Wait 5-30 minutes** for DNS to propagate

6. **Update Nginx config** with your domain:
   ```bash
   nano /etc/nginx/sites-available/idealcar
   # Change: server_name YOUR_SERVER_IP;
   # To:     server_name idealcar.co.za www.idealcar.co.za;
   
   # Save and restart
   nginx -t
   systemctl restart nginx
   ```

---

## Step 10: Add SSL Certificate (Free HTTPS) - Optional but Recommended

**Install Certbot:**
```bash
apt install -y certbot python3-certbot-nginx
```

**Get SSL certificate:**
```bash
certbot --nginx -d idealcar.co.za -d www.idealcar.co.za
```

**Follow prompts:**
- Enter your email
- Agree to terms
- Choose redirect HTTP to HTTPS (option 2)

**Done!** Your site now has https://

**Auto-renewal is enabled** - certificate renews automatically.

---

## 🎉 YOU'RE LIVE!

Your site is now running on production!

**Access your site:**
- Public site: http://YOUR_SERVER_IP (or your domain)
- Admin panel: http://YOUR_SERVER_IP/admin

**You can now:**
- ✅ Add cars from anywhere (not just your laptop)
- ✅ Edit cars directly on production
- ✅ Manage dealers, blogs, leads
- ✅ Changes appear instantly (no uploading!)

---

## 📋 Useful Commands

**SSH into server:**
```powershell
ssh root@YOUR_SERVER_IP
```

**Check if app is running:**
```bash
pm2 status
```

**View app logs:**
```bash
pm2 logs idealcar
```

**Restart app:**
```bash
pm2 restart idealcar
```

**Stop app:**
```bash
pm2 stop idealcar
```

**Update your code (if using Git):**
```bash
cd /var/www/idealcar/frontend
git pull
npm ci --production
npm run build
pm2 restart idealcar
```

**Update your code (if uploading manually):**
```powershell
# From your Windows machine
scp -r C:\Users\dirkl\ideal-car\frontend root@YOUR_SERVER_IP:/var/www/idealcar/

# Then SSH in and rebuild
ssh root@YOUR_SERVER_IP
cd /var/www/idealcar/frontend
npm ci --production
npm run build
pm2 restart idealcar
```

**Check disk space:**
```bash
df -h
```

**Check memory usage:**
```bash
free -h
```

**Check Nginx status:**
```bash
systemctl status nginx
```

---

## 🔧 Maintenance

### Monthly Tasks (10 minutes):

```bash
# SSH into server
ssh root@YOUR_SERVER_IP

# Update system packages
apt update && apt upgrade -y

# Restart if kernel was updated
reboot  # Only if system asks for reboot
```

### Weekly Backups:

**Option A: Manual backup (from your Windows machine):**
```powershell
# Backup data files
scp -r root@YOUR_SERVER_IP:/var/www/idealcar/frontend/data C:\Backups\idealcar\data-$(Get-Date -Format 'yyyy-MM-dd')

# Backup uploads
scp -r root@YOUR_SERVER_IP:/var/www/idealcar/frontend/public/uploads C:\Backups\idealcar\uploads-$(Get-Date -Format 'yyyy-MM-dd')
```

**Option B: Automated backup script:**

Create on server:
```bash
nano /root/backup.sh
```

Paste:
```bash
#!/bin/bash
BACKUP_DIR="/root/backups/$(date +%Y-%m-%d)"
mkdir -p $BACKUP_DIR
cp -r /var/www/idealcar/frontend/data $BACKUP_DIR/
cp -r /var/www/idealcar/frontend/public/uploads $BACKUP_DIR/
echo "Backup completed: $BACKUP_DIR"
```

Make executable:
```bash
chmod +x /root/backup.sh
```

Add to crontab (run weekly):
```bash
crontab -e
# Add this line:
0 2 * * 0 /root/backup.sh
```

---

## 🆘 Troubleshooting

### Site not loading:

```bash
# Check if app is running
pm2 status

# If stopped, start it
pm2 start idealcar

# Check logs for errors
pm2 logs idealcar --lines 50
```

### Nginx errors:

```bash
# Check Nginx status
systemctl status nginx

# View error logs
tail -f /var/log/nginx/error.log

# Test config
nginx -t

# Restart Nginx
systemctl restart nginx
```

### Out of disk space:

```bash
# Check space
df -h

# Clean old logs
pm2 flush

# Clean old uploads if needed
cd /var/www/idealcar/frontend/public/uploads
ls -lh
# Delete old files manually
```

### Can't upload images (413 error):

```bash
# Edit Nginx config
nano /etc/nginx/sites-available/idealcar

# Make sure this line exists:
# client_max_body_size 50M;

# Restart Nginx
systemctl restart nginx
```

---

## 💰 Cost Breakdown

**Monthly costs:**
- Hetzner CX11: €4.51 (~R90)
- Domain (if new): R150-300/year (R12-25/month)
- SSL Certificate: FREE (Let's Encrypt)

**Total: R90-115/month**

**What you get:**
- Full control server
- Admin panel works anywhere
- 2 vCPU, 2GB RAM
- 20TB bandwidth
- Can handle 100+ concurrent users

---

## 🎯 Next Steps After Deployment

1. **Test everything:**
   - Upload a test car
   - Edit a car
   - Delete a car
   - Add a dealer
   - Submit a contact form

2. **Set up monitoring:**
   - UptimeRobot (free): https://uptimerobot.com
   - Get alerts if site goes down

3. **Enable Google Analytics:**
   - Already built into your site
   - Add your GA4 measurement ID in site settings

4. **Create content:**
   - Add your car inventory
   - Write blog posts
   - Add dealer information

5. **SEO:**
   - Submit sitemap to Google Search Console
   - Your sitemap is at: yoursite.com/sitemap.xml

---

## 📞 Getting Help

**Hetzner Support:**
- Community: https://community.hetzner.com
- Docs: https://docs.hetzner.com

**Technical Issues:**
- PM2 Docs: https://pm2.keymetrics.io/docs
- Nginx Docs: https://nginx.org/en/docs
- Next.js Docs: https://nextjs.org/docs

**Need help?** Post your error in the Hetzner community - they're very responsive.

---

## ✅ Summary

**What you accomplished:**
1. ✅ Created VPS server
2. ✅ Installed Node.js, PM2, Nginx
3. ✅ Deployed your app
4. ✅ Configured web server
5. ✅ Set up auto-restart
6. ✅ (Optional) Added domain + SSL

**Result:**
Your admin panel works on production! You can now add/edit/remove cars from anywhere, anytime. Changes appear instantly. No more uploading files via FTP! 🎉

---

**Ready to start? Let me know if you need help with any step!**
