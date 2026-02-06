"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Moon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Dream {
  id: string;
  title: string;
  dreamDate: string;
  interpretation: string | null;
  mood: string | null;
  lucidity: number;
}

interface DreamCalendarProps {
  dreams: Dream[];
}

const DAYS_OF_WEEK = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

export function DreamCalendar({ dreams }: DreamCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Group dreams by date
  const dreamsByDate = useMemo(() => {
    const map: Record<string, Dream[]> = {};
    dreams.forEach((dream) => {
      const dateKey = new Date(dream.dreamDate).toISOString().split("T")[0];
      if (!map[dateKey]) {
        map[dateKey] = [];
      }
      map[dateKey].push(dream);
    });
    return map;
  }, [dreams]);

  // Get calendar days for current month
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Get the day of the week (0 = Sunday, 1 = Monday, etc.)
    // Adjust so Monday = 0
    let startDay = firstDayOfMonth.getDay() - 1;
    if (startDay < 0) startDay = 6;

    const daysInMonth = lastDayOfMonth.getDate();

    const days: { date: Date; isCurrentMonth: boolean }[] = [];

    // Previous month days
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    // Next month days to fill the grid (6 rows × 7 days = 42)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }

    return days;
  }, [currentDate]);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(null);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const getDateKey = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const selectedDreams = selectedDate ? dreamsByDate[selectedDate] || [] : [];

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-display text-lunar">
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={goToToday}
            className="text-mystic-400 hover:text-lunar text-xs"
          >
            Aujourd&apos;hui
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPreviousMonth}
            className="text-mystic-400 hover:text-lunar"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNextMonth}
            className="text-mystic-400 hover:text-lunar"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-mystic-900/30 rounded-xl border border-mystic-700/30 overflow-hidden">
        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b border-mystic-700/30">
          {DAYS_OF_WEEK.map((day) => (
            <div
              key={day}
              className="p-3 text-center text-sm font-medium text-mystic-500"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            const dateKey = getDateKey(day.date);
            const dayDreams = dreamsByDate[dateKey] || [];
            const hasDreams = dayDreams.length > 0;
            const hasInterpretation = dayDreams.some((d) => d.interpretation);
            const isSelected = selectedDate === dateKey;

            return (
              <button
                key={index}
                onClick={() => setSelectedDate(isSelected ? null : dateKey)}
                className={cn(
                  "relative min-h-[80px] p-2 border-b border-r border-mystic-700/20 transition-all text-left",
                  "hover:bg-mystic-800/30",
                  !day.isCurrentMonth && "opacity-40",
                  isToday(day.date) && "bg-mystic-800/50",
                  isSelected && "bg-gold/10 ring-1 ring-gold/50"
                )}
              >
                <span
                  className={cn(
                    "inline-flex items-center justify-center w-7 h-7 rounded-full text-sm",
                    isToday(day.date)
                      ? "bg-gold text-mystic-950 font-bold"
                      : "text-mystic-300"
                  )}
                >
                  {day.date.getDate()}
                </span>

                {hasDreams && (
                  <div className="mt-1 space-y-1">
                    {dayDreams.slice(0, 2).map((dream) => (
                      <div
                        key={dream.id}
                        className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded truncate",
                          hasInterpretation
                            ? "bg-gold/20 text-gold"
                            : "bg-mystic-600/30 text-mystic-300"
                        )}
                      >
                        {dream.title}
                      </div>
                    ))}
                    {dayDreams.length > 2 && (
                      <div className="text-[10px] text-mystic-500 px-1.5">
                        +{dayDreams.length - 2} autres
                      </div>
                    )}
                  </div>
                )}

                {/* Dream indicator dots */}
                {hasDreams && (
                  <div className="absolute bottom-1 right-1 flex gap-0.5">
                    {dayDreams.slice(0, 3).map((dream, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          dream.interpretation ? "bg-gold" : "bg-mystic-500"
                        )}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Dreams */}
      {selectedDate && (
        <div className="bg-mystic-900/30 rounded-xl border border-mystic-700/30 p-4">
          <h3 className="font-display text-lg text-lunar mb-4 flex items-center gap-2">
            <Moon className="w-5 h-5 text-mystic-400" />
            {new Date(selectedDate).toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </h3>

          {selectedDreams.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-mystic-500 mb-4">Aucun rêve enregistré ce jour</p>
              <Link href="/dreams/new">
                <Button className="btn-mystic">
                  Ajouter un rêve
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDreams.map((dream) => (
                <Link key={dream.id} href={`/dreams/${dream.id}`}>
                  <div className="p-4 rounded-lg bg-mystic-800/30 border border-mystic-700/30 hover:border-mystic-600/50 transition-all cursor-pointer">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display text-lunar truncate">
                          {dream.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-1 text-xs text-mystic-500">
                          {dream.mood && (
                            <span className="capitalize">{dream.mood}</span>
                          )}
                          {dream.lucidity > 0 && (
                            <span>Lucidité: {dream.lucidity}/5</span>
                          )}
                        </div>
                      </div>
                      {dream.interpretation && (
                        <span className="inline-flex items-center gap-1 text-xs text-gold flex-shrink-0">
                          <Sparkles className="w-3 h-3" />
                          Interprété
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-xs text-mystic-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-mystic-500" />
          <span>Rêve non interprété</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gold" />
          <span>Rêve interprété</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gold text-mystic-950 text-xs flex items-center justify-center font-bold">
            {new Date().getDate()}
          </div>
          <span>Aujourd&apos;hui</span>
        </div>
      </div>
    </div>
  );
}
