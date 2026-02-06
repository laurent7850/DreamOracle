import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Moon, PlusCircle, BookOpen, Sparkles, Calendar, BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-lunar mb-2">
            Bienvenue, {session?.user?.name?.split(" ")[0] || "Rêveur"}
          </h1>
          <p className="text-mystic-400">
            Que vous révèlent vos rêves aujourd&apos;hui ?
          </p>
        </div>
        <Link href="/dreams/new">
          <Button className="btn-mystic btn-gold">
            <PlusCircle className="w-5 h-5 mr-2" />
            Nouveau rêve
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<BookOpen className="w-6 h-6" />}
          title="Total des rêves"
          value={dreamCount}
          description="Rêves enregistrés"
        />
        <StatsCard
          icon={<Sparkles className="w-6 h-6" />}
          title="Interprétés"
          value={interpretedCount}
          description="Par l'Oracle"
        />
        <StatsCard
          icon={<Calendar className="w-6 h-6" />}
          title="Ce mois"
          value={dreamsThisMonth}
          description="Rêves notés"
        />
        <StatsCard
          icon={<Moon className="w-6 h-6" />}
          title="Taux"
          value={dreamCount > 0 ? Math.round((interpretedCount / dreamCount) * 100) + "%" : "0%"}
          description="D'interprétation"
        />
      </div>

      {/* Recent Dreams */}
      <Card className="glass-card border-mystic-700/30">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-display text-xl text-lunar">
            Rêves récents
          </CardTitle>
          <Link href="/dreams">
            <Button variant="ghost" className="text-mystic-400 hover:text-mystic-300">
              Voir tout
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentDreams.length === 0 ? (
            <div className="text-center py-12">
              <Moon className="w-16 h-16 text-mystic-600 mx-auto mb-4" />
              <p className="text-mystic-400 mb-4">
                Vous n&apos;avez pas encore enregistré de rêves
              </p>
              <Link href="/dreams/new">
                <Button className="btn-mystic">
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Enregistrer mon premier rêve
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentDreams.map((dream) => (
                <Link key={dream.id} href={`/dreams/${dream.id}`}>
                  <div className="p-4 rounded-lg bg-mystic-900/30 border border-mystic-700/30 hover:border-mystic-600/50 transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-display text-lg text-lunar">
                        {dream.title}
                      </h3>
                      <span className="text-xs text-mystic-500">
                        {new Date(dream.dreamDate).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                    <p className="text-mystic-400 text-sm line-clamp-2">
                      {dream.content}
                    </p>
                    {dream.interpretation && (
                      <span className="inline-flex items-center gap-1 mt-2 text-xs text-gold">
                        <Sparkles className="w-3 h-3" />
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
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-indigo-500/20">
                    <BarChart3 className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-lunar mb-1">
                      Découvrez vos statistiques
                    </h3>
                    <p className="text-mystic-400 text-sm">
                      Analysez vos tendances oniriques, émotions récurrentes et symboles
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-mystic-500 group-hover:text-lunar group-hover:translate-x-1 transition-all" />
              </div>
            </CardContent>
          </Card>
        </Link>
      )}

      {/* Quick Tips */}
      <Card className="glass-card border-mystic-700/30 border-gold/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-gold/10">
              <Sparkles className="w-6 h-6 text-gold" />
            </div>
            <div>
              <h3 className="font-display text-lg text-lunar mb-2">
                Conseil de l&apos;Oracle
              </h3>
              <p className="text-mystic-300 font-mystical">
                Notez vos rêves dès le réveil, avant même de bouger.
                Les détails s&apos;effacent rapidement de la mémoire consciente.
                Gardez un carnet ou votre téléphone près de votre lit.
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
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-mystic-800/50 text-mystic-400">
            {icon}
          </div>
          <div>
            <p className="text-sm text-mystic-500">{title}</p>
            <p className="text-2xl font-display text-lunar">{value}</p>
            <p className="text-xs text-mystic-500">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
