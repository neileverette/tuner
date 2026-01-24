#!/bin/bash

# Staging Server Setup Script
# This script configures Nginx and SSL for the staging environment
# Run this ON YOUR DIGITALOCEAN SERVER after SSHing in

set -e  # Exit on any error

echo "=========================================="
echo "Tuner Staging Environment Setup"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root (use sudo)${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1: Checking prerequisites...${NC}"

# Check if nginx is installed
if ! command -v nginx &> /dev/null; then
    echo -e "${RED}Nginx is not installed. Please install it first.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Nginx is installed${NC}"

# Check if certbot is installed
if ! command -v certbot &> /dev/null; then
    echo -e "${YELLOW}Certbot not found. Installing...${NC}"
    apt update
    apt install certbot python3-certbot-nginx -y
fi
echo -e "${GREEN}✓ Certbot is installed${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Please install it first.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker is installed${NC}"

echo ""
echo -e "${YELLOW}Step 2: Backing up current Nginx config...${NC}"
cp /etc/nginx/sites-available/tuner /etc/nginx/sites-available/tuner.backup.$(date +%Y%m%d_%H%M%S)
echo -e "${GREEN}✓ Backup created${NC}"

echo ""
echo -e "${YELLOW}Step 3: Adding staging server block to Nginx...${NC}"

# Check if staging block already exists
if grep -q "testing.tunr-music.com" /etc/nginx/sites-available/tuner; then
    echo -e "${YELLOW}Staging configuration already exists. Skipping...${NC}"
else
    # Add staging server block
    cat >> /etc/nginx/sites-available/tuner << 'EOF'

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
EOF
    echo -e "${GREEN}✓ Staging server block added${NC}"
fi

echo ""
echo -e "${YELLOW}Step 4: Testing Nginx configuration...${NC}"
nginx -t
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Nginx configuration is valid${NC}"
else
    echo -e "${RED}✗ Nginx configuration has errors. Please check manually.${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Step 5: Reloading Nginx...${NC}"
systemctl reload nginx
echo -e "${GREEN}✓ Nginx reloaded${NC}"

echo ""
echo -e "${YELLOW}Step 6: Checking DNS resolution...${NC}"
if host testing.tunr-music.com > /dev/null 2>&1; then
    echo -e "${GREEN}✓ DNS is configured for testing.tunr-music.com${NC}"
    
    echo ""
    echo -e "${YELLOW}Step 7: Setting up SSL certificate...${NC}"
    echo -e "${YELLOW}You will be prompted for:${NC}"
    echo "  1. Email address (for renewal notifications)"
    echo "  2. Terms of Service agreement (type 'Y')"
    echo "  3. Email sharing (type 'N' if you prefer)"
    echo ""
    
    # Run certbot
    certbot --nginx -d testing.tunr-music.com
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ SSL certificate installed successfully${NC}"
    else
        echo -e "${RED}✗ SSL certificate installation failed${NC}"
        echo "You can run this manually later: sudo certbot --nginx -d testing.tunr-music.com"
    fi
else
    echo -e "${RED}✗ DNS is not configured for testing.tunr-music.com${NC}"
    echo ""
    echo "Please add an A record in your DNS provider:"
    echo "  Type: A"
    echo "  Name: testing"
    echo "  Value: $(curl -s ifconfig.me)"
    echo "  TTL: 300"
    echo ""
    echo "After adding the DNS record, wait 5 minutes and run:"
    echo "  sudo certbot --nginx -d testing.tunr-music.com"
    exit 1
fi

echo ""
echo -e "${GREEN}=========================================="
echo "Setup Complete!"
echo "==========================================${NC}"
echo ""
echo "Next steps:"
echo "1. Push your code to the 'staging' branch"
echo "2. GitHub Actions will deploy automatically"
echo "3. Visit https://testing.tunr-music.com to test"
echo ""
echo "Useful commands:"
echo "  docker ps                    # View running containers"
echo "  docker logs -f tuner-staging # View staging logs"
echo "  systemctl status nginx       # Check Nginx status"
echo ""

# Made with Bob
