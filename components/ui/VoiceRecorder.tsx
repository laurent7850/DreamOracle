"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  className?: string;
  disabled?: boolean;
}

export function VoiceRecorder({ onTranscript, className, disabled }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Transcribe audio using ElevenLabs API
  const transcribeAudio = useCallback(async (audioBlob: Blob) => {
    setIsTranscribing(true);

    try {
      const formData = new FormData();
      const extension = audioBlob.type.includes("mp4") ? "m4a" :
                       audioBlob.type.includes("wav") ? "wav" : "webm";
      formData.append("audio", audioBlob, `recording.${extension}`);

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.error || "Transcription échouée");
        throw new Error(errorData.error || "Transcription failed");
      }

      const result = await response.json();

      if (result.transcript && result.transcript.trim()) {
        onTranscript(result.transcript.trim());
        toast.success("Transcription réussie !");
      } else {
        toast.info("Aucune parole détectée.");
      }
    } catch (error) {
      toast.error(`Erreur: ${error instanceof Error ? error.message : "Réessayez."}`);
    } finally {
      setIsTranscribing(false);
    }
  }, [onTranscript]);

  // Start recording
  const startRecording = useCallback(async () => {
    if (isRecording || isTranscribing) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        }
      });

      streamRef.current = stream;
      audioChunksRef.current = [];

      // Try different mime types for compatibility (iOS, Android, Desktop)
      let mimeType = "";
      const supportedTypes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4;codecs=mp4a.40.2",
        "audio/mp4",
        "audio/aac",
        "audio/wav",
        "audio/ogg;codecs=opus",
        "audio/ogg",
        "",
      ];

      for (const type of supportedTypes) {
        if (type === "" || MediaRecorder.isTypeSupported(type)) {
          mimeType = type;
          break;
        }
      }

      const mediaRecorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const actualMimeType = mediaRecorder.mimeType || mimeType || "audio/webm";
        stream.getTracks().forEach(track => track.stop());

        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setRecordingTime(0);

        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: actualMimeType });
          await transcribeAudio(audioBlob);
        } else {
          toast.error("Aucun audio enregistré. Réessayez.");
        }
      };

      mediaRecorder.onerror = () => {
        toast.error("Erreur d'enregistrement");
      };

      mediaRecorder.start(500);
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast.info("Enregistrement en cours... Appuyez à nouveau pour arrêter.");

    } catch {
      toast.error("Impossible d'accéder au microphone. Vérifiez vos permissions.");
    }
  }, [isRecording, isTranscribing, transcribeAudio]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (!isRecording || !mediaRecorderRef.current) return;

    try {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } catch {
      setIsRecording(false);
    }
  }, [isRecording]);

  // Toggle recording
  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  // Format recording time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={disabled || isTranscribing}
        onClick={toggleRecording}
        className={cn(
          "transition-all",
          isRecording
            ? "bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500/30 hover:text-red-300"
            : isTranscribing
            ? "bg-gold/20 border-gold text-gold"
            : "border-mystic-600/30 text-mystic-400 hover:border-mystic-500 hover:text-mystic-300",
          className
        )}
        aria-label={isRecording ? "Arrêter l'enregistrement" : isTranscribing ? "Transcription en cours" : "Dicter votre rêve"}
        title={isRecording ? "Arrêter l'enregistrement" : "Dicter votre rêve"}
      >
        {isTranscribing ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : isRecording ? (
          <Square className="w-4 h-4 fill-current" />
        ) : (
          <Mic className="w-5 h-5" />
        )}
      </Button>

      {isRecording && (
        <span className="text-xs text-red-400 animate-pulse flex items-center gap-1">
          <span className="inline-block w-2 h-2 bg-red-500 rounded-full" />
          {formatTime(recordingTime)}
        </span>
      )}

      {isTranscribing && (
        <span className="text-xs text-gold animate-pulse">
          Transcription...
        </span>
      )}
    </div>
  );
}
