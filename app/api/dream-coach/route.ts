import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { chatWithDreamCoach, DreamCoachMessage } from "@/lib/claude";
import { hasFeature } from "@/lib/subscription";
import { z } from "zod";

const chatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().min(1).max(2000),
    })
  ),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Get user subscription
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        subscriptionTier: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Check if user has access to Dream Coach (PREMIUM only)
    const tier = user.subscriptionTier as "FREE" | "ESSENTIAL" | "PREMIUM";
    if (tier !== "PREMIUM") {
      return NextResponse.json(
        {
          error: "Dream Coach est une fonctionnalité Oracle+",
          upgradeRequired: true,
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = chatSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Données invalides", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { messages } = validation.data;

    // Get user's recent dreams for context
    const recentDreams = await prisma.dream.findMany({
      where: { userId: session.user.id },
      orderBy: { dreamDate: "desc" },
      take: 10,
      select: {
        title: true,
        content: true,
        dreamDate: true,
        interpretation: true,
        symbols: true,
      },
    });

    // Transform dreams for context
    const dreamContext = {
      userName: user.name || undefined,
      recentDreams: recentDreams.map((d) => ({
        title: d.title,
        content: d.content,
        dreamDate: d.dreamDate,
        interpretation: d.interpretation,
        symbols: JSON.parse(d.symbols || "[]") as string[],
      })),
    };

    // Chat with Dream Coach
    const response = await chatWithDreamCoach(
      messages as DreamCoachMessage[],
      dreamContext
    );

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Dream Coach error:", error);
    return NextResponse.json(
      { error: "Erreur du Dream Coach" },
      { status: 500 }
    );
  }
}
