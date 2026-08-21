"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  SlidersHorizontal,
  Filter,
  MapPin,
  Users,
  Check,
  RefreshCw,
} from "lucide-react";
import CascadingLocationPicker from "./CascadingLocationPicker";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export interface PersistentFilterBarProps {
  currentState?: string;
  currentDistrict?: string;
  currentCity?: string;
  currentType?: string;
  totalResultsCount?: number;
}

export const PersistentFilterBar: React.FC<PersistentFilterBarProps> = ({
  currentState = "kerala",
  currentDistrict = "",
  currentCity = "",
  currentType = "all",
  totalResultsCount = 0,
}) => {
  const router = useRouter();
  const [hostelType, setHostelType] = useState(currentType);

  const handleTypeChange = (type: string) => {
    setHostelType(type);
    const params = new URLSearchParams();
    if (currentState) params.set("state", currentState);
    if (currentDistrict) params.set("district", currentDistrict);
    if (currentCity) params.set("city", currentCity);
    if (type && type !== "all") params.set("type", type);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="sticky top-16 z-30 bg-white border-b border-surface-border shadow-xs py-3 px-3 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Top bar with location selector and count */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Cascading Picker (Compact) */}
          <div className="flex-1 w-full lg:max-w-3xl">
            <CascadingLocationPicker
              initialState={currentState}
              initialDistrict={currentDistrict}
              initialCity={currentCity}
              autoRedirect={true}
              compact={true}
            />
          </div>

          {/* Quick Hostel Type Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto flex-nowrap no-scrollbar pb-1 lg:pb-0 shrink-0 text-xs -mx-1 px-1 lg:mx-0 lg:px-0">
            {[
              { id: "all", label: "All" },
              { id: "boys", label: "Men's / Boys" },
              { id: "girls", label: "Ladies" },
              { id: "co-ed", label: "Co-Living" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTypeChange(tab.id)}
                className={`px-2.5 py-1.5 rounded-[3px] font-semibold transition-colors cursor-pointer shrink-0 ${
                  hostelType === tab.id
                    ? "bg-primary text-white"
                    : "bg-surface text-charcoal-muted hover:bg-surface-muted border border-surface-border"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filter Summary Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-charcoal-muted pt-1 border-t border-surface-muted">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-charcoal">Active Filters:</span>
            {currentDistrict ? (
              <Badge variant="primary">
                District: {currentDistrict}
              </Badge>
            ) : (
              <Badge variant="neutral">All Kerala Districts</Badge>
            )}

            {currentCity && (
              <Badge variant="primary">
                Hub: {currentCity}
              </Badge>
            )}

            {currentType !== "all" && (
              <Badge variant="outline">
                Type: {currentType === "boys" ? "Men's PG" : currentType === "girls" ? "Ladies Hostel" : "Co-living"}
              </Badge>
            )}
          </div>

          <span className="text-xs font-semibold text-primary shrink-0">
            {totalResultsCount} Verified Hostels Found
          </span>
        </div>
      </div>
    </div>
  );
};

export default PersistentFilterBar;
