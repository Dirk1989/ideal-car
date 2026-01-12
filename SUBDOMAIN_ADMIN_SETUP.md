# Admin Subdomain Setup Guide

## 🎯 Goal
Move admin panel to `admin.idealcar.co.za` and block public access to `/admin` on main site.

## 🔒 Security Benefits
- ✅ Admin panel hidden from public (can't find at yoursite.com/admin)
- ✅ Separate subdomain harder to discover
- ✅ Can add extra security (IP whitelist, different password, etc.)
- ✅ Professional setup

---

## Setup Steps

### Step 1: Configure DNS (Afrihost) - 5 minutes

**Login to Afrihost DNS Management:**

Add these DNS records:

```
Type: A
Name: admin
Value: YOUR_HETZNER_SERVER_IP
TTL: 3600

Type: A  
Name: www
Value: YOUR_HETZNER_SERVER_IP
TTL: 3600

Type: A
Name: @ (root)
Value: YOUR_HETZNER_SERVER_IP
TTL: 3600
```

**Wait 10-30 minutes for DNS propagation.**

---

### Step 2: Update Nginx Configuration (10 minutes)

**SSH into your Hetzner server:**
```bash
ssh root@YOUR_SERVER_IP
```

**Create new Nginx config:**
```bash
nano /etc/nginx/sites-available/idealcar
```

**Replace entire file with this:**

```nginx
# Main website - Block /admin access
server {
    listen 80;
    server_name idealcar.co.za www.idealcar.co.za;

    # Block direct access to /admin on main domain
    location /admin {
        return 404;  # Or return 403 for forbidden
    }

    # Allow all other pages
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
        
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    client_max_body_size 50M;
}

# Admin subdomain - Only allow /admin
server {
    listen 80;
    server_name admin.idealcar.co.za;

    # Optional: Restrict to specific IPs (your office/home)
    # allow 102.xxx.xxx.xxx;  # Your IP address
    # deny all;

    location / {
        # Redirect root to /admin
        return 301 /admin;
    }

    location /admin {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Allow API routes (needed by admin)
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Allow static files (images, CSS, JS)
    location /_next {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    location /uploads {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    client_max_body_size 50M;
}
```

**Save and exit:**
- Press `Ctrl + X`
- Press `Y`
- Press `Enter`

**Test and reload Nginx:**
```bash
# Test configuration
nginx -t

# Should see: "configuration file test is successful"

# Reload Nginx
systemctl reload nginx
```

---

### Step 3: Test Setup (5 minutes)

**Test main site (should work):**
```
http://idealcar.co.za
http://www.idealcar.co.za
```

**Test blocked admin (should show 404):**
```
http://idealcar.co.za/admin  ← Should be blocked!
```

**Test admin subdomain (should work):**
```
http://admin.idealcar.co.za  ← Should show admin panel!
```

---

### Step 4: Add SSL Certificates (5 minutes)

**Install SSL for both main and admin subdomains:**

```bash
# Install certbot if not already installed
apt install -y certbot python3-certbot-nginx

# Get certificates for all domains
certbot --nginx -d idealcar.co.za -d www.idealcar.co.za -d admin.idealcar.co.za
```

**Follow prompts:**
- Enter email
- Agree to terms
- Choose option 2 (redirect HTTP to HTTPS)

**Done!** Now you have:
- `https://idealcar.co.za` (main site, admin blocked)
- `https://admin.idealcar.co.za` (admin panel only)

---

## 🔒 Additional Security Options

### Option A: IP Whitelist (Recommended)

**Restrict admin to only your IP address:**

Find your IP:
```bash
# On your Windows machine
curl https://api.ipify.org
# Example output: 102.xxx.xxx.xxx
```

**Update Nginx admin server block:**
```nginx
server {
    listen 80;
    server_name admin.idealcar.co.za;

    # Only allow your IP
    allow 102.xxx.xxx.xxx;  # Your home/office IP
    allow 41.xxx.xxx.xxx;   # Another trusted IP
    deny all;

    # ... rest of config
}
```

**Reload Nginx:**
```bash
systemctl reload nginx
```

Now **only your IP can access** admin.idealcar.co.za!

### Option B: HTTP Basic Auth (Extra Layer)

**Create password file:**
```bash
apt install -y apache2-utils
htpasswd -c /etc/nginx/.htpasswd admin
# Enter password when prompted
```

**Add to Nginx admin server block:**
```nginx
server {
    listen 80;
    server_name admin.idealcar.co.za;

    # Add basic auth
    auth_basic "Admin Area";
    auth_basic_user_file /etc/nginx/.htpasswd;

    # ... rest of config
}
```

**Reload Nginx:**
```bash
systemctl reload nginx
```

Now there's **double password protection**:
1. Nginx basic auth (browser popup)
2. Your app password (login screen)

### Option C: VPN Only Access (Most Secure)

**For serious security:**
- Set up WireGuard VPN on Hetzner
- Only allow admin access from VPN
- Completely invisible to public internet

(This is advanced - only if you need maximum security)

---

## 📱 Accessing Admin

**From anywhere:**
```
https://admin.idealcar.co.za
```

**What happens:**
1. DNS routes to your server
2. Nginx checks it's admin subdomain
3. Serves /admin page
4. You login with password
5. Full admin access

**Main site:**
```
https://idealcar.co.za/admin  ← BLOCKED (404 error)
```

Public visitors can't even find admin panel!

---

## 🔄 Update Workflow

**Adding/editing cars:**
1. Go to `https://admin.idealcar.co.za`
2. Login
3. Add/edit cars
4. Changes instantly live on main site

**No FTP uploads, no rebuilds, instant updates!**

---

## 🧪 Testing Checklist

After setup, test these:

- [ ] Main site loads: `https://idealcar.co.za`
- [ ] WWW redirect works: `https://www.idealcar.co.za`
- [ ] Admin blocked on main: `https://idealcar.co.za/admin` → 404
- [ ] Admin subdomain works: `https://admin.idealcar.co.za` → Login screen
- [ ] Can login to admin
- [ ] Can add/edit cars in admin
- [ ] Changes appear on main site
- [ ] SSL certificate valid (green padlock)
- [ ] Images upload correctly
- [ ] API routes work

---

## 🚨 Troubleshooting

### "admin.idealcar.co.za" not loading:

**Check DNS propagation:**
```bash
# On your Windows machine
nslookup admin.idealcar.co.za
# Should show your server IP
```

If not resolved yet, wait 30 more minutes.

### Still seeing admin on main site:

**Check Nginx config:**
```bash
nginx -t
cat /etc/nginx/sites-enabled/idealcar
# Make sure the "return 404" is in the main server block
```

### SSL certificate errors:

**Check certificate includes subdomain:**
```bash
certbot certificates
# Should list: idealcar.co.za, www.idealcar.co.za, admin.idealcar.co.za
```

If missing admin subdomain:
```bash
certbot --nginx -d admin.idealcar.co.za
```

### Can't access admin at all:

**Check if IP whitelisting is blocking you:**
```bash
nano /etc/nginx/sites-available/idealcar
# Comment out or remove "allow/deny" lines temporarily
systemctl reload nginx
```

---

## 📋 Summary

**What you achieved:**
- ✅ Admin hidden from public (404 on main domain)
- ✅ Admin accessible at `admin.idealcar.co.za`
- ✅ Same server, same app, just routing magic
- ✅ SSL on both domains
- ✅ Professional setup

**Security layers:**
1. Hidden subdomain (hard to find)
2. Password protection (login screen)
3. Optional IP whitelist (your IP only)
4. Optional basic auth (double password)
5. HTTPS encryption

**Access:**
- Public: `https://idealcar.co.za`
- Admin: `https://admin.idealcar.co.za`

---

## 🎯 Quick Setup Summary

```bash
# 1. Add DNS record for admin.idealcar.co.za (Afrihost)
# 2. SSH into server
ssh root@YOUR_SERVER_IP

# 3. Update Nginx config
nano /etc/nginx/sites-available/idealcar
# (paste the config from Step 2 above)

# 4. Test and reload
nginx -t
systemctl reload nginx

# 5. Add SSL
certbot --nginx -d idealcar.co.za -d www.idealcar.co.za -d admin.idealcar.co.za

# Done!
```

**Time: 20 minutes total**

---

## 💡 Pro Tips

**Bookmark admin URL:**
Save `https://admin.idealcar.co.za` in your browser favorites.

**Mobile access:**
Works on phone too - manage cars from anywhere!

**Team access:**
Give team members the admin subdomain URL + password.

**Extra security:**
Add IP whitelist if you always work from same location.

**Monitoring:**
Watch Nginx logs to see if anyone tries to access /admin on main domain:
```bash
tail -f /var/log/nginx/access.log | grep admin
```

---

**Ready to set this up?** It's just updating Nginx config and adding one DNS record! 🚀
