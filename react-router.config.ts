import type { Config } from "@react-router/dev/config";
import { readdirSync } from "node:fs";

/**
 * Static site generation: every route — including every content-collection
 * entry — is prerendered to crawlable HTML at build time. New content files
 * are picked up automatically on the next build.
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
  ssr: false,
  async prerender() {
    return [
      "/",
      "/about",
      "/developments",
      ...slugs("content/developments").map((s) => `/developments/${s}`),
      "/developers",
      ...slugs("content/developers").map((s) => `/developers/${s}`),
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
  },
} satisfies Config;
