import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: NextRequest) {
  // Verify authorization
  const authHeader = request.headers.get("authorization");
  if (!authHeader || authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check for duplicate emails in users
    const duplicateEmails = await prisma.$queryRaw<{ email: string; count: bigint }[]>`
      SELECT email, COUNT(*) as count
      FROM "User"
      GROUP BY email
      HAVING COUNT(*) > 1
    `;

    // Check for duplicate userIds in UserSettings
    const duplicateSettings = await prisma.$queryRaw<{ userId: string; count: bigint }[]>`
      SELECT "userId", COUNT(*) as count
      FROM "UserSettings"
      GROUP BY "userId"
      HAVING COUNT(*) > 1
    `;

    // Check for duplicate endpoints in PushSubscription
    const duplicatePushSubs = await prisma.$queryRaw<{ endpoint: string; count: bigint }[]>`
      SELECT endpoint, COUNT(*) as count
      FROM "PushSubscription"
      GROUP BY endpoint
      HAVING COUNT(*) > 1
    `;

    // Check for orphaned records (records with no matching user)
    const orphanedSettings = await prisma.$queryRaw<{ id: string }[]>`
      SELECT us.id
      FROM "UserSettings" us
      LEFT JOIN "User" u ON us."userId" = u.id
      WHERE u.id IS NULL
    `;

    const orphanedDreams = await prisma.$queryRaw<{ id: string }[]>`
      SELECT d.id
      FROM "Dream" d
      LEFT JOIN "User" u ON d."userId" = u.id
      WHERE u.id IS NULL
    `;

    const orphanedAccounts = await prisma.$queryRaw<{ id: string }[]>`
      SELECT a.id
      FROM "Account" a
      LEFT JOIN "User" u ON a."userId" = u.id
      WHERE u.id IS NULL
    `;

    const orphanedPushSubs = await prisma.$queryRaw<{ id: string }[]>`
      SELECT ps.id
      FROM "PushSubscription" ps
      LEFT JOIN "User" u ON ps."userId" = u.id
      WHERE u.id IS NULL
    `;

    const orphanedUsageLogs = await prisma.$queryRaw<{ id: string }[]>`
      SELECT ul.id
      FROM "UsageLog" ul
      LEFT JOIN "User" u ON ul."userId" = u.id
      WHERE u.id IS NULL
    `;

    // Get all users with their data counts
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        _count: {
          select: {
            dreams: true,
            accounts: true,
            pushSubscriptions: true,
            usageLogs: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      success: true,
      duplicates: {
        emails: duplicateEmails.map(d => ({ email: d.email, count: Number(d.count) })),
        settings: duplicateSettings.map(d => ({ userId: d.userId, count: Number(d.count) })),
        pushSubscriptions: duplicatePushSubs.map(d => ({ endpoint: d.endpoint.substring(0, 50) + "...", count: Number(d.count) })),
      },
      orphanedRecords: {
        settings: orphanedSettings.length,
        dreams: orphanedDreams.length,
        accounts: orphanedAccounts.length,
        pushSubscriptions: orphanedPushSubs.length,
        usageLogs: orphanedUsageLogs.length,
      },
      users: users.map(u => ({
        id: u.id,
        email: u.email,
        name: u.name,
        createdAt: u.createdAt,
        counts: u._count,
      })),
    });
  } catch (error) {
    console.error("Check duplicates error:", error);
    return NextResponse.json(
      { error: "Failed to check duplicates", details: String(error) },
      { status: 500 }
    );
  }
}
