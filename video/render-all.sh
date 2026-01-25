#!/bin/bash

# Render all TikTok animation variations

echo "🎬 Rendering all animation variations..."
echo ""

# Create output directory
mkdir -p out

# Render each composition
echo "📹 1/4 - Original (Cinematic camera)"
npm run build -- --codec=h264 --overwrite

echo "📹 2/4 - Slow Zoom (Dramatic)"
npx remotion render SlowZoom out/tuner-slow-zoom.mp4 --codec=h264 --overwrite

echo "📹 3/4 - Fast Paced (Energy)"
npx remotion render FastPaced out/tuner-fast-paced.mp4 --codec=h264 --overwrite

echo "📹 4/4 - Pan Across (Smooth)"
npx remotion render PanAcross out/tuner-pan-across.mp4 --codec=h264 --overwrite

echo ""
echo "✅ All videos rendered to ./out/"
ls -lh out/*.mp4
