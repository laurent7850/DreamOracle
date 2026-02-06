"use client";

import { Flame, Trophy, Calendar, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakCardProps {
  streaks: {
    currentStreak: number;
    longestStreak: number;
    thisWeek: number;
    thisMonth: number;
  };
}

export function StreakCard({ streaks }: StreakCardProps) {
  const { currentStreak, longestStreak, thisWeek, thisMonth } = streaks;

  const getStreakMessage = () => {
    if (currentStreak >= 30) return "Incroyable ! Vous êtes un maître des rêves ! 🌟";
    if (currentStreak >= 14) return "Fantastique ! Votre connexion avec vos rêves est forte ! ✨";
    if (currentStreak >= 7) return "Excellent ! Une semaine complète de rêves ! 🎯";
    if (currentStreak >= 3) return "Bien joué ! Continuez comme ça ! 💪";
    if (currentStreak >= 1) return "Bon début ! Notez vos rêves demain aussi ! 🌙";
    return "Commencez votre série en notant un rêve ! 📝";
  };

  return (
    <div className="space-y-6">
      {/* Current Streak - Featured */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gold/20 to-mystic-800/50 border border-gold/30 p-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-4">
            <div className={cn(
              "p-4 rounded-full",
              currentStreak > 0 ? "bg-gold/20" : "bg-mystic-800/50"
            )}>
              <Flame className={cn(
                "w-8 h-8",
                currentStreak > 0 ? "text-gold" : "text-mystic-600"
              )} />
            </div>
            <div>
              <p className="text-mystic-400 text-sm">Série actuelle</p>
              <p className="text-4xl font-display text-lunar">
                {currentStreak} <span className="text-lg text-mystic-400">jour{currentStreak !== 1 ? "s" : ""}</span>
              </p>
            </div>
          </div>
          <p className="mt-4 text-mystic-300 text-sm">
            {getStreakMessage()}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-mystic-900/30 rounded-lg p-4 text-center border border-mystic-700/30">
          <Trophy className="w-5 h-5 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-display text-lunar">{longestStreak}</p>
          <p className="text-xs text-mystic-500">Record</p>
        </div>
        <div className="bg-mystic-900/30 rounded-lg p-4 text-center border border-mystic-700/30">
          <Calendar className="w-5 h-5 text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-display text-lunar">{thisWeek}</p>
          <p className="text-xs text-mystic-500">Cette semaine</p>
        </div>
        <div className="bg-mystic-900/30 rounded-lg p-4 text-center border border-mystic-700/30">
          <TrendingUp className="w-5 h-5 text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-display text-lunar">{thisMonth}</p>
          <p className="text-xs text-mystic-500">Ce mois</p>
        </div>
      </div>

      {/* Progress to next milestone */}
      {currentStreak > 0 && currentStreak < 30 && (
        <div className="bg-mystic-900/30 rounded-lg p-4 border border-mystic-700/30">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-mystic-400">Prochain objectif</span>
            <span className="text-lunar">
              {currentStreak < 3 ? "3 jours" :
               currentStreak < 7 ? "7 jours" :
               currentStreak < 14 ? "14 jours" :
               "30 jours"}
            </span>
          </div>
          <div className="h-2 bg-mystic-800/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold/70 to-gold rounded-full transition-all duration-500"
              style={{
                width: `${(currentStreak / (
                  currentStreak < 3 ? 3 :
                  currentStreak < 7 ? 7 :
                  currentStreak < 14 ? 14 : 30
                )) * 100}%`
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
