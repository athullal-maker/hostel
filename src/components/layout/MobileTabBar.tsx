"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Home, Search, CalendarCheck, User, ShieldCheck } from "lucide-react";

/**
 * Fixed bottom tab bar shown only on mobile (< md). This is the single
 * biggest thing that makes the site read as a native app rather than a
 * responsive website — primary navigation lives in the thumb zone, the
 * top Navbar stays minimal on small screens, and content gets safe-area
 * + `pb-app-nav` spacing so nothing sits underneath it (see layout.tsx).
 */
export const MobileTabBar: React.FC = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isAdminRoute = pathname?.startsWith("/admin") || pathname?.startsWith("/superadmin");
  if (isAdminRoute) {
    return null;
  }

  const accountHref = session ? "/account/bookings" : "/login";
  const accountLabel = session ? "Account" : "Sign In";

  const tabs = [
    { href: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
    { href: "/search", label: "Search", icon: Search, match: (p: string) => p.startsWith("/search") || p.startsWith("/hostel") },
    { href: "/account/bookings", label: "Bookings", icon: CalendarCheck, match: (p: string) => p.startsWith("/account/bookings") },
    { href: accountHref, label: accountLabel, icon: User, match: (p: string) => p.startsWith(accountHref) },
  ];

  return (
    <nav
      aria-label="Primary"
      className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-surface-border pb-safe"
      style={{ height: "var(--app-bottom-nav-height)" }}
    >
      <div className="grid grid-cols-4 h-full max-w-7xl mx-auto">
        {tabs.map((tab) => {
          const isActive = tab.match(pathname || "");
          const Icon = tab.icon;
          return (
            <Link
              key={tab.label}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className="flex flex-col items-center justify-center gap-0.5 min-h-[44px] active:scale-95 transition-transform"
            >
              <Icon
                className={`w-5 h-5 ${isActive ? "text-primary" : "text-charcoal-subtle"}`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={`text-[10px] leading-none ${
                  isActive ? "text-primary font-bold" : "text-charcoal-subtle font-medium"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileTabBar;
