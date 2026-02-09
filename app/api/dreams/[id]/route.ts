import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// Schema for PATCH updates
const updateDreamSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(10).max(10000).optional(),
  dreamDate: z.string().datetime().optional(),
  emotions: z.array(z.string().max(50)).max(20).optional(),
  symbols: z.array(z.string().max(100)).max(50).optional(),
  lucidity: z.number().min(0).max(5).optional(),
  interpretation: z.string().max(20000).optional(),
  tags: z.array(z.string().max(50)).max(30).optional(),
  isRecurring: z.boolean().optional(),
  mood: z.string().max(50).optional(),
  sleepQuality: z.number().min(1).max(5).optional(),
});

// GET - Get a single dream
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const dream = await prisma.dream.findUnique({
      where: { id },
    });

    if (!dream) {
      return NextResponse.json({ error: "Rêve non trouvé" }, { status: 404 });
    }

    if (dream.userId !== session.user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    // Parse JSON strings for SQLite
    return NextResponse.json({
      ...dream,
      emotions: JSON.parse(dream.emotions as string),
      symbols: JSON.parse(dream.symbols as string),
      tags: JSON.parse(dream.tags as string),
    });
  } catch (error) {
    console.error("Error fetching dream:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du rêve" },
      { status: 500 }
    );
  }
}

// PATCH - Update a dream
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const dream = await prisma.dream.findUnique({
      where: { id },
    });

    if (!dream) {
      return NextResponse.json({ error: "Rêve non trouvé" }, { status: 404 });
    }

    if (dream.userId !== session.user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const body = await request.json();

    // Validate request body
    const validation = updateDreamSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = validation.data;

    const updatedDream = await prisma.dream.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.content && { content: data.content }),
        ...(data.dreamDate && { dreamDate: new Date(data.dreamDate) }),
        ...(data.emotions && { emotions: JSON.stringify(data.emotions) }),
        ...(data.symbols && { symbols: JSON.stringify(data.symbols) }),
        ...(data.lucidity !== undefined && { lucidity: data.lucidity }),
        ...(data.interpretation && {
          interpretation: data.interpretation,
          interpretedAt: new Date(),
        }),
        ...(data.tags && { tags: JSON.stringify(data.tags) }),
        ...(data.isRecurring !== undefined && { isRecurring: data.isRecurring }),
        ...(data.mood && { mood: data.mood }),
        ...(data.sleepQuality && { sleepQuality: data.sleepQuality }),
      },
    });

    // Parse JSON strings for response
    return NextResponse.json({
      ...updatedDream,
      emotions: JSON.parse(updatedDream.emotions as string),
      symbols: JSON.parse(updatedDream.symbols as string),
      tags: JSON.parse(updatedDream.tags as string),
    });
  } catch (error) {
    console.error("Error updating dream:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du rêve" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a dream
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const dream = await prisma.dream.findUnique({
      where: { id },
    });

    if (!dream) {
      return NextResponse.json({ error: "Rêve non trouvé" }, { status: 404 });
    }

    if (dream.userId !== session.user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    await prisma.dream.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Rêve supprimé avec succès" });
  } catch (error) {
    console.error("Error deleting dream:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du rêve" },
      { status: 500 }
    );
  }
}
