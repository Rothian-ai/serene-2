import { defineConfig } from "prisma/config";
import { existsSync } from "node:fs";

/**
 * Prisma 7 keeps connection URLs out of schema.prisma, and its CLI no longer
 * auto-loads `.env` — so load it here (when present) or `prisma db push` /
 * `migrate` can't see DIRECT_URL locally. On Vercel/CI the vars are already in
 * the environment, so the file simply won't exist.
 *
 * Migrations use Neon's DIRECT (non-pooled) connection; the app runtime uses the
 * POOLED `DATABASE_URL` (see app/lib/db.server.ts).
 */
if (existsSync(".env")) {
  try {
    process.loadEnvFile(".env");
  } catch {
    // Node < 20.12 has no loadEnvFile; the vars must then come from the shell.
  }
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
});
