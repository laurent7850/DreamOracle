"use client";

import { Moon } from "lucide-react";

interface LoadingOracleProps {
  message?: string;
}

export function LoadingOracle({
  message = "L'oracle médite...",
}: LoadingOracleProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12">
      <div className="relative">
        <div className="oracle-loading" />
        <Moon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-mystic-400 animate-pulse" />
      </div>
      <p className="text-mystic-300 font-mystical text-lg animate-pulse">
        {message}
      </p>
    </div>
  );
}
