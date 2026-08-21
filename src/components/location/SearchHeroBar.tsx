"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Crosshair,
  MapPin,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import CascadingLocationPicker from "./CascadingLocationPicker";

export const SearchHeroBar: React.FC = () => {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string>("all");
  const [stateSlug, setStateSlug] = useState("kerala");
  const [districtSlug, setDistrictSlug] = useState("");
  const [citySlug, setCitySlug] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [showAdvancedLocation, setShowAdvancedLocation] = useState(false);

  const handleLocationSelect = (s: string, d: string, c: string) => {
    setStateSlug(s);
    setDistrictSlug(d);
    setCitySlug(c);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (stateSlug) params.set("state", stateSlug);
    if (districtSlug) params.set("district", districtSlug);
    if (citySlug) params.set("city", citySlug);
    if (selectedType && selectedType !== "all") params.set("type", selectedType);
    if (searchQuery.trim()) params.set("q", searchQuery.trim());

    router.push(`/search?${params.toString()}`);
  };

  const handleNearMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `/api/locations/nearest?lat=${latitude}&lng=${longitude}`
          );
          const data = await res.json();
          if (data.city) {
            router.push(
              `/search?state=${data.city.stateSlug || "kerala"}&district=${
                data.city.districtSlug || "ernakulam"
              }&city=${data.city.slug || "kakkanad"}`
            );
          } else {
            router.push(`/search?state=kerala&district=ernakulam&city=kakkanad`);
          }
        } catch {
          router.push(`/search?state=kerala&district=ernakulam&city=kakkanad`);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        router.push(`/search?state=kerala&district=ernakulam&city=kakkanad`);
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="w-full space-y-3">
      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto flex-nowrap no-scrollbar pb-1 -mx-1 px-1">
        {[
          { id: "all", label: "All Properties" },
          { id: "boys", label: "Men's / Boys PG" },
          { id: "girls", label: "Ladies / Girls PG" },
          { id: "co-ed", label: "Co-Living Spaces" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedType(tab.id)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 cursor-pointer ${
              selectedType === tab.id
                ? "bg-primary text-white shadow-xs"
                : "bg-white text-charcoal-muted hover:bg-surface-muted hover:text-charcoal border border-surface-border"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Floating Single Search Card */}
      <div className="bg-white border border-surface-border-strong rounded-2xl shadow-lg p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="flex items-center flex-1 min-w-0 px-3 py-1.5">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Find a hostel near your college or workplace"
            className="w-full min-w-0 bg-transparent text-sm sm:text-base text-charcoal placeholder:text-charcoal-subtle focus:outline-none font-normal"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="p-2 text-primary hover:text-primary-800 transition-colors cursor-pointer shrink-0"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-stretch sm:items-center gap-1.5 w-full sm:w-auto sm:shrink-0">
          <button
            type="button"
            onClick={() => setShowAdvancedLocation(!showAdvancedLocation)}
            className="flex-1 sm:flex-initial min-h-[44px] px-3 py-2.5 text-xs font-bold text-charcoal-muted hover:text-primary flex items-center justify-center sm:justify-start gap-1 rounded-xl hover:bg-surface transition-colors cursor-pointer border border-surface-border sm:border-transparent"
            title="Select State, District and City"
          >
            <MapPin className="w-4 h-4 text-primary" />
            <span className="hidden md:inline">Location Picker</span>
            {showAdvancedLocation ? (
              <ChevronUp className="w-3.5 h-3.5 ml-0.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={handleNearMe}
            disabled={isLocating}
            className="flex-1 sm:flex-initial bg-primary hover:bg-primary-700 active:bg-primary-800 text-white text-sm font-bold px-6 py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer min-h-[46px]"
          >
            {isLocating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Crosshair className="w-4 h-4" />
            )}
            <span>{isLocating ? "Locating..." : "Near Me"}</span>
          </button>
        </div>
      </div>

      {/* Expandable Cascading Location Picker (State -> District -> City) */}
      {showAdvancedLocation && (
        <div className="bg-white p-4 rounded-2xl shadow-md border border-surface-border animate-fade-in">
          <CascadingLocationPicker
            initialState="kerala"
            onLocationSelect={handleLocationSelect}
            autoRedirect={false}
          />
        </div>
      )}

      {/* Quick Hub Pills */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-charcoal-muted pt-1">
        <span className="font-bold text-charcoal">Popular Hubs:</span>
        {[
          { name: "Kakkanad Infopark", slug: "kakkanad" },
          { name: "CUSAT Kalamassery", slug: "kalamassery" },
          { name: "TVM Technopark", slug: "kazhakkoottam" },
          { name: "NIT Calicut", slug: "chathamangalam-nit" },
        ].map((hub) => (
          <button
            key={hub.slug}
            type="button"
            onClick={() => router.push(`/search?city=${hub.slug}`)}
            className="px-2.5 py-1 bg-white hover:bg-primary-100 hover:text-primary border border-surface-border rounded-lg transition-colors font-medium cursor-pointer"
          >
            {hub.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchHeroBar;
