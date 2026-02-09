import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { checkCredits, logUsage } from "@/lib/credits";

const dreamSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  content: z.string().min(10, "Décrivez votre rêve en au moins 10 caractères"),
  dreamDate: z.string().transform((str) => new Date(str)),
  emotions: z.array(z.string()).default([]),
  lucidity: z.number().min(0).max(5).default(0),
  mood: z.string().optional(),
  sleepQuality: z.number().min(1).max(5).optional(),
  isRecurring: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

// GET - List user's dreams
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10"))); // Max 100 items
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    const where = {
      userId: session.user.id,
      ...(search && {
        OR: [
          { title: { contains: search } },
          { content: { contains: search } },
        ],
      }),
    };

    const [dreams, total] = await Promise.all([
      prisma.dream.findMany({
        where,
        orderBy: { dreamDate: "desc" },
        skip,
        take: limit,
      }),
      prisma.dream.count({ where }),
    ]);

    // Parse JSON strings for SQLite
    const parsedDreams = dreams.map((dream) => ({
      ...dream,
      emotions: JSON.parse(dream.emotions as string),
      symbols: JSON.parse(dream.symbols as string),
      tags: JSON.parse(dream.tags as string),
    }));

    return NextResponse.json({
      dreams: parsedDreams,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching dreams:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des rêves" },
      { status: 500 }
    );
  }
}

// POST - Create a new dream
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Check credits before processing
    const creditCheck = await checkCredits(session.user.id, 'dream');
    if (!creditCheck.allowed) {
      return NextResponse.json({
        error: creditCheck.message,
        code: 'CREDITS_EXHAUSTED',
        tier: creditCheck.tier,
        used: creditCheck.used,
        limit: creditCheck.limit,
        upgradeRecommendation: creditCheck.upgradeRecommendation,
      }, { status: 403 });
    }

    const body = await request.json();
    const validation = dreamSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = validation.data;

    const dream = await prisma.dream.create({
      data: {
        userId: session.user.id,
        title: data.title,
        content: data.content,
        dreamDate: data.dreamDate,
        emotions: JSON.stringify(data.emotions),
        lucidity: data.lucidity,
        mood: data.mood,
        sleepQuality: data.sleepQuality,
        isRecurring: data.isRecurring,
        tags: JSON.stringify(data.tags),
      },
    });

    // Log usage after successful creation
    await logUsage(session.user.id, 'dream', { dreamId: dream.id });

    return NextResponse.json(
      {
        ...dream,
        emotions: data.emotions,
        symbols: [],
        tags: data.tags,
        credits: {
          used: creditCheck.used + 1,
          limit: creditCheck.limit,
          remaining: creditCheck.remaining - 1,
          isUnlimited: creditCheck.isUnlimited,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating dream:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du rêve" },
      { status: 500 }
    );
  }
}
