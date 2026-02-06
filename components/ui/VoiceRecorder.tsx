"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  className?: string;
  disabled?: boolean;
}

// Types for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export function VoiceRecorder({ onTranscript, className, disabled }: VoiceRecorderProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [interimTranscript, setInterimTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const shouldRestartRef = useRef(false); // Track if we should auto-restart

  // Check browser support
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognitionAPI) {
        setIsSupported(false);
      }
    }
  }, []);

  // Initialize speech recognition
  const initRecognition = useCallback(() => {
    if (typeof window === "undefined") return null;

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return null;

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "fr-FR"; // French language

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = "";
      let interim = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interim += transcript;
        }
      }

      if (finalTranscript) {
        onTranscript(finalTranscript.trim());
        setInterimTranscript("");
      } else {
        setInterimTranscript(interim);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);

      // Don't show error for no-speech if we're in continuous mode - just restart
      if (event.error === "no-speech" && shouldRestartRef.current) {
        // Will auto-restart in onend
        return;
      }

      // For other errors, stop completely
      shouldRestartRef.current = false;
      setIsListening(false);
      setInterimTranscript("");

      switch (event.error) {
        case "not-allowed":
          toast.error("Accès au microphone refusé. Veuillez autoriser l'accès dans les paramètres de votre navigateur.");
          break;
        case "no-speech":
          // Only show if user manually stopped
          break;
        case "network":
          toast.error("Erreur réseau. Vérifiez votre connexion internet.");
          break;
        case "aborted":
          // User aborted, don't show error
          break;
        default:
          toast.error("Erreur de reconnaissance vocale. Réessayez.");
      }
    };

    recognition.onend = () => {
      setInterimTranscript("");

      // Auto-restart if user hasn't clicked to stop
      if (shouldRestartRef.current) {
        try {
          // Small delay before restarting to avoid rapid restarts
          setTimeout(() => {
            if (shouldRestartRef.current && recognitionRef.current) {
              recognitionRef.current.start();
            }
          }, 100);
        } catch (e) {
          console.error("Error restarting recognition:", e);
          shouldRestartRef.current = false;
          setIsListening(false);
        }
      } else {
        setIsListening(false);
      }
    };

    recognition.onstart = () => {
      setIsListening(true);
    };

    return recognition;
  }, [onTranscript]);

  // Toggle listening
  const toggleListening = useCallback(async () => {
    if (!isSupported) {
      toast.error("La reconnaissance vocale n'est pas supportée par votre navigateur.");
      return;
    }

    if (isListening) {
      // User wants to stop - disable auto-restart
      shouldRestartRef.current = false;
      recognitionRef.current?.stop();
      setIsListening(false);
      toast.info("Enregistrement arrêté.");
    } else {
      // Request microphone permission
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });

        // Create new recognition instance each time for cleaner state
        recognitionRef.current = initRecognition();

        if (recognitionRef.current) {
          // Enable auto-restart
          shouldRestartRef.current = true;
          recognitionRef.current.start();
          toast.info("🎤 Parlez maintenant... L'enregistrement continue jusqu'à ce que vous cliquiez pour arrêter.");
        }
      } catch (err) {
        console.error("Microphone permission error:", err);
        toast.error("Impossible d'accéder au microphone. Vérifiez vos permissions.");
      }
    }
  }, [isListening, isSupported, initRecognition]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      shouldRestartRef.current = false;
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  if (!isSupported) {
    return (
      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled
        className={cn(
          "border-mystic-600/30 text-mystic-500 cursor-not-allowed",
          className
        )}
        title="Reconnaissance vocale non supportée"
      >
        <MicOff className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={disabled}
        onClick={toggleListening}
        className={cn(
          "transition-all",
          isListening
            ? "bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500/30 hover:text-red-300 animate-pulse"
            : "border-mystic-600/30 text-mystic-400 hover:border-mystic-500 hover:text-mystic-300",
          className
        )}
        title={isListening ? "Arrêter l'enregistrement" : "Dicter votre rêve"}
      >
        {isListening ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Mic className="w-5 h-5" />
        )}
      </Button>

      {interimTranscript && (
        <span className="text-sm text-mystic-400 italic animate-pulse">
          {interimTranscript.substring(0, 50)}...
        </span>
      )}
    </div>
  );
}
