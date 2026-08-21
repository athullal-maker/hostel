"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Compass,
  ChevronDown,
  Search,
  Check,
  X,
  Loader2,
  Building,
  Navigation,
  Sparkles,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export interface LocationItem {
  _id?: string;
  name: string;
  slug: string;
}

export interface CascadingLocationPickerProps {
  initialState?: string;
  initialDistrict?: string;
  initialCity?: string;
  onLocationSelect?: (state: string, district: string, city: string) => void;
  autoRedirect?: boolean;
  compact?: boolean;
}

export const CascadingLocationPicker: React.FC<CascadingLocationPickerProps> = ({
  initialState = "kerala",
  initialDistrict = "",
  initialCity = "",
  onLocationSelect,
  autoRedirect = true,
  compact = false,
}) => {
  const router = useRouter();

  // Selected State, District, City slugs
  const [selectedState, setSelectedState] = useState<string>(initialState);
  const [selectedDistrict, setSelectedDistrict] = useState<string>(initialDistrict);
  const [selectedCity, setSelectedCity] = useState<string>(initialCity);

  // Dynamic Lists
  const [states, setStates] = useState<LocationItem[]>([]);
  const [districts, setDistricts] = useState<LocationItem[]>([]);
  const [cities, setCities] = useState<LocationItem[]>([]);

  // Loading states
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [geoMessage, setGeoMessage] = useState<string | null>(null);

  // Mobile Bottom-Sheet State
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const [mobileStep, setMobileStep] = useState<"district" | "city">("district");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch States on Mount
  useEffect(() => {
    async function fetchStates() {
      setLoadingStates(true);
      try {
        const res = await fetch("/api/locations/states");
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setStates(data.data);
          if (!selectedState) {
            setSelectedState(data.data[0].slug);
          }
        }
      } catch (err) {
        console.error("Failed to load states:", err);
      } finally {
        setLoadingStates(false);
      }
    }
    fetchStates();
  }, []);

  // Fetch Districts when State changes
  useEffect(() => {
    if (!selectedState) return;

    async function fetchDistricts() {
      setLoadingDistricts(true);
      try {
        const res = await fetch(`/api/locations/districts?stateSlug=${selectedState}`);
        const data = await res.json();
        if (data.success) {
          setDistricts(data.data);
          const exists = data.data.some((d: LocationItem) => d.slug === selectedDistrict);
          if (!exists && !initialDistrict) {
            setSelectedDistrict("");
            setSelectedCity("");
            setCities([]);
          }
        }
      } catch (err) {
        console.error("Failed to load districts:", err);
      } finally {
        setLoadingDistricts(false);
      }
    }

    fetchDistricts();
  }, [selectedState]);

  // Fetch Cities when District changes
  useEffect(() => {
    if (!selectedDistrict) {
      setCities([]);
      return;
    }

    async function fetchCities() {
      setLoadingCities(true);
      try {
        const res = await fetch(`/api/locations/cities?districtSlug=${selectedDistrict}`);
        const data = await res.json();
        if (data.success) {
          setCities(data.data);
          const exists = data.data.some((c: LocationItem) => c.slug === selectedCity);
          if (!exists && !initialCity) {
            setSelectedCity("");
          }
        }
      } catch (err) {
        console.error("Failed to load cities:", err);
      } finally {
        setLoadingCities(false);
      }
    }

    fetchCities();
  }, [selectedDistrict]);

  // Handle "Use my current location"
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setDetectingLocation(true);
    setGeoMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `/api/locations/nearest?lat=${latitude}&lng=${longitude}`
          );
          const data = await res.json();

          if (data.success && data.data) {
            const { state, district, city } = data.data;
            setSelectedState(state.slug);
            setSelectedDistrict(district.slug);
            setSelectedCity(city.slug);
            setGeoMessage(`Located near ${city.name}, ${district.name}`);

            if (onLocationSelect) {
              onLocationSelect(state.slug, district.slug, city.slug);
            }

            if (autoRedirect) {
              setTimeout(() => {
                router.push(
                  `/search?state=${state.slug}&district=${district.slug}&city=${city.slug}`
                );
              }, 600);
            }
          } else {
            setGeoMessage("No registered hostel hub found near current location.");
          }
        } catch (err) {
          console.error("Nearest location error:", err);
          setGeoMessage("Could not resolve nearest hub. Please select manually.");
        } finally {
          setDetectingLocation(false);
        }
      },
      (error) => {
        console.warn("Geolocation denied or error:", error);
        setDetectingLocation(false);
        setGeoMessage("Location access denied. Please select your hub from dropdown.");
      },
      { timeout: 8000 }
    );
  };

  // Perform Final Search Action
  const handleSearchSubmit = () => {
    if (onLocationSelect) {
      onLocationSelect(selectedState, selectedDistrict, selectedCity);
    }

    if (autoRedirect) {
      const params = new URLSearchParams();
      if (selectedState) params.set("state", selectedState);
      if (selectedDistrict) params.set("district", selectedDistrict);
      if (selectedCity) params.set("city", selectedCity);

      router.push(`/search?${params.toString()}`);
    }
  };

  // Find readable names for display
  const activeStateObj = states.find((s) => s.slug === selectedState);
  const activeDistrictObj = districts.find((d) => d.slug === selectedDistrict);
  const activeCityObj = cities.find((c) => c.slug === selectedCity);

  return (
    <div className="w-full">
      {/* 1. DESKTOP VIEW (>= 640px) */}
      <div className="hidden sm:block">
        <div
          className={`bg-white border border-surface-border-strong rounded-[8px] p-2 shadow-sm transition-all focus-within:border-primary ${
            compact ? "py-1.5" : "py-2.5"
          }`}
        >
          <div className="grid grid-cols-12 gap-2 items-center">
            {/* State Selector */}
            <div className="col-span-3 border-r border-surface-border pr-2">
              <div className="flex items-center justify-between">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal-muted">
                  State
                </label>
                {loadingStates && (
                  <Loader2 className="w-2.5 h-2.5 animate-spin text-primary" />
                )}
              </div>
              <div className="relative mt-0.5">
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setSelectedDistrict("");
                    setSelectedCity("");
                  }}
                  className="w-full bg-transparent text-charcoal font-bold text-xs focus:outline-none cursor-pointer truncate pr-4"
                >
                  {states.length > 0 ? (
                    states.map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {s.name}
                      </option>
                    ))
                  ) : (
                    <option value="kerala">Kerala</option>
                  )}
                </select>
              </div>
            </div>

            {/* District Selector */}
            <div className="col-span-4 border-r border-surface-border pr-2">
              <div className="flex items-center justify-between">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal-muted">
                  District / Zone
                </label>
                {loadingDistricts && (
                  <Loader2 className="w-2.5 h-2.5 animate-spin text-primary" />
                )}
              </div>
              <div className="relative mt-0.5">
                <select
                  value={selectedDistrict}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    setSelectedCity("");
                  }}
                  className="w-full bg-transparent text-charcoal font-semibold text-xs focus:outline-none cursor-pointer truncate pr-4"
                >
                  <option value="">Select District (e.g. Ernakulam)</option>
                  {districts.map((d) => (
                    <option key={d.slug} value={d.slug}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* City / College / Tech Hub Selector */}
            <div className="col-span-5 flex items-center justify-between pl-1">
              <div className="flex-1 pr-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-charcoal-muted">
                    City / College / IT Hub
                  </label>
                  {loadingCities && (
                    <Loader2 className="w-2.5 h-2.5 animate-spin text-primary" />
                  )}
                </div>
                <div className="relative mt-0.5">
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    disabled={!selectedDistrict}
                    className="w-full bg-transparent text-charcoal font-semibold text-xs focus:outline-none cursor-pointer truncate disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {!selectedDistrict
                        ? "← Pick District first"
                        : cities.length === 0
                        ? "Loading hubs..."
                        : "Select Hub / Area (e.g. Kakkanad)"}
                    </option>
                    {cities.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Button */}
              <Button
                variant="primary"
                size={compact ? "sm" : "md"}
                onClick={handleSearchSubmit}
                className="shrink-0 font-bold"
              >
                <Search className="w-3.5 h-3.5 mr-1" />
                Find
              </Button>
            </div>
          </div>
        </div>

        {/* Geolocation Quick Trigger Bar */}
        <div className="flex items-center justify-between text-xs mt-2 px-1">
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={detectingLocation}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-700 hover:underline cursor-pointer disabled:opacity-50"
          >
            {detectingLocation ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Compass className="w-3.5 h-3.5 text-primary" />
            )}
            <span>Use my current location</span>
          </button>

          {geoMessage && (
            <span className="text-[11px] text-primary font-semibold animate-fade-in">
              {geoMessage}
            </span>
          )}

          {/* Quick Popular Kerala Chips */}
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-charcoal-muted">
            <span className="font-bold text-charcoal">Popular Hubs:</span>
            {[
              { dist: "ernakulam", city: "kakkanad", label: "Infopark" },
              { dist: "ernakulam", city: "kalamassery", label: "CUSAT" },
              { dist: "thiruvananthapuram", city: "kazhakkoottam", label: "Technopark" },
              { dist: "kozhikode", city: "chathamangalam-nit", label: "NIT Calicut" },
            ].map((quick, qIdx) => (
              <button
                key={qIdx}
                type="button"
                onClick={() => {
                  setSelectedState("kerala");
                  setSelectedDistrict(quick.dist);
                  setSelectedCity(quick.city);
                }}
                className="bg-surface hover:bg-surface-muted text-charcoal px-2.5 py-0.5 rounded-[4px] border border-surface-border font-medium transition-colors cursor-pointer"
              >
                {quick.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. MOBILE VIEW (< 640px) */}
      <div className="sm:hidden">
        {/* Mobile Compact Trigger Button */}
        <div
          onClick={() => setIsMobileSheetOpen(true)}
          className="bg-white border border-surface-border-strong rounded-[8px] p-3 shadow-xs flex items-center justify-between cursor-pointer active:bg-surface"
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <div className="truncate">
              <span className="text-[10px] uppercase font-bold text-charcoal-muted block leading-none">
                Location Selection
              </span>
              <span className="text-xs font-bold text-charcoal truncate block mt-0.5">
                {activeCityObj?.name
                  ? `${activeCityObj.name}, ${activeDistrictObj?.name}`
                  : activeDistrictObj?.name
                  ? `All in ${activeDistrictObj.name}`
                  : "Tap to choose District & City Hub"}
              </span>
            </div>
          </div>

          <div className="bg-primary text-white p-1.5 rounded-[4px] shrink-0">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {/* Mobile Geolocation quick button */}
        <div className="flex items-center justify-between gap-2 mt-2">
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={detectingLocation}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary min-h-[44px] px-1"
          >
            {detectingLocation ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Compass className="w-3.5 h-3.5 text-primary" />
            )}
            <span>Detect nearest hostel hub</span>
          </button>
          {geoMessage && (
            <span className="text-[10px] text-primary font-semibold text-right">{geoMessage}</span>
          )}
        </div>

        {/* Slide-Up Bottom Sheet Modal for Mobile */}
        {isMobileSheetOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 animate-fade-in">
            {/* Backdrop Dismiss */}
            <div
              className="flex-1"
              onClick={() => setIsMobileSheetOpen(false)}
            />

            {/* Bottom Sheet Container */}
            <div className="bg-white rounded-t-[16px] border-t-2 border-primary max-h-[85vh] flex flex-col shadow-2xl animate-slide-up">
              {/* Sheet Header */}
              <div className="p-4 border-b border-surface-border flex items-center justify-between bg-surface rounded-t-[16px]">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-primary text-white rounded-[4px]">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm text-charcoal">
                      Select Location Hub
                    </h3>
                    <p className="text-[11px] text-charcoal-muted">
                      District → College / Tech Hub Area
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMobileSheetOpen(false)}
                  className="p-1 text-charcoal-muted hover:text-charcoal rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Step Tabs & Live Search Input */}
              <div className="p-3 border-b border-surface-border space-y-2">
                <div className="grid grid-cols-2 gap-2 bg-surface-muted p-1 rounded-[6px]">
                  <button
                    type="button"
                    onClick={() => setMobileStep("district")}
                    className={`min-h-[44px] py-1.5 text-xs font-bold rounded-[4px] transition-colors cursor-pointer ${
                      mobileStep === "district"
                        ? "bg-white text-primary shadow-xs"
                        : "text-charcoal-muted"
                    }`}
                  >
                    1. District {selectedDistrict && "✓"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedDistrict) setMobileStep("city");
                    }}
                    disabled={!selectedDistrict}
                    className={`min-h-[44px] py-1.5 text-xs font-bold rounded-[4px] transition-colors cursor-pointer ${
                      mobileStep === "city"
                        ? "bg-white text-primary shadow-xs"
                        : "text-charcoal-muted disabled:opacity-50"
                    }`}
                  >
                    2. City / Campus {selectedCity && "✓"}
                  </button>
                </div>

                {/* Filter Search Input */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-muted" />
                  <input
                    type="text"
                    placeholder={
                      mobileStep === "district"
                        ? "Search District (e.g. Ernakulam, Trivandrum)..."
                        : "Search Campus / Tech Hub (e.g. Kakkanad, CUSAT)..."
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full min-h-[44px] pl-8 pr-3 py-2 text-xs bg-surface border border-surface-border-strong rounded-[6px] text-charcoal focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Scrollable List Container */}
              <div className="flex-1 overflow-y-auto p-3 max-h-60 space-y-1">
                {mobileStep === "district" ? (
                  districts
                    .filter((d) =>
                      d.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((d) => {
                      const isSelected = selectedDistrict === d.slug;
                      return (
                        <div
                          key={d.slug}
                          onClick={() => {
                            setSelectedDistrict(d.slug);
                            setSelectedCity("");
                            setSearchQuery("");
                            setMobileStep("city");
                          }}
                          className={`min-h-[44px] p-2.5 rounded-[6px] text-xs font-semibold flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? "bg-primary-50 text-primary border border-primary/30 font-bold"
                              : "hover:bg-surface text-charcoal"
                          }`}
                        >
                          <span>{d.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-primary" />}
                        </div>
                      );
                    })
                ) : cities.length === 0 ? (
                  <div className="p-4 text-center text-xs text-charcoal-muted">
                    No specific hubs mapped for this district yet.
                  </div>
                ) : (
                  cities
                    .filter((c) =>
                      c.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((c) => {
                      const isSelected = selectedCity === c.slug;
                      return (
                        <div
                          key={c.slug}
                          onClick={() => {
                            setSelectedCity(c.slug);
                            setIsMobileSheetOpen(false);
                            if (onLocationSelect) {
                              onLocationSelect(selectedState, selectedDistrict, c.slug);
                            }
                            if (autoRedirect) {
                              router.push(
                                `/search?state=${selectedState}&district=${selectedDistrict}&city=${c.slug}`
                              );
                            }
                          }}
                          className={`min-h-[44px] p-2.5 rounded-[6px] text-xs font-semibold flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? "bg-primary-50 text-primary border border-primary/30 font-bold"
                              : "hover:bg-surface text-charcoal"
                          }`}
                        >
                          <span>{c.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-primary" />}
                        </div>
                      );
                    })
                )}
              </div>

              {/* Bottom Sheet Footer */}
              <div className="p-3 bg-surface border-t border-surface-border flex items-center justify-between gap-2 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
                <Button
                  variant="outline"
                  size="md"
                  fullWidth
                  onClick={() => setIsMobileSheetOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => {
                    setIsMobileSheetOpen(false);
                    handleSearchSubmit();
                  }}
                  disabled={!selectedDistrict}
                >
                  Apply & Search
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CascadingLocationPicker;
