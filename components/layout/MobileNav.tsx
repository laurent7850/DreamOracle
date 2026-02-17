"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  Settings,
  MoreHorizontal,
  Calendar,
  BarChart3,
  HelpCircle,
  Crown,
  Smartphone,
  LogOut,
  X,
  Brain,
  Sparkles,
  Cloud,
  Activity,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";

const ADMIN_EMAILS = ["divers@distr-action.com"];

const mainNavItems = [
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
];

const moreNavItems = [
  {
    href: "/coach",
    label: "Dream Coach",
    icon: Brain,
  },
  {
    href: "/symbols",
    label: "Symboles",
    icon: Sparkles,
  },
  {
    href: "/backup",
    label: "Sauvegarde",
    icon: Cloud,
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
    href: "/help",
    label: "Aide",
    icon: HelpCircle,
  },
  {
    href: "/pricing",
    label: "Voir les plans",
    icon: Crown,
  },
  {
    href: "/settings#install-app",
    label: "Installer l'app",
    icon: Smartphone,
  },
];

export function MobileNav() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);
  const { data: session } = useSession();
  const isAdmin = session?.user?.email && ADMIN_EMAILS.includes(session.user.email);

  // Check if any "more" item is active (including admin)
  const isMoreActive = moreNavItems.some(
    (item) =>
      pathname === item.href ||
      (item.href !== "/dashboard" && pathname.startsWith(item.href.split("#")[0]))
  ) || pathname.startsWith("/admin");

  return (
    <>
      {/* More Menu Overlay */}
      {showMore && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setShowMore(false)}
        />
      )}

      {/* More Menu Panel */}
      {showMore && (
        <div className="fixed bottom-16 left-0 right-0 z-50 md:hidden px-4 pb-2">
          <div className="glass-card rounded-xl border border-mystic-700/30 p-3 space-y-1">
            <div className="flex justify-between items-center mb-2 px-2">
              <span className="text-sm font-medium text-lunar">Plus d&apos;options</span>
              <button
                onClick={() => setShowMore(false)}
                className="text-mystic-400 hover:text-lunar p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {moreNavItems.map((item) => {
              const isActive =
                pathname === item.href ||
                pathname.startsWith(item.href.split("#")[0]);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setShowMore(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                    isActive
                      ? "bg-mystic-700/40 text-gold"
                      : "text-mystic-300 hover:bg-mystic-900/30 hover:text-lunar"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
            {/* Admin CRM - visible only for admins */}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setShowMore(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                  pathname.startsWith("/admin")
                    ? "bg-mystic-700/40 text-gold"
                    : "text-red-400/80 hover:bg-mystic-900/30 hover:text-red-300"
                )}
              >
                <Shield className="w-5 h-5" />
                <span className="text-sm">Admin CRM</span>
              </Link>
            )}
            <button
              onClick={() => {
                setShowMore(false);
                signOut({ callbackUrl: "/" });
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-mystic-400 hover:bg-mystic-900/30 hover:text-lunar w-full"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm">Déconnexion</span>
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass-card rounded-none border-t border-mystic-700/30 safe-area-bottom">
        <div className="flex justify-around items-center py-1.5 sm:py-2">
          {mainNavItems.map((item) => {
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

          {/* More Button */}
          <button
            onClick={() => setShowMore(!showMore)}
            className={cn(
              "flex flex-col items-center gap-0.5 sm:gap-1 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all min-w-[52px]",
              showMore || isMoreActive ? "text-gold" : "text-mystic-400"
            )}
          >
            <MoreHorizontal className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-[10px] sm:text-xs">Plus</span>
          </button>
        </div>
      </nav>
    </>
  );
}
