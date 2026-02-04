"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Save, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface EditableDreamContentProps {
  dreamId: string;
  initialContent: string;
}

export function EditableDreamContent({
  dreamId,
  initialContent,
}: EditableDreamContentProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (content.trim() === initialContent.trim()) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/dreams/${dreamId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim() }),
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || "Erreur lors de la sauvegarde");
        return;
      }

      toast.success("Rêve mis à jour avec succès");
      setIsEditing(false);
      router.refresh();
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setContent(initialContent);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="space-y-3">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[200px] bg-mystic-900/50 border-mystic-600/30 text-lunar font-mystical text-lg leading-relaxed resize-y"
          placeholder="Décrivez votre rêve..."
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            disabled={isSaving}
            className="text-mystic-400 hover:text-mystic-300"
          >
            <X className="w-4 h-4 mr-1" />
            Annuler
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gold/20 text-gold hover:bg-gold/30 border border-gold/30"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-1" />
            )}
            Sauvegarder
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative">
      <p className="text-lunar whitespace-pre-wrap leading-relaxed font-mystical text-lg">
        {content}
      </p>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsEditing(true)}
        className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity text-mystic-400 hover:text-gold"
      >
        <Pencil className="w-4 h-4 mr-1" />
        Modifier
      </Button>
    </div>
  );
}
