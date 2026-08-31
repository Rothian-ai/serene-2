import type { Config } from "@react-router/dev/config";
import { vercelPreset } from "@vercel/react-router/vite";
import { readdirSync } from "node:fs";

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
      // /developers is served live: its wall is drawn from Amelia's register,
      // so freezing it at build would re-create the drift it exists to fix.
      // The per-developer entries are curated content and stay prerendered.
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
