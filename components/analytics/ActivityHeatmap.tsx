"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface ActivityHeatmapProps {
  data: { date: string; count: number }[];
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const { weeks, months, maxCount } = useMemo(() => {
    // Group by weeks (columns) and days (rows)
    const weeks: { date: string; count: number; dayOfWeek: number }[][] = [];
    let currentWeek: { date: string; count: number; dayOfWeek: number }[] = [];

    // Get the last 52 weeks of data
    const last52Weeks = data.slice(-364);

    last52Weeks.forEach((day, index) => {
      const date = new Date(day.date);
      const dayOfWeek = date.getDay();

      // Start new week on Sunday (dayOfWeek === 0)
      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      currentWeek.push({ ...day, dayOfWeek });

      // Push last week
      if (index === last52Weeks.length - 1) {
        weeks.push(currentWeek);
      }
    });

    // Calculate months for labels
    const months: { label: string; colSpan: number }[] = [];
    let currentMonth = "";
    let colSpan = 0;

    weeks.forEach((week) => {
      if (week.length > 0) {
        const date = new Date(week[0].date);
        const monthLabel = date.toLocaleDateString("fr-FR", { month: "short" });

        if (monthLabel !== currentMonth) {
          if (currentMonth) {
            months.push({ label: currentMonth, colSpan });
          }
          currentMonth = monthLabel;
          colSpan = 1;
        } else {
          colSpan++;
        }
      }
    });
    if (currentMonth) {
      months.push({ label: currentMonth, colSpan });
    }

    const maxCount = Math.max(...data.map((d) => d.count), 1);

    return { weeks, months, maxCount };
  }, [data]);

  const getIntensityClass = (count: number) => {
    if (count === 0) return "bg-mystic-900/50";
    const ratio = count / maxCount;
    if (ratio <= 0.25) return "bg-mystic-600/70";
    if (ratio <= 0.5) return "bg-mystic-500";
    if (ratio <= 0.75) return "bg-gold/70";
    return "bg-gold";
  };

  const dayLabels = ["", "Lun", "", "Mer", "", "Ven", ""];

  return (
    <div className="overflow-x-auto">
      {/* Month labels */}
      <div className="flex gap-[2px] mb-1 pl-8">
        {months.map((month, idx) => (
          <div
            key={idx}
            className="text-xs text-mystic-500"
            style={{ width: `${month.colSpan * 12 + (month.colSpan - 1) * 2}px` }}
          >
            {month.label}
          </div>
        ))}
      </div>

      <div className="flex gap-1">
        {/* Day labels */}
        <div className="flex flex-col gap-[2px] pr-1">
          {dayLabels.map((label, idx) => (
            <div
              key={idx}
              className="h-[10px] w-6 text-[10px] text-mystic-500 flex items-center"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="flex gap-[2px]">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-[2px]">
              {[0, 1, 2, 3, 4, 5, 6].map((dayOfWeek) => {
                const day = week.find((d) => d.dayOfWeek === dayOfWeek);
                if (!day) {
                  return (
                    <div
                      key={dayOfWeek}
                      className="w-[10px] h-[10px] rounded-sm bg-transparent"
                    />
                  );
                }

                const date = new Date(day.date);
                const formattedDate = date.toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                });

                return (
                  <div
                    key={dayOfWeek}
                    className={cn(
                      "w-[10px] h-[10px] rounded-sm transition-all cursor-pointer hover:ring-1 hover:ring-lunar",
                      getIntensityClass(day.count)
                    )}
                    title={`${formattedDate}: ${day.count} rêve${day.count > 1 ? "s" : ""}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-3 text-xs text-mystic-500">
        <span>Moins</span>
        <div className="flex gap-[2px]">
          <div className="w-[10px] h-[10px] rounded-sm bg-mystic-900/50" />
          <div className="w-[10px] h-[10px] rounded-sm bg-mystic-600/70" />
          <div className="w-[10px] h-[10px] rounded-sm bg-mystic-500" />
          <div className="w-[10px] h-[10px] rounded-sm bg-gold/70" />
          <div className="w-[10px] h-[10px] rounded-sm bg-gold" />
        </div>
        <span>Plus</span>
      </div>
    </div>
  );
}
