import { readdirSync, writeFileSync } from "node:fs";

/** Regenerates public/sitemap.xml from the content collections. Runs before every build. */

const BASE = "https://serenebay.com";

const slugs = (dir) => {
  try {
    return readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
  } catch {
    return [];
  }
};

const routes = [
  "/",
  "/difference",
  "/lifecycle",
  "/about",
  "/insights",
  ...slugs("content/insights").map((s) => `/insights/${s}`),
  "/amelia",
  "/careers",
  "/faqs",
  "/contact",
  "/privacy",
  "/cookies",
  "/terms",
];

const today = new Date().toISOString().slice(0, 10);
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((r) => `  <url><loc>${BASE}${r}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`;

writeFileSync("public/sitemap.xml", xml);
console.log(`sitemap: ${routes.length} routes → public/sitemap.xml`);
