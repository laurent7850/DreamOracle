"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Mic, MicOff, Square } from "lucide-react";
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

// Detect if we're on a mobile device
function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export function VoiceRecorder({ onTranscript, className, disabled }: VoiceRecorderProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const shouldRestartRef = useRef(false);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastResultTimeRef = useRef<number>(0);

  // Check browser support and mobile
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognitionAPI) {
        setIsSupported(false);
      }
      setIsMobile(isMobileDevice());
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
    recognition.lang = "fr-FR";

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

      // Track last result time for mobile restart logic
      lastResultTimeRef.current = Date.now();

      if (finalTranscript) {
        onTranscript(finalTranscript.trim());
        setInterimTranscript("");
      } else {
        setInterimTranscript(interim);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);

      // On mobile, some errors are expected and we should try to restart
      if (shouldRestartRef.current) {
        if (event.error === "no-speech" || event.error === "aborted") {
          // Will try to restart in onend
          return;
        }
      }

      // For critical errors, stop completely
      if (event.error === "not-allowed") {
        shouldRestartRef.current = false;
        setIsListening(false);
        setInterimTranscript("");
        toast.error("Accès au microphone refusé. Veuillez autoriser l'accès dans les paramètres.");
        return;
      }

      if (event.error === "network") {
        shouldRestartRef.current = false;
        setIsListening(false);
        setInterimTranscript("");
        toast.error("Erreur réseau. Vérifiez votre connexion internet.");
        return;
      }

      // For other errors on mobile, don't show toast but allow restart
      if (!isMobileDevice()) {
        if (event.error !== "no-speech" && event.error !== "aborted") {
          toast.error("Erreur de reconnaissance vocale.");
        }
      }
    };

    recognition.onend = () => {
      setInterimTranscript("");

      // Auto-restart logic
      if (shouldRestartRef.current) {
        // Clear any existing restart timeout
        if (restartTimeoutRef.current) {
          clearTimeout(restartTimeoutRef.current);
        }

        // On mobile, use a longer delay and create a new instance
        const delay = isMobileDevice() ? 300 : 100;

        restartTimeoutRef.current = setTimeout(() => {
          if (shouldRestartRef.current) {
            try {
              // On mobile, create a fresh instance each time
              if (isMobileDevice()) {
                recognitionRef.current = initRecognition();
              }

              if (recognitionRef.current) {
                recognitionRef.current.start();
              } else {
                // If we can't restart, stop gracefully
                shouldRestartRef.current = false;
                setIsListening(false);
              }
            } catch (e) {
              console.error("Error restarting recognition:", e);
              // On mobile, if restart fails, show a helpful message
              if (isMobileDevice()) {
                shouldRestartRef.current = false;
                setIsListening(false);
                toast.info("Appuyez à nouveau sur le micro pour continuer.");
              } else {
                shouldRestartRef.current = false;
                setIsListening(false);
              }
            }
          }
        }, delay);
      } else {
        setIsListening(false);
      }
    };

    recognition.onstart = () => {
      setIsListening(true);
      lastResultTimeRef.current = Date.now();
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
      // User wants to stop
      shouldRestartRef.current = false;
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = null;
      }
      try {
        recognitionRef.current?.stop();
      } catch (e) {
        // Ignore stop errors
      }
      setIsListening(false);
      setInterimTranscript("");
      toast.info("Enregistrement arrêté.");
    } else {
      // Request microphone permission
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });

        // Create new recognition instance
        recognitionRef.current = initRecognition();

        if (recognitionRef.current) {
          shouldRestartRef.current = true;
          recognitionRef.current.start();

          if (isMobile) {
            toast.info("🎤 Parlez... Appuyez sur ⏹ pour arrêter.", { duration: 3000 });
          } else {
            toast.info("🎤 Parlez maintenant... Cliquez pour arrêter.", { duration: 3000 });
          }
        }
      } catch (err) {
        console.error("Microphone permission error:", err);
        toast.error("Impossible d'accéder au microphone. Vérifiez vos permissions.");
      }
    }
  }, [isListening, isSupported, initRecognition, isMobile]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      shouldRestartRef.current = false;
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // Ignore abort errors
        }
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
          <Square className="w-4 h-4 fill-current" />
        ) : (
          <Mic className="w-5 h-5" />
        )}
      </Button>

      {interimTranscript && (
        <span className="text-sm text-mystic-400 italic animate-pulse max-w-[150px] truncate">
          {interimTranscript}
        </span>
      )}

      {isListening && !interimTranscript && (
        <span className="text-xs text-red-400 animate-pulse">
          ● REC
        </span>
      )}
    </div>
  );
}
