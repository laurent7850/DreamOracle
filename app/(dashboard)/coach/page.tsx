"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Brain,
  Send,
  Loader2,
  Sparkles,
  Moon,
  Lock,
  Crown,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
  "Quels patterns récurrents vois-tu dans mes rêves ?",
  "Que signifie le symbole de l'eau dans mes rêves ?",
  "Comment mieux me souvenir de mes rêves ?",
  "Pourquoi je fais souvent des rêves lucides ?",
];

export default function DreamCoachPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Check access on mount
  useEffect(() => {
    const checkAccess = async () => {
      try {
        const res = await fetch("/api/usage");
        const data = await res.json();
        setHasAccess(data.tier === "PREMIUM");
      } catch {
        setHasAccess(false);
      }
    };
    checkAccess();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initial greeting
  useEffect(() => {
    if (hasAccess && messages.length === 0) {
      const greeting: Message = {
        id: "greeting",
        role: "assistant",
        content: `🌙 Bienvenue, ${session?.user?.name || "voyageur des rêves"} !

Je suis ton Dream Coach, ton guide personnel dans l'univers onirique. J'ai accès à ton journal de rêves et je peux t'aider à :

✨ Comprendre les patterns récurrents dans tes rêves
🔮 Décrypter la signification de tes symboles personnels
🌟 Améliorer ta capacité à te souvenir de tes rêves
💫 Explorer les messages de ton subconscient

Pose-moi une question sur tes rêves, ou choisis une suggestion ci-dessous !`,
        timestamp: new Date(),
      };
      setMessages([greeting]);
    }
  }, [hasAccess, session?.user?.name]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Prepare messages for API (exclude greeting)
      const apiMessages = [...messages, userMessage]
        .filter((m) => m.id !== "greeting")
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const response = await fetch("/api/dream-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) {
        const error = await response.json();
        if (error.upgradeRequired) {
          toast({
            title: "Fonctionnalité Oracle+",
            description: "Le Dream Coach est réservé aux abonnés Oracle+.",
            variant: "destructive",
          });
          return;
        }
        throw new Error(error.error);
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message. Réessaie.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const resetConversation = () => {
    setMessages([]);
    // Trigger greeting again
    setTimeout(() => {
      const greeting: Message = {
        id: "greeting",
        role: "assistant",
        content: `🌙 Nouvelle conversation ! Comment puis-je t'aider à explorer tes rêves aujourd'hui ?`,
        timestamp: new Date(),
      };
      setMessages([greeting]);
    }, 100);
  };

  // Loading state
  if (hasAccess === null) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-mystic-400" />
      </div>
    );
  }

  // No access - upgrade prompt
  if (!hasAccess) {
    return (
      <div className="max-w-2xl mx-auto px-3 sm:px-4 md:px-0">
        <Card className="glass-card border-mystic-700/30 overflow-hidden">
          <div className="bg-gradient-to-br from-gold/20 via-mystic-800/50 to-purple-900/30 p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold/20 flex items-center justify-center">
              <Lock className="w-10 h-10 text-gold" />
            </div>
            <h1 className="font-display text-3xl text-lunar mb-3">
              Dream Coach
            </h1>
            <p className="text-mystic-300 mb-6 max-w-md mx-auto">
              Ton guide personnel pour explorer et comprendre tes rêves.
              Disponible exclusivement avec l'abonnement Oracle+.
            </p>

            <div className="bg-mystic-900/50 rounded-lg p-6 mb-6 text-left">
              <h3 className="text-gold font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Avec Dream Coach, tu peux :
              </h3>
              <ul className="space-y-2 text-mystic-300">
                <li className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-mystic-400" />
                  Découvrir les patterns récurrents dans tes rêves
                </li>
                <li className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-mystic-400" />
                  Comprendre tes symboles personnels
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-mystic-400" />
                  Recevoir des conseils pour mieux rêver
                </li>
              </ul>
            </div>

            <Link href="/pricing">
              <Button className="bg-gradient-to-r from-gold to-amber-500 text-night font-semibold hover:from-gold/90 hover:to-amber-500/90">
                <Crown className="w-4 h-4 mr-2" />
                Passer à Oracle+
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-0 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-gradient-to-br from-gold/30 to-purple-600/30">
            <Brain className="w-6 h-6 text-gold" />
          </div>
          <div>
            <h1 className="font-display text-2xl text-lunar">Dream Coach</h1>
            <p className="text-sm text-mystic-400">
              Ton guide personnel des rêves
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetConversation}
          className="text-mystic-400 hover:text-mystic-200"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Nouvelle conversation
        </Button>
      </div>

      {/* Messages */}
      <Card className="glass-card border-mystic-700/30 flex-1 overflow-hidden flex flex-col">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-indigo-600 text-white rounded-br-md"
                    : "bg-mystic-800/70 text-mystic-100 rounded-bl-md"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-2 text-gold text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-medium">Oracle</span>
                  </div>
                )}
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-mystic-800/70 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-2 text-mystic-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Oracle réfléchit...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </CardContent>

        {/* Suggested questions */}
        {messages.length <= 1 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-mystic-500 mb-2">
              Suggestions :
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  disabled={isLoading}
                  className="text-xs px-3 py-1.5 rounded-full bg-mystic-800/50 text-mystic-300 hover:bg-mystic-700/50 transition-colors disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="p-4 border-t border-mystic-700/30"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pose une question sur tes rêves..."
              disabled={isLoading}
              className="flex-1 bg-mystic-900/50 border border-mystic-700/50 rounded-full px-4 py-2 text-lunar placeholder-mystic-500 focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:opacity-50"
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="rounded-full bg-gold hover:bg-gold/90 text-night px-4"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
