import puppeteer from "puppeteer";
import { mkdir } from "fs/promises";
import { join } from "path";

const BASE = "https://adenaobocao-boteco-da-estacao-1c8n.vercel.app";
const OUT = join(import.meta.dirname, "..", "public", "cases", "boteco");

// More screens, more scroll positions — to feed the LiveDemo cycling
const pages = [
  // Home — hero + menu + footer (scroll through)
  { name: "home-desktop.jpg",       path: "/",                 viewport: { width: 1440, height: 900 }, scroll: 0 },
  { name: "home-menu.jpg",          path: "/",                 viewport: { width: 1440, height: 900 }, scroll: 700 },
  { name: "home-full-desktop.jpg",  path: "/",                 viewport: { width: 1440, height: 900 }, fullPage: true },
  // Dashboard — main + internal pages (each url = different feature)
  { name: "dashboard-desktop.jpg",          path: "/dashboard",           viewport: { width: 1440, height: 900 }, scroll: 0 },
  { name: "dashboard-pedidos.jpg",          path: "/dashboard/pedidos",   viewport: { width: 1440, height: 900 }, scroll: 0, optional: true },
  { name: "dashboard-cozinha.jpg",          path: "/dashboard/cozinha",   viewport: { width: 1440, height: 900 }, scroll: 0, optional: true },
  { name: "dashboard-agenda.jpg",           path: "/dashboard/agenda",    viewport: { width: 1440, height: 900 }, scroll: 0, optional: true },
  { name: "dashboard-analytics.jpg",        path: "/dashboard/analytics", viewport: { width: 1440, height: 900 }, scroll: 0, optional: true },
  { name: "dashboard-cupons.jpg",           path: "/dashboard/cupons",    viewport: { width: 1440, height: 900 }, scroll: 0, optional: true },
  { name: "dashboard-whatsapp.jpg",         path: "/dashboard/whatsapp",  viewport: { width: 1440, height: 900 }, scroll: 0, optional: true },
  { name: "dashboard-full-desktop.jpg",     path: "/dashboard",           viewport: { width: 1440, height: 900 }, fullPage: true },
  // Mobile
  { name: "home-mobile.jpg",      path: "/",          viewport: { width: 390, height: 844 }, scroll: 0 },
  { name: "dashboard-mobile.jpg", path: "/dashboard", viewport: { width: 390, height: 844 }, scroll: 0 },
];

async function run() {
  await mkdir(OUT, { recursive: true });
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });

  for (const pg of pages) {
    console.log(`Capturing ${pg.name} ...`);
    try {
      const page = await browser.newPage();
      await page.setViewport(pg.viewport);
      const resp = await page.goto(`${BASE}${pg.path}`, { waitUntil: "networkidle2", timeout: 45000 });
      if (pg.optional && resp && resp.status() >= 400) {
        console.log(`  -> skip (HTTP ${resp.status()})`);
        await page.close();
        continue;
      }
      await new Promise((r) => setTimeout(r, 2000));
      if (typeof pg.scroll === "number") {
        await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), pg.scroll);
        await new Promise((r) => setTimeout(r, 1200));
      }
      await page.screenshot({
        path: join(OUT, pg.name),
        type: "jpeg",
        quality: 90,
        fullPage: !!pg.fullPage,
      });
      await page.close();
      console.log(`  -> saved ${pg.name}`);
    } catch (e) {
      if (pg.optional) { console.log(`  -> skip (${e.message})`); continue; }
      throw e;
    }
  }

  await browser.close();
  console.log("Boteco capture done.");
}

run().catch(console.error);
