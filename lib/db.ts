import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Configure Prisma with connection pool settings for production
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    // Configure datasources for connection pooling
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

// Always cache the client in production to prevent connection pool exhaustion
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
} else {
  // In production, ensure we reuse the same client across hot reloads
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown handler
if (typeof process !== "undefined") {
  process.on("beforeExit", async () => {
    await prisma.$disconnect();
  });
}

export default prisma;
