"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import {
  Building2,
  Mail,
  Lock,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  LockKeyhole,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(
    errorParam === "unauthenticated"
      ? "Please sign in to access the admin portal."
      : errorParam === "unauthorized_role"
      ? "Access restricted: Only verified hostel admins and platform superadmins can enter."
      : ""
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password. Please check your credentials.");
        setIsLoading(false);
        return;
      }

      // Fetch fresh session to inspect user role
      const session = await getSession();
      const role = session?.user?.role;

      if (role === "superadmin") {
        router.push(callbackUrl && callbackUrl.startsWith("/superadmin") ? callbackUrl : "/superadmin/dashboard");
      } else if (role === "admin") {
        router.push(callbackUrl && callbackUrl.startsWith("/admin") ? callbackUrl : "/admin/dashboard");
      } else {
        router.push("/");
      }

      router.refresh();
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 sm:py-12">
      <Card padding="lg" className="space-y-6 shadow-lg border-2 border-primary/20 bg-white rounded-[10px]">
        {/* Admin Header with Slate & Rose Red */}
        <div className="text-center space-y-2">
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-primary-50 px-2.5 py-0.5 rounded border border-primary/20 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Administration Portal
            </div>
            <h1 className="font-heading text-2xl font-extrabold text-charcoal">
              Hostel Admin Login
            </h1>
            <p className="text-xs text-charcoal-muted">
              Property Management & Verification Dashboard
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-primary-50 border border-primary-900/30 rounded-[6px] flex items-start gap-2 text-xs text-primary-900">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Admin / Warden Email Address"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="warden@hostel.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4 text-charcoal-muted" />}
            required
          />

          <Input
            label="Secret Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4 text-charcoal-muted" />}
            required
          />

          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 text-xs">
            <span className="text-[11px] text-charcoal-muted">Protected by Role Guards</span>
            <Link
              href="/forgot-password"
              className="text-primary hover:underline font-bold text-[11px]"
            >
              Reset credentials?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            size="lg"
            isLoading={isLoading}
            className="font-bold"
          >
            Authenticate & Enter Dashboard
          </Button>
        </form>

        {/* Notice on Admin Account Provisioning */}
        <div className="pt-4 border-t border-slate-100 space-y-2 text-center text-xs text-charcoal-muted">
          <p className="text-[11px] text-charcoal-muted bg-surface p-2.5 rounded-[6px] border border-surface-border">
            <span className="font-bold text-charcoal block mb-0.5">
              Admin Accounts Provisioning Policy:
            </span>
            Hostel manager accounts cannot be self-registered. They are provisioned and audited directly by the Superadmin.
          </p>

          <div className="pt-1">
            <Link href="/login" className="text-primary hover:underline text-xs font-bold">
              ← Switch to Resident / User Login
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-charcoal-muted">Loading Admin Portal...</div>}>
      <AdminLoginForm />
    </Suspense>
  );
}
