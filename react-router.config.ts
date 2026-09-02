import type { Config } from "@react-router/dev/config";
import { vercelPreset } from "@vercel/react-router/vite";
import { readFileSync, readdirSync } from "node:fs";

/**
 * Vercel target. `ssr: true` gives us server routes (the /dashboard admin and
 * the /api/submit endpoint need a runtime + database). The marketing pages are
 * still prerendered to static HTML at build for speed/SEO; everything not in the
 * list (dashboard, api) is server-rendered on demand by the Vercel function.
 */

/**
 * Content slugs to prerender, minus anything marked `hidden: true`.
 *
 * The flag lives in the markdown frontmatter and app/lib/content.ts filters on
 * it at runtime, so a hidden entry's route 404s. Prerendering it anyway would
 * fail the build on that 404. The flag is read off the file rather than
 * imported, because this runs before the app modules exist.
 */
function slugs(dir: string): string[] {
  try {
    return readdirSync(dir)
      .filter((f) => f.endsWith(".md"))
      .filter((f) => !/^hidden:\s*true\s*$/m.test(readFileSync(`${dir}/${f}`, "utf8")))
      .map((f) => f.replace(/\.md$/, ""));
  } catch {
    return [];
  }
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
      ...slugs("content/developers").map((s) => `/developers/${s}`),
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
