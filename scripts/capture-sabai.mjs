import puppeteer from "puppeteer";
import { mkdir, readFile, stat } from "fs/promises";
import { createServer } from "http";
import { join, extname, resolve } from "path";

// Serve the local Sabai site-v2 over a tiny http server,
// then screenshot it with puppeteer. Avoids Vercel preview auth.
const SITE_ROOT = resolve("C:/Users/T-GAMER/sabai/site-v2");
const OUT = join(import.meta.dirname, "..", "public", "cases", "sabai-live");
const PORT = 4321;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".js":   "application/javascript; charset=utf-8",
  ".json": "application/json",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png":  "image/png",
  ".webp": "image/webp",
  ".svg":  "image/svg+xml",
  ".woff": "font/woff",
  ".woff2":"font/woff2",
  ".ttf":  "font/ttf",
};

function startServer() {
  return new Promise((ok) => {
    const server = createServer(async (req, res) => {
      try {
        let url = decodeURIComponent(req.url.split("?")[0]);
        if (url === "/") url = "/index.html";
        const filePath = join(SITE_ROOT, url);
        if (!filePath.startsWith(SITE_ROOT)) { res.statusCode = 403; return res.end(); }
        const s = await stat(filePath).catch(() => null);
        if (!s || !s.isFile()) { res.statusCode = 404; return res.end("not found"); }
        const buf = await readFile(filePath);
        res.setHeader("Content-Type", MIME[extname(filePath).toLowerCase()] || "application/octet-stream");
        res.end(buf);
      } catch (e) { res.statusCode = 500; res.end(String(e)); }
    });
    server.listen(PORT, () => ok(server));
  });
}

const BASE = `http://localhost:${PORT}`;

const frames = [
  // Homepage scroll-through (desktop)
  { name: "desktop-1-hero.jpg",     path: "/index.html",         viewport: { width: 1440, height: 900 }, scroll: 0 },
  { name: "desktop-2-section2.jpg", path: "/index.html",         viewport: { width: 1440, height: 900 }, scroll: 900 },
  { name: "desktop-3-section3.jpg", path: "/index.html",         viewport: { width: 1440, height: 900 }, scroll: 1800 },
  { name: "desktop-4-section4.jpg", path: "/index.html",         viewport: { width: 1440, height: 900 }, scroll: 2700 },
  { name: "desktop-5-section5.jpg", path: "/index.html",         viewport: { width: 1440, height: 900 }, scroll: 3600 },
  // Product pages — each a different product
  { name: "desktop-6-produto-cool.jpg", path: "/produto-cool.html", viewport: { width: 1440, height: 900 }, scroll: 0 },
  { name: "desktop-7-produto-heat.jpg", path: "/produto-heat.html", viewport: { width: 1440, height: 900 }, scroll: 0 },
  { name: "desktop-8-produto-mist.jpg", path: "/produto-mist.html", viewport: { width: 1440, height: 900 }, scroll: 0 },
  { name: "desktop-9-hub.jpg",          path: "/hub.html",          viewport: { width: 1440, height: 900 }, scroll: 0 },
  // Full page
  { name: "desktop-full.jpg", path: "/index.html", viewport: { width: 1440, height: 900 }, fullPage: true },
  // Mobile
  { name: "mobile-1-hero.jpg",     path: "/index.html",       viewport: { width: 390, height: 844 }, scroll: 0 },
  { name: "mobile-2-products.jpg", path: "/index.html",       viewport: { width: 390, height: 844 }, scroll: 800 },
  { name: "mobile-3-produto.jpg",  path: "/produto-cool.html",viewport: { width: 390, height: 844 }, scroll: 0 },
];

async function run() {
  await mkdir(OUT, { recursive: true });
  const server = await startServer();
  console.log(`Server up on ${BASE}`);
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });

  try {
    for (const f of frames) {
      console.log(`Capturing ${f.name} ...`);
      const page = await browser.newPage();
      await page.setViewport(f.viewport);
      await page.goto(`${BASE}${f.path}`, { waitUntil: "networkidle2", timeout: 45000 });
      await new Promise((r) => setTimeout(r, 1200));
      if (typeof f.scroll === "number") {
        await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), f.scroll);
        await new Promise((r) => setTimeout(r, 1200));
      }
      await page.screenshot({
        path: join(OUT, f.name),
        type: "jpeg",
        quality: 88,
        fullPage: !!f.fullPage,
      });
      await page.close();
      console.log(`  -> saved ${f.name}`);
    }
  } finally {
    await browser.close();
    server.close();
  }
  console.log("Sabai capture done.");
}

run().catch((e) => { console.error(e); process.exit(1); });
