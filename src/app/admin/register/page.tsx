"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  ShieldCheck,
  User,
  Mail,
  Lock,
  Phone,
  AlertCircle,
  Building2,
  CheckCircle2,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";

function AdminRegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Call admin registration API
      const res = await fetch("/api/auth/admin-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to register admin account");
        setIsLoading(false);
        return;
      }

      // 2. Automatically log the new admin in
      const loginRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (loginRes?.error) {
        router.push("/admin/login?registered=success");
      } else {
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 sm:py-12">
      <Card padding="lg" className="space-y-6 shadow-lg border-2 border-primary/20 bg-white rounded-[10px]">
        {/* Admin Register Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-primary-50 px-2.5 py-0.5 rounded border border-primary/20 mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Hostel Management Onboarding
          </div>
          <h1 className="font-heading text-2xl font-extrabold text-charcoal">
            Register as Hostel Admin
          </h1>
          <p className="text-xs text-charcoal-muted">
            Create an owner/warden account to list and manage your properties
          </p>
        </div>

        {error && (
          <div className="p-3 bg-primary-50 border border-primary-900/30 rounded-[6px] flex items-start gap-2 text-xs text-primary-900">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <Input
            label="Admin / Warden Full Name"
            placeholder="e.g. Manoj Kumar"
            value={name}
            onChange={(e) => setName(e.target.value)}
            leftIcon={<User className="w-4 h-4 text-charcoal-muted" />}
            required
          />

          <Input
            label="Official Email Address"
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
            label="Contact Phone Number"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+91 98470 11223"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            leftIcon={<Phone className="w-4 h-4 text-charcoal-muted" />}
            required
          />

          <Input
            label="Secret Password (min 6 characters)"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4 text-charcoal-muted" />}
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4 text-charcoal-muted" />}
            required
          />

          <div className="text-[11px] text-charcoal-muted bg-surface p-2.5 rounded-[6px] border border-surface-border flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
            <span>
              Once registered, you can immediately add hostels, manage room availability, and receive booking inquiries.
            </span>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            size="lg"
            isLoading={isLoading}
            className="font-bold"
          >
            Create Admin Account & Continue
          </Button>
        </form>

        <div className="pt-4 border-t border-slate-100 space-y-2 text-center text-xs text-charcoal-muted">
          <div>
            <span>Already have an admin account? </span>
            <Link href="/admin/login" className="text-primary font-bold hover:underline">
              Sign In to Admin Portal →
            </Link>
          </div>

          <div className="pt-1">
            <Link href="/login" className="text-charcoal-muted hover:underline text-[11px]">
              ← Switch to Resident / User Login
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function AdminRegisterPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-charcoal-muted">Loading Admin Portal...</div>}>
      <AdminRegisterForm />
    </Suspense>
  );
}
