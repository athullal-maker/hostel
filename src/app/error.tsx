"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, Phone } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error boundary triggered:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10 sm:py-16 bg-surface">
      <Card
        padding="lg"
        className="max-w-lg w-full text-center space-y-6 border-2 border-primary-900/30 bg-white shadow-md rounded-[10px]"
      >
        <div className="w-14 h-14 bg-primary-50 text-primary-900 rounded-full flex items-center justify-center mx-auto border border-primary-900/20">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div>
          <span className="font-mono text-xs uppercase font-bold text-primary-900 tracking-wider block">
            System Notice
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-charcoal mt-1">
            Something Went Wrong Loading Listing
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-2 leading-relaxed">
            We encountered a temporary connection issue communicating with our hostel directory database.
          </p>
        </div>

        <div className="p-3.5 bg-surface border border-surface-border rounded-[8px] text-xs text-left text-charcoal-muted space-y-1">
          <div className="flex items-center gap-1 text-charcoal font-bold">
            <Phone className="w-3.5 h-3.5 text-primary" />
            <span>Need Urgent Accommodation Assistance?</span>
          </div>
          <p className="text-[11px]">
            Direct Support Line: <span className="font-mono font-bold text-primary">+91 484 290 8800</span> (Support Desk)
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            variant="primary"
            fullWidth
            size="md"
            onClick={() => reset()}
          >
            <RefreshCw className="w-4 h-4 mr-1.5" /> Try Loading Again
          </Button>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" fullWidth size="md">
              <Home className="w-4 h-4 mr-1.5" /> Homepage
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
