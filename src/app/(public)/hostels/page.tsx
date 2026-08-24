"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Filter, MapPin, Search, SlidersHorizontal, Loader2 } from "lucide-react";
import HostelCard from "@/components/hostel/HostelCard";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const FALLBACK_HOSTELS = [
  {
    id: "h1",
    name: "Green Valley Executive PG for Men",
    hostelType: "boys" as const,
    locality: "Kakkanad (Near Phase 1 Gate)",
    city: "Kochi, Ernakulam",
    distanceInfo: "350m to Infopark Main Gate",
    coverImage: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=700&q=80",
    startingPrice: 4800,
    sharingPrices: [
      { type: "Single (AC)", price: 9500, available: true },
      { type: "2-Sharing", price: 6800, available: true },
      { type: "3-Sharing", price: 5400, available: true },
      { type: "4-Sharing", price: 4800, available: false },
    ],
    avgRating: 4.7,
    totalReviews: 38,
    isVerified: true,
    foodIncluded: true,
    foodType: "Kerala Meals (Breakfast, Lunch, Dinner with Non-Veg 3x/week)",
    curfew: "No Curfew (Biometric Entry)",
    hasAC: true,
    hasWifi: true,
  },
  {
    id: "h2",
    name: "Ahalya Heritage Ladies Hostel & Student PG",
    hostelType: "girls" as const,
    locality: "Kalamassery (Near CUSAT Main Gate)",
    city: "Kochi, Ernakulam",
    distanceInfo: "200m to CUSAT Campus",
    coverImage: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=700&q=80",
    startingPrice: 5200,
    sharingPrices: [
      { type: "Single Room", price: 8500, available: true },
      { type: "2-Sharing", price: 6200, available: true },
      { type: "3-Sharing", price: 5200, available: true },
      { type: "4-Sharing", price: 4500, available: true },
    ],
    avgRating: 4.9,
    totalReviews: 52,
    isVerified: true,
    foodIncluded: true,
    foodType: "Homestyle Kerala Vegetarian & Egg/Chicken Meals",
    curfew: "9:30 PM (Resident Warden)",
    hasAC: false,
    hasWifi: true,
  },
  {
    id: "h3",
    name: "TechnoNest Co-Living & Techie PGs",
    hostelType: "co-ed" as const,
    locality: "Kazhakkoottam (Opposite Technopark Phase 3)",
    city: "Thiruvananthapuram",
    distanceInfo: "100m to Technopark Bypass",
    coverImage: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=700&q=80",
    startingPrice: 6500,
    sharingPrices: [
      { type: "Single Studio", price: 13000, available: true },
      { type: "2-Sharing AC", price: 8500, available: true },
      { type: "3-Sharing", price: 6500, available: true },
    ],
    avgRating: 4.6,
    totalReviews: 19,
    isVerified: true,
    foodIncluded: false,
    foodType: "Equipped Shared Kitchen / Meal Delivery",
    curfew: "24x7 Open (Keycard Access)",
    hasAC: true,
    hasWifi: true,
  },
];

export default function HostelsListingPage() {
  const [hostels, setHostels] = useState<any[]>(FALLBACK_HOSTELS);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLiveHostels() {
      try {
        setLoading(true);
        const res = await fetch("/api/hostels");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const formatted = json.data.map((h: any) => ({
            id: h._id || h.id,
            name: h.name,
            hostelType: h.hostelType || "boys",
            locality: h.fullAddress?.split(",")?.[0]?.trim() || "Kerala",
            city: h.cityId?.name || "Kochi",
            distanceInfo: "Centrally located",
            coverImage: h.coverImage || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=700&q=80",
            startingPrice: h.startingPrice || 4800,
            sharingPrices: h.sharingPrices && h.sharingPrices.length > 0
              ? h.sharingPrices
              : [
                  { type: "2-Sharing Standard", price: h.startingPrice || 5500, available: true },
                  { type: "3-Sharing Economy", price: (h.startingPrice || 5500) - 800, available: true },
                ],
            avgRating: h.avgRating || 4.7,
            totalReviews: 24,
            isVerified: true,
            foodIncluded: h.amenities?.some((a: string) => a.toLowerCase().includes("food")) || false,
            foodType: h.description || "Homestyle Kerala Meals Included",
            curfew: h.rules || "No Curfew (Biometric Entry)",
            hasAC: h.amenities?.some((a: string) => a.toLowerCase().includes("ac")) || false,
            hasWifi: h.amenities?.some((a: string) => a.toLowerCase().includes("wi-fi") || a.toLowerCase().includes("wifi")) || true,
          }));
          setHostels(formatted);
        }
      } catch (err) {
        console.error("Failed to load live hostels:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLiveHostels();
  }, []);

  const filteredHostels = hostels.filter((h) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      h.name.toLowerCase().includes(query) ||
      h.locality.toLowerCase().includes(query) ||
      h.city.toLowerCase().includes(query)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Search Header Bar */}
      <div className="bg-white border border-surface-border rounded-[6px] p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xs">
        <div>
          <h1 className="font-heading text-lg sm:text-2xl font-bold text-charcoal">
            Verified Hostels & PGs in Kerala
          </h1>
          <p className="text-xs text-charcoal-muted">
            Showing verified hostels and PGs across Kochi, Trivandrum, Kozhikode and student hubs
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64 md:w-72">
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Kakkanad, CUSAT, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-surface-border rounded-[4px] pl-9 pr-3 py-2.5 text-sm sm:text-xs text-charcoal focus:bg-white focus:outline-none focus:border-primary min-h-11 sm:min-h-0"
            />
          </div>
          <Link href="/search">
            <Button variant="primary" size="md" className="shrink-0 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 mr-1" /> Advanced Search
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Listings */}
      <div className="space-y-4">
        {filteredHostels.map((hostel) => (
          <HostelCard key={hostel.id} {...hostel} />
        ))}
      </div>
    </div>
  );
}
