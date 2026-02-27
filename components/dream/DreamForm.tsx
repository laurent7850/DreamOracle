"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Calendar, Moon, Sparkles, Loader2, Tag, X, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { VoiceRecorder } from "@/components/ui/VoiceRecorder";
import { EMOTION_OPTIONS, MOOD_OPTIONS } from "@/types";

const dreamFormSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  content: z.string().min(10, "Décrivez votre rêve en au moins 10 caractères"),
  dreamDate: z.string(),
  mood: z.string().optional(),
  sleepQuality: z.number().min(1).max(5).optional(),
  lucidity: z.number().min(0).max(5),
  isRecurring: z.boolean(),
});

type DreamFormData = z.infer<typeof dreamFormSchema>;

export function DreamForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DreamFormData>({
    resolver: zodResolver(dreamFormSchema),
    defaultValues: {
      dreamDate: new Date().toISOString().split("T")[0],
      lucidity: 0,
      isRecurring: false,
    },
  });

  const lucidity = watch("lucidity");
  const sleepQuality = watch("sleepQuality");
  const currentContent = watch("content");

  // Handle voice transcript - append to existing content
  const handleVoiceTranscript = (text: string) => {
    const newContent = currentContent ? `${currentContent} ${text}` : text;
    setValue("content", newContent);
  };

  const toggleEmotion = (value: string) => {
    setSelectedEmotions((prev) =>
      prev.includes(value)
        ? prev.filter((e) => e !== value)
        : [...prev, value]
    );
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags((prev) => [...prev, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const onSubmit = async (data: DreamFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/dreams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          emotions: selectedEmotions,
          tags,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Erreur lors de la création du rêve");
        return;
      }

      toast.success("Rêve enregistré avec succès !");
      router.push(`/dreams/${result.id}?interpret=true`);
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-lunar flex items-center gap-2 text-sm sm:text-base">
          <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-mystic-400" />
          Titre du rêve
        </Label>
        <Input
          id="title"
          placeholder="Donnez un titre à votre rêve..."
          {...register("title")}
          className="bg-mystic-900/30 border-mystic-600/30 text-lunar placeholder:text-mystic-500 focus:border-mystic-500"
        />
        {errors.title && (
          <p className="text-red-400 text-sm">{errors.title.message}</p>
        )}
      </div>

      {/* Date */}
      <div className="space-y-2">
        <Label htmlFor="dreamDate" className="text-lunar flex items-center gap-2 text-sm sm:text-base">
          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-mystic-400" />
          Date du rêve
        </Label>
        <Input
          id="dreamDate"
          type="date"
          {...register("dreamDate")}
          className="bg-mystic-900/30 border-mystic-600/30 text-lunar focus:border-mystic-500"
        />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="content" className="text-lunar flex items-center gap-2 text-sm sm:text-base">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-mystic-400" />
            <span className="hidden sm:inline">Décrivez votre rêve</span>
            <span className="sm:hidden">Description</span>
          </Label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-mystic-500 hidden md:inline">
              <Mic className="w-3 h-3 inline mr-1" />
              Dictez votre rêve
            </span>
            <VoiceRecorder
              onTranscript={handleVoiceTranscript}
              disabled={isLoading}
            />
          </div>
        </div>
        <Textarea
          id="content"
          placeholder="Décrivez votre rêve en détail..."
          {...register("content")}
          rows={6}
          className="bg-mystic-900/30 border-mystic-600/30 text-lunar placeholder:text-mystic-500 focus:border-mystic-500 resize-none text-sm sm:text-base"
        />
        {errors.content && (
          <p className="text-red-400 text-sm">{errors.content.message}</p>
        )}
      </div>

      {/* Emotions */}
      <div className="space-y-2 sm:space-y-3">
        <Label className="text-lunar text-sm sm:text-base">Émotions ressenties</Label>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {EMOTION_OPTIONS.map((emotion) => (
            <button
              key={emotion.value}
              type="button"
              onClick={() => toggleEmotion(emotion.value)}
              className={`flex flex-col items-center gap-1 px-2 sm:px-3 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm transition-all min-w-[3.5rem] sm:min-w-[4.5rem] ${
                selectedEmotions.includes(emotion.value)
                  ? "bg-mystic-600 text-white border border-mystic-500"
                  : "bg-mystic-900/30 text-mystic-300 border border-mystic-700/30 hover:border-mystic-600/50"
              }`}
            >
              <span className="text-lg sm:text-xl">{emotion.emoji}</span>
              <span className="text-[10px] sm:text-xs leading-tight">{emotion.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mood */}
      <div className="space-y-2">
        <Label className="text-lunar text-sm sm:text-base">Humeur au réveil</Label>
        <Select onValueChange={(value) => setValue("mood", value)}>
          <SelectTrigger className="bg-mystic-900/30 border-mystic-600/30 text-lunar text-sm sm:text-base">
            <SelectValue placeholder="Sélectionnez votre humeur" />
          </SelectTrigger>
          <SelectContent className="bg-night-light border-mystic-700">
            {MOOD_OPTIONS.map((mood) => (
              <SelectItem
                key={mood.value}
                value={mood.value}
                className="text-lunar hover:bg-mystic-800 text-sm sm:text-base"
              >
                {mood.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sleep Quality */}
      <div className="space-y-2 sm:space-y-3">
        <Label className="text-lunar text-sm sm:text-base">Qualité du sommeil</Label>
        <div className="flex gap-1.5 sm:gap-2">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setValue("sleepQuality", level)}
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all text-sm sm:text-base ${
                sleepQuality === level
                  ? "bg-gold text-night"
                  : "bg-mystic-900/30 text-mystic-400 border border-mystic-700/30 hover:border-mystic-600/50"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
        <p className="text-[10px] sm:text-xs text-mystic-500">1 = Mauvais, 5 = Excellent</p>
      </div>

      {/* Lucidity */}
      <div className="space-y-2 sm:space-y-3">
        <Label className="text-lunar text-sm sm:text-base">Niveau de lucidité</Label>
        <div className="flex gap-1.5 sm:gap-2 flex-wrap">
          {[0, 1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setValue("lucidity", level)}
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all text-sm sm:text-base ${
                lucidity === level
                  ? "bg-mystic-500 text-white"
                  : "bg-mystic-900/30 text-mystic-400 border border-mystic-700/30 hover:border-mystic-600/50"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
        <p className="text-[10px] sm:text-xs text-mystic-500">
          0 = Pas lucide, 5 = Conscient de rêver
        </p>
      </div>

      {/* Recurring */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="isRecurring"
          {...register("isRecurring")}
          className="w-5 h-5 rounded border-mystic-600 bg-mystic-900/30 text-mystic-500 focus:ring-mystic-500"
        />
        <Label htmlFor="isRecurring" className="text-lunar cursor-pointer">
          C&apos;est un rêve récurrent
        </Label>
      </div>

      {/* Tags */}
      <div className="space-y-2 sm:space-y-3">
        <Label className="text-lunar flex items-center gap-2 text-sm sm:text-base">
          <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-mystic-400" />
          Tags personnalisés
        </Label>
        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
            placeholder="Ajouter un tag..."
            className="bg-mystic-900/30 border-mystic-600/30 text-lunar placeholder:text-mystic-500 text-sm sm:text-base"
          />
          <Button
            type="button"
            onClick={addTag}
            variant="outline"
            className="border-mystic-600/30 text-mystic-300 text-sm sm:text-base px-3 sm:px-4"
          >
            <span className="hidden sm:inline">Ajouter</span>
            <span className="sm:hidden">+</span>
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                className="bg-mystic-800 text-mystic-200 hover:bg-mystic-700"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="flex gap-4 pt-2">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 btn-mystic btn-gold text-sm sm:text-base py-2.5 sm:py-3"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
              <span className="hidden sm:inline">Enregistrement...</span>
              <span className="sm:hidden">Envoi...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="hidden sm:inline">Enregistrer le rêve</span>
              <span className="sm:hidden">Enregistrer</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
