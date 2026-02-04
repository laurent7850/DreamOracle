"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sparkles, Loader2, RefreshCw, Moon, MessageCircle, Lightbulb, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { INTERPRETATION_STYLES } from "@/types";
import type { DreamInterpretation as InterpretationType } from "@/types";

interface DreamInterpretationProps {
  dreamId: string;
  existingInterpretation: string | null;
}

export function DreamInterpretation({
  dreamId,
  existingInterpretation,
}: DreamInterpretationProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [style, setStyle] = useState<"spiritual" | "psychological" | "balanced">("balanced");
  const [currentStyle, setCurrentStyle] = useState<"spiritual" | "psychological" | "balanced" | null>(null);
  const [interpretation, setInterpretation] = useState<InterpretationType | null>(null);

  const requestInterpretation = async (requestedStyle?: "spiritual" | "psychological" | "balanced") => {
    const styleToUse = requestedStyle || style;
    setIsLoading(true);

    try {
      const response = await fetch("/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dreamId, style: styleToUse }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Erreur lors de l'interprétation");
        return;
      }

      setInterpretation(data.interpretation);
      setCurrentStyle(styleToUse);
      toast.success("L'Oracle a révélé le sens de votre rêve !");
      router.refresh();
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  // Get style label
  const getStyleLabel = (styleValue: string) => {
    const found = INTERPRETATION_STYLES.find(s => s.value === styleValue);
    return found ? found.label : styleValue;
  };

  // If we have a structured interpretation from the current session
  if (interpretation) {
    return (
      <Card className="glass-card border-gold/20">
        <CardHeader className="border-b border-mystic-700/30">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="font-display text-xl text-gold flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Révélation de l&apos;Oracle
              {currentStyle && (
                <span className="text-sm font-normal text-mystic-400">
                  ({getStyleLabel(currentStyle)})
                </span>
              )}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setInterpretation(null)}
              className="text-mystic-400 hover:text-mystic-300"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Nouvelle interprétation
            </Button>
          </div>
          {/* Style switcher for alternative interpretations */}
          <div className="mt-4 pt-4 border-t border-mystic-700/30">
            <p className="text-sm text-mystic-400 mb-3 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Voir cette interprétation sous un autre angle :
            </p>
            <div className="flex flex-wrap gap-2">
              {INTERPRETATION_STYLES.filter(s => s.value !== currentStyle).map((styleOption) => (
                <Button
                  key={styleOption.value}
                  variant="outline"
                  size="sm"
                  disabled={isLoading}
                  onClick={() => requestInterpretation(styleOption.value as "spiritual" | "psychological" | "balanced")}
                  className="border-mystic-600/30 text-mystic-300 hover:text-gold hover:border-gold/50 bg-mystic-900/30"
                >
                  {isLoading ? (
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3 mr-1" />
                  )}
                  {styleOption.label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Symbols */}
          <div>
            <h3 className="text-lunar font-display text-lg mb-3 flex items-center gap-2">
              <Moon className="w-4 h-4 text-mystic-400" />
              Symboles Clés
            </h3>
            <div className="space-y-3">
              {interpretation.symbols.map((symbol, index) => (
                <div
                  key={index}
                  className="bg-mystic-900/30 p-3 rounded-lg border border-mystic-700/30"
                >
                  <span className="text-gold font-medium">{symbol.name}</span>
                  <p className="text-mystic-300 text-sm mt-1">{symbol.meaning}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Emotional Themes */}
          <div>
            <h3 className="text-lunar font-display text-lg mb-3">
              Thèmes Émotionnels
            </h3>
            <div className="flex flex-wrap gap-2">
              {interpretation.emotionalThemes.map((theme, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-mystic-800/50 text-mystic-200 rounded-full text-sm"
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>

          {/* Main Message */}
          <div className="bg-gradient-to-r from-mystic-900/50 to-gold/10 p-4 rounded-lg border border-gold/20">
            <h3 className="text-gold font-display text-lg mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Message de votre Subconscient
            </h3>
            <p className="text-lunar font-mystical text-lg leading-relaxed">
              {interpretation.mainMessage}
            </p>
          </div>

          {/* Reflection Questions */}
          <div>
            <h3 className="text-lunar font-display text-lg mb-3 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-mystic-400" />
              Questions de Réflexion
            </h3>
            <ul className="space-y-2">
              {interpretation.reflectionQuestions.map((question, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-mystic-300"
                >
                  <span className="text-mystic-500">•</span>
                  {question}
                </li>
              ))}
            </ul>
          </div>

          {/* Practical Advice */}
          <div className="bg-mystic-900/30 p-4 rounded-lg border border-mystic-700/30">
            <h3 className="text-lunar font-display text-lg mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-gold" />
              Conseil Pratique
            </h3>
            <p className="text-mystic-300">{interpretation.practicalAdvice}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If we have an existing interpretation stored as text
  if (existingInterpretation) {
    return (
      <Card className="glass-card border-gold/20">
        <CardHeader className="border-b border-mystic-700/30">
          <div className="flex items-center justify-between">
            <CardTitle className="font-display text-xl text-gold flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Interprétation de l&apos;Oracle
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => requestInterpretation()}
              disabled={isLoading}
              className="text-mystic-400 hover:text-mystic-300"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-1" />
              )}
              Réinterpréter
            </Button>
          </div>
          {/* Style switcher for alternative interpretations */}
          <div className="mt-4 pt-4 border-t border-mystic-700/30">
            <p className="text-sm text-mystic-400 mb-3 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Découvrir d&apos;autres perspectives :
            </p>
            <div className="flex flex-wrap gap-2">
              {INTERPRETATION_STYLES.map((styleOption) => (
                <Button
                  key={styleOption.value}
                  variant="outline"
                  size="sm"
                  disabled={isLoading}
                  onClick={() => requestInterpretation(styleOption.value as "spiritual" | "psychological" | "balanced")}
                  className="border-mystic-600/30 text-mystic-300 hover:text-gold hover:border-gold/50 bg-mystic-900/30"
                >
                  {isLoading ? (
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3 mr-1" />
                  )}
                  {styleOption.label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-mystic-200 font-mystical leading-relaxed">
              {existingInterpretation}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // No interpretation yet - show request form
  return (
    <Card className="glass-card border-mystic-700/30">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-mystic-800/50 animate-pulse">
            <Sparkles className="w-10 h-10 text-mystic-400" />
          </div>
        </div>
        <CardTitle className="font-display text-xl text-lunar">
          Demander une interprétation
        </CardTitle>
        <p className="text-mystic-400 mt-2">
          Laissez l&apos;Oracle révéler le sens caché de votre rêve
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm text-mystic-300">Style d&apos;interprétation</label>
          <Select
            value={style}
            onValueChange={(value: "spiritual" | "psychological" | "balanced") =>
              setStyle(value)
            }
          >
            <SelectTrigger className="bg-mystic-900/30 border-mystic-600/30 text-lunar">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-night-light border-mystic-700">
              {INTERPRETATION_STYLES.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-lunar hover:bg-mystic-800"
                >
                  <div>
                    <span className="font-medium">{option.label}</span>
                    <p className="text-xs text-mystic-400">{option.description}</p>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={() => requestInterpretation()}
          disabled={isLoading}
          className="w-full btn-mystic btn-gold"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              L&apos;Oracle médite...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Consulter l&apos;Oracle
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
