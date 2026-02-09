import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  BarChart3,
  Brain,
  Calendar,
  Cloud,
  Heart,
  Moon,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsDashboard } from "./AnalyticsDashboard";

export const metadata = {
  title: "Statistiques | DreamOracle",
  description: "Analysez vos tendances oniriques et découvrez les patterns de vos rêves",
};

export default async function AnalyticsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 px-3 sm:px-4 md:px-0">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl text-lunar mb-2 flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-mystic-400" />
          Statistiques
        </h1>
        <p className="text-mystic-400">
          Analysez vos tendances oniriques et découvrez les patterns de vos rêves
        </p>
      </div>

      {/* Main Dashboard */}
      <Suspense fallback={<AnalyticsLoading />}>
        <AnalyticsDashboard />
      </Suspense>
    </div>
  );
}

function AnalyticsLoading() {
  return (
    <div className="space-y-6">
      {/* Loading skeleton for stats cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="glass-card border-mystic-700/30 animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-mystic-800/50 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Loading skeleton for charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="glass-card border-mystic-700/30 animate-pulse">
            <CardHeader>
              <div className="h-6 w-32 bg-mystic-800/50 rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-mystic-800/30 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
