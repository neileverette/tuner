# Staging Environment Setup Guide

## Quick Start Checklist

### ✅ Step 1: Create Staging Droplet (15 minutes)

1. **Go to DigitalOcean Console**
   - Navigate to: https://cloud.digitalocean.com/droplets

2. **Create New Droplet**
   - Click "Create" → "Droplets"
   - **Image**: Ubuntu 22.04 LTS
   - **Plan**: Basic - $6/month (1GB RAM, 1 vCPU)
   - **Region**: Same as production (check your current droplet)
   - **Hostname**: `tuner-staging`
   - **SSH Keys**: Select your existing SSH key
   - Click "Create Droplet"

3. **Note the IP Address**
   - Copy the droplet's IP address (e.g., `164.90.xxx.xxx`)

### ✅ Step 2: Configure DNS (5 minutes)

1. **Add DNS Record**
   - Go to your DNS provider (DigitalOcean Networking or your domain registrar)
   - Add new A record:
     - **Type**: A
     - **Hostname**: `testing` (or `testing.tunr-music.com`)
     - **Value**: Your staging droplet IP
     - **TTL**: 300 (5 minutes)

2. **Wait for DNS Propagation**
   ```bash
   # Test DNS resolution (may take 5-10 minutes)
   nslookup testing.tunr-music.com
   ```

### ✅ Step 3: Set Up Staging Droplet (10 minutes)

SSH into your new staging droplet:

```bash
ssh root@<staging-droplet-ip>
```

Run these commands:

```bash
# Update system
apt-get update
apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
rm get-docker.sh

# Install AWS CLI (for ECR access)
apt-get install -y awscli

# Configure AWS credentials
aws configure
# Enter:
# - AWS Access Key ID: [Your AWS key]
# - AWS Secret Access Key: [Your AWS secret]
# - Default region: us-east-1
# - Default output format: json

# Test ECR login
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 070322435379.dkr.ecr.us-east-1.amazonaws.com

# Install Nginx (for SSL)
apt-get install -y nginx certbot python3-certbot-nginx

# Configure Nginx for Tuner
cat > /etc/nginx/sites-available/tuner-staging << 'EOF'
server {
    listen 80;
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
EOF

# Enable the site
ln -s /etc/nginx/sites-available/tuner-staging /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default  # Remove default site
nginx -t  # Test configuration
systemctl restart nginx

# Get SSL certificate (wait until DNS is propagated!)
certbot --nginx -d testing.tunr-music.com --non-interactive --agree-tos --email your-email@example.com

# Verify SSL auto-renewal
certbot renew --dry-run

echo "✅ Staging droplet setup complete!"
```

### ✅ Step 4: Configure GitHub Secrets (5 minutes)

1. **Go to GitHub Repository Settings**
   - Navigate to: https://github.com/YOUR_USERNAME/Tuner/settings/secrets/actions

2. **Add New Secrets**
   Click "New repository secret" for each:

   - **Name**: `DO_STAGING_HOST`
     - **Value**: Your staging droplet IP (e.g., `164.90.xxx.xxx`)

   - **Name**: `DO_STAGING_USER`
     - **Value**: `root`

   - **Name**: `DO_STAGING_SSH_KEY`
     - **Value**: Your private SSH key (the one you used to create the droplet)
     - To get it: `cat ~/.ssh/id_rsa` (or your key file)
     - Copy the entire key including `-----BEGIN` and `-----END` lines

### ✅ Step 5: Deploy to Staging (Automated)

Now you're ready to deploy! The workflow is already updated.

```bash
# 1. Commit all changes (fallback thumbnails + staging setup)
git add .
git commit -m "feat: Add fallback thumbnails and staging environment"

# 2. Create and push staging branch
git checkout -b staging
git push -u origin staging

# 3. GitHub Actions will automatically:
#    - Build Docker image
#    - Push to ECR with tag: tuner:staging-latest
#    - Deploy to testing.tunr-music.com
```

### ✅ Step 6: Verify Staging Deployment

1. **Check GitHub Actions**
   - Go to: https://github.com/YOUR_USERNAME/Tuner/actions
   - Watch the deployment progress
   - Should see: ✅ build-and-push, ✅ deploy-digitalocean-staging

2. **Test Staging Site**
   - Open: https://testing.tunr-music.com
   - Test fallback thumbnails
   - Navigate through all stations
   - Check browser console for errors
   - Test on mobile

3. **Check Logs** (if needed)
   ```bash
   ssh root@<staging-ip>
   docker logs tuner-staging
   docker ps | grep tuner-staging
   ```

### ✅ Step 7: Deploy to Production (After Testing)

Once staging looks good:

```bash
# Merge staging to main
git checkout main
git merge staging
git push origin main

# GitHub Actions automatically deploys to production:
# - EC2: http://tuner.neil-everette.com:3001
# - DO: https://tunr-music.com
```

## Troubleshooting

### DNS Not Resolving
```bash
# Check DNS propagation
dig testing.tunr-music.com
nslookup testing.tunr-music.com

# If not working, wait 5-10 minutes and try again
```

### SSL Certificate Failed
```bash
# Make sure DNS is working first!
# Then retry:
certbot --nginx -d testing.tunr-music.com
```

### Docker Container Not Starting
```bash
ssh root@<staging-ip>

# Check logs
docker logs tuner-staging

# Check if port is available
netstat -tulpn | grep 3001

# Restart container
docker stop tuner-staging
docker rm tuner-staging
docker pull 070322435379.dkr.ecr.us-east-1.amazonaws.com/tuner:staging-latest
docker run -d --name tuner-staging -p 3001:3001 --restart unless-stopped 070322435379.dkr.ecr.us-east-1.amazonaws.com/tuner:staging-latest
```

### GitHub Actions Failing
- Check secrets are configured correctly
- Verify SSH key has no passphrase
- Check staging droplet is running
- Verify AWS credentials on staging droplet

## URLs Reference

- **Staging**: https://testing.tunr-music.com
- **Production (DO)**: https://tunr-music.com
- **Production (EC2)**: http://tuner.neil-everette.com:3001

## Cost

- **Staging Droplet**: $6/month
- **Total New Cost**: $6/month

## Next Steps

After successful staging deployment:
1. Test thoroughly on staging
2. Get feedback from users (share testing.tunr-music.com)
3. Fix any issues on staging branch
4. Merge to main for production deployment
5. Monitor production for any issues

---

**Need Help?** Check the logs or reach out!