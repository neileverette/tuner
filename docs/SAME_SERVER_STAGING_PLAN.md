# Same-Server Staging & Production Deployment Plan

## Overview
Run both **production** and **staging** containers on the same DigitalOcean server, accessible via different URLs, with automated GitHub Actions deployment.

---

## Architecture

### URLs & Ports
- **Production**: `tunr-music.com` → Port 3000 (container: `tuner-prod`)
- **Staging**: `testing.tunr-music.com` → Port 3001 (container: `tuner-staging`)

### Docker Containers
```
┌─────────────────────────────────────┐
│   DigitalOcean Server               │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  tuner-prod (port 3000)      │  │ ← tunr-music.com
│  │  Image: tuner:latest         │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  tuner-staging (port 3001)   │  │ ← testing.tunr-music.com
│  │  Image: tuner:staging-latest │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

---

## Workflow

### Branch Strategy
1. **`staging` branch** → Deploys to staging container (port 3001)
2. **`main` branch** → Deploys to production container (port 3000)

### Deployment Flow
```
Developer pushes to staging
    ↓
GitHub Actions builds Docker image
    ↓
Pushes to ECR as tuner:staging-latest
    ↓
SSH to DO server
    ↓
Pull staging image & restart tuner-staging container
    ↓
Test on testing.tunr-music.com
    ↓
If good, merge staging → main
    ↓
GitHub Actions builds Docker image
    ↓
Pushes to ECR as tuner:latest
    ↓
SSH to DO server
    ↓
Pull production image & restart tuner-prod container
    ↓
