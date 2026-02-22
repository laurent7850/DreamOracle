import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updateSettingsSchema = z.object({
  interpretationStyle: z.enum(["spiritual", "psychological", "balanced", "creative"]).optional(),
  language: z.enum(["fr", "en"]).optional(),
  notificationsEnabled: z.boolean().optional(),
  theme: z.enum(["dark", "midnight", "aurora", "cosmic", "ocean", "sunset"]).optional(),
  reminderTime: z.string().regex(/^\d{2}:\d{2}$/).nullable().optional(),
});

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = updateSettingsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const settings = await prisma.userSettings.upsert({
      where: { userId: session.user.id },
      update: {
        ...(data.interpretationStyle && {
          interpretationStyle: data.interpretationStyle,
        }),
        ...(data.language && { language: data.language }),
        ...(data.notificationsEnabled !== undefined && {
          notificationsEnabled: data.notificationsEnabled,
        }),
        ...(data.theme && { theme: data.theme }),
        ...(data.reminderTime !== undefined && {
          reminderTime: data.reminderTime,
        }),
      },
      create: {
        userId: session.user.id,
        interpretationStyle: data.interpretationStyle || "balanced",
        language: data.language || "fr",
        notificationsEnabled: data.notificationsEnabled ?? true,
        theme: data.theme || "dark",
        reminderTime: data.reminderTime,
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
