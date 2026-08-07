import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Prisma client singleton. Prisma 7 connects via a driver adapter — here the
 * node-postgres adapter pointed at the POOLED Neon connection (`DATABASE_URL`);
 * migrations use the direct URL via prisma.config.ts. A global cache avoids
 * exhausting connections under dev HMR / serverless reuse.
 */
const globalForPrisma = globalThis as unknown as { __prisma?: PrismaClient };

export const prisma =
  globalForPrisma.__prisma ??
  new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.__prisma = prisma;
