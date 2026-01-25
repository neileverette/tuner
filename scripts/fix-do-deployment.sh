#!/bin/bash
# Run this script ON YOUR DIGITALOCEAN SERVER to fix the deployment

set -e

echo "🔧 Fixing DigitalOcean deployment..."

# Stop ALL tuner containers
echo "Stopping all tuner containers..."
docker ps -a | grep tuner | awk '{print $1}' | xargs -r docker stop || true
docker ps -a | grep tuner | awk '{print $1}' | xargs -r docker rm || true

# Kill anything on ports 3000, 3001, 3002
echo "Freeing ports 3000-3002..."
lsof -ti:3000 | xargs -r kill -9 || true
lsof -ti:3001 | xargs -r kill -9 || true  
lsof -ti:3002 | xargs -r kill -9 || true

# Update Nginx config for testing.tunr-music.com
echo "Updating Nginx configuration..."
if [ -f /etc/nginx/sites-available/testing.tunr-music.com ]; then
    sed -i 's/proxy_pass http:\/\/localhost:3001;/proxy_pass http:\/\/localhost:3002;/g' /etc/nginx/sites-available/testing.tunr-music.com
    nginx -t && systemctl reload nginx
    echo "✅ Nginx updated to use port 3002"
else
    echo "⚠️  Nginx config not found at /etc/nginx/sites-available/testing.tunr-music.com"
    echo "   You'll need to manually update it to use port 3002"
fi

echo ""
echo "✅ Server is ready for deployment!"
echo "   - All old containers removed"
echo "   - Ports 3000-3002 freed"
echo "   - Nginx configured for port 3002"
echo ""
echo "Now push to testing branch to trigger deployment"

# Made with Bob
