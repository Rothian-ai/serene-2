import type { Config } from "@react-router/dev/config";
import { vercelPreset } from "@vercel/react-router/vite";
import { readFileSync, readdirSync } from "node:fs";

/**
 * Vercel target. `ssr: true` gives us server routes (the /dashboard admin and
 * the /api/submit endpoint need a runtime + database). The marketing pages are
 * still prerendered to static HTML at build for speed/SEO; everything not in the
 * list (dashboard, api) is server-rendered on demand by the Vercel function.
 */
function slugs(dir: string): string[] {
  try {
    return readdirSync(dir)
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.replace(/\.md$/, ""));
  } catch {
    return [];
  }
}

/**
 * Only the developers with a written record get a page. Twenty-one of the
 * twenty-eight are a name and nothing else, so prerendering those would publish
 * blank profiles and list them in the sitemap; they are named on /developers
 * instead. A file earns its page by carrying frontmatter past `name`, or a body.
 *
 * Line-walked rather than pattern-matched: the same rule has to hold in
 * scripts/generate-sitemap.mjs, and one readable loop is easier to keep in step
 * across two files than one clever expression.
 */
function profiled(dir: string): string[] {
  return slugs(dir).filter((slug) => {
    let raw: string;
    try {
      raw = readFileSync(`${dir}/${slug}.md`, "utf8");
    } catch {
      return false;
    }
    const lines = raw.split("\n").map((l) => l.replace("\r", ""));
    if (lines[0].trim() !== "---") return false;
    const close = lines.indexOf("---", 1);
    if (close === -1) return false;
    const keys = lines
      .slice(1, close)
      .filter((l) => /^[a-zA-Z]/.test(l) && l.includes(":")).length;
    const body = lines.slice(close + 1).join("\n").trim();
    return keys > 1 || body.length > 0;
  });
}

export default {
  ssr: true,
  presets: [vercelPreset()],
  async prerender() {
    return [
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
  },
} satisfies Config;
