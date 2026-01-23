import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { interpretDream, formatInterpretationAsText } from "@/lib/claude";

const interpretSchema = z.object({
  dreamId: z.string(),
  style: z.enum(["spiritual", "psychological", "balanced"]).default("balanced"),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const validation = interpretSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { dreamId, style } = validation.data;

    // Get the dream
    const dream = await prisma.dream.findUnique({
      where: { id: dreamId },
    });

    if (!dream) {
      return NextResponse.json({ error: "Rêve non trouvé" }, { status: 404 });
    }

    if (dream.userId !== session.user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    // Get interpretation from Claude
    const emotions = JSON.parse(dream.emotions) as string[];
    const interpretation = await interpretDream(dream.content, emotions, style);

    // Format interpretation as text for storage
    const interpretationText = formatInterpretationAsText(interpretation);

    // Extract symbols from interpretation
    const symbols = interpretation.symbols.map((s) => s.name);

    // Update the dream with interpretation
    const updatedDream = await prisma.dream.update({
      where: { id: dreamId },
      data: {
        interpretation: interpretationText,
        interpretedAt: new Date(),
        symbols: JSON.stringify(symbols),
      },
    });

    return NextResponse.json({
      dream: {
        ...updatedDream,
        emotions: JSON.parse(updatedDream.emotions),
        symbols,
        tags: JSON.parse(updatedDream.tags),
      },
      interpretation,
    });
  } catch (error) {
    console.error("Error interpreting dream:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'interprétation du rêve" },
      { status: 500 }
    );
  }
}
