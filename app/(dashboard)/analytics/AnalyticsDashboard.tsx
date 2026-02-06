"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  Brain,
  Calendar,
  Clock,
  Cloud,
  Eye,
  Flame,
  Heart,
  Moon,
  Sparkles,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  EmotionChart,
  ActivityHeatmap,
  SymbolCloud,
  StreakCard,
  MonthlyChart,
  WeekdayChart,
  LucidityChart,
  MoodChart,
} from "@/components/analytics";

interface AnalyticsData {
  overview: {
    totalDreams: number;
    interpretedDreams: number;
    lucidDreams: number;
    recurringDreams: number;
    avgDreamsPerWeek: number;
    bestDreamDay: string | null;
    userSince: string;
  };
  streaks: {
    currentStreak: number;
    longestStreak: number;
    thisWeek: number;
    thisMonth: number;
  };
  charts: {
    dreamsPerMonth: { month: string; label: string; count: number }[];
    dreamsPerDayOfWeek: { day: string; count: number }[];
    emotionFrequency: { emotion: string; count: number }[];
    symbolFrequency: { symbol: string; count: number }[];
    tagFrequency: { tag: string; count: number }[];
    moodDistribution: { mood: string; count: number }[];
    sleepQualityTrend: { date: string; quality: number }[];
    lucidityDistribution: { level: number; label: string; count: number }[];
    activityHeatmap: { date: string; count: number }[];
  };
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch("/api/analytics");
        if (!response.ok) throw new Error("Failed to fetch analytics");
        const analyticsData = await response.json();
        setData(analyticsData);
      } catch (err) {
        setError("Erreur lors du chargement des statistiques");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-mystic-400 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-20 text-mystic-400">
        <Moon className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p>{error || "Aucune donnée disponible"}</p>
      </div>
    );
  }

  const { overview, streaks, charts } = data;

  // Calculate days since first dream
  const daysSinceStart = Math.floor(
    (new Date().getTime() - new Date(overview.userSince).getTime()) /
    (1000 * 60 * 60 * 24)
  );

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Moon className="w-6 h-6" />}
          label="Total des rêves"
          value={overview.totalDreams}
          subtext={`${overview.avgDreamsPerWeek} par semaine en moyenne`}
          color="text-mystic-400"
        />
        <StatCard
          icon={<Sparkles className="w-6 h-6" />}
          label="Interprétés"
          value={overview.interpretedDreams}
          subtext={`${overview.totalDreams > 0 ? Math.round((overview.interpretedDreams / overview.totalDreams) * 100) : 0}% de vos rêves`}
          color="text-gold"
        />
        <StatCard
          icon={<Eye className="w-6 h-6" />}
          label="Rêves lucides"
          value={overview.lucidDreams}
          subtext={`${overview.totalDreams > 0 ? Math.round((overview.lucidDreams / overview.totalDreams) * 100) : 0}% de lucidité`}
          color="text-purple-400"
        />
        <StatCard
          icon={<Clock className="w-6 h-6" />}
          label="Depuis"
          value={daysSinceStart}
          subtext="jours d'exploration"
          color="text-blue-400"
        />
      </div>

      {/* Streaks Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glass-card border-mystic-700/30">
          <CardHeader>
            <CardTitle className="font-display text-lg text-lunar flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              Votre série
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StreakCard streaks={streaks} />
          </CardContent>
        </Card>

        <Card className="glass-card border-mystic-700/30">
          <CardHeader>
            <CardTitle className="font-display text-lg text-lunar flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              Jour le plus actif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WeekdayChart
              data={charts.dreamsPerDayOfWeek}
              bestDay={overview.bestDreamDay}
            />
          </CardContent>
        </Card>
      </div>

      {/* Activity Heatmap */}
      <Card className="glass-card border-mystic-700/30">
        <CardHeader>
          <CardTitle className="font-display text-lg text-lunar flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-400" />
            Activité sur l&apos;année
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityHeatmap data={charts.activityHeatmap} />
        </CardContent>
      </Card>

      {/* Monthly Trends & Emotions */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glass-card border-mystic-700/30">
          <CardHeader>
            <CardTitle className="font-display text-lg text-lunar flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Évolution mensuelle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyChart data={charts.dreamsPerMonth} />
          </CardContent>
        </Card>

        <Card className="glass-card border-mystic-700/30">
          <CardHeader>
            <CardTitle className="font-display text-lg text-lunar flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-400" />
              Émotions fréquentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EmotionChart data={charts.emotionFrequency} />
          </CardContent>
        </Card>
      </div>

      {/* Mood & Lucidity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="glass-card border-mystic-700/30">
          <CardHeader>
            <CardTitle className="font-display text-lg text-lunar flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-400" />
              Humeur des rêves
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MoodChart data={charts.moodDistribution} />
          </CardContent>
        </Card>

        <Card className="glass-card border-mystic-700/30">
          <CardHeader>
            <CardTitle className="font-display text-lg text-lunar flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-400" />
              Niveaux de lucidité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LucidityChart
              data={charts.lucidityDistribution}
              totalLucid={overview.lucidDreams}
              totalDreams={overview.totalDreams}
            />
          </CardContent>
        </Card>
      </div>

      {/* Symbol Cloud */}
      <Card className="glass-card border-mystic-700/30">
        <CardHeader>
          <CardTitle className="font-display text-lg text-lunar flex items-center gap-2">
            <Cloud className="w-5 h-5 text-cyan-400" />
            Symboles récurrents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SymbolCloud data={charts.symbolFrequency} />
        </CardContent>
      </Card>

      {/* Insights Card */}
      {overview.totalDreams >= 5 && (
        <Card className="glass-card border-gold/20 bg-gradient-to-br from-mystic-900/80 to-gold/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-gold/10">
                <Sparkles className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h3 className="font-display text-lg text-lunar mb-2">
                  Insights de l&apos;Oracle
                </h3>
                <div className="space-y-2 text-mystic-300 text-sm">
                  {overview.bestDreamDay && (
                    <p>
                      🌙 Vous avez tendance à mieux vous souvenir de vos rêves le{" "}
                      <span className="text-gold font-medium">
                        {overview.bestDreamDay === "Lun" ? "lundi" :
                         overview.bestDreamDay === "Mar" ? "mardi" :
                         overview.bestDreamDay === "Mer" ? "mercredi" :
                         overview.bestDreamDay === "Jeu" ? "jeudi" :
                         overview.bestDreamDay === "Ven" ? "vendredi" :
                         overview.bestDreamDay === "Sam" ? "samedi" : "dimanche"}
                      </span>.
                    </p>
                  )}
                  {charts.emotionFrequency.length > 0 && (
                    <p>
                      💫 L&apos;émotion dominante dans vos rêves est{" "}
                      <span className="text-gold font-medium capitalize">
                        {charts.emotionFrequency[0].emotion}
                      </span>.
                    </p>
                  )}
                  {overview.lucidDreams > 0 && (
                    <p>
                      ✨ Vous avez déjà eu{" "}
                      <span className="text-gold font-medium">{overview.lucidDreams}</span>{" "}
                      rêve{overview.lucidDreams > 1 ? "s" : ""} lucide{overview.lucidDreams > 1 ? "s" : ""} !
                      Continuez à pratiquer.
                    </p>
                  )}
                  {streaks.longestStreak >= 7 && (
                    <p>
                      🔥 Votre meilleure série est de{" "}
                      <span className="text-gold font-medium">{streaks.longestStreak} jours</span>.
                      Impressionnant !
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  subtext,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  subtext: string;
  color: string;
}) {
  return (
    <Card className="glass-card border-mystic-700/30">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full bg-mystic-800/50 ${color}`}>
            {icon}
          </div>
          <div>
            <p className="text-sm text-mystic-500">{label}</p>
            <p className="text-2xl font-display text-lunar">{value}</p>
            <p className="text-xs text-mystic-500">{subtext}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
