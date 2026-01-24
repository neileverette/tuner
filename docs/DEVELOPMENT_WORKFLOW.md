# Development Workflow

This document outlines the complete development workflow for the Tuner project, from feature development to production deployment.

## Branch Structure

```
main (production)
  ↑
testing (pre-production)
  ↑
feature/* (development)
```

- **`main`**: Production branch - deploys to tunr-music.com (port 3000)
- **`testing`**: Testing/staging branch - deploys to testing.tunr-music.com (port 3001)
- **`feature/*`**: Feature branches - local development only

## Complete Workflow

### 1. Create a Feature Branch

Start from the testing branch (or main if testing doesn't exist yet):

```bash
# Make sure you're up to date
git checkout testing
git pull origin testing

# Create your feature branch
git checkout -b feature/my-new-feature
```

### 2. Develop Your Feature

Make your changes, commit regularly:

```bash
# Make changes to files
git add .
git commit -m "feat: Add new feature"

# Push to remote (optional, for backup)
git push origin feature/my-new-feature
```

### 3. Merge Feature to Testing Branch

When ready to test on testing.tunr-music.com:

```bash
# Switch to testing branch
git checkout testing

# Pull latest changes
git pull origin testing

# Merge your feature branch
git merge feature/my-new-feature

# Push to trigger deployment
git push origin testing
```

**This will automatically:**
- Trigger GitHub Actions workflow
- Build Docker image with `--no-cache`
- Push to ECR as `testing-latest`
- Deploy to DigitalOcean container `tuner-testing`
- Make it available at https://testing.tunr-music.com

### 4. Test on testing.tunr-music.com

- Visit https://testing.tunr-music.com
- Test all functionality
- Verify the changes work as expected
- Check for any bugs or issues

### 5. Deploy to Production

Once testing is successful:

```bash
# Switch to main branch
git checkout main

# Pull latest changes
git pull origin main

# Merge testing branch
git merge testing

# Push to trigger production deployment
git push origin main
```

**This will automatically:**
- Trigger GitHub Actions workflow
- Build Docker image with `--no-cache`
- Push to ECR as `latest`
- Deploy to DigitalOcean container `tuner-prod`
- Make it available at https://tunr-music.com

### 6. Clean Up (Optional)

After successful production deployment:

```bash
# Delete local feature branch
git branch -d feature/my-new-feature

# Delete remote feature branch (if you pushed it)
git push origin --delete feature/my-new-feature
```

## Quick Reference Commands

### Merge feature to testing (triggers testing deployment)
```bash
git checkout testing
git pull origin testing
git merge feature/my-feature-name
git push origin testing
```

### Merge testing to production (triggers production deployment)
```bash
git checkout main
git pull origin main
git merge testing
git push origin main
```

### Check deployment status
```bash
# View recent deployments
gh run list --limit 5

# Or visit GitHub Actions page
open https://github.com/neileverette/Tuner/actions
```

## Deployment Details

### Testing Environment
- **URL**: https://testing.tunr-music.com
- **Branch**: `testing`
- **Container**: `tuner-testing`
- **Port**: 3001
- **Docker Tag**: `testing-latest`

### Production Environment
- **URL**: https://tunr-music.com
- **Branch**: `main`
- **Container**: `tuner-prod`
- **Port**: 3000
- **Docker Tag**: `latest`

## Troubleshooting

### Deployment not showing changes?

If testing.tunr-music.com doesn't show your changes after deployment:

1. Check GitHub Actions to ensure deployment succeeded
2. SSH into DigitalOcean and verify container is running:
   ```bash
   docker ps | grep tuner-testing
   ```
3. Check container logs:
   ```bash
   docker logs tuner-testing
   ```
4. Force a fresh deployment:
   ```bash
   # Make a trivial change
   git commit --allow-empty -m "chore: Force redeploy"
   git push origin testing
   ```

### Merge conflicts?

If you get merge conflicts when merging to testing or main:

```bash
# Resolve conflicts in your editor
# Then:
git add .
git commit -m "fix: Resolve merge conflicts"
git push origin testing  # or main
```

## Best Practices

1. **Always test on testing branch first** - Never merge directly to main
2. **Keep feature branches small** - Easier to review and test
3. **Use descriptive branch names** - `feature/add-fallback-thumbnails` not `feature/fix`
4. **Commit often** - Small, focused commits are easier to debug
5. **Pull before merge** - Always `git pull` before merging to avoid conflicts
6. **Monitor deployments** - Check GitHub Actions to ensure deployment succeeds

## Emergency Rollback

If production has a critical bug:

```bash
# Find the last good commit
git log main --oneline

# Reset main to that commit
git checkout main
git reset --hard <commit-hash>
git push origin main --force

# This will trigger a deployment of the old version
```

**Note**: This is destructive. Only use in emergencies.