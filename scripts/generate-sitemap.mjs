import { writeFileSync } from "node:fs";

/** Regenerates public/sitemap.xml. Alpha (coming-soon): the homepage only. */

const BASE = "https://serene.com";

const routes = ["/"];

const today = new Date().toISOString().slice(0, 10);
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((r) => `  <url><loc>${BASE}${r}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`;

writeFileSync("public/sitemap.xml", xml);
console.log(`sitemap: ${routes.length} routes → public/sitemap.xml`);
