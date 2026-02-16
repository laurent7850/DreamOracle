import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { calculateBiorhythm, calculateBiorhythmRange, findCriticalDays } from "@/lib/biorhythm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { birthDate: true },
    });

    if (!user?.birthDate) {
      return NextResponse.json({ needsBirthDate: true }, { status: 200 });
    }

    const searchParams = request.nextUrl.searchParams;
    const dateStr = searchParams.get("date");
    const targetDate = dateStr ? new Date(dateStr) : new Date();

    // Calculate today's biorhythm
    const cycles = calculateBiorhythm(user.birthDate, targetDate);

    // Calculate 30-day range for chart (15 days before, 15 days after)
    const startDate = new Date(targetDate);
    startDate.setDate(startDate.getDate() - 15);
    const endDate = new Date(targetDate);
    endDate.setDate(endDate.getDate() + 15);
    const chartData = calculateBiorhythmRange(user.birthDate, startDate, endDate);

    // Find upcoming critical days
    const criticalDays = findCriticalDays(user.birthDate, targetDate, 14);

    return NextResponse.json({
      cycles,
      chartData,
      criticalDays,
      targetDate: targetDate.toISOString(),
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

    const { birthDate } = await request.json();
    if (!birthDate) {
      return NextResponse.json({ error: "Date de naissance requise" }, { status: 400 });
    }

    const parsed = new Date(birthDate);
    if (isNaN(parsed.getTime())) {
      return NextResponse.json({ error: "Date invalide" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { birthDate: parsed },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Birth date save error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
