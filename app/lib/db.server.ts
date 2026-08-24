import type { PrismaClient } from "@prisma/client";

/**
 * Prisma access, loaded entirely on demand.
 *
 * WHY THE IMPORTS ARE DYNAMIC — this is load-bearing, please do not "tidy" it
 * back into top-level imports.
 *
 * React Router bundles every server route into a single Vercel function. Any
 * module-scope code that throws while that bundle is being imported takes the
 * whole site's server side down with it — not just the route that needed it.
 * That is exactly what happened in production: every server route returned
 * FUNCTION_INVOCATION_FAILED, including `/dashboard/login` and a three-line
 * JSON loader that never touch the database, because `@prisma/client` was
 * imported at the top of this file and failed to resolve inside the function.
 *
 * So: `@prisma/client` and `@prisma/adapter-pg` are imported inside
 * `getPrisma()` only. The type-only import above is erased at compile time and
 * emits no runtime require. `dbConfigured()` is a plain environment check with
 * no dependencies at all, so callers can branch on it without loading anything.
 *
 * The consequence is that a missing or broken Prisma install degrades to "no
 * submissions database" — the contact form still emails, `/dashboard` still
 * renders its empty state — instead of a site-wide 500.
 */

const globalForPrisma = globalThis as unknown as { __prisma?: PrismaClient };

/** True when a database connection string is present. Loads nothing. */
export const dbConfigured = (): boolean => Boolean(process.env.DATABASE_URL);

/**
 * The Prisma client, constructed on first use. Async because the driver and
 * adapter are imported lazily; callers must await it.
 *
 * Throws if there is no `DATABASE_URL`, or if Prisma cannot be loaded. Both are
 * caught by the callers, which treat persistence as best-effort.
 */
export async function getPrisma(): Promise<PrismaClient> {
  if (!dbConfigured()) {
    throw new Error("DATABASE_URL is not set — no submissions database is configured.");
  }
  if (!globalForPrisma.__prisma) {
    const [{ PrismaClient }, { PrismaPg }] = await Promise.all([
      import("@prisma/client"),
      import("@prisma/adapter-pg"),
    ]);
    // Cached on globalThis so dev HMR and serverless instance reuse share one
    // client instead of opening a new pool on every reload or invocation.
    globalForPrisma.__prisma = new PrismaClient({
      adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
    });
  }
  return globalForPrisma.__prisma;
}
