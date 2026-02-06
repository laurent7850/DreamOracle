"use client";

import { cn } from "@/lib/utils";

interface MoodChartProps {
  data: { mood: string; count: number }[];
}

const moodConfig: Record<string, { color: string; emoji: string; bgColor: string }> = {
  positif: { color: "text-green-400", emoji: "😊", bgColor: "bg-green-500" },
  neutre: { color: "text-blue-400", emoji: "😐", bgColor: "bg-blue-500" },
  négatif: { color: "text-red-400", emoji: "😔", bgColor: "bg-red-500" },
  mitigé: { color: "text-yellow-400", emoji: "😕", bgColor: "bg-yellow-500" },
};

export function MoodChart({ data }: MoodChartProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-mystic-500">
        <p>Pas encore de données d&apos;humeur</p>
        <p className="text-sm mt-1">Notez l&apos;humeur de vos rêves pour voir les tendances</p>
      </div>
    );
  }

  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="space-y-4">
      {/* Pie chart representation using CSS */}
      <div className="flex justify-center">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {(() => {
              let offset = 0;
              return data.map((item) => {
                const percentage = (item.count / total) * 100;
                const circumference = 2 * Math.PI * 40;
                const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -(offset / 100) * circumference;
                offset += percentage;

                const config = moodConfig[item.mood] || { bgColor: "bg-mystic-500" };
                const strokeColor = config.bgColor.replace("bg-", "").replace("-500", "");

                return (
                  <circle
                    key={item.mood}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    strokeWidth="20"
                    stroke={`var(--${strokeColor})`}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className={cn(
                      "transition-all duration-500",
                      item.mood === "positif" && "stroke-green-500",
                      item.mood === "neutre" && "stroke-blue-500",
                      item.mood === "négatif" && "stroke-red-500",
                      item.mood === "mitigé" && "stroke-yellow-500"
                    )}
                  />
                );
              });
            })()}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-display text-lunar">{total}</p>
              <p className="text-xs text-mystic-500">rêves</p>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-3">
        {data.map((item) => {
          const config = moodConfig[item.mood] || {
            color: "text-mystic-400",
            emoji: "💭",
            bgColor: "bg-mystic-500",
          };
          const percentage = Math.round((item.count / total) * 100);

          return (
            <div
              key={item.mood}
              className="flex items-center gap-2 p-2 bg-mystic-900/30 rounded-lg"
            >
              <span className="text-lg">{config.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm capitalize", config.color)}>{item.mood}</p>
                <p className="text-xs text-mystic-500">
                  {item.count} ({percentage}%)
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
