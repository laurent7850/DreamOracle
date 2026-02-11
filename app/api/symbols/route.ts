import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

// GET - List user's symbol dictionary
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Check if user has access (PREMIUM only)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { subscriptionTier: true },
    });

    if (user?.subscriptionTier !== "PREMIUM") {
      return NextResponse.json(
        { error: "Fonctionnalité Oracle+", upgradeRequired: true },
        { status: 403 }
      );
    }

    const symbols = await prisma.userSymbol.findMany({
      where: { userId: session.user.id },
      orderBy: [{ occurrences: "desc" }, { name: "asc" }],
    });

    // Also get symbol stats from dreams
    const dreams = await prisma.dream.findMany({
      where: { userId: session.user.id },
      select: { symbols: true },
    });

    // Count occurrences from dreams
    const symbolCounts: Record<string, number> = {};
    for (const dream of dreams) {
      const dreamSymbols = JSON.parse(dream.symbols || "[]") as string[];
      for (const symbol of dreamSymbols) {
        symbolCounts[symbol.toLowerCase()] = (symbolCounts[symbol.toLowerCase()] || 0) + 1;
      }
    }

    return NextResponse.json({
      symbols,
      dreamSymbolCounts: symbolCounts,
    });
  } catch (error) {
    console.error("Get symbols error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}

const createSymbolSchema = z.object({
  name: z.string().min(1).max(100),
  meaning: z.string().min(1).max(1000),
  personalNote: z.string().max(500).optional(),
});

// POST - Add a symbol to dictionary
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Check subscription
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { subscriptionTier: true },
    });

    if (user?.subscriptionTier !== "PREMIUM") {
      return NextResponse.json(
        { error: "Fonctionnalité Oracle+", upgradeRequired: true },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = createSymbolSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Données invalides", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { name, meaning, personalNote } = validation.data;

    // Upsert - update if exists, create if not
    const symbol = await prisma.userSymbol.upsert({
      where: {
        userId_name: {
          userId: session.user.id,
          name: name.toLowerCase(),
        },
      },
      update: {
        meaning,
        personalNote,
        occurrences: { increment: 1 },
      },
      create: {
        userId: session.user.id,
        name: name.toLowerCase(),
        meaning,
        personalNote,
      },
    });

    return NextResponse.json({ symbol });
  } catch (error) {
    console.error("Create symbol error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création" },
      { status: 500 }
    );
  }
}
