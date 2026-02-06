"use client";

import { cn } from "@/lib/utils";

interface WeekdayChartProps {
  data: { day: string; count: number }[];
  bestDay: string | null;
}

export function WeekdayChart({ data, bestDay }: WeekdayChartProps) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-2 h-32">
        {data.map((item) => {
          const height = (item.count / maxCount) * 100;
          const isBest = item.day === bestDay && item.count > 0;

          return (
            <div
              key={item.day}
              className="flex-1 flex flex-col items-center gap-2"
            >
              <div className="relative w-full flex justify-center">
                {item.count > 0 && (
                  <span className="absolute -top-5 text-xs text-mystic-400">
                    {item.count}
                  </span>
                )}
                <div
                  className={cn(
                    "w-full max-w-10 rounded-t-md transition-all duration-500",
                    isBest
                      ? "bg-gradient-to-t from-gold/70 to-gold"
                      : "bg-gradient-to-t from-mystic-600/50 to-mystic-500/70",
                    item.count === 0 && "bg-mystic-800/30"
                  )}
                  style={{ height: `${Math.max(height, 8)}%` }}
                />
              </div>
              <span className={cn(
                "text-xs font-medium",
                isBest ? "text-gold" : "text-mystic-400"
              )}>
                {item.day}
              </span>
            </div>
          );
        })}
      </div>

      {bestDay && (
        <p className="text-center text-sm text-mystic-400">
          Vous rêvez le plus le <span className="text-gold font-medium">{
            bestDay === "Lun" ? "lundi" :
            bestDay === "Mar" ? "mardi" :
            bestDay === "Mer" ? "mercredi" :
            bestDay === "Jeu" ? "jeudi" :
            bestDay === "Ven" ? "vendredi" :
            bestDay === "Sam" ? "samedi" : "dimanche"
          }</span>
        </p>
      )}
    </div>
  );
}
