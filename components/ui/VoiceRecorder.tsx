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
  const [hasPermission, setHasPermission] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const shouldRestartRef = useRef(false);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastResultTimeRef = useRef<number>(0);
  const accumulatedTranscriptRef = useRef<string>("");

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
  const initRecognition = useCallback((forMobileHold: boolean = false) => {
    if (typeof window === "undefined") return null;

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return null;

    const recognition = new SpeechRecognitionAPI();
    // On mobile with hold mode, don't use continuous to avoid auto-stop issues
    recognition.continuous = !forMobileHold;
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
        // On mobile hold mode, accumulate transcript
        if (forMobileHold) {
          accumulatedTranscriptRef.current += finalTranscript;
        } else {
          onTranscript(finalTranscript.trim());
        }
        setInterimTranscript("");
      } else {
        setInterimTranscript(interim);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);

      // On mobile hold mode, some errors are expected
      if (forMobileHold) {
        if (event.error === "no-speech" || event.error === "aborted") {
          return;
        }
      }

      // On desktop, some errors are expected and we should try to restart
      if (shouldRestartRef.current && !forMobileHold) {
        if (event.error === "no-speech" || event.error === "aborted") {
          return;
        }
      }

      // For critical errors, stop completely
      if (event.error === "not-allowed") {
        shouldRestartRef.current = false;
        setIsListening(false);
        setInterimTranscript("");
        setHasPermission(false);
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

      // For other errors on mobile hold mode, don't show toast
      if (!forMobileHold && !isMobileDevice()) {
        if (event.error !== "no-speech" && event.error !== "aborted") {
          toast.error("Erreur de reconnaissance vocale.");
        }
      }
    };

    recognition.onend = () => {
      // On mobile hold mode, send accumulated transcript when recognition ends
      if (forMobileHold) {
        const accumulated = accumulatedTranscriptRef.current.trim();
        const interim = interimTranscript.trim();
        const finalText = accumulated || interim;

        if (finalText) {
          onTranscript(finalText);
        }

        accumulatedTranscriptRef.current = "";
        setInterimTranscript("");
        setIsListening(false);
        return;
      }

      setInterimTranscript("");

      // Auto-restart logic (desktop only)
      if (shouldRestartRef.current) {
        if (restartTimeoutRef.current) {
          clearTimeout(restartTimeoutRef.current);
        }

        const delay = 100;

        restartTimeoutRef.current = setTimeout(() => {
          if (shouldRestartRef.current) {
            try {
              if (recognitionRef.current) {
                recognitionRef.current.start();
              } else {
                shouldRestartRef.current = false;
                setIsListening(false);
              }
            } catch (e) {
              console.error("Error restarting recognition:", e);
              shouldRestartRef.current = false;
              setIsListening(false);
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
  }, [onTranscript, interimTranscript]);

  // Request microphone permission (for mobile, called once on first tap)
  const requestPermission = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      return true;
    } catch (err) {
      console.error("Microphone permission error:", err);
      toast.error("Impossible d'accéder au microphone. Vérifiez vos permissions.");
      return false;
    }
  }, []);

  // Start recording (for mobile hold mode)
  const startRecording = useCallback(async () => {
    if (!isSupported) {
      toast.error("La reconnaissance vocale n'est pas supportée par votre navigateur.");
      return;
    }

    if (isListening) return;

    // Request permission if not already granted
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) return;
    }

    // Create new recognition instance for mobile hold mode
    accumulatedTranscriptRef.current = "";
    recognitionRef.current = initRecognition(true);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Error starting recognition:", e);
        toast.error("Erreur lors du démarrage de l'enregistrement.");
      }
    }
  }, [isSupported, isListening, hasPermission, requestPermission, initRecognition]);

  // Stop recording (for mobile hold mode)
  const stopRecording = useCallback(() => {
    if (!isListening) return;

    try {
      recognitionRef.current?.stop();
    } catch (e) {
      // Ignore stop errors
    }
  }, [isListening]);

  // Toggle listening (desktop mode)
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
      const granted = await requestPermission();
      if (!granted) return;

      // Create new recognition instance
      recognitionRef.current = initRecognition(false);

      if (recognitionRef.current) {
        shouldRestartRef.current = true;
        recognitionRef.current.start();
        toast.info("🎤 Parlez maintenant... Cliquez pour arrêter.", { duration: 3000 });
      }
    }
  }, [isListening, isSupported, initRecognition, requestPermission]);

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

  // Mobile: Press and hold mode
  if (isMobile) {
    return (
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={disabled}
          onTouchStart={(e) => {
            e.preventDefault();
            startRecording();
          }}
          onTouchEnd={(e) => {
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
            if (isListening) stopRecording();
          }}
          onContextMenu={(e) => e.preventDefault()}
          className={cn(
            "transition-all select-none touch-none",
            isListening
              ? "bg-red-500/20 border-red-500 text-red-400 scale-110 shadow-lg shadow-red-500/20"
              : "border-mystic-600/30 text-mystic-400 hover:border-mystic-500 hover:text-mystic-300",
            className
          )}
          title="Maintenez appuyé pour dicter"
        >
          {isListening ? (
            <Mic className="w-5 h-5 animate-pulse" />
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </Button>

        {interimTranscript && (
          <span className="text-sm text-mystic-400 italic animate-pulse max-w-[120px] truncate">
            {interimTranscript}
          </span>
        )}

        {isListening && !interimTranscript && (
          <span className="text-xs text-red-400 animate-pulse flex items-center gap-1">
            <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Parlez...
          </span>
        )}

        {!isListening && !interimTranscript && (
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
