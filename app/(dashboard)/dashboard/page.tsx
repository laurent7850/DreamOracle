import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Moon, PlusCircle, BookOpen, Sparkles, Calendar, BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardUsage } from "@/components/subscription";

export default async function DashboardPage() {
  const session = await auth();

  const [recentDreams, dreamCount, interpretedCount] = await Promise.all([
    prisma.dream.findMany({
      where: { userId: session?.user?.id },
      orderBy: { dreamDate: "desc" },
      take: 5,
    }),
    prisma.dream.count({
      where: { userId: session?.user?.id },
    }),
    prisma.dream.count({
      where: {
        userId: session?.user?.id,
        interpretation: { not: null },
      },
    }),
  ]);

  // Get dreams this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const dreamsThisMonth = await prisma.dream.count({
    where: {
      userId: session?.user?.id,
      dreamDate: { gte: startOfMonth },
    },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 px-1">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl text-lunar mb-1 sm:mb-2">
            Bienvenue, {session?.user?.name?.split(" ")[0] || "Rêveur"}
          </h1>
          <p className="text-mystic-400 text-sm sm:text-base">
            Que vous révèlent vos rêves aujourd&apos;hui ?
          </p>
        </div>
        <Link href="/dreams/new" className="w-full sm:w-auto">
          <Button className="btn-mystic btn-gold w-full sm:w-auto">
            <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Nouveau rêve
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        <StatsCard
          icon={<BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />}
          title="Total rêves"
          value={dreamCount}
          description="Enregistrés"
        />
        <StatsCard
          icon={<Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />}
          title="Interprétés"
          value={interpretedCount}
          description="Par l'Oracle"
        />
        <StatsCard
          icon={<Calendar className="w-5 h-5 sm:w-6 sm:h-6" />}
          title="Ce mois"
          value={dreamsThisMonth}
          description="Rêves notés"
        />
        <StatsCard
          icon={<Moon className="w-5 h-5 sm:w-6 sm:h-6" />}
          title="Taux"
          value={dreamCount > 0 ? Math.round((interpretedCount / dreamCount) * 100) + "%" : "0%"}
          description="Interprétation"
        />
      </div>

      {/* Recent Dreams */}
      <Card className="glass-card border-mystic-700/30">
        <CardHeader className="flex flex-row items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          <CardTitle className="font-display text-base sm:text-xl text-lunar">
            Rêves récents
          </CardTitle>
          <Link href="/dreams">
            <Button variant="ghost" className="text-mystic-400 hover:text-mystic-300 text-xs sm:text-sm px-2 sm:px-4">
              Voir tout
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
          {recentDreams.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <Moon className="w-12 h-12 sm:w-16 sm:h-16 text-mystic-600 mx-auto mb-3 sm:mb-4" />
              <p className="text-mystic-400 mb-3 sm:mb-4 text-sm sm:text-base">
                Vous n&apos;avez pas encore enregistré de rêves
              </p>
              <Link href="/dreams/new">
                <Button className="btn-mystic text-sm sm:text-base">
                  <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  <span className="hidden sm:inline">Enregistrer mon premier rêve</span>
                  <span className="sm:hidden">Premier rêve</span>
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {recentDreams.map((dream) => (
                <Link key={dream.id} href={`/dreams/${dream.id}`}>
                  <div className="p-3 sm:p-4 rounded-lg bg-mystic-900/30 border border-mystic-700/30 hover:border-mystic-600/50 transition-all cursor-pointer">
                    <div className="flex justify-between items-start gap-2 mb-1.5 sm:mb-2">
                      <h3 className="font-display text-sm sm:text-lg text-lunar truncate flex-1">
                        {dream.title}
                      </h3>
                      <span className="text-[10px] sm:text-xs text-mystic-500 flex-shrink-0">
                        {new Date(dream.dreamDate).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                    <p className="text-mystic-400 text-xs sm:text-sm line-clamp-2">
                      {dream.content}
                    </p>
                    {dream.interpretation && (
                      <span className="inline-flex items-center gap-1 mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-gold">
                        <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        Interprété
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analytics CTA */}
      {dreamCount >= 3 && (
        <Link href="/analytics">
          <Card className="glass-card border-mystic-700/30 hover:border-mystic-600/50 transition-all cursor-pointer group">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 rounded-full bg-indigo-500/20 flex-shrink-0">
                    <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-sm sm:text-lg text-lunar mb-0.5 sm:mb-1">
                      Découvrez vos statistiques
                    </h3>
                    <p className="text-mystic-400 text-xs sm:text-sm line-clamp-2">
                      Analysez vos tendances oniriques et émotions
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-mystic-500 group-hover:text-lunar group-hover:translate-x-1 transition-all flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        </Link>
      )}

      {/* Usage & Subscription */}
      <DashboardUsage />

      {/* Quick Tips */}
      <Card className="glass-card border-mystic-700/30 border-gold/20">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 rounded-full bg-gold/10 flex-shrink-0">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
            </div>
            <div className="min-w-0">
              <h3 className="font-display text-sm sm:text-lg text-lunar mb-1 sm:mb-2">
                Conseil de l&apos;Oracle
              </h3>
              <p className="text-mystic-300 font-mystical text-xs sm:text-sm md:text-base">
                Notez vos rêves dès le réveil, avant même de bouger.
                Les détails s&apos;effacent rapidement de la mémoire consciente.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatsCard({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  description: string;
}) {
  return (
    <Card className="glass-card border-mystic-700/30">
      <CardContent className="p-3 sm:p-4 md:p-6">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="p-2 sm:p-3 rounded-full bg-mystic-800/50 text-mystic-400 flex-shrink-0">
            {icon}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-sm text-mystic-500 truncate">{title}</p>
            <p className="text-lg sm:text-xl md:text-2xl font-display text-lunar">{value}</p>
            <p className="text-[10px] sm:text-xs text-mystic-500 truncate">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
