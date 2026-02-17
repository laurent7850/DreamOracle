import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { calculateBiorhythm, calculateBiorhythmRange, findCriticalDays } from "@/lib/biorhythm";
import { hasFeature, type SubscriptionTier } from "@/lib/subscription";
import { z } from "zod";

const birthDateSchema = z.object({
  birthDate: z.string().refine((val) => {
    const d = new Date(val);
    if (isNaN(d.getTime())) return false;
    // Must be in the past and after 1900
    const now = new Date();
    return d < now && d.getFullYear() >= 1900;
  }, { message: "Date de naissance invalide" }),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { birthDate: true, subscriptionTier: true },
    });

    if (!user?.birthDate) {
      return NextResponse.json({ needsBirthDate: true }, { status: 200 });
    }

    const tier = (user.subscriptionTier || 'FREE') as SubscriptionTier;
    const hasAdvanced = hasFeature(tier, 'advancedBiorhythm');

    const searchParams = request.nextUrl.searchParams;
    const dateStr = searchParams.get("date");
    const targetDate = dateStr ? new Date(dateStr) : new Date();

    // Calculate today's biorhythm
    const cycles = calculateBiorhythm(user.birthDate, targetDate);

    // Calculate 60-day range for chart (30 days before, 30 days after)
    const startDate = new Date(targetDate);
    startDate.setDate(startDate.getDate() - 30);
    const endDate = new Date(targetDate);
    endDate.setDate(endDate.getDate() + 30);
    const chartData = calculateBiorhythmRange(user.birthDate, startDate, endDate);

    // Find upcoming critical days (within 30 days) - only for advanced tier
    const criticalDays = hasAdvanced
      ? findCriticalDays(user.birthDate, targetDate, 30)
      : [];

    // Compute daysSinceBirth for chart start so client can super-sample sine curves
    const birthMs = new Date(user.birthDate.getFullYear(), user.birthDate.getMonth(), user.birthDate.getDate()).getTime();
    const startMs = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime();
    const daysSinceBirthAtStart = Math.floor((startMs - birthMs) / (1000 * 60 * 60 * 24));

    return NextResponse.json({
      cycles,
      chartData,
      criticalDays,
      targetDate: targetDate.toISOString(),
      hasAdvanced,
      daysSinceBirthAtStart,
    });
  } catch (error) {
    console.error("Biorhythm error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// Save birth date
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = birthDateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Date de naissance invalide" },
        { status: 400 }
      );
    }

    const birthDate = new Date(parsed.data.birthDate);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { birthDate },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Birth date save error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
