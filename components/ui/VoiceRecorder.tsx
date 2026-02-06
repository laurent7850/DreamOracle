"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Mic, MicOff, Square, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  className?: string;
  disabled?: boolean;
}

// Detect if we're on a mobile device
function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export function VoiceRecorder({ onTranscript, className, disabled }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check if mobile on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(isMobileDevice());
    }
  }, []);

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
      formData.append("audio", audioBlob, "recording.webm");

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Transcription failed");
      }

      const result = await response.json();

      if (result.transcript && result.transcript.trim()) {
        onTranscript(result.transcript.trim());
        toast.success("Transcription réussie !");
      } else {
        toast.info("Aucune parole détectée.");
      }
    } catch (error) {
      console.error("Transcription error:", error);
      toast.error("Erreur lors de la transcription. Réessayez.");
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
          sampleRate: 44100,
        }
      });

      streamRef.current = stream;
      audioChunksRef.current = [];

      // Try webm first, fallback to mp4 for Safari
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());

        // Clear timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setRecordingTime(0);

        // Create blob and transcribe
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          await transcribeAudio(audioBlob);
        }
      };

      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Impossible d'accéder au microphone. Vérifiez vos permissions.");
    }
  }, [isRecording, isTranscribing, transcribeAudio]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (!isRecording || !mediaRecorderRef.current) return;

    try {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } catch (error) {
      console.error("Error stopping recording:", error);
      setIsRecording(false);
    }
  }, [isRecording]);

  // Format recording time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Mobile: Press and hold mode
  if (isMobile) {
    return (
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={disabled || isTranscribing}
          onTouchStart={(e) => {
            e.preventDefault();
            startRecording();
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            stopRecording();
          }}
          onTouchCancel={(e) => {
            e.preventDefault();
            stopRecording();
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            startRecording();
          }}
          onMouseUp={(e) => {
            e.preventDefault();
            stopRecording();
          }}
          onMouseLeave={() => {
            if (isRecording) stopRecording();
          }}
          onContextMenu={(e) => e.preventDefault()}
          className={cn(
            "transition-all select-none touch-none",
            isRecording
              ? "bg-red-500/20 border-red-500 text-red-400 scale-110 shadow-lg shadow-red-500/20"
              : isTranscribing
              ? "bg-gold/20 border-gold text-gold"
              : "border-mystic-600/30 text-mystic-400 hover:border-mystic-500 hover:text-mystic-300",
            className
          )}
          title="Maintenez appuyé pour dicter"
        >
          {isTranscribing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isRecording ? (
            <Mic className="w-5 h-5 animate-pulse" />
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </Button>

        {isRecording && (
          <span className="text-xs text-red-400 animate-pulse flex items-center gap-1">
            <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            {formatTime(recordingTime)}
          </span>
        )}

        {isTranscribing && (
          <span className="text-xs text-gold animate-pulse">
            Transcription...
          </span>
        )}

        {!isRecording && !isTranscribing && (
          <span className="text-xs text-mystic-500">
            Maintenez
          </span>
        )}
      </div>
    );
  }

  // Desktop: Click to toggle mode
  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={disabled || isTranscribing}
        onClick={() => {
          if (isRecording) {
            stopRecording();
          } else {
            startRecording();
          }
        }}
        className={cn(
          "transition-all",
          isRecording
            ? "bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500/30 hover:text-red-300 animate-pulse"
            : isTranscribing
            ? "bg-gold/20 border-gold text-gold"
            : "border-mystic-600/30 text-mystic-400 hover:border-mystic-500 hover:text-mystic-300",
          className
        )}
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
