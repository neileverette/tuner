/**
 * Playwright capture script for Tuner promo video.
 *
 * Captures a single static frame of the UI - camera movements
 * are handled in post by Remotion for smooth, precise control.
 *
 * Usage: npm run capture
 */

import { chromium, type Page } from "playwright";
import * as fs from "fs";
import * as path from "path";

const FPS = 30;
const DURATION_SECONDS = 8;
const TOTAL_FRAMES = FPS * DURATION_SECONDS; // 240 frames

// Output directory for captured frames
const FRAMES_DIR = path.join(process.cwd(), "public", "frames");

// Your app URL - change if running on different port
const APP_URL = process.env.APP_URL || "http://localhost:5173";

async function captureFrames() {
  console.log("🎬 Starting Tuner hero capture (8 seconds)...\n");

  // Clean and create frames directory
  if (fs.existsSync(FRAMES_DIR)) {
    fs.rmSync(FRAMES_DIR, { recursive: true });
  }
  fs.mkdirSync(FRAMES_DIR, { recursive: true });

  // Launch browser
  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2, // Retina quality
  });

  const page = await context.newPage();

  // Navigate to app
  console.log(`📡 Loading ${APP_URL}...`);
  await page.goto(APP_URL, { waitUntil: "networkidle" });

  // Wait for splash to complete and content to be visible
  console.log("⏳ Waiting for app to fully load...");
  await page.waitForTimeout(3500); // Wait for splash animation

  // Dismiss welcome modal if visible
  const dismissBtn = page.locator("text=Got it");
  if (await dismissBtn.isVisible({ timeout: 500 }).catch(() => false)) {
    await dismissBtn.click();
    await page.waitForTimeout(500);
  }

  // Ensure we have a nice state - maybe navigate to a good station
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(600); // Wait for transition

  console.log("📸 Capturing hero frame...");

  // Capture a single high-quality frame
  // We'll duplicate it for all frames since camera movement is in Remotion
  const heroFrame = path.join(FRAMES_DIR, "hero.png");
  await page.screenshot({
    path: heroFrame,
    type: "png",
  });

  // Create symlinks or copies for each frame (Remotion expects numbered frames)
  // Using a single image and letting Remotion handle the camera = smoother results
  console.log(`📁 Creating ${TOTAL_FRAMES} frame references...`);

  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const filename = `frame-${String(i).padStart(6, "0")}.png`;
    const filepath = path.join(FRAMES_DIR, filename);
    // Copy the hero frame (symlinks can cause issues on some systems)
    fs.copyFileSync(heroFrame, filepath);
  }

  // Write manifest
  const manifestPath = path.join(FRAMES_DIR, "manifest.json");
  fs.writeFileSync(
    manifestPath,
    JSON.stringify(
      {
        fps: FPS,
        totalFrames: TOTAL_FRAMES,
        durationSeconds: DURATION_SECONDS,
        mode: "static-hero", // Single frame with camera movement
        heroFrame: "hero.png",
      },
      null,
      2
    )
  );

  await browser.close();

  console.log(`\n✅ Captured hero frame`);
  console.log(`📋 Created ${TOTAL_FRAMES} frames for ${DURATION_SECONDS}s video`);
  console.log(`\n🎥 Run 'npm run studio' to preview camera movements\n`);
}

// Run capture
captureFrames().catch((err) => {
  console.error("❌ Capture failed:", err);
  process.exit(1);
});
