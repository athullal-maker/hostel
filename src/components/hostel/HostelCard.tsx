import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Star,
  ShieldCheck,
  Utensils,
  Wifi,
  Phone,
  ArrowRight,
  Clock,
  Sparkles,
  Zap,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export interface HostelCardProps {
  id: string;
  name: string;
  hostelType: "boys" | "girls" | "co-ed";
  locality: string;
  city: string;
  distanceInfo: string;
  coverImage: string;
  startingPrice: number;
  sharingPrices?: { type: string; price: number; available: boolean }[];
  avgRating: number;
  totalReviews?: number;
  isVerified?: boolean;
  foodIncluded?: boolean;
  foodType?: string;
  curfew?: string;
  hasAC?: boolean;
  hasWifi?: boolean;
}

export const HostelCard: React.FC<HostelCardProps> = ({
  id,
  name,
  hostelType,
  locality,
  city,
  distanceInfo,
  coverImage,
  startingPrice,
  sharingPrices = [
    { type: "Single", price: startingPrice + 3000, available: true },
    { type: "2-Share", price: startingPrice + 1200, available: true },
    { type: "3-Share", price: startingPrice + 400, available: true },
    { type: "4-Share", price: startingPrice, available: true },
  ],
  avgRating,
  totalReviews = 24,
  isVerified = true,
  foodIncluded = true,
  foodType = "3-time Homestyle Meals Included",
  curfew = "9:30 PM (Biometric entry for shifts)",
  hasAC = true,
  hasWifi = true,
}) => {
  const typeBadgeVariant = "primary" as const;

  const typeLabel =
    hostelType === "girls"
      ? "Ladies Hostel / PG"
      : hostelType === "boys"
      ? "Men's Hostel / PG"
      : "Co-Living / Unisex";

  return (
    <div className="bg-white border border-surface-border rounded-[8px] shadow-subtle hover:border-surface-border-strong hover:shadow-card-hover transition-all flex flex-col md:flex-row overflow-hidden group">
      {/* Photo Column */}
      <div className="relative w-full md:w-64 lg:w-72 h-48 md:h-auto shrink-0 bg-slate-100 overflow-hidden">
        <Image
          src={coverImage || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80"}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Overlay Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
          <Badge variant={typeBadgeVariant} size="sm">
            {typeLabel}
          </Badge>
          {isVerified && (
            <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-[4px] inline-flex items-center gap-1 shadow-sm">
              <ShieldCheck className="w-3 h-3 text-white" />
              Verified Property
            </span>
          )}
        </div>

        <div className="absolute bottom-2.5 right-2.5 bg-slate-950/85 text-white text-[11px] font-bold px-2 py-0.5 rounded-[4px] flex items-center gap-1 shadow-xs">
          <Star className="w-3 h-3 fill-primary text-primary" />
          <span>{avgRating.toFixed(1)}</span>
          <span className="text-slate-400 font-normal">({totalReviews})</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header & Location */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <Link href={`/hostel/${id}`}>
                <h3 className="font-heading font-bold text-base sm:text-lg text-charcoal group-hover:text-primary transition-colors leading-tight">
                  {name}
                </h3>
              </Link>
              <p className="text-xs text-charcoal-muted flex flex-wrap items-center gap-x-1 gap-y-0.5 mt-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="truncate max-w-full">{locality}, {city}</span>
                <span className="text-slate-300">•</span>
                <span className="text-primary font-bold">{distanceInfo}</span>
              </p>
            </div>

            {/* Quick Price Callout */}
            <div className="text-right shrink-0">
              <span className="text-[10px] text-charcoal-muted uppercase tracking-wider block font-bold">
                Starting from
              </span>
              <span className="text-lg sm:text-xl font-heading font-extrabold text-primary whitespace-nowrap">
                ₹{startingPrice.toLocaleString("en-IN")}
              </span>
              <span className="text-[11px] text-charcoal-muted">/month</span>
            </div>
          </div>

          {/* Key Utilitarian Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs text-charcoal">
            <div className="flex items-center gap-1.5 min-w-0">
              <Utensils className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="truncate min-w-0">
                {foodIncluded ? (
                  <span className="font-medium text-charcoal">
                    Food: <span className="text-primary font-semibold">{foodType}</span>
                  </span>
                ) : (
                  <span className="text-charcoal-muted">Self-cooking / External Mess</span>
                )}
              </span>
            </div>

            <div className="flex items-center gap-1.5 min-w-0">
              <Clock className="w-3.5 h-3.5 text-charcoal-muted shrink-0" />
              <span className="truncate min-w-0 text-charcoal-muted">
                Curfew: <span className="text-charcoal font-semibold">{curfew}</span>
              </span>
            </div>
          </div>

          {/* Sharing Matrix */}
          <div className="mt-3 bg-surface border border-surface-border rounded-[6px] p-2.5">
            <div className="text-[10px] uppercase font-bold text-charcoal-muted tracking-wider mb-1.5 flex items-center justify-between">
              <span>Monthly Rent by Room Sharing:</span>
              <span className="text-[10px] text-primary font-bold">Zero Brokerage</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {sharingPrices.map((tier, index) => (
                <div
                  key={index}
                  className="bg-white border border-surface-border rounded-[4px] p-1.5 text-center shadow-2xs"
                >
                  <span className="text-[10px] font-medium text-charcoal-muted block">
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
                    {tier.available ? "Available" : "Full"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities Pills */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3">
            {hasAC && <Badge variant="neutral">AC Room</Badge>}
            {hasWifi && (
              <Badge variant="neutral" className="inline-flex items-center gap-1">
                <Wifi className="w-2.5 h-2.5" /> High-speed Wi-Fi
              </Badge>
            )}
            <Badge variant="neutral">Attached Bathroom</Badge>
            <Badge variant="neutral">Warden on Premise</Badge>
            <Badge variant="neutral">RO Water</Badge>
            <Badge variant="neutral">Power Backup</Badge>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-3 mt-3 border-t border-slate-100 gap-2">
          <div className="hidden sm:flex items-center gap-1 text-xs text-charcoal-muted order-2 sm:order-1">
            <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>100% Verified Property • Instant Booking</span>
          </div>

          <div className="flex items-center gap-2 order-1 sm:order-2">
            <Button
              variant="outline"
              size="sm"
              fullWidth
              className="border-primary text-primary hover:bg-primary-50 sm:w-auto"
            >
              <Phone className="w-3.5 h-3.5 mr-1" />
              Call Manager
            </Button>

            <Link href={`/hostel/${id}`} className="w-full sm:w-auto">
              <Button variant="primary" size="sm" fullWidth className="sm:w-auto">
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostelCard;
