import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

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

    const updatedDream = await prisma.dream.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.content && { content: body.content }),
        ...(body.dreamDate && { dreamDate: new Date(body.dreamDate) }),
        ...(body.emotions && { emotions: JSON.stringify(body.emotions) }),
        ...(body.symbols && { symbols: JSON.stringify(body.symbols) }),
        ...(body.lucidity !== undefined && { lucidity: body.lucidity }),
        ...(body.interpretation && {
          interpretation: body.interpretation,
          interpretedAt: new Date(),
        }),
        ...(body.tags && { tags: JSON.stringify(body.tags) }),
        ...(body.isRecurring !== undefined && { isRecurring: body.isRecurring }),
        ...(body.mood && { mood: body.mood }),
        ...(body.sleepQuality && { sleepQuality: body.sleepQuality }),
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
