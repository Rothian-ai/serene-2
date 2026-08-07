import { defineConfig } from "prisma/config";

/**
 * Prisma 7 keeps connection URLs out of schema.prisma. This URL is used by the
 * CLI for migrations/introspection — point it at Neon's DIRECT (non-pooled)
 * connection. The app runtime uses the POOLED `DATABASE_URL` (see db.server.ts).
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
});
