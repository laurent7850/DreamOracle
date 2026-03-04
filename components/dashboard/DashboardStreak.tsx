"use client";

import { Flame, Trophy, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardStreakProps {
  currentStreak: number;
  longestStreak: number;
  dreamsThisWeek: number;
}

export function DashboardStreak({ currentStreak, longestStreak, dreamsThisWeek }: DashboardStreakProps) {
  const nextMilestone = currentStreak < 3 ? 3 : currentStreak < 7 ? 7 : currentStreak < 14 ? 14 : 30;
  const progress = currentStreak > 0 ? Math.min((currentStreak / nextMilestone) * 100, 100) : 0;

  const getMessage = () => {
    if (currentStreak >= 30) return "Maître des rêves !";
    if (currentStreak >= 14) return "Connexion profonde !";
    if (currentStreak >= 7) return "Semaine parfaite !";
    if (currentStreak >= 3) return "Bel élan !";
    if (currentStreak >= 1) return "Bien joué !";
    return "Note un rêve pour commencer !";
  };

  return (
    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-gold/5 to-mystic-800/30 border border-gold/20">
      {/* Flame icon */}
      <div className={cn(
        "p-2 sm:p-3 rounded-full flex-shrink-0",
        currentStreak > 0 ? "bg-gold/15" : "bg-mystic-800/50"
      )}>
        <Flame className={cn(
          "w-5 h-5 sm:w-6 sm:h-6",
          currentStreak > 0 ? "text-gold" : "text-mystic-600"
        )} />
      </div>

      {/* Streak info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-0.5">
          <span className="text-xl sm:text-2xl font-display text-lunar">
            {currentStreak}
          </span>
          <span className="text-xs sm:text-sm text-mystic-400">
            jour{currentStreak !== 1 ? "s" : ""} de série
          </span>
        </div>
        {/* Progress bar */}
        {currentStreak > 0 && currentStreak < 30 && (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-mystic-800/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold/70 to-gold rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[10px] sm:text-xs text-mystic-500 flex-shrink-0">
              {nextMilestone}j
            </span>
          </div>
        )}
        <p className="text-[10px] sm:text-xs text-mystic-500 mt-0.5">{getMessage()}</p>
      </div>

      {/* Mini stats */}
      <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
        <div className="text-center">
          <div className="flex items-center gap-1 text-mystic-500">
            <Trophy className="w-3 h-3" />
            <span className="text-xs">Record</span>
          </div>
          <p className="text-sm font-display text-lunar">{longestStreak}j</p>
        </div>
        <div className="text-center">
          <div className="flex items-center gap-1 text-mystic-500">
            <Target className="w-3 h-3" />
            <span className="text-xs">Semaine</span>
          </div>
          <p className="text-sm font-display text-lunar">{dreamsThisWeek}</p>
        </div>
      </div>
    </div>
  );
}
