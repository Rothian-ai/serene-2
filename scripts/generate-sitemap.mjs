import { readFileSync, readdirSync, writeFileSync } from "node:fs";

/** Regenerates public/sitemap.xml from the content collections. Runs before every build. */

const BASE = "https://serene.com";

const slugs = (dir) => {
  try {
    return readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
  } catch {
    return [];
  }
};

/**
 * Only developers with a written record get a URL. Most of the register is a
 * name and nothing else, and listing a blank profile in the sitemap invites a
 * crawler to index an empty page. Must stay in step with the same function in
 * react-router.config.ts, which decides what gets prerendered.
 */
const profiled = (dir) =>
  slugs(dir).filter((slug) => {
    let raw;
    try {
      raw = readFileSync(`${dir}/${slug}.md`, "utf8");
    } catch {
      return false;
    }
    const lines = raw.split("\n").map((l) => l.replace("\r", ""));
    if (lines[0].trim() !== "---") return false;
    const close = lines.indexOf("---", 1);
    if (close === -1) return false;
    const keys = lines.slice(1, close).filter((l) => /^[a-zA-Z]/.test(l) && l.includes(":")).length;
    const body = lines.slice(close + 1).join("\n").trim();
    return keys > 1 || body.length > 0;
  });

const routes = [
  "/",
  "/off-plan",
  "/difference",
  "/lifecycle",
  "/about",
  "/developers",
  ...profiled("content/developers").map((s) => `/developers/${s}`),
  "/insights",
  ...slugs("content/insights").map((s) => `/insights/${s}`),
  "/careers",
  "/faqs",
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
