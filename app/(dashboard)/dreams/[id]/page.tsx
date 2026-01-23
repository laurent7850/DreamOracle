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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Button */}
      <Link href="/dreams">
        <Button
          variant="ghost"
          className="text-mystic-400 hover:text-mystic-300 -ml-2"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour aux rêves
        </Button>
      </Link>

      {/* Dream Content Card */}
      <Card className="glass-card border-mystic-700/30">
        <CardHeader className="border-b border-mystic-700/30">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-mystic-800/50">
                <Moon className="w-8 h-8 text-mystic-400" />
              </div>
              <div>
                <CardTitle className="font-display text-2xl text-lunar">
                  {dream.title}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-mystic-400 mt-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(dream.dreamDate).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>

            <DeleteDreamButton dreamId={dream.id} />
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Dream Text */}
          <div className="bg-mystic-900/30 p-6 rounded-lg border border-mystic-700/30">
            <p className="text-lunar whitespace-pre-wrap leading-relaxed font-mystical text-lg">
              {dream.content}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Sleep Quality */}
            {dream.sleepQuality && (
              <div className="bg-mystic-900/30 p-4 rounded-lg border border-mystic-700/30">
                <p className="text-mystic-500 text-sm mb-1">Qualité du sommeil</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
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
            <div className="bg-mystic-900/30 p-4 rounded-lg border border-mystic-700/30">
              <p className="text-mystic-500 text-sm mb-1 flex items-center gap-1">
                <Brain className="w-4 h-4" />
                Lucidité
              </p>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
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
              <div className="bg-mystic-900/30 p-4 rounded-lg border border-mystic-700/30">
                <p className="text-mystic-500 text-sm mb-1 flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  Humeur au réveil
                </p>
                <p className="text-lunar">{moodLabel}</p>
              </div>
            )}

            {/* Recurring */}
            {dream.isRecurring && (
              <div className="bg-mystic-900/30 p-4 rounded-lg border border-mystic-700/30">
                <p className="text-mystic-500 text-sm mb-1 flex items-center gap-1">
                  <Repeat className="w-4 h-4" />
                  Type
                </p>
                <p className="text-lunar">Rêve récurrent</p>
              </div>
            )}
          </div>

          {/* Emotions */}
          {emotions.length > 0 && (
            <div>
              <p className="text-mystic-500 text-sm mb-2 flex items-center gap-1">
                <Heart className="w-4 h-4" />
                Émotions ressenties
              </p>
              <div className="flex flex-wrap gap-2">
                {emotions.map((emotion) => {
                  const emotionData = EMOTION_OPTIONS.find(
                    (e) => e.value === emotion
                  );
                  return emotionData ? (
                    <Badge
                      key={emotion}
                      className="bg-mystic-800 text-mystic-200 border-mystic-700"
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
              <p className="text-mystic-500 text-sm mb-2">Symboles identifiés</p>
              <div className="flex flex-wrap gap-2">
                {symbols.map((symbol) => (
                  <Badge
                    key={symbol}
                    className="bg-gold/20 text-gold border-gold/30"
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
              <p className="text-mystic-500 text-sm mb-2 flex items-center gap-1">
                <Tag className="w-4 h-4" />
                Tags
              </p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="border-mystic-600 text-mystic-300"
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
      <DreamInterpretation
        dreamId={dream.id}
        existingInterpretation={dream.interpretation}
      />
    </div>
  );
}
