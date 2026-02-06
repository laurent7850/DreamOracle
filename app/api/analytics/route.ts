import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get all dreams for the user
    const dreams = await prisma.dream.findMany({
      where: { userId },
      orderBy: { dreamDate: "desc" },
      select: {
        id: true,
        dreamDate: true,
        emotions: true,
        symbols: true,
        lucidity: true,
        mood: true,
        sleepQuality: true,
        interpretation: true,
        tags: true,
        isRecurring: true,
        createdAt: true,
      },
    });

    // Basic counts
    const totalDreams = dreams.length;
    const interpretedDreams = dreams.filter((d) => d.interpretation).length;
    const lucidDreams = dreams.filter((d) => d.lucidity >= 3).length;
    const recurringDreams = dreams.filter((d) => d.isRecurring).length;

    // Calculate streaks
    const streakData = calculateStreaks(dreams);

    // Dreams per month (last 12 months)
    const dreamsPerMonth = calculateDreamsPerMonth(dreams);

    // Dreams per day of week
    const dreamsPerDayOfWeek = calculateDreamsPerDayOfWeek(dreams);

    // Emotion frequency
    const emotionFrequency = calculateEmotionFrequency(dreams);

    // Symbol frequency (top 20)
    const symbolFrequency = calculateSymbolFrequency(dreams);

    // Tag frequency
    const tagFrequency = calculateTagFrequency(dreams);

    // Mood distribution
    const moodDistribution = calculateMoodDistribution(dreams);

    // Sleep quality trends (last 30 days)
    const sleepQualityTrend = calculateSleepQualityTrend(dreams);

    // Lucidity distribution
    const lucidityDistribution = calculateLucidityDistribution(dreams);

    // Activity heatmap (last 365 days)
    const activityHeatmap = calculateActivityHeatmap(dreams);

    // Best dream day
    const bestDreamDay = getBestDreamDay(dreamsPerDayOfWeek);

    // Average dreams per week
    const avgDreamsPerWeek = calculateAvgDreamsPerWeek(dreams);

    // User since
    const userSince = dreams.length > 0
      ? dreams[dreams.length - 1].dreamDate
      : new Date();

    return NextResponse.json({
      overview: {
        totalDreams,
        interpretedDreams,
        lucidDreams,
        recurringDreams,
        avgDreamsPerWeek,
        bestDreamDay,
        userSince,
      },
      streaks: streakData,
      charts: {
        dreamsPerMonth,
        dreamsPerDayOfWeek,
        emotionFrequency,
        symbolFrequency,
        tagFrequency,
        moodDistribution,
        sleepQualityTrend,
        lucidityDistribution,
        activityHeatmap,
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Erreur lors du calcul des statistiques" },
      { status: 500 }
    );
  }
}

interface DreamData {
  id: string;
  dreamDate: Date;
  emotions: string;
  symbols: string;
  lucidity: number;
  mood: string | null;
  sleepQuality: number | null;
  interpretation: string | null;
  tags: string;
  isRecurring: boolean;
  createdAt: Date;
}

function calculateStreaks(dreams: DreamData[]) {
  if (dreams.length === 0) {
    return { currentStreak: 0, longestStreak: 0, thisWeek: 0, thisMonth: 0 };
  }

  // Sort by date descending
  const sortedDreams = [...dreams].sort(
    (a, b) => new Date(b.dreamDate).getTime() - new Date(a.dreamDate).getTime()
  );

  // Get unique dates (one dream per day counts)
  const uniqueDates = new Set<string>();
  sortedDreams.forEach((d) => {
    uniqueDates.add(new Date(d.dreamDate).toISOString().split("T")[0]);
  });
  const dates = Array.from(uniqueDates).sort().reverse();

  // Calculate current streak
  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < dates.length; i++) {
    const dreamDate = new Date(dates[i]);
    dreamDate.setHours(0, 0, 0, 0);

    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);
    expectedDate.setHours(0, 0, 0, 0);

    // Allow yesterday as start of streak
    if (i === 0) {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      if (dreamDate.getTime() !== today.getTime() &&
          dreamDate.getTime() !== yesterday.getTime()) {
        break;
      }
    }

    const diffDays = Math.floor(
      (today.getTime() - dreamDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays <= i + 1) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 1;

  for (let i = 1; i < dates.length; i++) {
    const prevDate = new Date(dates[i - 1]);
    const currDate = new Date(dates[i]);
    const diffDays = Math.floor(
      (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  // This week
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
  startOfWeek.setHours(0, 0, 0, 0);

  const thisWeek = dreams.filter((d) => new Date(d.dreamDate) >= startOfWeek).length;

  // This month
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const thisMonth = dreams.filter((d) => new Date(d.dreamDate) >= startOfMonth).length;

  return { currentStreak, longestStreak, thisWeek, thisMonth };
}

function calculateDreamsPerMonth(dreams: DreamData[]) {
  const months: Record<string, number> = {};
  const now = new Date();

  // Initialize last 12 months
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    months[key] = 0;
  }

  // Count dreams
  dreams.forEach((dream) => {
    const date = new Date(dream.dreamDate);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (key in months) {
      months[key]++;
    }
  });

  return Object.entries(months).map(([month, count]) => ({
    month,
    label: new Date(month + "-01").toLocaleDateString("fr-FR", { month: "short" }),
    count,
  }));
}

function calculateDreamsPerDayOfWeek(dreams: DreamData[]) {
  const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
  const counts = [0, 0, 0, 0, 0, 0, 0];

  dreams.forEach((dream) => {
    const dayOfWeek = new Date(dream.dreamDate).getDay();
    counts[dayOfWeek]++;
  });

  // Reorder to start from Monday
  return [
    { day: "Lun", count: counts[1] },
    { day: "Mar", count: counts[2] },
    { day: "Mer", count: counts[3] },
    { day: "Jeu", count: counts[4] },
    { day: "Ven", count: counts[5] },
    { day: "Sam", count: counts[6] },
    { day: "Dim", count: counts[0] },
  ];
}

function calculateEmotionFrequency(dreams: DreamData[]) {
  const emotions: Record<string, number> = {};

  dreams.forEach((dream) => {
    try {
      const dreamEmotions = JSON.parse(dream.emotions || "[]");
      dreamEmotions.forEach((emotion: string) => {
        const normalized = emotion.toLowerCase().trim();
        if (normalized) {
          emotions[normalized] = (emotions[normalized] || 0) + 1;
        }
      });
    } catch {
      // Ignore parse errors
    }
  });

  return Object.entries(emotions)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([emotion, count]) => ({ emotion, count }));
}

function calculateSymbolFrequency(dreams: DreamData[]) {
  const symbols: Record<string, number> = {};

  dreams.forEach((dream) => {
    try {
      const dreamSymbols = JSON.parse(dream.symbols || "[]");
      dreamSymbols.forEach((symbol: string) => {
        const normalized = symbol.toLowerCase().trim();
        if (normalized) {
          symbols[normalized] = (symbols[normalized] || 0) + 1;
        }
      });
    } catch {
      // Ignore parse errors
    }
  });

  return Object.entries(symbols)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([symbol, count]) => ({ symbol, count }));
}

