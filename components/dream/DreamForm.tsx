"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Calendar, Moon, Sparkles, Loader2, Tag, X } from "lucide-react";
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
      router.push(`/dreams/${result.id}`);
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-lunar flex items-center gap-2">
          <Moon className="w-4 h-4 text-mystic-400" />
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
        <Label htmlFor="dreamDate" className="text-lunar flex items-center gap-2">
          <Calendar className="w-4 h-4 text-mystic-400" />
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
        <Label htmlFor="content" className="text-lunar flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-mystic-400" />
          Décrivez votre rêve
        </Label>
        <Textarea
          id="content"
          placeholder="Décrivez votre rêve en détail... Que s'est-il passé ? Quels personnages étaient présents ? Quels lieux avez-vous visités ?"
          {...register("content")}
          rows={8}
          className="bg-mystic-900/30 border-mystic-600/30 text-lunar placeholder:text-mystic-500 focus:border-mystic-500 resize-none"
        />
        {errors.content && (
          <p className="text-red-400 text-sm">{errors.content.message}</p>
        )}
      </div>

      {/* Emotions */}
      <div className="space-y-3">
        <Label className="text-lunar">Émotions ressenties</Label>
        <div className="flex flex-wrap gap-2">
          {EMOTION_OPTIONS.map((emotion) => (
            <button
              key={emotion.value}
              type="button"
              onClick={() => toggleEmotion(emotion.value)}
              className={`px-3 py-2 rounded-full text-sm transition-all ${
                selectedEmotions.includes(emotion.value)
                  ? "bg-mystic-600 text-white border border-mystic-500"
                  : "bg-mystic-900/30 text-mystic-300 border border-mystic-700/30 hover:border-mystic-600/50"
              }`}
            >
              {emotion.emoji} {emotion.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mood */}
      <div className="space-y-2">
        <Label className="text-lunar">Humeur au réveil</Label>
        <Select onValueChange={(value) => setValue("mood", value)}>
          <SelectTrigger className="bg-mystic-900/30 border-mystic-600/30 text-lunar">
            <SelectValue placeholder="Sélectionnez votre humeur" />
          </SelectTrigger>
          <SelectContent className="bg-night-light border-mystic-700">
            {MOOD_OPTIONS.map((mood) => (
              <SelectItem
                key={mood.value}
                value={mood.value}
                className="text-lunar hover:bg-mystic-800"
              >
                {mood.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sleep Quality */}
      <div className="space-y-3">
        <Label className="text-lunar">Qualité du sommeil</Label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setValue("sleepQuality", level)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                sleepQuality === level
                  ? "bg-gold text-night"
                  : "bg-mystic-900/30 text-mystic-400 border border-mystic-700/30 hover:border-mystic-600/50"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
        <p className="text-xs text-mystic-500">1 = Mauvais, 5 = Excellent</p>
      </div>

      {/* Lucidity */}
      <div className="space-y-3">
        <Label className="text-lunar">Niveau de lucidité</Label>
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setValue("lucidity", level)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                lucidity === level
                  ? "bg-mystic-500 text-white"
                  : "bg-mystic-900/30 text-mystic-400 border border-mystic-700/30 hover:border-mystic-600/50"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
        <p className="text-xs text-mystic-500">
          0 = Pas lucide, 5 = Totalement conscient de rêver
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
      <div className="space-y-3">
        <Label className="text-lunar flex items-center gap-2">
          <Tag className="w-4 h-4 text-mystic-400" />
          Tags personnalisés
        </Label>
        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
            placeholder="Ajouter un tag..."
            className="bg-mystic-900/30 border-mystic-600/30 text-lunar placeholder:text-mystic-500"
          />
          <Button
            type="button"
            onClick={addTag}
            variant="outline"
            className="border-mystic-600/30 text-mystic-300"
          >
            Ajouter
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
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 btn-mystic btn-gold"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Enregistrer le rêve
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