Live on tunr-music.com
```

---

## Server Setup (One-Time)

### 1. Nginx Configuration
Create two server blocks in `/etc/nginx/sites-available/tuner`:

```nginx
# Production
server {
    listen 80;
    listen [::]:80;
    server_name tunr-music.com www.tunr-music.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Staging
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
    }
}
```

Enable and reload:
```bash
sudo ln -s /etc/nginx/sites-available/tuner /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 2. SSL Certificates (Let's Encrypt)
```bash
sudo certbot --nginx -d tunr-music.com -d www.tunr-music.com
sudo certbot --nginx -d testing.tunr-music.com
```

### 3. DNS Configuration
Add A record in your DNS provider:
- `testing.tunr-music.com` → Your DO server IP

---

## GitHub Actions Workflow

### Updated `.github/workflows/deploy.yml`

```yaml
name: Deploy to DigitalOcean

on:
  push:
    branches:
      - main      # Production
      - staging   # Staging

env:
  AWS_REGION: us-east-1
  ECR_REPOSITORY: tuner

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set environment variables
        run: |
          if [ "${{ github.ref }}" == "refs/heads/main" ]; then
            echo "ENVIRONMENT=production" >> $GITHUB_ENV
            echo "DOCKER_TAG=latest" >> $GITHUB_ENV
            echo "CONTAINER_NAME=tuner-prod" >> $GITHUB_ENV
            echo "CONTAINER_PORT=3000" >> $GITHUB_ENV
          else
            echo "ENVIRONMENT=staging" >> $GITHUB_ENV
            echo "DOCKER_TAG=staging-latest" >> $GITHUB_ENV
            echo "CONTAINER_NAME=tuner-staging" >> $GITHUB_ENV
            echo "CONTAINER_PORT=3001" >> $GITHUB_ENV
          fi

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1

      - name: Build and push Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:${{ env.DOCKER_TAG }} .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:${{ env.DOCKER_TAG }}

      - name: Deploy to DigitalOcean
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.DO_HOST }}
          username: ${{ secrets.DO_USER }}
          key: ${{ secrets.DO_SSH_KEY }}
          script: |
            # Login to ECR
            aws ecr get-login-password --region ${{ env.AWS_REGION }} | \
              docker login --username AWS --password-stdin ${{ env.ECR_REGISTRY }}
            
            # Pull latest image
            docker pull ${{ env.ECR_REGISTRY }}/${{ env.ECR_REPOSITORY }}:${{ env.DOCKER_TAG }}
            
            # Stop and remove old container
            docker stop ${{ env.CONTAINER_NAME }} || true
            docker rm ${{ env.CONTAINER_NAME }} || true
            
            # Run new container
            docker run -d \
              --name ${{ env.CONTAINER_NAME }} \
              --restart unless-stopped \
              -p ${{ env.CONTAINER_PORT }}:3000 \
              ${{ env.ECR_REGISTRY }}/${{ env.ECR_REPOSITORY }}:${{ env.DOCKER_TAG }}
            
            # Clean up old images
            docker image prune -af
```

---

## GitHub Secrets Required

Add these to your GitHub repository settings (Settings → Secrets and variables → Actions):

- `AWS_ACCESS_KEY_ID` - Your AWS access key
- `AWS_SECRET_ACCESS_KEY` - Your AWS secret key
- `DO_HOST` - Your DigitalOcean server IP
- `DO_USER` - SSH username (usually `root`)
- `DO_SSH_KEY` - Private SSH key for server access

---

## Usage

### Testing Changes (Staging)
```bash
# Create feature branch from staging
git checkout staging
git pull origin staging
git checkout -b feature/my-new-feature

# Make changes, commit
git add .
git commit -m "feat: Add new feature"

# Push to staging
git checkout staging
git merge feature/my-new-feature
git push origin staging
```

**Result**: Automatically deploys to `testing.tunr-music.com` (port 3001)

### Deploying to Production
```bash
# After testing on staging, merge to main
git checkout main
git pull origin main
git merge staging
git push origin main
```

**Result**: Automatically deploys to `tunr-music.com` (port 3000)

---

## Server Commands

### View Running Containers
```bash
docker ps
```

### View Logs
```bash
# Production logs
docker logs -f tuner-prod

# Staging logs
docker logs -f tuner-staging
```

### Manual Container Management
```bash
# Restart production
docker restart tuner-prod

# Restart staging
docker restart tuner-staging

# Stop staging (to save resources)
docker stop tuner-staging
```

### Check Nginx Status
```bash
sudo systemctl status nginx
sudo nginx -t  # Test configuration
```

---

## Benefits

✅ **Same server** - No additional infrastructure costs
✅ **Isolated containers** - Staging can't break production
✅ **Automated deployments** - Push to branch = automatic deploy
✅ **Easy testing** - Test on real server before production
✅ **Quick rollback** - Keep previous images, easy to revert
✅ **Resource efficient** - Stop staging container when not testing

---

## Cost Analysis

- **Current**: 1 DO droplet running production
- **New**: Same droplet running both containers
- **Additional cost**: $0 (just uses more RAM/CPU on same server)

**Recommended droplet size**: 
- Minimum: 2GB RAM ($12/month)
- Recommended: 4GB RAM ($24/month) for smooth operation

---

## Monitoring

### Health Checks
```bash
# Production
curl https://tunr-music.com

# Staging
curl https://testing.tunr-music.com
```

### Resource Usage
```bash
docker stats tuner-prod tuner-staging
```

---

## Troubleshooting

### Container won't start
```bash
# Check logs
docker logs tuner-staging

# Check if port is in use
sudo lsof -i :3001
```

### Nginx errors
```bash
# Check configuration
sudo nginx -t

# View error logs
sudo tail -f /var/log/nginx/error.log
```

### SSL certificate issues
```bash
# Renew certificates
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

---

## Next Steps

1. ✅ Update GitHub Actions workflow (see above)
2. ⬜ Configure Nginx on DO server
3. ⬜ Set up SSL for testing.tunr-music.com
4. ⬜ Add DNS record for testing.tunr-music.com
5. ⬜ Add GitHub secrets
6. ⬜ Create staging branch
7. ⬜ Test deployment to staging
8. ⬜ Deploy to production