const puppeteer = require("puppeteer");

(async () => {
  const url = process.env.SITE_URL || "https://starship-staging.netlify.app/"; // set as env or default

  console.log(`🔍 Checking site: ${url}`);

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  try {
    const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

    if (!response || !response.ok()) {
      console.error(`❌ Failed to load: ${url}, status: ${response?.status()}`);
      process.exit(1);
    } else {
      console.log(`✅ Page loaded: ${url}, status: ${response.status()}`);
    }

    // Example: Check if Facebook social feed div exists
    const fbFeed = await page.$(".fb-feed, #facebook-feed");
    if (!fbFeed) {
      console.error("⚠️ Facebook feed element is MISSING (possible token/embedding issue)");
    } else {
      console.log("✅ Facebook feed detected");
    }

    // Add more checks for critical sections (headers, logos, etc.)
    const logo = await page.$("img.logo");
    if (!logo) console.error("⚠️ Logo missing!");
    else console.log("✅ Logo found");

  } catch (err) {
    console.error("❌ Error during monitoring:", err.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
