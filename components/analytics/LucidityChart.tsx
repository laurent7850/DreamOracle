"use client";

import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

interface LucidityChartProps {
  data: { level: number; label: string; count: number }[];
  totalLucid: number;
  totalDreams: number;
}

export function LucidityChart({ data, totalLucid, totalDreams }: LucidityChartProps) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const lucidPercentage = totalDreams > 0 ? Math.round((totalLucid / totalDreams) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Lucid ratio */}
      <div className="flex items-center gap-4 p-4 bg-mystic-900/30 rounded-lg border border-mystic-700/30">
        <div className={cn(
          "p-3 rounded-full",
          totalLucid > 0 ? "bg-purple-500/20" : "bg-mystic-800/50"
        )}>
          {totalLucid > 0 ? (
            <Eye className="w-6 h-6 text-purple-400" />
          ) : (
            <EyeOff className="w-6 h-6 text-mystic-600" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-mystic-400 text-sm">Rêves lucides</p>
          <p className="text-2xl font-display text-lunar">
            {totalLucid} <span className="text-sm text-mystic-400">/ {totalDreams}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-display text-purple-400">{lucidPercentage}%</p>
          <p className="text-xs text-mystic-500">taux de lucidité</p>
        </div>
      </div>

      {/* Level distribution */}
      <div className="space-y-2">
        <p className="text-sm text-mystic-400 mb-3">Distribution par niveau</p>
        {data.map((item) => {
          const percentage = (item.count / maxCount) * 100;
          const levelColors = [
            "bg-mystic-700",
            "bg-indigo-700",
            "bg-indigo-600",
            "bg-purple-600",
            "bg-purple-500",
            "bg-fuchsia-500",
          ];

          return (
            <div key={item.level} className="group">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-mystic-400">
                  {item.level === 0 ? "Non lucide" : `Niveau ${item.level}`}
                </span>
                <span className="text-xs text-mystic-500">{item.count}</span>
              </div>
              <div className="h-2 bg-mystic-800/50 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    levelColors[item.level]
                  )}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {totalLucid === 0 && (
        <div className="text-center py-4 text-mystic-500 text-sm">
          <p>Pas encore de rêves lucides enregistrés</p>
          <p className="mt-1 text-xs">
            Conseil: tenez un journal de rêves régulier pour améliorer votre lucidité
          </p>
        </div>
      )}
    </div>
  );
}
