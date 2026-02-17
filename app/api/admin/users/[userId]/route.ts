import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/admin";
import { z } from "zod";

// GET - Get single user details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
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
        birthDate: true,
        // Explicitly omit: password, emailVerified
        _count: {
          select: {
            dreams: true,
            usageLogs: true,
            sessions: true,
            accounts: true,
            pushSubscriptions: true,
          },
        },
        dreams: {
          orderBy: { createdAt: "desc" },
          take: 10,
          select: {
            id: true,
            title: true,
            createdAt: true,
            dreamDate: true,
            interpretation: true,
          },
        },
        usageLogs: {
          orderBy: { createdAt: "desc" },
          take: 20,
          select: {
            id: true,
            action: true,
            createdAt: true,
            metadata: true,
          },
        },
        accounts: {
          select: {
            provider: true,
          },
        },
        settings: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get monthly usage breakdown
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyUsage = await prisma.usageLog.groupBy({
      by: ["action"],
      where: {
        userId,
        createdAt: { gte: startOfMonth },
      },
      _count: true,
    });

    return NextResponse.json({
      user,
      monthlyUsage: monthlyUsage.reduce(
        (acc, stat) => {
          acc[stat.action] = stat._count;
          return acc;
        },
        {} as Record<string, number>
      ),
    });
  } catch (error) {
    console.error("Admin get user error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// PATCH - Update user
const updateUserSchema = z.object({
  name: z.string().optional(),
  subscriptionTier: z.enum(["FREE", "ESSENTIAL", "PREMIUM"]).optional(),
  subscriptionStatus: z.enum(["active", "canceled", "past_due", "expired"]).optional(),
  subscriptionEnds: z.string().datetime().nullable().optional(),
  role: z.enum(["user", "admin"]).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await params;
    const body = await request.json();

    const validation = updateUserSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Transform subscriptionEnds if provided
    const updateData: Record<string, unknown> = { ...data };
    if (data.subscriptionEnds !== undefined) {
      updateData.subscriptionEnds = data.subscriptionEnds
        ? new Date(data.subscriptionEnds)
        : null;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        subscriptionTier: true,
        subscriptionStatus: true,
        subscriptionEnds: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Admin update user error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await params;

    // Delete user and all related data (cascades due to schema)
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin delete user error:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
