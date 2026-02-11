"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "midnight" | "aurora" | "cosmic" | "ocean" | "sunset";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  // Load theme from settings on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.theme) {
            setTheme(data.theme as Theme);
          }
        }
      } catch {
        // Use default theme
      }
      setMounted(true);
    };
    loadTheme();
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme, mounted]);

  // Listen for theme changes from settings
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "dreamoracle-theme" && e.newValue) {
        setTheme(e.newValue as Theme);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
