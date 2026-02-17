import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { hasFeatureAccess } from "@/lib/subscription";
import { z } from "zod";

// GET - Export user data as JSON backup
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check premium access
    const hasAccess = await hasFeatureAccess(session.user.id, "cloudBackup");
    if (!hasAccess) {
      return NextResponse.json(
        { error: "Premium feature", upgradeRequired: true },
        { status: 403 }
      );
    }

    // Fetch all user data
    const [user, dreams, settings, symbols] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          name: true,
          email: true,
          createdAt: true,
        },
      }),
      prisma.dream.findMany({
        where: { userId: session.user.id },
        orderBy: { dreamDate: "desc" },
      }),
      prisma.userSettings.findUnique({
        where: { userId: session.user.id },
      }),
      prisma.userSymbol.findMany({
        where: { userId: session.user.id },
      }),
    ]);

    const backup = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      user: {
        name: user?.name,
        email: user?.email,
        createdAt: user?.createdAt,
      },
      settings: settings
        ? {
            interpretationStyle: settings.interpretationStyle,
            language: settings.language,
            notificationsEnabled: settings.notificationsEnabled,
            reminderTime: settings.reminderTime,
            theme: settings.theme,
          }
        : null,
      dreams: dreams.map((d) => ({
        title: d.title,
        content: d.content,
        dreamDate: d.dreamDate,
        emotions: d.emotions,
        symbols: d.symbols,
        lucidity: d.lucidity,
        interpretation: d.interpretation,
        tags: d.tags,
        isRecurring: d.isRecurring,
        mood: d.mood,
        sleepQuality: d.sleepQuality,
        createdAt: d.createdAt,
      })),
      symbols: symbols.map((s) => ({
        name: s.name,
        meaning: s.meaning,
        personalNote: s.personalNote,
        occurrences: s.occurrences,
        createdAt: s.createdAt,
      })),
      stats: {
        totalDreams: dreams.length,
        totalSymbols: symbols.length,
      },
    };

    return NextResponse.json(backup);
  } catch (error) {
    console.error("Backup export error:", error);
    return NextResponse.json(
      { error: "Failed to export backup" },
      { status: 500 }
    );
  }
}

// POST - Import user data from JSON backup
const importSchema = z.object({
  version: z.string().max(10),
  dreams: z.array(
    z.object({
      title: z.string().max(200),
      content: z.string().max(10000),
      dreamDate: z.string(),
      emotions: z.string().max(2000).optional().default("[]"),
      symbols: z.string().max(5000).optional().default("[]"),
      lucidity: z.number().min(0).max(5).optional().default(0),
      interpretation: z.string().max(20000).nullable().optional(),
      tags: z.string().max(2000).optional().default("[]"),
      isRecurring: z.boolean().optional().default(false),
      mood: z.string().max(50).nullable().optional(),
      sleepQuality: z.number().min(1).max(5).nullable().optional(),
      createdAt: z.string().optional(),
    })
  ).max(1000).optional().default([]),
  symbols: z.array(
    z.object({
      name: z.string().max(100),
      meaning: z.string().max(2000),
      personalNote: z.string().max(2000).nullable().optional(),
      occurrences: z.number().min(0).max(10000).optional().default(1),
      createdAt: z.string().optional(),
    })
  ).max(500).optional().default([]),
  settings: z.object({
    interpretationStyle: z.string().max(50).optional(),
    language: z.string().max(10).optional(),
    notificationsEnabled: z.boolean().optional(),
    reminderTime: z.string().max(10).nullable().optional(),
    theme: z.string().max(50).optional(),
  }).nullable().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check premium access
    const hasAccess = await hasFeatureAccess(session.user.id, "cloudBackup");
    if (!hasAccess) {
      return NextResponse.json(
        { error: "Premium feature", upgradeRequired: true },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = importSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid backup format", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const results = {
      dreamsImported: 0,
      dreamsSkipped: 0,
      symbolsImported: 0,
      symbolsSkipped: 0,
      settingsUpdated: false,
    };

    // Import dreams (skip duplicates based on title + dreamDate)
    for (const dream of data.dreams) {
      const dreamDate = new Date(dream.dreamDate);

      // Check for existing dream with same title and date
      const existing = await prisma.dream.findFirst({
        where: {
          userId: session.user.id,
          title: dream.title,
          dreamDate: {
            gte: new Date(dreamDate.getTime() - 60000), // Within 1 minute
            lte: new Date(dreamDate.getTime() + 60000),
          },
        },
      });

      if (existing) {
        results.dreamsSkipped++;
        continue;
      }

      await prisma.dream.create({
        data: {
          userId: session.user.id,
          title: dream.title,
          content: dream.content,
          dreamDate: dreamDate,
          emotions: dream.emotions || "[]",
          symbols: dream.symbols || "[]",
          lucidity: dream.lucidity || 0,
          interpretation: dream.interpretation || null,
          tags: dream.tags || "[]",
          isRecurring: dream.isRecurring || false,
          mood: dream.mood || null,
          sleepQuality: dream.sleepQuality || null,
        },
      });
      results.dreamsImported++;
    }

    // Import symbols (upsert based on name)
    for (const symbol of data.symbols) {
      try {
        await prisma.userSymbol.upsert({
          where: {
            userId_name: {
              userId: session.user.id,
              name: symbol.name,
            },
          },
          update: {
            meaning: symbol.meaning,
            personalNote: symbol.personalNote || null,
            occurrences: symbol.occurrences || 1,
          },
          create: {
            userId: session.user.id,
            name: symbol.name,
            meaning: symbol.meaning,
            personalNote: symbol.personalNote || null,
            occurrences: symbol.occurrences || 1,
          },
        });
        results.symbolsImported++;
      } catch {
        results.symbolsSkipped++;
      }
    }

    // Update settings if provided
    if (data.settings) {
      await prisma.userSettings.upsert({
        where: { userId: session.user.id },
        update: {
          ...(data.settings.interpretationStyle && {
            interpretationStyle: data.settings.interpretationStyle,
          }),
          ...(data.settings.language && { language: data.settings.language }),
          ...(data.settings.theme && { theme: data.settings.theme }),
          ...(data.settings.notificationsEnabled !== undefined && {
            notificationsEnabled: data.settings.notificationsEnabled,
          }),
          ...(data.settings.reminderTime !== undefined && {
            reminderTime: data.settings.reminderTime,
          }),
        },
        create: {
          userId: session.user.id,
          interpretationStyle: data.settings.interpretationStyle || "balanced",
          language: data.settings.language || "fr",
          theme: data.settings.theme || "dark",
          notificationsEnabled: data.settings.notificationsEnabled ?? true,
          reminderTime: data.settings.reminderTime || null,
        },
      });
      results.settingsUpdated = true;
    }

    return NextResponse.json({
      success: true,
      message: "Import completed",
      results,
    });
  } catch (error) {
    console.error("Backup import error:", error);
    return NextResponse.json(
      { error: "Failed to import backup" },
      { status: 500 }
    );
  }
}
