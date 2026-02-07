"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, PlusCircle, Settings, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/dashboard",
    label: "Accueil",
    icon: LayoutDashboard,
  },
  {
    href: "/dreams",
    label: "Rêves",
    icon: BookOpen,
  },
  {
    href: "/dreams/new",
    label: "Nouveau",
    icon: PlusCircle,
  },
  {
    href: "/settings",
    label: "Options",
    icon: Settings,
  },
  {
    href: "/help",
    label: "Aide",
    icon: HelpCircle,
  },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass-card rounded-none border-t border-mystic-700/30 safe-area-bottom">
      <div className="flex justify-around items-center py-1.5 sm:py-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 sm:gap-1 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all min-w-[52px]",
                isActive ? "text-gold" : "text-mystic-400"
              )}
            >
              <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-[10px] sm:text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
