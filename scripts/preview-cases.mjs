import puppeteer from "puppeteer";
import { mkdir } from "fs/promises";
import { join } from "path";

const OUT = join(import.meta.dirname, "preview-out");

async function run() {
  await mkdir(OUT, { recursive: true });
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log("Loading http://localhost:3000 ...");
  await page.goto("http://localhost:3000", { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 2500));

  // Scroll to the Cases section
  await page.evaluate(() => {
    const el = document.getElementById("work");
    if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
  });
  await new Promise((r) => setTimeout(r, 2000));

  await page.screenshot({ path: join(OUT, "01-cases-top.jpg"), type: "jpeg", quality: 88 });
  console.log("  saved 01-cases-top.jpg");

  // Scroll down a bit to see the live demos
  await page.evaluate(() => window.scrollBy({ top: 1800, behavior: "instant" }));
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: join(OUT, "02-cases-mid.jpg"), type: "jpeg", quality: 88 });
  console.log("  saved 02-cases-mid.jpg");

  await page.evaluate(() => window.scrollBy({ top: 1500, behavior: "instant" }));
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: join(OUT, "03-cases-livedemos.jpg"), type: "jpeg", quality: 88 });
  console.log("  saved 03-cases-livedemos.jpg");

  await page.evaluate(() => window.scrollBy({ top: 1500, behavior: "instant" }));
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: join(OUT, "04-cases-bottom.jpg"), type: "jpeg", quality: 88 });
  console.log("  saved 04-cases-bottom.jpg");

  // Click "Marca" filter
  console.log("Clicking Marca filter...");
  const buttons = await page.$$("button");
  for (const b of buttons) {
    const txt = await page.evaluate((el) => el.textContent, b);
    if (txt && txt.toLowerCase().includes("marca")) {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1500));
  await page.evaluate(() => document.getElementById("work")?.scrollIntoView({ behavior: "instant", block: "start" }));
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: join(OUT, "05-filter-marca.jpg"), type: "jpeg", quality: 88 });
  console.log("  saved 05-filter-marca.jpg");

  // Click Produto Digital
  console.log("Clicking Produto Digital filter...");
  const btns2 = await page.$$("button");
  for (const b of btns2) {
    const txt = await page.evaluate((el) => el.textContent, b);
    if (txt && txt.toLowerCase().includes("produto")) {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1500));
  await page.evaluate(() => document.getElementById("work")?.scrollIntoView({ behavior: "instant", block: "start" }));
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: join(OUT, "06-filter-produto.jpg"), type: "jpeg", quality: 88 });
  console.log("  saved 06-filter-produto.jpg");

  // Full page while still filtered to Produto
  await page.screenshot({ path: join(OUT, "07-filter-produto-full.jpg"), type: "jpeg", quality: 85, fullPage: true });
  console.log("  saved 07-filter-produto-full.jpg");

  await browser.close();
  console.log("Preview done.");
}

run().catch((e) => { console.error(e); process.exit(1); });
