"use client";

import { cn } from "@/lib/utils";

interface EmotionChartProps {
  data: { emotion: string; count: number }[];
}

const emotionColors: Record<string, string> = {
  joie: "bg-yellow-500",
  peur: "bg-purple-600",
  tristesse: "bg-blue-500",
  colère: "bg-red-500",
  surprise: "bg-pink-500",
  amour: "bg-rose-500",
  anxiété: "bg-orange-500",
  paix: "bg-green-500",
  confusion: "bg-indigo-500",
  espoir: "bg-emerald-500",
  nostalgie: "bg-amber-600",
  curiosité: "bg-cyan-500",
  excitation: "bg-fuchsia-500",
  sérénité: "bg-teal-500",
};

const emotionEmojis: Record<string, string> = {
  joie: "😊",
  peur: "😨",
  tristesse: "😢",
  colère: "😠",
  surprise: "😲",
  amour: "❤️",
  anxiété: "😰",
  paix: "☮️",
  confusion: "😕",
  espoir: "🌟",
  nostalgie: "🥹",
  curiosité: "🤔",
  excitation: "🤩",
  sérénité: "😌",
};

export function EmotionChart({ data }: EmotionChartProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-mystic-500">
        <p>Pas encore assez de données</p>
        <p className="text-sm mt-1">Continuez à noter vos émotions dans vos rêves</p>
      </div>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count));

  return (
    <div className="space-y-3">
      {data.map((item, index) => {
        const percentage = (item.count / maxCount) * 100;
        const colorClass = emotionColors[item.emotion] || "bg-mystic-500";
        const emoji = emotionEmojis[item.emotion] || "💭";

        return (
          <div key={item.emotion} className="group">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-lunar capitalize flex items-center gap-2">
                <span>{emoji}</span>
                {item.emotion}
              </span>
              <span className="text-xs text-mystic-500">{item.count}</span>
            </div>
            <div className="h-2 bg-mystic-800/50 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500 ease-out",
                  colorClass
                )}
                style={{
                  width: `${percentage}%`,
                  animationDelay: `${index * 100}ms`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
