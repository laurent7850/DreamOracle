"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle2, AlertCircle } from "lucide-react";

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}

let toastListeners: ((toasts: Toast[]) => void)[] = [];
let currentToasts: Toast[] = [];

// Global function to show toast from anywhere
export function showToast(toast: Omit<Toast, "id">) {
  const id = Math.random().toString(36).slice(2);
  const newToast = { ...toast, id };
  currentToasts = [...currentToasts, newToast];
  toastListeners.forEach((l) => l(currentToasts));

  // Auto-dismiss
  setTimeout(() => {
    currentToasts = currentToasts.filter((t) => t.id !== id);
    toastListeners.forEach((l) => l(currentToasts));
  }, 4000);
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    toastListeners.push(setToasts);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== setToasts);
    };
  }, []);

  const dismiss = (id: string) => {
    currentToasts = currentToasts.filter((t) => t.id !== id);
    toastListeners.forEach((l) => l(currentToasts));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            glass-card rounded-lg border p-4 shadow-lg animate-in slide-in-from-right-full
            ${
              toast.variant === "destructive"
                ? "border-red-500/50 bg-red-900/20"
                : "border-mystic-600/50 bg-mystic-900/90"
            }
          `}
        >
          <div className="flex items-start gap-3">
            {toast.variant === "destructive" ? (
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-lunar text-sm">{toast.title}</p>
              {toast.description && (
                <p className="text-sm text-mystic-400 mt-1">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              className="text-mystic-400 hover:text-mystic-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
