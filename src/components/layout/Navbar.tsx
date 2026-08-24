"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  ExternalLink,
} from "lucide-react";
import Badge from "@/components/ui/Badge";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  const isAdminRoute = pathname?.startsWith("/admin") || pathname?.startsWith("/superadmin");
  const isSuperAdminRoute = pathname?.startsWith("/superadmin");

  // ================= ADMIN & SUPERADMIN DEDICATED MONOCHROME NAVBAR =================
  if (isAdminRoute) {
    return (
      <header className="sticky top-0 z-40 bg-white border-b border-neutral-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Left: Brand + Role Badge */}
            <div className="flex items-center gap-3">
              <Link href={isSuperAdminRoute ? "/superadmin/dashboard" : "/admin/dashboard"} className="flex items-center group shrink-0">
                <span className="font-heading font-extrabold text-xl sm:text-2xl text-black tracking-tight">
                  Kerala<span className="text-neutral-500">Hostels</span>
                </span>
              </Link>
              <span className="bg-black text-white text-[10px] font-extrabold px-2 py-0.5 rounded tracking-wider uppercase">
                {isSuperAdminRoute ? "SuperAdmin Console" : "Hostel Admin"}
              </span>
            </div>

            {/* Middle: Switcher & Public Link */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-1 text-xs font-semibold text-neutral-600 hover:text-black px-3 py-1.5 rounded-[6px] border border-neutral-200 hover:bg-neutral-50 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View Public Site
              </Link>

              {user?.role === "superadmin" && (
                <>
                  <Link
                    href="/superadmin/dashboard"
                    className={`text-xs font-bold px-3 py-1.5 rounded-[6px] transition-colors ${
                      isSuperAdminRoute
                        ? "bg-black text-white shadow-2xs"
                        : "bg-white text-neutral-700 hover:text-black border border-neutral-200 hover:bg-neutral-50"
                    }`}
                  >
                    Governance Portal
                  </Link>
                  <Link
                    href="/admin/dashboard"
                    className={`text-xs font-bold px-3 py-1.5 rounded-[6px] transition-colors ${
                      pathname?.startsWith("/admin")
                        ? "bg-black text-white shadow-2xs"
                        : "bg-white text-neutral-700 hover:text-black border border-neutral-200 hover:bg-neutral-50"
                    }`}
                  >
                    Property Admin
                  </Link>
                </>
              )}
            </div>

            {/* Right: User Profile + Logout */}
            <div className="flex items-center gap-2">
              {user && (
                <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 px-3 py-1.5 rounded-[6px] min-h-[38px]">
                  <User className="w-3.5 h-3.5 text-black" />
                  <span className="text-xs font-semibold text-black max-w-[120px] sm:max-w-[160px] truncate">
                    {user.name || user.email}
                  </span>
                  <span className="bg-neutral-200 text-black border border-neutral-300 text-[10px] font-bold px-1.5 py-0.2 rounded uppercase">
                    {user.role}
                  </span>
                </div>
              )}

              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                title="Sign Out"
                className="p-2 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-[6px] border border-neutral-200 transition-colors cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // ================= STANDARD PUBLIC NAVBAR =================
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-surface-border shadow-2xs">
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
          <nav className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <Link
              href="/admin/register"
              className="inline-flex items-center gap-1 text-xs font-bold text-charcoal hover:text-primary px-2.5 sm:px-3 py-2 rounded-[6px] border border-surface-border hover:border-primary/40 bg-surface/50 hover:bg-primary-50/50 transition-colors"
            >
              <Building className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="hidden xs:inline sm:inline">List Property</span>
              <span className="xs:hidden sm:hidden">List</span>
            </Link>

            {user ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link
                  href="/account/bookings"
                  className="flex items-center gap-1 text-xs font-semibold text-charcoal bg-surface hover:bg-primary-50 border border-surface-border hover:border-primary/30 px-2.5 sm:px-3 py-1.5 rounded-[6px] transition-colors min-h-[38px]"
                >
                  <User className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="hidden sm:inline">My Account</span>
                  <span className="sm:hidden">Account</span>
                </Link>

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  title="Sign Out"
                  className="p-2 text-charcoal-muted hover:text-primary-700 hover:bg-primary-50 rounded-[6px] border border-surface-border transition-colors cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-primary hover:bg-primary-700 active:bg-primary-800 text-white text-xs font-bold px-3 sm:px-4 py-2 rounded-[6px] transition-colors shadow-sm inline-flex items-center gap-1 min-h-[38px]"
              >
                <span>Sign In</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
