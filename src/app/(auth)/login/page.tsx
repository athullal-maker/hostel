"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { Mail, Lock, AlertCircle, CheckCircle2, Shield } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "";
  const signupSuccess = searchParams.get("signup") === "success";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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
        setError("Invalid email address or password");
        setIsLoading(false);
        return;
      }

      // Check user role from session
      const session = await getSession();
      const role = session?.user?.role;

      if (callbackUrl) {
        router.push(callbackUrl);
      } else if (role === "superadmin") {
        router.push("/superadmin/dashboard");
      } else if (role === "admin") {
        router.push("/admin/dashboard");
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
    <Card padding="lg" className="space-y-6 shadow-md border-surface-border rounded-[10px]">
      <div className="text-center space-y-1">
        <h1 className="font-heading text-2xl font-extrabold text-charcoal">
          Sign in to KeralaHostels
        </h1>
        <p className="text-xs text-charcoal-muted">
          Access your bookings, favorites, and direct manager contacts
        </p>
      </div>

      {signupSuccess && (
        <div className="p-3 bg-primary-50 border border-primary-500/30 rounded-[6px] flex items-center gap-2 text-xs text-primary-700 font-bold">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-primary" />
          <span>Account created successfully! Please sign in below.</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-primary-50 border border-primary-900/30 rounded-[6px] flex items-start gap-2 text-xs text-primary-900">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="your.email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="w-4 h-4 text-charcoal-muted" />}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock className="w-4 h-4 text-charcoal-muted" />}
          required
        />

        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer text-charcoal-muted">
            <input
              type="checkbox"
              className="rounded-[2px] text-primary accent-primary"
            />
            <span>Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-primary hover:underline font-bold"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          size="md"
          isLoading={isLoading}
          className="font-bold"
        >
          Sign In
        </Button>
      </form>

      <div className="pt-4 border-t border-slate-100 text-center text-xs text-charcoal-muted">
        <span>New to KeralaHostels? </span>
        <Link
          href="/signup"
          className="text-primary font-bold hover:underline"
        >
          Create Student Account →
        </Link>
      </div>

      <div className="bg-surface border border-surface-border rounded-[6px] p-3 text-[11px] text-charcoal-muted flex items-start gap-2">
        <Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-charcoal block">Hostel Owner & Manager Portal</span>
          <span>
            Hostel management login is located at{" "}
            <Link href="/admin/login" className="text-primary font-bold hover:underline">
              /admin/login
            </Link>
          </span>
        </div>
      </div>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-8 sm:py-12">
      <Suspense fallback={<div className="p-6 text-center text-xs text-charcoal-muted">Loading login form...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
