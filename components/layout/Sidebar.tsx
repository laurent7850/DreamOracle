"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
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
  Crown,
  Brain,
  Sparkles,
  Cloud,
  Activity,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const ADMIN_EMAILS = ["divers@distr-action.com"];

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
    href: "/coach",
    label: "Dream Coach",
    icon: Brain,
    premium: true,
  },
  {
    href: "/symbols",
    label: "Symboles",
    icon: Sparkles,
    premium: true,
  },
  {
    href: "/backup",
    label: "Sauvegarde",
    icon: Cloud,
    premium: true,
  },
  {
    href: "/biorhythm",
    label: "Biorythme",
    icon: Activity,
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
  const { data: session } = useSession();
  const isAdmin = session?.user?.email && ADMIN_EMAILS.includes(session.user.email);

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

          {/* Admin CRM - visible only for admins */}
          {isAdmin && (
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                pathname.startsWith("/admin")
                  ? "bg-mystic-700/40 text-gold border border-mystic-600/50"
                  : "text-red-400/80 hover:bg-mystic-900/30 hover:text-red-300"
              )}
            >
              <Shield className={cn("w-5 h-5 flex-shrink-0", pathname.startsWith("/admin") && "text-gold")} />
              {!collapsed && <span>Admin CRM</span>}
            </Link>
          )}
        </nav>

        {/* Upgrade & Install App Links */}
        {!collapsed && (
          <div className="px-3 py-2 space-y-2">
            <Link
              href="/pricing"
              className={cn(
                "flex items-center gap-3 px-4 py-3 w-full rounded-lg",
                "bg-gradient-to-r from-indigo-600/20 to-purple-600/20",
                "text-indigo-300 hover:text-indigo-200 transition-all",
                "border border-indigo-500/30 hover:border-indigo-500/50"
              )}
            >
              <Crown className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">Voir les plans</span>
            </Link>
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
