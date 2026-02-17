"use client";

import { useSession } from "next-auth/react";
import { Moon, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function Header() {
  const { data: session } = useSession();

  const initials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 z-30 h-14 sm:h-16 glass-card rounded-none border-b border-mystic-700/30 flex items-center justify-between px-3 sm:px-6">
      <div className="flex items-center gap-1.5 sm:gap-2 md:hidden">
        <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-mystic-400" />
        <span className="font-display text-base sm:text-lg text-lunar">DreamOracle</span>
      </div>

      <div className="hidden md:block" />

      <div className="flex items-center gap-2 sm:gap-4">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="text-mystic-400 hover:text-mystic-300 hover:bg-mystic-900/30 h-8 w-8 sm:h-10 sm:w-10"
        >
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>

        <div className="flex items-center gap-2 sm:gap-3">
          <Avatar className="w-8 h-8 sm:w-9 sm:h-9 border border-mystic-600/50">
            <AvatarImage src={session?.user?.image || undefined} />
            <AvatarFallback className="bg-mystic-800 text-lunar text-xs sm:text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden md:block text-lunar text-sm">
            {session?.user?.name}
          </span>
        </div>
      </div>
    </header>
  );
}
