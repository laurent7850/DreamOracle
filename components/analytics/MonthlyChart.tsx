"use client";

import { cn } from "@/lib/utils";

interface MonthlyChartProps {
  data: { month: string; label: string; count: number }[];
}

export function MonthlyChart({ data }: MonthlyChartProps) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="flex items-end justify-between gap-1 h-40">
      {data.map((item, index) => {
        const height = (item.count / maxCount) * 100;
        const isCurrentMonth = index === data.length - 1;

        return (
          <div
            key={item.month}
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
                  "w-full max-w-8 rounded-t-md transition-all duration-500 ease-out",
                  isCurrentMonth
                    ? "bg-gradient-to-t from-gold/70 to-gold"
                    : "bg-gradient-to-t from-mystic-600/50 to-mystic-500/70",
                  item.count === 0 && "bg-mystic-800/30"
                )}
                style={{
                  height: `${Math.max(height, 4)}%`,
                  animationDelay: `${index * 50}ms`,
                }}
              />
            </div>
            <span className={cn(
              "text-[10px] uppercase",
              isCurrentMonth ? "text-gold" : "text-mystic-500"
            )}>
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
