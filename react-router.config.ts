import type { Config } from "@react-router/dev/config";

/**
 * Alpha (coming-soon): static single-page build. Only the homepage is
 * prerendered; the catch-all route serves the same hero for any other path.
 */
export default {
  ssr: false,
  async prerender() {
    return ["/"];
  },
} satisfies Config;
