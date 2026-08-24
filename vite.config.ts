import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

/**
 * Serve the Decap CMS admin at `/admin` (and `/admin/`) in dev. The app runs
 * SPA-mode (ssr:false), so React Router's catch-all would otherwise swallow the
 * bare `/admin/` request and render the app's 404. This dev-only middleware
 * returns the static admin page before the router sees it. (Production static
 * hosts resolve `/admin/` → `/admin/index.html` themselves.)
 */
function decapAdmin(): Plugin {
  return {
    name: "decap-admin-dev",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = (req.url ?? "").split("?")[0];
        if (path === "/admin" || path === "/admin/") {
          res.setHeader("Content-Type", "text/html");
          res.end(readFileSync(resolve("public/admin/index.html")));
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [decapAdmin(), tailwindcss(), reactRouter(), tsconfigPaths()],
  ssr: {
    /**
     * Bundle GSAP into the server build instead of leaving it as a bare import.
     *
     * GSAP's plugin subpaths (`gsap/ScrollTrigger`, `gsap/SplitText`) are
     * CJS/UMD. Vite externalises dependencies in the SSR build by default, so
     * the emitted server bundle kept real `import { ScrollTrigger } from
     * "gsap/ScrollTrigger"` statements and left Node to do the CJS→ESM interop
     * at runtime. Node's named-export detection worked locally but not inside
     * Vercel's traced function bundle, where it threw
     *
     *   SyntaxError: The requested module 'gsap/ScrollTrigger'
     *                does not provide an export named 'ScrollTrigger'
     *
     * That happens while the module graph is being instantiated — before any
     * route code runs — so it took down every server-rendered route at once:
     * /dashboard, /api/submit, /__manifest, even the 404. Only the prerendered
     * static pages survived, which made it look like a data problem.
     *
     * Listing gsap here makes Vite resolve and convert it at build time, so no
     * `gsap/*` import survives into the server output and there is no runtime
     * interop left to get wrong.
     */
    noExternal: ["gsap"],
  },
});
