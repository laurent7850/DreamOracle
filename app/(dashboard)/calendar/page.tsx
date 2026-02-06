import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Calendar, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DreamCalendar } from "@/components/calendar";

export const metadata = {
  title: "Calendrier | DreamOracle",
  description: "Visualisez vos rêves sur un calendrier",
};

export default async function CalendarPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Get all dreams for the calendar
  const dreams = await prisma.dream.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      title: true,
      dreamDate: true,
      interpretation: true,
      mood: true,
      lucidity: true,
    },
    orderBy: { dreamDate: "desc" },
  });

  // Convert dates to strings for serialization
  const serializedDreams = dreams.map((dream) => ({
    ...dream,
    dreamDate: dream.dreamDate.toISOString(),
  }));

  // Calculate stats
  const totalDreams = dreams.length;
  const interpretedDreams = dreams.filter((d) => d.interpretation).length;

  // Count unique days with dreams
  const uniqueDays = new Set(
    dreams.map((d) => d.dreamDate.toISOString().split("T")[0])
  ).size;

  // Calculate current month stats
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const dreamsThisMonth = dreams.filter(
    (d) => new Date(d.dreamDate) >= startOfMonth
  ).length;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-lunar mb-2 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-mystic-400" />
            Calendrier des rêves
          </h1>
          <p className="text-mystic-400">
            Visualisez vos rêves jour par jour
          </p>
        </div>
        <Link href="/dreams/new">
          <Button className="btn-mystic btn-gold">
            <PlusCircle className="w-5 h-5 mr-2" />
            Nouveau rêve
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickStat label="Total des rêves" value={totalDreams} />
        <QuickStat label="Jours avec rêves" value={uniqueDays} />
        <QuickStat label="Ce mois-ci" value={dreamsThisMonth} />
        <QuickStat
          label="Taux interprétation"
          value={totalDreams > 0 ? `${Math.round((interpretedDreams / totalDreams) * 100)}%` : "0%"}
        />
      </div>

      {/* Calendar */}
      <DreamCalendar dreams={serializedDreams} />
    </div>
  );
}

function QuickStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-mystic-900/30 rounded-lg border border-mystic-700/30 p-4 text-center">
      <p className="text-2xl font-display text-lunar">{value}</p>
      <p className="text-xs text-mystic-500 mt-1">{label}</p>
    </div>
  );
}
