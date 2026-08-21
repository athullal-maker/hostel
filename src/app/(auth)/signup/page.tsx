"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { User, Mail, Lock, Phone, AlertCircle, CheckCircle2, Shield } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";

export default function SignupPage() {
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
      // 1. Call signup API (server hardcodes role: 'user')
      const res = await fetch("/api/auth/signup", {
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
        setError(data.error || "Failed to create account");
        setIsLoading(false);
        return;
      }

      // 2. Automatically log the user in
      const loginRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (loginRes?.error) {
        router.push("/login?signup=success");
      } else {
        router.push("/");
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
      <Card padding="lg" className="space-y-6 shadow-md border-surface-border rounded-[10px]">
        <div className="text-center space-y-1">
          <h1 className="font-heading text-2xl font-extrabold text-charcoal">
            Create Account
          </h1>
          <p className="text-xs text-charcoal-muted">
            Directly connect with property managers, book room visits, and track your stay across Kerala.
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
            label="Full Name"
            placeholder="e.g. Ananya Nair"
            value={name}
            onChange={(e) => setName(e.target.value)}
            leftIcon={<User className="w-4 h-4 text-charcoal-muted" />}
            required
          />

          <Input
            label="Email Address"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="ananya@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4 text-charcoal-muted" />}
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+91 98470 XXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            leftIcon={<Phone className="w-4 h-4 text-charcoal-muted" />}
            required
          />

          <Input
            label="Password (min 6 characters)"
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
              By creating an account, you get direct access to manager contacts with 0% brokerage fees.
            </span>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            size="md"
            isLoading={isLoading}
            className="mt-2 font-bold"
          >
            Create My Account
          </Button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-charcoal-muted">
          <span>Already have an account? </span>
          <Link href="/login" className="text-primary font-bold hover:underline">
            Sign In →
          </Link>
        </div>

        {/* Notice about hostel owner accounts */}
        <div className="bg-primary-50 border border-primary/20 rounded-[6px] p-2.5 text-[11px] text-primary-700 flex items-start gap-2">
          <Shield className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Are you a Property Owner / Warden?</span>
            <span>
              Hostel owner accounts are provisioned via our admin verification team.{" "}
              <Link href="/admin/login" className="font-bold underline">
                Go to Admin Portal
              </Link>
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
