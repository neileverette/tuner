import { chromium } from "playwright";
import * as path from "path";

const APP_URL = "https://tunr-music.com";
const OUTPUT_PATH = path.join(process.cwd(), "public", "full-page-ui.png");

async function capture() {
    console.log("📸 capturing high-res full page...");

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1200 }, // Slightly taller to ensure bottom controls are visible
        deviceScaleFactor: 2, // Retina quality
    });
    const page = await context.newPage();

    await page.goto(APP_URL, { waitUntil: "networkidle" });
    await page.waitForTimeout(3000); // Wait for splash/animations

    // Dismiss welcome modal
    const dismissBtn = page.locator("text=Got it");
    if (await dismissBtn.isVisible().catch(() => false)) {
        await dismissBtn.click();
        await page.waitForTimeout(1000);
    }

    // Take the screenshot of the viewport (or full page if needed, but viewport is usually safer for web apps that preserve layout)
    await page.screenshot({ path: OUTPUT_PATH, fullPage: false });

    await browser.close();
    console.log(`✅ Saved to ${OUTPUT_PATH}`);
}

capture().catch(console.error);
