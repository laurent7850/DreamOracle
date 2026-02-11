import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/admin";
import { z } from "zod";

// GET - List all users with pagination and filters
export async function GET(request: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const search = searchParams.get("search") || "";
    const tier = searchParams.get("tier") || "";
    const status = searchParams.get("status") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { email: { contains: search } },
        { name: { contains: search } },
      ];
    }

    if (tier) {
      where.subscriptionTier = tier;
    }

    if (status) {
      where.subscriptionStatus = status;
    }

    // Get users with counts
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          createdAt: true,
          updatedAt: true,
          lastLoginAt: true,
          role: true,
          subscriptionTier: true,
          subscriptionStatus: true,
          subscriptionEnds: true,
          stripeCustomerId: true,
          stripeSubscriptionId: true,
          creditsResetAt: true,
          _count: {
            select: {
              dreams: true,
              usageLogs: true,
              sessions: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    // Get usage stats for each user (this month)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const usageStats = await prisma.usageLog.groupBy({
      by: ["userId", "action"],
      where: {
        userId: { in: users.map((u) => u.id) },
        createdAt: { gte: startOfMonth },
      },
      _count: true,
    });

    // Map usage stats to users
    const usageByUser = usageStats.reduce(
      (acc, stat) => {
        if (!acc[stat.userId]) {
          acc[stat.userId] = {};
        }
        acc[stat.userId][stat.action] = stat._count;
        return acc;
      },
      {} as Record<string, Record<string, number>>
    );

    const enrichedUsers = users.map((user) => ({
      ...user,
      monthlyUsage: usageByUser[user.id] || {},
    }));

    return NextResponse.json({
      users: enrichedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Admin users list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
