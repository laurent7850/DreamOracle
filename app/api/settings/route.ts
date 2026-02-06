import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();

    const settings = await prisma.userSettings.upsert({
      where: { userId: session.user.id },
      update: {
        ...(body.interpretationStyle && {
          interpretationStyle: body.interpretationStyle,
        }),
        ...(body.language && { language: body.language }),
        ...(body.notificationsEnabled !== undefined && {
          notificationsEnabled: body.notificationsEnabled,
        }),
        ...(body.theme && { theme: body.theme }),
        ...(body.reminderTime !== undefined && {
          reminderTime: body.reminderTime,
        }),
        ...(body.reminderDays !== undefined && {
          reminderDays: body.reminderDays,
        }),
      },
      create: {
        userId: session.user.id,
        interpretationStyle: body.interpretationStyle || "balanced",
        language: body.language || "fr",
        notificationsEnabled: body.notificationsEnabled ?? true,
        theme: body.theme || "dark",
        reminderTime: body.reminderTime,
        reminderDays: body.reminderDays || "[0,1,2,3,4,5,6]",
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour des paramètres" },
      { status: 500 }
    );
  }
}
