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

    return NextResponse.json(dream);
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
        ...(body.emotions && { emotions: body.emotions }),
        ...(body.symbols && { symbols: body.symbols }),
        ...(body.lucidity !== undefined && { lucidity: body.lucidity }),
        ...(body.interpretation && {
          interpretation: body.interpretation,
          interpretedAt: new Date(),
        }),
        ...(body.tags && { tags: body.tags }),
        ...(body.isRecurring !== undefined && { isRecurring: body.isRecurring }),
        ...(body.mood && { mood: body.mood }),
        ...(body.sleepQuality && { sleepQuality: body.sleepQuality }),
      },
    });

    return NextResponse.json(updatedDream);
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
