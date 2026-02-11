"use client";

import { useState, useCallback } from "react";

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}

interface ToastState {
  toasts: Toast[];
}

let toastListeners: ((state: ToastState) => void)[] = [];
let toastState: ToastState = { toasts: [] };

function dispatch(action: { type: string; toast?: Toast; toastId?: string }) {
  switch (action.type) {
    case "ADD_TOAST":
      if (action.toast) {
        toastState = {
          toasts: [...toastState.toasts, action.toast],
        };
      }
      break;
    case "REMOVE_TOAST":
      toastState = {
        toasts: toastState.toasts.filter((t) => t.id !== action.toastId),
      };
      break;
  }

  toastListeners.forEach((listener) => listener(toastState));
}

export function useToast() {
  const [state, setState] = useState<ToastState>(toastState);

  // Subscribe to state changes
  useState(() => {
    toastListeners.push(setState);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== setState);
    };
  });

  const toast = useCallback(
    ({
      title,
      description,
      variant = "default",
    }: {
      title: string;
      description?: string;
      variant?: "default" | "destructive";
    }) => {
      const id = Math.random().toString(36).slice(2);
      const newToast: Toast = { id, title, description, variant };

      dispatch({ type: "ADD_TOAST", toast: newToast });

      // Auto-dismiss after 4 seconds
      setTimeout(() => {
        dispatch({ type: "REMOVE_TOAST", toastId: id });
      }, 4000);

      return id;
    },
    []
  );

  const dismiss = useCallback((toastId: string) => {
    dispatch({ type: "REMOVE_TOAST", toastId });
  }, []);

  return {
    toasts: state.toasts,
    toast,
    dismiss,
  };
}
