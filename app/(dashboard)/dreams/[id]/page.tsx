import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  Moon,
  Calendar,
  ArrowLeft,
  Repeat,
  Brain,
  Heart,
  Tag,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DreamInterpretation } from "@/components/dream/DreamInterpretation";
import { EditableDreamContent } from "@/components/dream/EditableDreamContent";
import { DeleteDreamButton } from "./DeleteDreamButton";
import { EMOTION_OPTIONS, MOOD_OPTIONS } from "@/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dream = await prisma.dream.findUnique({
    where: { id },
    select: { title: true },
  });

  return {
    title: dream?.title || "Rêve",
  };
}

export default async function DreamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  const dream = await prisma.dream.findUnique({
    where: { id },
  });

  if (!dream) {
    notFound();
  }

  if (dream.userId !== session?.user?.id) {
    notFound();
  }

  const emotions = JSON.parse(dream.emotions) as string[];
  const symbols = JSON.parse(dream.symbols) as string[];
  const tags = JSON.parse(dream.tags) as string[];

  const moodLabel = MOOD_OPTIONS.find((m) => m.value === dream.mood)?.label;

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 px-1">
      {/* Back Button */}
      <Link href="/dreams">
        <Button
          variant="ghost"
          className="text-mystic-400 hover:text-mystic-300 -ml-2 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
          Retour aux rêves
        </Button>
      </Link>

      {/* Dream Content Card */}
      <Card className="glass-card border-mystic-700/30">
        <CardHeader className="border-b border-mystic-700/30 px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 rounded-full bg-mystic-800/50">
                <Moon className="w-6 h-6 sm:w-8 sm:h-8 text-mystic-400" />
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="font-display text-lg sm:text-xl md:text-2xl text-lunar truncate">
                  {dream.title}
                </CardTitle>
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-mystic-400 mt-1">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">
                    {new Date(dream.dreamDate).toLocaleDateString("fr-FR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            <DeleteDreamButton dreamId={dream.id} />
          </div>
        </CardHeader>

        <CardContent className="pt-4 sm:pt-6 space-y-4 sm:space-y-6 px-4 sm:px-6">
          {/* Dream Text - Editable */}
          <div className="bg-mystic-900/30 p-4 sm:p-6 rounded-lg border border-mystic-700/30">
            <EditableDreamContent
              dreamId={dream.id}
              initialContent={dream.content}
            />
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
            {/* Sleep Quality */}
            {dream.sleepQuality && (
              <div className="bg-mystic-900/30 p-3 sm:p-4 rounded-lg border border-mystic-700/30">
                <p className="text-mystic-500 text-xs sm:text-sm mb-1">Qualité sommeil</p>
                <div className="flex gap-0.5 sm:gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs ${
                        level <= dream.sleepQuality!
                          ? "bg-gold text-night"
                          : "bg-mystic-800 text-mystic-600"
                      }`}
                    >
                      {level}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lucidity */}
            <div className="bg-mystic-900/30 p-3 sm:p-4 rounded-lg border border-mystic-700/30">
              <p className="text-mystic-500 text-xs sm:text-sm mb-1 flex items-center gap-1">
                <Brain className="w-3 h-3 sm:w-4 sm:h-4" />
                Lucidité
              </p>
              <div className="flex gap-0.5 sm:gap-1 flex-wrap">
                {[0, 1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs ${
                      level <= dream.lucidity
                        ? "bg-mystic-500 text-white"
                        : "bg-mystic-800 text-mystic-600"
                    }`}
                  >
                    {level}
                  </div>
                ))}
              </div>
            </div>

            {/* Mood */}
            {dream.mood && (
              <div className="bg-mystic-900/30 p-3 sm:p-4 rounded-lg border border-mystic-700/30">
                <p className="text-mystic-500 text-xs sm:text-sm mb-1 flex items-center gap-1">
                  <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                  Humeur
                </p>
                <p className="text-lunar text-sm sm:text-base">{moodLabel}</p>
              </div>
            )}

            {/* Recurring */}
            {dream.isRecurring && (
              <div className="bg-mystic-900/30 p-3 sm:p-4 rounded-lg border border-mystic-700/30">
                <p className="text-mystic-500 text-xs sm:text-sm mb-1 flex items-center gap-1">
                  <Repeat className="w-3 h-3 sm:w-4 sm:h-4" />
                  Type
                </p>
                <p className="text-lunar text-sm sm:text-base">Récurrent</p>
              </div>
            )}
          </div>

          {/* Emotions */}
          {emotions.length > 0 && (
            <div>
              <p className="text-mystic-500 text-xs sm:text-sm mb-2 flex items-center gap-1">
                <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                Émotions ressenties
              </p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {emotions.map((emotion) => {
                  const emotionData = EMOTION_OPTIONS.find(
                    (e) => e.value === emotion
                  );
                  return emotionData ? (
                    <Badge
                      key={emotion}
                      className="bg-mystic-800 text-mystic-200 border-mystic-700 text-xs sm:text-sm"
                    >
                      {emotionData.emoji} {emotionData.label}
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* Symbols */}
          {symbols.length > 0 && (
            <div>
              <p className="text-mystic-500 text-xs sm:text-sm mb-2">Symboles identifiés</p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {symbols.map((symbol) => (
                  <Badge
                    key={symbol}
                    className="bg-gold/20 text-gold border-gold/30 text-xs sm:text-sm"
                  >
                    {symbol}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div>
              <p className="text-mystic-500 text-xs sm:text-sm mb-2 flex items-center gap-1">
                <Tag className="w-3 h-3 sm:w-4 sm:h-4" />
                Tags
              </p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="border-mystic-600 text-mystic-300 text-xs sm:text-sm"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Interpretation Section */}
      <Suspense>
        <DreamInterpretation
          dreamId={dream.id}
          existingInterpretation={dream.interpretation}
        />
      </Suspense>
    </div>
  );
}
