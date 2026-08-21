import React from "react";
import { Building2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 px-4 bg-surface">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      <div className="text-center space-y-1">
        <span className="font-heading font-extrabold text-sm text-charcoal block">
          Loading Verified Hostels & Co-Living Spaces...
        </span>
        <span className="text-xs text-charcoal-muted">
          Retrieving direct rates, room sharing matrix & manager contacts
        </span>
      </div>
    </div>
  );
}
