import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Prisma client singleton, constructed lazily.
 *
 * Prisma 7 connects via a driver adapter — here node-postgres pointed at the
 * POOLED Neon connection (`DATABASE_URL`); migrations use the direct URL via
 * prisma.config.ts. A global cache avoids exhausting connections under dev HMR
 * and serverless instance reuse.
 *
 * The client is built on first use rather than at import, because the database
 * is optional: the contact form works on SMTP alone, and a deploy with no
 * `DATABASE_URL` must be able to import this module (and render /dashboard's
 * empty state) without constructing an adapter for a connection that does not
 * exist.
 */
const globalForPrisma = globalThis as unknown as { __prisma?: PrismaClient };

/** True when a database connection string is present. */
export const dbConfigured = (): boolean => Boolean(process.env.DATABASE_URL);

export function getPrisma(): PrismaClient {
  if (!dbConfigured()) {
    throw new Error("DATABASE_URL is not set — no submissions database is configured.");
  }
  // Cached on globalThis so dev HMR and serverless instance reuse share one
  // client instead of opening a new pool on every reload or invocation.
  globalForPrisma.__prisma ??= new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });
  return globalForPrisma.__prisma;
}
