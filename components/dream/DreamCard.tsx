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
      <article className="glass-card p-6 hover:border-mystic-500/50 transition-all cursor-pointer group">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-mystic-400 group-hover:text-gold transition-colors" />
            <h3 className="font-display text-lg text-lunar group-hover:text-gold transition-colors">
              {dream.title}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-mystic-500">
            <Calendar className="w-4 h-4" />
            {new Date(dream.dreamDate).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>

        <p className="text-mystic-300 text-sm line-clamp-3 mb-4">
          {dream.content}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          {dream.interpretation && (
            <Badge className="bg-gold/20 text-gold border-gold/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Interprété
            </Badge>
          )}

          {dream.isRecurring && (
            <Badge className="bg-mystic-700/50 text-mystic-300 border-mystic-600/30">
              <Repeat className="w-3 h-3 mr-1" />
              Récurrent
            </Badge>
          )}

          {dream.lucidity > 0 && (
            <Badge className="bg-aurora-blue/20 text-aurora-blue border-aurora-blue/30">
              Lucidité {dream.lucidity}/5
            </Badge>
          )}

          {emotions.slice(0, 3).map((emotion) => {
            const emotionData = EMOTION_OPTIONS.find((e) => e.value === emotion);
            return emotionData ? (
              <Badge
                key={emotion}
                className="bg-mystic-800/50 text-mystic-200 border-mystic-700/30"
              >
                {emotionData.emoji} {emotionData.label}
              </Badge>
            ) : null;
          })}

          {tags.slice(0, 2).map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="border-mystic-600/30 text-mystic-400"
            >
              #{tag}
            </Badge>
          ))}

          {(emotions.length > 3 || tags.length > 2) && (
            <span className="text-xs text-mystic-500">
              +{Math.max(0, emotions.length - 3) + Math.max(0, tags.length - 2)}
            </span>
          )}
        </div>
      </article>
    </Link>
  );
}
