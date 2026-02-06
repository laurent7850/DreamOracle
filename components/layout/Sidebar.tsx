"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Moon,
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Smartphone,
  BarChart3,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
  {
    href: "/dashboard",
    label: "Tableau de bord",
    icon: LayoutDashboard,
  },
  {
    href: "/dreams",
    label: "Mes rêves",
    icon: BookOpen,
  },
  {
    href: "/dreams/new",
    label: "Nouveau rêve",
    icon: PlusCircle,
  },
  {
    href: "/calendar",
    label: "Calendrier",
    icon: Calendar,
  },
  {
    href: "/analytics",
    label: "Statistiques",
    icon: BarChart3,
  },
  {
    href: "/settings",
    label: "Paramètres",
    icon: Settings,
  },
  {
    href: "/help",
    label: "Aide",
    icon: HelpCircle,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen transition-all duration-300 glass-card rounded-none border-r border-mystic-700/30",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-6 border-b border-mystic-700/30">
          <Link href="/dashboard" className="flex items-center gap-3">
            <Moon className="w-8 h-8 text-mystic-400 flex-shrink-0" />
            {!collapsed && (
              <span className="font-display text-xl text-lunar">DreamOracle</span>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="text-mystic-400 hover:text-mystic-300 hover:bg-mystic-900/30"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                  isActive
                    ? "bg-mystic-700/40 text-gold border border-mystic-600/50"
                    : "text-mystic-300 hover:bg-mystic-900/30 hover:text-lunar"
                )}
              >
                <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-gold")} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Install App Link */}
        {!collapsed && (
          <div className="px-3 py-2">
            <Link
              href="/settings#install-app"
              className={cn(
                "flex items-center gap-3 px-4 py-3 w-full rounded-lg",
                "text-gold hover:bg-gold/10 transition-all",
                "border border-gold/30 hover:border-gold/50"
              )}
            >
              <Smartphone className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">Installer l&apos;app</span>
            </Link>
          </div>
        )}

        {/* Logout */}
        <div className="px-3 py-4 border-t border-mystic-700/30">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className={cn(
              "flex items-center gap-3 px-4 py-3 w-full rounded-lg text-mystic-400 hover:bg-mystic-900/30 hover:text-lunar transition-all"
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