function calculateTagFrequency(dreams: DreamData[]) {
  const tags: Record<string, number> = {};

  dreams.forEach((dream) => {
    try {
      const dreamTags = JSON.parse(dream.tags || "[]");
      dreamTags.forEach((tag: string) => {
        const normalized = tag.toLowerCase().trim();
        if (normalized) {
          tags[normalized] = (tags[normalized] || 0) + 1;
        }
      });
    } catch {
      // Ignore parse errors
    }
  });

  return Object.entries(tags)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, count }));
}

function calculateMoodDistribution(dreams: DreamData[]) {
  const moods: Record<string, number> = {
    positif: 0,
    neutre: 0,
    négatif: 0,
    mitigé: 0,
  };

  dreams.forEach((dream) => {
    if (dream.mood) {
      const normalized = dream.mood.toLowerCase();
      if (normalized in moods) {
        moods[normalized]++;
      }
    }
  });

  return Object.entries(moods)
    .filter(([_, count]) => count > 0)
    .map(([mood, count]) => ({ mood, count }));
}

function calculateSleepQualityTrend(dreams: DreamData[]) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentDreams = dreams
    .filter((d) => new Date(d.dreamDate) >= thirtyDaysAgo && d.sleepQuality !== null)
    .sort((a, b) => new Date(a.dreamDate).getTime() - new Date(b.dreamDate).getTime());

  return recentDreams.map((dream) => ({
    date: new Date(dream.dreamDate).toISOString().split("T")[0],
    quality: dream.sleepQuality,
  }));
}

function calculateLucidityDistribution(dreams: DreamData[]) {
  const levels = [0, 0, 0, 0, 0, 0]; // 0-5

  dreams.forEach((dream) => {
    if (dream.lucidity >= 0 && dream.lucidity <= 5) {
      levels[dream.lucidity]++;
    }
  });

  return levels.map((count, level) => ({
    level,
    label: level === 0 ? "Non lucide" : level === 5 ? "Totalement lucide" : `Niveau ${level}`,
    count,
  }));
}

function calculateActivityHeatmap(dreams: DreamData[]) {
  const heatmap: Record<string, number> = {};
  const today = new Date();

  // Initialize last 365 days
  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const key = date.toISOString().split("T")[0];
    heatmap[key] = 0;
  }

  // Count dreams
  dreams.forEach((dream) => {
    const key = new Date(dream.dreamDate).toISOString().split("T")[0];
    if (key in heatmap) {
      heatmap[key]++;
    }
  });

  return Object.entries(heatmap)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, count]) => ({ date, count }));
}

function getBestDreamDay(dreamsPerDayOfWeek: { day: string; count: number }[]) {
  const best = dreamsPerDayOfWeek.reduce((max, curr) =>
    curr.count > max.count ? curr : max
  );
  return best.count > 0 ? best.day : null;
}

function calculateAvgDreamsPerWeek(dreams: DreamData[]) {
  if (dreams.length === 0) return 0;

  const firstDream = dreams[dreams.length - 1];
  const now = new Date();
  const weeks = Math.max(
    1,
    Math.ceil(
      (now.getTime() - new Date(firstDream.dreamDate).getTime()) /
      (1000 * 60 * 60 * 24 * 7)
    )
  );

  return Math.round((dreams.length / weeks) * 10) / 10;
}
