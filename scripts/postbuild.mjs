/**
 * React Router emits the static site to build/client (alongside a build/server
 * dir it deletes under ssr:false). Deploy tooling — Hostinger's GitHub builder
 * among others — expects a single conventional output folder with index.html at
 * its root, so mirror build/client to ./dist after every build.
 */
import { cpSync, existsSync, rmSync } from "node:fs";

const SRC = "build/client";
const OUT = "dist";

if (!existsSync(`${SRC}/index.html`)) {
  console.error(`postbuild: ${SRC}/index.html not found — build did not complete`);
  process.exit(1);
}

rmSync(OUT, { recursive: true, force: true });
cpSync(SRC, OUT, { recursive: true });

console.log(`postbuild: ${SRC} -> ${OUT}`);
