# Staging Deployment Strategy

## Overview
Set up a branch-based staging environment to safely test changes before production deployment.

## Current Setup
- **Production Branch**: `main`
- **Production URL**: https://tunr-music.com (DigitalOcean)
- **Production URL**: http://tuner.neil-everette.com:3001 (EC2)
- **ECR Repository**: `tuner`
- **Deployment**: Automated via GitHub Actions on push to `main`

## Proposed Staging Setup

### Architecture
```
┌─────────────────┐
│ station-edition │ ← Feature branch (current work)
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│    staging      │ ← Staging branch (test environment)
└────────┬────────┘
         │ (after validation)
         ↓
┌─────────────────┐
│      main       │ ← Production branch
└─────────────────┘
```

### Infrastructure Requirements

#### Option A: Separate DigitalOcean Droplet (SELECTED)
- **Staging Droplet**: New DO droplet for staging
- **Staging URL**: https://testing.tunr-music.com
- **Container Name**: `tuner-staging`
- **Port**: 3001 (same as production)
- **Cost**: ~$6-12/month for basic droplet

#### Option B: Same Droplet, Different Port
- **Staging URL**: https://tunr-music.com:3002
- **Container Name**: `tuner-staging`
- **Port**: 3002
- **Cost**: $0 (uses existing droplet)
- **Note**: Requires nginx configuration for port routing

#### Option C: EC2 Only for Staging
- **Staging URL**: http://staging.tuner.neil-everette.com:3001
- **Use existing EC2**: Deploy staging to EC2, production to DO
- **Cost**: $0 (uses existing EC2)

## Recommended Approach: Option A (Separate Droplet)

### Benefits
- ✅ Complete isolation from production
- ✅ Can test infrastructure changes safely
- ✅ No port conflicts
- ✅ Easy SSL setup with Let's Encrypt
- ✅ Can run load tests without affecting production

### Implementation Steps

## Phase 1: Commit Current Work
```bash
# 1. Commit fallback thumbnail feature
git add .
git commit -m "feat: Add fallback thumbnail system for stations without artwork"

# 2. Push to feature branch
git push origin station-edition
```

## Phase 2: Create Staging Branch
```bash
# 1. Create staging branch from station-edition
git checkout -b staging
git push -u origin staging

# 2. Keep main as production
# (Don't merge yet - we'll test on staging first)
```

## Phase 3: Set Up Staging Infrastructure

### Create Staging Droplet (DigitalOcean)
1. Go to DigitalOcean Console
2. Create new Droplet:
   - **Name**: tuner-staging
   - **Image**: Ubuntu 22.04 LTS
   - **Size**: Basic ($6/month)
   - **Region**: Same as production
   - **SSH Keys**: Add your existing keys

3. Install Docker on staging droplet:
```bash
ssh root@<staging-droplet-ip>

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install AWS CLI (for ECR access)
apt-get update
apt-get install -y awscli

# Configure AWS credentials
aws configure
# Enter your AWS credentials
```

4. Set up DNS:
   - Add A record: `testing.tunr-music.com` → staging droplet IP
   - TTL: 300 (5 minutes for quick updates during setup)

### Configure GitHub Secrets
Add these secrets in GitHub repository settings:
- `DO_STAGING_HOST`: Staging droplet IP
- `DO_STAGING_USER`: root (or your user)
- `DO_STAGING_SSH_KEY`: SSH private key for staging droplet

## Phase 4: Update GitHub Actions

### Modified Workflow Structure
```yaml
on:
  push:
    branches:
      - main      # Production
      - staging   # Staging

jobs:
  build-and-push:
    # Builds image with branch-specific tag
    
  deploy-staging:
    # Only runs on staging branch
    # Deploys to staging droplet
    
  deploy-production:
    # Only runs on main branch
    # Deploys to production (EC2 + DO)
```

## Phase 5: Testing Workflow

### Deploy to Staging
```bash
# 1. Push to staging branch
git checkout staging
git push origin staging

# 2. GitHub Actions automatically:
#    - Builds Docker image with tag: tuner:staging-<sha>
#    - Pushes to ECR
#    - Deploys to staging droplet
#    - Available at: https://testing.tunr-music.com
```

### Validate on Staging
1. Open https://testing.tunr-music.com
2. Test fallback thumbnails:
   - Navigate through all stations
   - Verify empty thumbnails show colored backgrounds with initials
   - Check album art still displays for SomaFM stations
   - Test image error handling
3. Check browser console for errors
4. Test on mobile devices
5. Verify performance

### Promote to Production
```bash
# After staging validation passes:
git checkout main
git merge staging
git push origin main

# GitHub Actions automatically deploys to production
```

## Phase 6: Rollback Strategy

### If Issues Found on Staging
```bash
# Simply fix on staging branch
git checkout staging
# Make fixes
git commit -m "fix: Issue description"
git push origin staging
# Test again
```

### If Issues Found on Production
```bash
# Option 1: Quick rollback
git checkout main
git revert HEAD
git push origin main

# Option 2: Redeploy previous version
# Manually trigger workflow with previous commit SHA
```

## Monitoring & Alerts

### Staging Environment
- Monitor staging deployments in GitHub Actions
- Check staging logs: `ssh root@staging-droplet "docker logs tuner-staging"`
- No uptime monitoring needed (it's for testing)

### Production Environment
- Keep existing monitoring
- Add staging deployment notifications to Slack/Discord (optional)

## Cost Analysis

### Option A: Separate Droplet
- **Staging Droplet**: $6/month
- **Total New Cost**: $6/month
- **Benefits**: Complete isolation, safe testing

### Option B: Same Droplet
- **Additional Cost**: $0
- **Trade-offs**: Shared resources, port management

### Option C: EC2 Only
- **Additional Cost**: $0
- **Trade-offs**: No DO staging, EC2 only

## Timeline

### Immediate (Today)
1. ✅ Commit fallback thumbnail changes
2. ✅ Create staging branch
3. ⏱️ Create staging droplet (15 minutes)
4. ⏱️ Update GitHub Actions (30 minutes)
5. ⏱️ Configure secrets (5 minutes)

### Testing Phase (1-2 hours)
1. Deploy to staging
2. Comprehensive testing
3. Fix any issues found
4. Re-test

### Production Deployment (15 minutes)
1. Merge staging to main
2. Automatic deployment
3. Verify production

**Total Time**: ~2-3 hours for complete setup and testing

## Next Steps

Ready to proceed? Here's what we'll do:

1. **Commit the fallback thumbnail changes** ✓
2. **Create staging branch** ✓
3. **Update GitHub Actions workflow** (I'll create the file)
4. **You create staging droplet** (15 min)
5. **Configure GitHub secrets** (5 min)
6. **Test deployment** (1-2 hours)
7. **Deploy to production** (after validation)

---

**Decision Point**: Which option do you prefer?
- [ ] Option A: Separate staging droplet ($6/month) - **Recommended**
- [ ] Option B: Same droplet, different port ($0)
- [ ] Option C: EC2 only for staging ($0)