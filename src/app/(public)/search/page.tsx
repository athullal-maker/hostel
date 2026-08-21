"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Filter,
  Search,
  ShieldCheck,
  Building2,
  SlidersHorizontal,
  Star,
  Utensils,
  Wifi,
  Phone,
  ArrowRight,
  Clock,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Bed,
  RefreshCw,
  Eye,
  Sliders,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import CascadingLocationPicker from "@/components/location/CascadingLocationPicker";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export interface SearchHostel {
  id: string;
  name: string;
  hostelType: "boys" | "girls" | "co-ed";
  stateSlug: string;
  districtSlug: string;
  citySlug: string;
  locality: string;
  city: string;
  fullAddress: string;
  distanceKm: number;
  distanceInfo: string;
  coverImage: string;
  galleryImages: string[];
  startingPrice: number;
  totalCapacity: number;
  bedsAvailable: number;
  sharingPrices: { type: string; price: number; capacity: number; available: boolean; bedsLeft: number }[];
  avgRating: number;
  totalReviews: number;
  isVerified: boolean;
  foodIncluded: boolean;
  foodType: string;
  curfew: string;
  hasAC: boolean;
  hasWifi: boolean;
  amenities: string[];
  checkInTime: string;
  checkOutTime: string;
}

export const SEEDED_SEARCH_HOSTELS: SearchHostel[] = [
  {
    id: "hostel-kakkanad-1",
    name: "Green Valley Executive PG for Men",
    hostelType: "boys",
    stateSlug: "kerala",
    districtSlug: "ernakulam",
    citySlug: "kakkanad",
    locality: "Kakkanad (Near Phase 1 Gate)",
    city: "Kochi, Ernakulam",
    fullAddress: "Plot 42, Infopark Expressway, Kakkanad, Kochi, Kerala 682030",
    distanceKm: 0.35,
    distanceInfo: "350m to Infopark Main Gate",
    coverImage: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
    ],
    startingPrice: 4800,
    totalCapacity: 54,
    bedsAvailable: 8,
    sharingPrices: [
      { type: "Single Private (AC)", price: 9500, capacity: 1, available: true, bedsLeft: 1 },
      { type: "2-Sharing Deluxe", price: 6800, capacity: 2, available: true, bedsLeft: 3 },
      { type: "3-Sharing Standard", price: 5400, capacity: 3, available: true, bedsLeft: 4 },
      { type: "4-Sharing Economy", price: 4800, capacity: 4, available: false, bedsLeft: 0 },
    ],
    avgRating: 4.8,
    totalReviews: 42,
    isVerified: true,
    foodIncluded: true,
    foodType: "3-time Homestyle Meals Included (Non-Veg 3x/week)",
    curfew: "No Night Curfew (Biometric Entry for Shift Employees)",
    hasAC: true,
    hasWifi: true,
    amenities: [
      "Homestyle Food Included",
      "AC Available",
      "High-speed 100 Mbps Wi-Fi",
      "Attached Bathroom",
      "Warden 24x7",
      "No Night Curfew",
      "Power Backup Generator",
      "Two-Wheeler Parking",
      "CCTV Surveillance",
      "RO Drinking Water",
    ],
    checkInTime: "12:00 PM",
    checkOutTime: "11:00 AM",
  },
  {
    id: "hostel-cusat-2",
    name: "Ahalya Heritage Ladies Hostel & Student PG",
    hostelType: "girls",
    stateSlug: "kerala",
    districtSlug: "ernakulam",
    citySlug: "kalamassery",
    locality: "Kalamassery (Near CUSAT Main Gate)",
    city: "Kochi, Ernakulam",
    fullAddress: "University Road, South Kalamassery, Kochi, Kerala 682022",
    distanceKm: 0.2,
    distanceInfo: "200m to CUSAT Campus & Metro",
    coverImage: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
    ],
    startingPrice: 5200,
    totalCapacity: 40,
    bedsAvailable: 6,
    sharingPrices: [
      { type: "Single Study Room", price: 8500, capacity: 1, available: true, bedsLeft: 1 },
      { type: "2-Sharing Standard", price: 6200, capacity: 2, available: true, bedsLeft: 2 },
      { type: "3-Sharing Student", price: 5200, capacity: 3, available: true, bedsLeft: 3 },
      { type: "4-Sharing Economy", price: 4500, capacity: 4, available: true, bedsLeft: 2 },
    ],
    avgRating: 4.9,
    totalReviews: 58,
    isVerified: true,
    foodIncluded: true,
    foodType: "Authentic Homestyle Vegetarian & Chicken Meals",
    curfew: "9:30 PM (Security Guard + Resident Lady Warden)",
    hasAC: false,
    hasWifi: true,
    amenities: [
      "Homestyle Food Included",
      "High-speed 100 Mbps Wi-Fi",
      "Attached Bathroom",
      "Warden 24x7",
      "CCTV Surveillance",
      "Study Table & Chair",
      "RO Drinking Water",
      "Washing Machine",
    ],
    checkInTime: "10:00 AM",
    checkOutTime: "10:00 AM",
  },
  {
    id: "hostel-kazhakkoottam-3",
    name: "TechnoNest Luxury Co-Living & PGs",
    hostelType: "co-ed",
    stateSlug: "kerala",
    districtSlug: "thiruvananthapuram",
    citySlug: "kazhakkoottam",
    locality: "Kazhakkoottam (Near Phase 3 Technopark)",
    city: "Thiruvananthapuram",
    fullAddress: "NH 66 Bypass, Kazhakkoottam, Trivandrum, Kerala 695582",
    distanceKm: 0.5,
    distanceInfo: "500m to Technopark Phase 3",
    coverImage: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
    ],
    startingPrice: 6500,
    totalCapacity: 80,
    bedsAvailable: 12,
    sharingPrices: [
      { type: "Studio Suite (AC)", price: 14500, capacity: 1, available: true, bedsLeft: 2 },
      { type: "2-Sharing Executive", price: 8500, capacity: 2, available: true, bedsLeft: 4 },
      { type: "3-Sharing Classic", price: 6500, capacity: 3, available: true, bedsLeft: 6 },
    ],
    avgRating: 4.7,
    totalReviews: 31,
    isVerified: true,
    foodIncluded: false,
    foodType: "Self-cooking Modern Kitchen & Food Delivery Allowed",
    curfew: "24x7 Access (Digital Smart Locks)",
    hasAC: true,
    hasWifi: true,
    amenities: [
      "AC Available",
      "High-speed 100 Mbps Wi-Fi",
      "Attached Bathroom",
      "No Night Curfew",
      "Power Backup Generator",
      "Fully Equipped Kitchen",
      "Gym Access",
      "Housekeeping Daily",
      "Covered Car Parking",
    ],
    checkInTime: "02:00 PM",
    checkOutTime: "12:00 PM",
  },
  {
    id: "hostel-sreekariyam-4",
    name: "College Heights CET Boys Hostel",
    hostelType: "boys",
    stateSlug: "kerala",
    districtSlug: "thiruvananthapuram",
    citySlug: "sreekariyam",
    locality: "Sreekariyam (CET Gate 2)",
    city: "Thiruvananthapuram",
    fullAddress: "Engineering College PO, Sreekariyam, Trivandrum 695016",
    distanceKm: 0.15,
    distanceInfo: "150m to CET Campus Entrance",
    coverImage: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80",
    ],
    startingPrice: 4200,
    totalCapacity: 36,
    bedsAvailable: 4,
    sharingPrices: [
      { type: "2-Sharing Standard", price: 5600, capacity: 2, available: true, bedsLeft: 1 },
      { type: "3-Sharing Economy", price: 4600, capacity: 3, available: true, bedsLeft: 2 },
      { type: "4-Sharing Student", price: 4200, capacity: 4, available: true, bedsLeft: 1 },
    ],
    avgRating: 4.6,
    totalReviews: 29,
    isVerified: true,
    foodIncluded: true,
    foodType: "3-time Homestyle Kerala Meals Included",
    curfew: "10:00 PM (Study Hours 8 PM - 11 PM)",
    hasAC: false,
    hasWifi: true,
    amenities: [
      "Homestyle Food Included",
      "High-speed 100 Mbps Wi-Fi",
      "Attached Bathroom",
      "Two-Wheeler Parking",
      "RO Drinking Water",
      "Study Table & Chair",
    ],
    checkInTime: "11:00 AM",
    checkOutTime: "10:00 AM",
  },
  {
    id: "hostel-nit-5",
    name: "Malabar Scholar NIT Calicut PG",
    hostelType: "boys",
    stateSlug: "kerala",
    districtSlug: "kozhikode",
    citySlug: "chathamangalam-nit",
    locality: "Chathamangalam (Near NIT Main Gate)",
    city: "Kozhikode",
    fullAddress: "NIT Campus PO, Chathamangalam, Calicut 673601",
    distanceKm: 0.1,
    distanceInfo: "100m to NIT Calicut East Gate",
    coverImage: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
    ],
    startingPrice: 4600,
    totalCapacity: 48,
    bedsAvailable: 9,
    sharingPrices: [
      { type: "Single Private", price: 7800, capacity: 1, available: true, bedsLeft: 2 },
      { type: "2-Sharing Standard", price: 5800, capacity: 2, available: true, bedsLeft: 3 },
      { type: "3-Sharing Economy", price: 4600, capacity: 3, available: true, bedsLeft: 4 },
    ],
    avgRating: 4.8,
    totalReviews: 36,
    isVerified: true,
    foodIncluded: true,
    foodType: "Authentic Malabar Homestyle Meals (Veg & Non-Veg)",
    curfew: "10:30 PM (Special Lab Pass Allowed)",
    hasAC: true,
    hasWifi: true,
    amenities: [
      "Homestyle Food Included",
      "AC Available",
      "High-speed 100 Mbps Wi-Fi",
      "Attached Bathroom",
      "Warden 24x7",
      "Power Backup Generator",
      "RO Drinking Water",
    ],
    checkInTime: "12:00 PM",
    checkOutTime: "11:00 AM",
  },
];

