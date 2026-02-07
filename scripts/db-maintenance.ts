/**
 * Database Maintenance Script
 * Run periodically to clean up expired sessions and optimize database
 *
 * Usage: npx tsx scripts/db-maintenance.ts
 * Or via cron: 0 3 * * * cd /app && npx tsx scripts/db-maintenance.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanupExpiredSessions() {
  console.log("🧹 Cleaning up expired sessions...");

  const result = await prisma.session.deleteMany({
    where: {
      expires: {
        lt: new Date(),
      },
    },
  });

  console.log(`   Deleted ${result.count} expired sessions`);
  return result.count;
}

async function cleanupExpiredVerificationTokens() {
  console.log("🧹 Cleaning up expired verification tokens...");

  const result = await prisma.verificationToken.deleteMany({
    where: {
      expires: {
        lt: new Date(),
      },
    },
  });

  console.log(`   Deleted ${result.count} expired tokens`);
  return result.count;
}

async function cleanupOrphanedPushSubscriptions() {
  console.log("🧹 Cleaning up orphaned push subscriptions...");

  // Find subscriptions older than 90 days that might be stale
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const result = await prisma.pushSubscription.deleteMany({
    where: {
      createdAt: {
        lt: ninetyDaysAgo,
      },
    },
  });

  console.log(`   Deleted ${result.count} stale push subscriptions`);
  return result.count;
}

async function getDatabaseStats() {
  console.log("\n📊 Database Statistics:");

  const [users, dreams, sessions, pushSubs] = await Promise.all([
    prisma.user.count(),
    prisma.dream.count(),
    prisma.session.count(),
    prisma.pushSubscription.count(),
  ]);

  console.log(`   Users: ${users}`);
  console.log(`   Dreams: ${dreams}`);
  console.log(`   Active Sessions: ${sessions}`);
  console.log(`   Push Subscriptions: ${pushSubs}`);

  // Average dreams per user
  if (users > 0) {
    console.log(`   Average dreams/user: ${(dreams / users).toFixed(2)}`);
  }

  return { users, dreams, sessions, pushSubs };
}

async function main() {
  console.log("🚀 Starting database maintenance...\n");
  console.log(`   Time: ${new Date().toISOString()}\n`);

  try {
    // Run cleanup tasks
    await cleanupExpiredSessions();
    await cleanupExpiredVerificationTokens();
    await cleanupOrphanedPushSubscriptions();

    // Get stats
    await getDatabaseStats();

    console.log("\n✅ Maintenance completed successfully!");
  } catch (error) {
    console.error("❌ Maintenance failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
