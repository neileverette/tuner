#!/bin/bash
# Force a clean redeployment of staging environment
# This script ensures the latest staging image is pulled and deployed

set -e

echo "🔄 Forcing staging redeployment..."

# Make a trivial change to trigger rebuild
TIMESTAMP=$(date +%s)
echo "# Deployment trigger: $TIMESTAMP" >> .github/workflows/deploy.yml

# Commit and push
git add .github/workflows/deploy.yml
git commit -m "chore: Force staging redeploy - $TIMESTAMP"
git push origin staging

echo "✅ Pushed trigger commit to staging branch"
echo "📦 GitHub Actions will now:"
echo "   1. Build fresh Docker image with --no-cache"
echo "   2. Push to ECR as staging-latest"
echo "   3. Deploy to DigitalOcean"
echo ""
echo "🔗 Monitor deployment: https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\(.*\)\.git/\1/')/actions"
echo "🌐 Test at: https://testing.tunr-music.com"

# Made with Bob
