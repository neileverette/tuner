# Server Setup Commands - Step by Step

Replace `YOUR_ACTUAL_IP` with your real server IP address throughout these commands.

---

## Step 1: Add DNS Record (Do This First!)

**Go to your DNS provider** (where you manage tunr-music.com):

1. Add a new A record:
   - **Type**: A
   - **Name**: `testing` (or `testing.tunr-music.com` depending on your provider)
   - **Value**: `YOUR_ACTUAL_IP`
   - **TTL**: 300 (5 minutes)

2. Wait 2-5 minutes for DNS to propagate

3. Test it works:
```bash
# Run this on your local machine
ping testing.tunr-music.com
# Should show YOUR_ACTUAL_IP
```

---

## Step 2: Configure Nginx on Your Server

### SSH to your server:
```bash
ssh root@YOUR_ACTUAL_IP
```

### Check your current Nginx config:
```bash
cat /etc/nginx/sites-available/tuner
```

### Edit the Nginx config:
```bash
sudo nano /etc/nginx/sites-available/tuner
```

### Add this staging server block (paste at the end of the file):
```nginx
# Staging environment
server {
    listen 80;
    listen [::]:80;
    server_name testing.tunr-music.com;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Save and exit:
- Press `Ctrl + X`
- Press `Y` to confirm
- Press `Enter` to save

### Test Nginx configuration:
```bash
sudo nginx -t
```
Should say: "syntax is ok" and "test is successful"

### Reload Nginx:
```bash
sudo systemctl reload nginx
```

### Verify Nginx is running:
```bash
sudo systemctl status nginx
```
Should show "active (running)"

---

## Step 3: Set Up SSL Certificate

### Install Certbot (if not already installed):
```bash
# Check if certbot is installed
certbot --version

# If not installed, install it:
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
```

### Get SSL certificate for staging domain:
```bash
sudo certbot --nginx -d testing.tunr-music.com
```

You'll be asked:
1. **Email address**: Enter your email
2. **Terms of Service**: Type `Y` to agree
3. **Share email**: Type `N` (optional)

Certbot will automatically:
- Get the certificate
- Update your Nginx config
- Set up auto-renewal

### Verify SSL is working:
```bash
# Check certificate
sudo certbot certificates

# Test renewal (dry run)
sudo certbot renew --dry-run
```

### Test in browser:
```bash
# From your local machine
curl -I https://testing.tunr-music.com
```
Should return HTTP 502 (because container isn't running yet - that's OK!)

---

## Step 4: Verify GitHub Secrets

### Go to your GitHub repository:
1. Click **Settings** tab
2. Click **Secrets and variables** → **Actions**
3. Verify these secrets exist:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `DO_HOST` (should be YOUR_ACTUAL_IP)
   - `DO_USER` (should be `root`)
   - `DO_SSH_KEY` (your private SSH key)

### If any are missing, add them:
- Click **New repository secret**
- Enter name and value
- Click **Add secret**

---

## Step 5: Test Server Setup

### Check if Docker is installed:
```bash
docker --version
```

### Check if AWS CLI is installed:
```bash
aws --version
```

### Test ECR login (replace with your actual ECR registry):
```bash
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin YOUR_ECR_REGISTRY_URL
```

### Check current containers:
```bash
docker ps -a
```

You should see your production container running on port 3000.

---

## Step 6: Deploy to Staging

### On your local machine:

```bash
# Make sure you're in the Tuner directory
cd /Users/neileverette/Desktop/Tuner

# Add all changes
git add .

# Commit
git commit -m "feat: Add fallback thumbnails and staging deployment"

# Create staging branch
git checkout -b staging

# Push to GitHub (this triggers deployment)
git push -u origin staging
```

### Watch the deployment:
1. Go to GitHub repository
2. Click **Actions** tab
3. Watch the workflow run
4. Should take 3-5 minutes

### After deployment completes:

```bash
# SSH to your server
ssh root@YOUR_ACTUAL_IP

# Check containers
docker ps

# You should see TWO containers:
# - tuner-prod (port 3000)
# - tuner-staging (port 3001)

# Check staging logs
docker logs -f tuner-staging
```

### Test staging in browser:
```
https://testing.tunr-music.com
```

You should see your app with fallback thumbnails!

---

## Step 7: Deploy to Production (After Testing)

### On your local machine:

```bash
# Switch to main branch
git checkout main

# Merge staging
git merge staging

# Push to production
git push origin main
```

This deploys to `tunr-music.com` (port 3000).

---

## Troubleshooting

### DNS not resolving:
```bash
# Check DNS propagation
nslookup testing.tunr-music.com
dig testing.tunr-music.com
```

### Nginx errors:
```bash
# Check error logs
sudo tail -f /var/log/nginx/error.log

# Check access logs
sudo tail -f /var/log/nginx/access.log
```

### Container not starting:
```bash
# Check container logs
docker logs tuner-staging

# Check if port is in use
sudo lsof -i :3001

# Restart container manually
docker restart tuner-staging
```

### SSL certificate issues:
```bash
# Check certificates
sudo certbot certificates

# Renew manually
sudo certbot renew

# Check Nginx SSL config
sudo cat /etc/nginx/sites-available/tuner | grep ssl
```

---

## Quick Reference

### View running containers:
```bash
docker ps
```

### View all containers (including stopped):
```bash
docker ps -a
```

### View container logs:
```bash
docker logs -f tuner-staging
docker logs -f tuner-prod
```

### Restart containers:
```bash
docker restart tuner-staging
docker restart tuner-prod
```

### Stop staging (to save resources):
```bash
docker stop tuner-staging
```

### Start staging again:
```bash
docker start tuner-staging
```

### Check Nginx status:
```bash
sudo systemctl status nginx
```

### Reload Nginx:
```bash
sudo nginx -t && sudo systemctl reload nginx
```

### Check disk space:
```bash
df -h
```

### Clean up old Docker images:
```bash
docker image prune -af
```

---

## Summary Checklist

- [ ] DNS A record added for testing.tunr-music.com
- [ ] DNS resolves to your server IP
- [ ] Nginx config updated with staging server block
- [ ] Nginx configuration tested and reloaded
- [ ] SSL certificate obtained for testing.tunr-music.com
- [ ] GitHub secrets verified
- [ ] Code committed and pushed to staging branch
- [ ] GitHub Actions deployment successful
- [ ] Both containers running (tuner-prod and tuner-staging)
- [ ] Staging site accessible at https://testing.tunr-music.com
- [ ] Fallback thumbnails working on staging
- [ ] Ready to merge to production

---

**Need help?** Check the logs and error messages, they usually tell you exactly what's wrong!