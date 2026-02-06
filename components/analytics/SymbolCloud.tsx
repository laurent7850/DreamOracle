"use client";

import { cn } from "@/lib/utils";

interface SymbolCloudProps {
  data: { symbol: string; count: number }[];
}

export function SymbolCloud({ data }: SymbolCloudProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-mystic-500">
        <p>Pas encore de symboles détectés</p>
        <p className="text-sm mt-1">Les symboles apparaîtront après l&apos;interprétation de vos rêves</p>
      </div>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count));
  const minCount = Math.min(...data.map((d) => d.count));

  const getSize = (count: number) => {
    if (maxCount === minCount) return "text-base";
    const ratio = (count - minCount) / (maxCount - minCount);
    if (ratio <= 0.2) return "text-xs";
    if (ratio <= 0.4) return "text-sm";
    if (ratio <= 0.6) return "text-base";
    if (ratio <= 0.8) return "text-lg";
    return "text-xl";
  };

  const getOpacity = (count: number) => {
    if (maxCount === minCount) return "opacity-100";
    const ratio = (count - minCount) / (maxCount - minCount);
    if (ratio <= 0.3) return "opacity-60";
    if (ratio <= 0.6) return "opacity-80";
    return "opacity-100";
  };

  // Shuffle for visual variety
  const shuffled = [...data].sort(() => Math.random() - 0.5);

  return (
    <div className="flex flex-wrap gap-2 justify-center py-4">
      {shuffled.map((item) => (
        <span
          key={item.symbol}
          className={cn(
            "px-3 py-1.5 rounded-full bg-mystic-800/50 text-mystic-300 hover:bg-mystic-700/50 hover:text-lunar transition-all cursor-default",
            getSize(item.count),
            getOpacity(item.count)
          )}
          title={`${item.count} occurrence${item.count > 1 ? "s" : ""}`}
        >
          {item.symbol}
        </span>
      ))}
    </div>
  );
}