const ALL_AMENITY_FILTERS = [
  "Homestyle Food Included",
  "AC Available",
  "High-speed 100 Mbps Wi-Fi",
  "Attached Bathroom",
  "Warden 24x7",
  "No Night Curfew",
  "Power Backup Generator",
  "Two-Wheeler Parking",
  "CCTV Surveillance",
  "RO Drinking Water",
  "Washing Machine",
  "Gym Access",
];

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Location params from URL
  const stateParam = searchParams.get("state") || "kerala";
  const districtParam = searchParams.get("district") || "";
  const cityParam = searchParams.get("city") || "";
  const initialType = searchParams.get("type") || "all";

  // Filter States
  const [selectedType, setSelectedType] = useState<string>(initialType);
  const [maxBudget, setMaxBudget] = useState<number>(12000);
  const [minRating, setMinRating] = useState<number>(0);
  const [hasFoodOnly, setHasFoodOnly] = useState<boolean>(false);
  const [hasAcOnly, setHasAcOnly] = useState<boolean>(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("recommended");

  // Mobile Filters Drawer
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleResetFilters = () => {
    setSelectedType("all");
    setMaxBudget(12000);
    setMinRating(0);
    setHasFoodOnly(false);
    setHasAcOnly(false);
    setSelectedAmenities([]);
    setSortBy("recommended");
    router.push(`/search?state=${stateParam}`);
  };

  // Filter & Sort Logic
  const filteredAndSortedHostels = useMemo(() => {
    let result = SEEDED_SEARCH_HOSTELS.filter((hostel) => {
      // 1. Location match
      if (districtParam && hostel.districtSlug !== districtParam) {
        return false;
      }
      if (cityParam && hostel.citySlug !== cityParam) {
        return false;
      }

      // 2. Hostel Type match
      if (selectedType !== "all" && hostel.hostelType !== selectedType) {
        return false;
      }

      // 3. Budget match
      if (hostel.startingPrice > maxBudget) {
        return false;
      }

      // 4. Rating match
      if (minRating > 0 && hostel.avgRating < minRating) {
        return false;
      }

      // 5. Food filter
      if (hasFoodOnly && !hostel.foodIncluded) {
        return false;
      }

      // 6. AC filter
      if (hasAcOnly && !hostel.hasAC) {
        return false;
      }

      // 7. Amenities checklist
      if (selectedAmenities.length > 0) {
        const matchesAllAmenities = selectedAmenities.every((a) =>
          hostel.amenities.includes(a)
        );
        if (!matchesAllAmenities) return false;
      }

      return true;
    });

    // Sort Logic
    if (sortBy === "price_asc") {
      result.sort((a, b) => a.startingPrice - b.startingPrice);
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => b.startingPrice - a.startingPrice);
    } else if (sortBy === "rating_desc") {
      result.sort((a, b) => b.avgRating - a.avgRating);
    } else if (sortBy === "nearest") {
      result.sort((a, b) => a.distanceKm - b.distanceKm);
    }

    return result;
  }, [
    districtParam,
    cityParam,
    selectedType,
    maxBudget,
    minRating,
    hasFoodOnly,
    hasAcOnly,
    selectedAmenities,
    sortBy,
  ]);

  // Paginated Slices
  const totalResults = filteredAndSortedHostels.length;
  const totalPages = Math.ceil(totalResults / itemsPerPage) || 1;
  const paginatedHostels = filteredAndSortedHostels.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen pb-16 bg-surface">
      {/* Top Location Bar with Cascading Selector */}
      <div className="bg-white border-b border-surface-border py-3 px-4 sm:px-6 lg:px-8 shadow-2xs">
        <div className="max-w-7xl mx-auto space-y-2">
          {/* Location Breadcrumb */}
          <Breadcrumbs
            items={[
              { label: "Kerala", href: "/search?state=kerala" },
              ...(districtParam
                ? [
                    {
                      label:
                        districtParam.charAt(0).toUpperCase() +
                        districtParam.slice(1) +
                        " District",
                      href: `/search?state=kerala&district=${districtParam}`,
                    },
                  ]
                : []),
              ...(cityParam
                ? [
                    {
                      label:
                        cityParam.charAt(0).toUpperCase() + cityParam.slice(1),
                      href: `/search?state=kerala&district=${districtParam}&city=${cityParam}`,
                    },
                  ]
                : []),
            ]}
          />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1 border-t border-slate-100">
            <div className="flex-1 max-w-3xl">
              <CascadingLocationPicker
                initialState={stateParam}
                initialDistrict={districtParam}
                initialCity={cityParam}
                autoRedirect={true}
                compact={true}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 justify-between md:flex-nowrap md:justify-end">
              {/* Mobile Filters Toggle Button */}
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(true)}
                className="lg:hidden shrink-0 bg-surface border border-surface-border-strong text-charcoal px-3 py-2 rounded-[6px] text-xs font-bold flex items-center gap-1.5 active:bg-surface-muted min-h-[44px]"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
                <span>Filters ({selectedAmenities.length + (selectedType !== "all" ? 1 : 0) + (minRating > 0 ? 1 : 0)})</span>
              </button>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-1.5 text-xs text-charcoal-muted min-w-0 flex-1 md:flex-initial justify-end">
                <span className="hidden sm:inline font-bold shrink-0">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="min-w-0 max-w-full bg-white border border-surface-border-strong rounded-[6px] px-3 py-2 text-xs text-charcoal font-semibold focus:border-primary focus:outline-none cursor-pointer min-h-[44px]"
                >
                  <option value="recommended">Recommended (Verified First)</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating_desc">Highest Rated (4.5★+)</option>
                  <option value="nearest">Nearest to College / IT Gate</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout: Left Sidebar Filters + Results Column */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ================= DESKTOP LEFT SIDEBAR FILTERS ================= */}
          <aside className="hidden lg:block lg:col-span-3 space-y-4 sticky top-20">
            <Card padding="md" className="space-y-5 shadow-xs border-surface-border rounded-[8px]">
              {/* Header with Reset */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-primary" />
                  <h3 className="font-heading font-bold text-sm text-charcoal">
                    Filters
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-[11px] font-bold text-primary hover:underline cursor-pointer"
                >
                  Reset All
                </button>
              </div>

              {/* Hostel Type Filter */}
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
                  Category
                </label>
                <div className="space-y-1.5 text-xs">
                  {[
                    { id: "all", label: "All Properties" },
                    { id: "boys", label: "Men's / Boys PG" },
                    { id: "girls", label: "Ladies / Girls Hostel" },
                    { id: "co-ed", label: "Co-Living / Unisex" },
                  ].map((type) => (
                    <label
                      key={type.id}
                      className="flex items-center gap-2 cursor-pointer text-charcoal select-none hover:text-primary"
                    >
                      <input
                        type="radio"
                        name="hostelTypeFilter"
                        checked={selectedType === type.id}
                        onChange={() => setSelectedType(type.id)}
                        className="accent-primary"
                      />
                      <span>{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Max Monthly Budget Slider */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-charcoal uppercase tracking-wider">
                    Max Monthly Budget
                  </label>
                  <span className="font-heading font-extrabold text-xs text-primary">
                    ₹{maxBudget.toLocaleString("en-IN")}
                  </span>
                </div>
                <input
                  type="range"
                  min={3500}
                  max={15000}
                  step={500}
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex items-center justify-between text-[10px] text-charcoal-muted mt-1 font-mono">
                  <span>₹3.5k</span>
                  <span>₹8k</span>
                  <span>₹15k+</span>
                </div>
              </div>

              {/* Quick Preset Toggles */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                  Essential Requirements
                </label>
                <label className="flex items-center gap-2 text-xs text-charcoal cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={hasFoodOnly}
                    onChange={(e) => setHasFoodOnly(e.target.checked)}
                    className="accent-primary rounded-[2px]"
                  />
                  <span>Food Included</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-charcoal cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={hasAcOnly}
                    onChange={(e) => setHasAcOnly(e.target.checked)}
                    className="accent-primary rounded-[2px]"
                  />
                  <span>AC Rooms Available</span>
                </label>
              </div>

              {/* Minimum Rating */}
              <div className="pt-3 border-t border-slate-100">
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
                  Minimum Rating
                </label>
                <div className="grid grid-cols-3 gap-1 text-xs text-center font-bold">
                  {[
                    { val: 0, label: "Any" },
                    { val: 4.0, label: "4.0★+" },
                    { val: 4.5, label: "4.5★+" },
                  ].map((r) => (
                    <button
                      key={r.val}
                      type="button"
                      onClick={() => setMinRating(r.val)}
                      className={`py-1.5 rounded-[4px] border transition-colors cursor-pointer ${
                        minRating === r.val
                          ? "bg-primary text-white border-primary"
                          : "bg-surface text-charcoal-muted border-surface-border hover:bg-surface-muted"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities Checklist */}
              <div className="pt-3 border-t border-slate-100">
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
                  Amenities Checklist
                </label>
                <div className="space-y-2 text-xs max-h-56 overflow-y-auto pr-1">
                  {ALL_AMENITY_FILTERS.map((amenity) => (
                    <label
                      key={amenity}
                      className="flex items-center gap-2 cursor-pointer text-charcoal select-none hover:text-primary"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                        className="accent-primary rounded-[2px]"
                      />
                      <span className="truncate">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </Card>
          </aside>

          {/* ================= RESULTS CONTENT COLUMN ================= */}
          <main className="lg:col-span-9 space-y-4">
            {/* Header Summary */}
            <div className="bg-white border border-surface-border rounded-[8px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
              <div>
                <h1 className="font-heading text-lg sm:text-xl font-extrabold text-charcoal">
                  {cityParam
                    ? `Verified Hostels in ${cityParam.toUpperCase()} (${districtParam ? districtParam.toUpperCase() : "KERALA"})`
                    : districtParam
                    ? `Verified Hostels in ${districtParam.toUpperCase()} District`
                    : "All Verified Hostels & PGs in Kerala"}
                </h1>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Showing {totalResults} verified student hostels & working professional PGs
                </p>
              </div>

              {/* Active Filter Badges */}
              <div className="flex flex-wrap items-center gap-1.5">
                {selectedType !== "all" && (
                  <Badge variant="primary">
                    {selectedType === "boys" ? "Men's PG" : selectedType === "girls" ? "Ladies Hostel" : "Co-living"}
                  </Badge>
                )}
                {hasFoodOnly && <Badge variant="primary">Food Included</Badge>}
                {hasAcOnly && <Badge variant="outline">AC Rooms</Badge>}
                {minRating > 0 && <Badge variant="neutral">{minRating}★+ Rating</Badge>}
              </div>
            </div>

            {/* List of Results */}
            {paginatedHostels.length > 0 ? (
              <div className="space-y-4">
                {paginatedHostels.map((hostel) => (
                  <div
                    key={hostel.id}
                    className="bg-white border border-surface-border rounded-[8px] shadow-subtle hover:border-surface-border-strong hover:shadow-card-hover transition-all flex flex-col md:flex-row overflow-hidden group"
                  >
                    {/* Fixed aspect ratio photo column */}
                    <div className="relative w-full md:w-64 lg:w-72 h-48 md:h-auto shrink-0 bg-slate-100 overflow-hidden">
                      <Image
                        src={hostel.coverImage}
                        alt={hostel.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 300px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                        <Badge variant="primary">
                          {hostel.hostelType === "girls"
                            ? "Ladies Hostel"
                            : hostel.hostelType === "boys"
                            ? "Men's PG"
                            : "Co-Living"}
                        </Badge>
                        {hostel.isVerified && (
                          <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-[4px] inline-flex items-center gap-1 shadow-xs">
                            <ShieldCheck className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-2.5 right-2.5 bg-slate-950/85 text-white text-[11px] font-bold px-2 py-0.5 rounded-[4px] flex items-center gap-1">
                        <Star className="w-3 h-3 fill-primary text-primary" />
                        <span>{hostel.avgRating.toFixed(1)}</span>
                        <span className="text-slate-400 font-normal">({hostel.totalReviews})</span>
                      </div>
                    </div>

                    {/* Information-Dense Details */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Title & Price Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Link href={`/hostel/${hostel.id}`}>
                              <h2 className="font-heading font-bold text-base sm:text-lg text-charcoal hover:text-primary transition-colors leading-tight">
                                {hostel.name}
                              </h2>
                            </Link>
                            <p className="text-xs text-charcoal-muted flex items-center gap-1 mt-1 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                              <span>{hostel.locality}, {hostel.city}</span>
                              <span className="text-slate-300">•</span>
                              <span className="text-primary font-bold">{hostel.distanceInfo}</span>
                            </p>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-[10px] text-charcoal-muted uppercase tracking-wider block font-bold">
                              Starting from
                            </span>
                            <span className="text-lg sm:text-xl font-heading font-extrabold text-primary">
                              ₹{hostel.startingPrice.toLocaleString("en-IN")}
                            </span>
                            <span className="text-[11px] text-charcoal-muted">/month</span>
                          </div>
                        </div>

                        {/* Indicators: Food, Curfew, Beds */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs text-charcoal">
                          <div className="flex items-center gap-1.5">
                            <Utensils className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span className="truncate">
                              {hostel.foodIncluded ? (
                                <span className="font-medium text-charcoal">
                                  Food: <span className="text-primary font-semibold">{hostel.foodType}</span>
                                </span>
                              ) : (
                                <span className="text-charcoal-muted">Self-cooking / Mess outside</span>
                              )}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-charcoal-muted shrink-0" />
                            <span className="truncate text-charcoal-muted">
                              Gate Curfew: <span className="text-charcoal font-semibold">{hostel.curfew}</span>
                            </span>
                          </div>
                        </div>

                        {/* Sharing Matrix */}
                        <div className="mt-3 bg-surface border border-surface-border rounded-[6px] p-2">
                          <div className="text-[10px] uppercase font-bold text-charcoal-muted tracking-wider mb-1 flex items-center justify-between">
                            <span>Monthly Rent by Sharing Type:</span>
                            <span className="text-[10px] text-primary font-bold">
                              {hostel.bedsAvailable} Beds Available Now
                            </span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                            {hostel.sharingPrices.map((tier, idx) => (
                              <div
                                key={idx}
                                className="bg-white border border-surface-border rounded-[4px] p-1.5 text-center shadow-2xs"
                              >
                                <span className="text-[10px] font-medium text-charcoal-muted block truncate">
                                  {tier.type}
                                </span>
                                <span className="text-xs font-extrabold text-charcoal block">
                                  ₹{tier.price.toLocaleString("en-IN")}
                                </span>
                                <span
                                  className={`text-[9px] font-bold ${
                                    tier.available ? "text-primary" : "text-primary-900"
                                  }`}
                                >
                                  {tier.available ? `${tier.bedsLeft} open` : "Full"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Amenity Badges */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-3">
                          {hostel.hasAC && <Badge variant="neutral">AC Room</Badge>}
                          {hostel.hasWifi && <Badge variant="neutral">Wi-Fi</Badge>}
                          <Badge variant="neutral">Warden on Premise</Badge>
                          <Badge variant="neutral">RO Purified Water</Badge>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 gap-2">
                        <div className="flex items-center gap-1 text-xs text-charcoal-muted">
                          <Bed className="w-3.5 h-3.5 text-primary" />
                          <span>{hostel.totalCapacity} Total Capacity</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link href={`/hostel/${hostel.id}`}>
                            <Button variant="outline" size="sm" className="border-primary text-primary">
                              <Eye className="w-3.5 h-3.5 mr-1" />
                              View Rooms
                            </Button>
                          </Link>
                          <Link href={`/hostel/${hostel.id}`}>
                            <Button variant="primary" size="sm">
                              <span>Book Now</span>
                              <ArrowRight className="w-3.5 h-3.5 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-surface-border">
                    <span className="text-xs text-charcoal-muted">
                      Page <span className="font-bold text-charcoal">{currentPage}</span> of{" "}
                      <span className="font-bold text-charcoal">{totalPages}</span>
                    </span>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-initial min-h-[44px]"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      >
                        <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Prev
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-initial min-h-[44px]"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      >
                        Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Empty State */
              <Card padding="lg" className="text-center py-12 space-y-4 border-surface-border">
                <div className="w-12 h-12 rounded-full bg-primary-50 text-primary flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-charcoal">
                    No Hostels Found Matching Your Filters
                  </h3>
                  <p className="text-xs text-charcoal-muted mt-1 max-w-md mx-auto">
                    Try adjusting your budget slider, category selection, or search in nearby hub areas.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={handleResetFilters}>
                  <RefreshCw className="w-3.5 h-3.5 mr-1" /> Reset All Filters
                </Button>
              </Card>
            )}
          </main>
        </div>
      </div>

      {/* ================= MOBILE FILTERS SLIDE-UP DRAWER ================= */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end bg-black/60 animate-fade-in lg:hidden">
          <div className="flex-1" onClick={() => setIsMobileFiltersOpen(false)} />
          <div className="bg-white rounded-t-[16px] border-t-2 border-primary max-h-[85vh] flex flex-col shadow-2xl animate-slide-up">
            <div className="p-4 border-b border-surface-border flex items-center justify-between bg-surface rounded-t-[16px]">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-primary" />
                <h3 className="font-heading font-bold text-sm text-charcoal">
                  Filter Properties
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-1 text-charcoal-muted hover:text-charcoal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: "all", label: "All" },
                    { id: "boys", label: "Men's PG" },
                    { id: "girls", label: "Ladies Hostel" },
                    { id: "co-ed", label: "Co-Living" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedType(t.id)}
                      className={`p-2.5 rounded-[6px] border text-center font-bold transition-colors ${
                        selectedType === t.id
                          ? "bg-primary text-white border-primary"
                          : "bg-surface text-charcoal border-surface-border-strong"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-charcoal uppercase tracking-wider">
                    Max Budget
                  </label>
                  <span className="font-heading font-extrabold text-xs text-primary">
                    ₹{maxBudget.toLocaleString("en-IN")}
                  </span>
                </div>
                <input
                  type="range"
                  min={3500}
                  max={15000}
                  step={500}
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              {/* Amenities */}
              <div className="pt-3 border-t border-slate-100">
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
                  Amenities
                </label>
                <div className="space-y-2 text-xs">
                  {ALL_AMENITY_FILTERS.map((a) => (
                    <label key={a} className="flex items-center gap-2 text-charcoal">
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(a)}
                        onChange={() => handleAmenityToggle(a)}
                        className="accent-primary"
                      />
                      <span>{a}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-3 pt-3 pb-[calc(var(--app-bottom-nav-height)+env(safe-area-inset-bottom)+12px)] md:pb-3 bg-surface border-t border-surface-border flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={handleResetFilters}
              >
                Reset
              </Button>
              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={() => setIsMobileFiltersOpen(false)}
              >
                Show {totalResults} Properties
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-charcoal-muted font-semibold">Loading Verified Properties...</p>
          </div>
        </div>
      }
    >
      <SearchResultsContent />
    </Suspense>
  );
}
