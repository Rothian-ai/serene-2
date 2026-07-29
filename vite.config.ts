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
});
