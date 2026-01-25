/**
 * Playwright capture script for Tuner promo video.
 *
 * Captures 240 frames (8 seconds @ 30fps) of the LIVE running app.
 * Each frame is a screenshot of the actual UI at that moment in time.
 *
 * Usage: npm run capture
 */

import { chromium, type Page } from "playwright";
import * as fs from "fs";
import * as path from "path";

const FPS = 30;
const DURATION_SECONDS = 8;
const TOTAL_FRAMES = FPS * DURATION_SECONDS; // 240 frames
const FRAME_INTERVAL_MS = 1000 / FPS; // ~33.33ms per frame

// Output directory for captured frames
const FRAMES_DIR = path.join(process.cwd(), "public", "frames");

// Your app URL - change if running on different port
const APP_URL = process.env.APP_URL || "https://tunr-music.com";

/**
 * Simulate UI interactions during capture to show dynamic content.
 * This makes the video more interesting than a static screenshot.
 */
async function simulateInteractions(page: Page, currentFrame: number) {
  // At frame 60 (2 seconds): Press right arrow to change station
  if (currentFrame === 60) {
    await page.keyboard.press("ArrowRight");
  }

  // At frame 120 (4 seconds): Press right arrow again
  if (currentFrame === 120) {
    await page.keyboard.press("ArrowRight");
  }

  // At frame 180 (6 seconds): Press right arrow one more time
  if (currentFrame === 180) {
    await page.keyboard.press("ArrowRight");
  }
}

async function captureFrames() {
  console.log(`🎬 Starting Tuner frame capture (${DURATION_SECONDS} seconds @ ${FPS}fps)...\n`);

  // Clean and create frames directory
  if (fs.existsSync(FRAMES_DIR)) {
    console.log("🗑️  Cleaning old frames...");
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

  console.log(`📸 Capturing ${TOTAL_FRAMES} frames...\n`);

  // Capture each frame
  const startTime = Date.now();

  for (let i = 0; i < TOTAL_FRAMES; i++) {
    // Simulate interactions at specific frames
    await simulateInteractions(page, i);

    // Capture frame
    const filename = `frame-${String(i).padStart(6, "0")}.png`;
    const filepath = path.join(FRAMES_DIR, filename);

    await page.screenshot({
      path: filepath,
      type: "png",
    });

    // Progress indicator every 30 frames (1 second)
    if ((i + 1) % 30 === 0) {
      const progress = ((i + 1) / TOTAL_FRAMES) * 100;
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(
        `  ⏱️  ${i + 1}/${TOTAL_FRAMES} frames (${progress.toFixed(0)}%) - ${elapsed}s elapsed`
      );
    }

    // Small delay between frames to allow any animations to progress
    // (not strictly necessary but can help with smooth transitions)
    await page.waitForTimeout(10);
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
        mode: "live-capture",
        capturedAt: new Date().toISOString(),
        appUrl: APP_URL,
      },
      null,
      2
    )
  );

  await browser.close();

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log(`\n✅ Captured ${TOTAL_FRAMES} frames in ${totalTime}s`);
  console.log(`📋 Output: ${FRAMES_DIR}`);
  console.log(`\n🎥 Run 'npm run studio' to preview with camera movements\n`);
}

// Run capture
captureFrames().catch((err) => {
  console.error("❌ Capture failed:", err);
  process.exit(1);
});
