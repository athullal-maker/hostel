"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  MapPin,
  Search,
  ShieldCheck,
  Building2,
  User,
  Layers,
  LogOut,
  ShieldAlert,
  Phone,
  Mail,
  Building,
} from "lucide-react";
import Badge from "@/components/ui/Badge";

export const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-surface-border shadow-2xs">
      {/* Top micro-bar for quick contact & hubs — primary nav lives in the
          mobile bottom tab bar now, so this promo strip is desktop-only. */}
      <div className="hidden sm:block bg-charcoal text-surface text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-primary text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-[3px]">
              Direct Hostels & Co-Living
            </span>
            <span className="hidden sm:inline text-slate-300">
              Zero brokerage • Direct resident warden & manager contacts
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-medium text-slate-300">
            <a
              href="tel:+918884518010"
              className="hidden md:flex items-center gap-1 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-primary" />
              <span>+91 88845 18010</span>
            </a>
            <a
              href="mailto:info@keralahostels.in"
              className="hidden lg:flex items-center gap-1 hover:text-white transition-colors"
            >
              <Mail className="w-3 h-3 text-primary" />
              <span>info@keralahostels.in</span>
            </a>
            <span className="text-slate-600 hidden md:inline">•</span>
            <Link
              href="/search?state=kerala&district=ernakulam&city=kakkanad"
              className="hover:text-white hover:underline transition-colors hidden sm:inline"
            >
              Kochi Infopark
            </Link>
            <Link
              href="/search?state=kerala&district=thiruvananthapuram&city=kazhakkoottam"
              className="hover:text-white hover:underline transition-colors hidden sm:inline"
            >
              TVM Technopark
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand Wordmark */}
          <Link href="/" className="flex items-center group shrink-0">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-xl sm:text-2xl text-charcoal tracking-tight group-hover:text-primary transition-colors">
                  Kerala<span className="text-primary">Hostels</span>
                </span>
                <span className="text-[10px] font-bold bg-primary-50 text-primary px-1.5 py-0.2 rounded border border-primary/20">
                  .in
                </span>
              </div>
              <span className="hidden sm:block text-[10px] text-charcoal-muted -mt-0.5 font-medium tracking-wide">
                Verified Hostels, PGs & Co-Living
              </span>
            </div>
          </Link>

          {/* Quick Search Bar */}
          <div className="hidden md:flex flex-1 max-w-sm mx-4">
            <div className="w-full flex items-center bg-surface border border-surface-border-strong rounded-[8px] px-3 py-1.5 focus-within:border-primary focus-within:bg-white transition-colors">
              <Search className="w-4 h-4 text-charcoal-muted mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search college, tech park, or locality..."
                className="w-full bg-transparent text-xs text-charcoal placeholder:text-charcoal-subtle focus:outline-none"
              />
            </div>
          </div>

          {/* Right Action Links */}
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/admin/login"
              className="hidden lg:flex items-center gap-1 text-xs font-bold text-charcoal hover:text-primary px-2 py-1.5 transition-colors"
            >
              <Building className="w-3.5 h-3.5 text-primary" />
              LIST YOUR PROPERTY
            </Link>

            <Link
              href="/style-guide"
              className="hidden sm:flex items-center gap-1 text-xs font-semibold text-charcoal-muted hover:text-charcoal px-2 py-1.5 transition-colors"
            >
              <Layers className="w-3.5 h-3.5" />
              Style Guide
            </Link>

            {/* Role dashboard shortcut chips are also reachable via the mobile
                bottom tab bar's Account tab, so they're desktop-only here to
                keep the mobile bar uncluttered. Sign In stays visible at every
                size since it's the primary action for a signed-out visitor. */}
            {user?.role === "superadmin" && (
              <Link
                href="/superadmin/dashboard"
                className="hidden md:flex items-center gap-1 text-xs font-semibold text-primary-700 hover:text-primary-900 px-2.5 py-1.5 bg-primary-50 border border-primary/30 rounded-[6px] min-h-[40px]"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Superadmin
              </Link>
            )}

            {(user?.role === "admin" || user?.role === "superadmin") && (
              <Link
                href="/admin/dashboard"
                className="hidden md:flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-700 px-2.5 py-1.5 bg-primary-50 border border-primary/30 rounded-[6px] min-h-[40px]"
              >
                <Building2 className="w-3.5 h-3.5" />
                Admin Dashboard
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1.5 text-xs bg-surface border border-surface-border px-2.5 py-1.5 rounded-[6px] min-h-[40px]">
                  <User className="w-3.5 h-3.5 text-primary" />
                  <span className="font-semibold text-charcoal max-w-[90px] sm:max-w-[120px] truncate">
                    {user.name || user.email}
                  </span>
                  <Badge
                    variant={
                      user.role === "superadmin"
                        ? "danger"
                        : user.role === "admin"
                        ? "primary"
                        : "neutral"
                    }
                    size="sm"
                  >
                    {user.role}
                  </Badge>
                </div>

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  title="Sign Out"
                  className="p-2 text-charcoal-muted hover:text-primary-900 hover:bg-primary-50 rounded-[6px] border border-surface-border transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="bg-primary hover:bg-primary-700 active:bg-primary-800 text-white text-xs font-bold px-4 py-2 rounded-[8px] transition-colors shadow-sm inline-flex items-center gap-1 min-h-[38px] uppercase tracking-wide"
                >
                  <span>Sign In</span>
                </Link>

                <Link
                  href="/admin/login"
                  className="bg-charcoal hover:bg-charcoal text-white text-xs font-bold px-3 py-2 rounded-[8px] transition-colors shadow-sm hidden sm:inline-flex items-center gap-1.5 min-h-[38px]"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                  <span>Admin</span>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
