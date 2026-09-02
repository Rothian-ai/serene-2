import { readFileSync, readdirSync, writeFileSync } from "node:fs";

/** Regenerates public/sitemap.xml from the content collections. Runs before every build. */

const BASE = "https://serene.com";

/* Skips anything marked `hidden: true` in its frontmatter: a hidden route 404s
   at runtime, and a sitemap entry for it would point a crawler at a page we
   have taken down. Same rule as react-router.config.ts. */
const slugs = (dir) => {
  try {
    return readdirSync(dir)
      .filter((f) => f.endsWith(".md"))
      .filter((f) => !/^hidden:\s*true\s*$/m.test(readFileSync(`${dir}/${f}`, "utf8")))
      .map((f) => f.replace(/\.md$/, ""));
  } catch {
    return [];
  }
};

const routes = [
  "/",
  "/off-plan",
  "/difference",
  "/lifecycle",
  "/about",
  "/developers",
  ...slugs("content/developers").map((s) => `/developers/${s}`),
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
