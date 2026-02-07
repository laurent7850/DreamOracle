import Link from "next/link";
import { Moon, Sparkles, Calendar, Repeat } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EMOTION_OPTIONS } from "@/types";
import type { Dream } from "@/types";

interface DreamCardProps {
  dream: Dream;
}

export function DreamCard({ dream }: DreamCardProps) {
  const emotions = dream.emotions || [];
  const tags = dream.tags || [];

  return (
    <Link href={`/dreams/${dream.id}`}>
      <article className="glass-card p-4 sm:p-6 hover:border-mystic-500/50 transition-all cursor-pointer group">
        <div className="flex justify-between items-start gap-2 mb-2 sm:mb-3">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
            <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-mystic-400 group-hover:text-gold transition-colors flex-shrink-0" />
            <h3 className="font-display text-sm sm:text-lg text-lunar group-hover:text-gold transition-colors truncate">
              {dream.title}
            </h3>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-mystic-500 flex-shrink-0">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">
              {new Date(dream.dreamDate).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            <span className="sm:hidden">
              {new Date(dream.dreamDate).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
              })}
            </span>
          </div>
        </div>

        <p className="text-mystic-300 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3 mb-3 sm:mb-4">
          {dream.content}
        </p>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {dream.interpretation && (
            <Badge className="bg-gold/20 text-gold border-gold/30 text-[10px] sm:text-xs">
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
              <span className="hidden sm:inline">Interprété</span>
              <span className="sm:hidden">✓</span>
            </Badge>
          )}

          {dream.isRecurring && (
            <Badge className="bg-mystic-700/50 text-mystic-300 border-mystic-600/30 text-[10px] sm:text-xs">
              <Repeat className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
              <span className="hidden sm:inline">Récurrent</span>
              <span className="sm:hidden">↻</span>
            </Badge>
          )}

          {dream.lucidity > 0 && (
            <Badge className="bg-aurora-blue/20 text-aurora-blue border-aurora-blue/30 text-[10px] sm:text-xs">
              <span className="hidden sm:inline">Lucidité </span>{dream.lucidity}/5
            </Badge>
          )}

          {/* Show fewer emotions on mobile */}
          {emotions.slice(0, 2).map((emotion) => {
            const emotionData = EMOTION_OPTIONS.find((e) => e.value === emotion);
            return emotionData ? (
              <Badge
                key={emotion}
                className="bg-mystic-800/50 text-mystic-200 border-mystic-700/30 text-[10px] sm:text-xs hidden sm:inline-flex"
              >
                {emotionData.emoji} {emotionData.label}
              </Badge>
            ) : null;
          })}

          {/* Show just emoji on mobile */}
          {emotions.slice(0, 2).map((emotion) => {
            const emotionData = EMOTION_OPTIONS.find((e) => e.value === emotion);
            return emotionData ? (
              <Badge
                key={`${emotion}-mobile`}
                className="bg-mystic-800/50 text-mystic-200 border-mystic-700/30 text-[10px] sm:hidden"
              >
                {emotionData.emoji}
              </Badge>
            ) : null;
          })}

          {tags.slice(0, 1).map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="border-mystic-600/30 text-mystic-400 text-[10px] sm:text-xs hidden sm:inline-flex"
            >
              #{tag}
            </Badge>
          ))}

          {(emotions.length > 2 || tags.length > 1) && (
            <span className="text-[10px] sm:text-xs text-mystic-500">
              +{Math.max(0, emotions.length - 2) + Math.max(0, tags.length - 1)}
            </span>
          )}
        </div>
      </article>
    </Link>
  );
}
