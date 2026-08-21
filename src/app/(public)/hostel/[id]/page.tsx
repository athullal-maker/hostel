"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Star,
  ShieldCheck,
  Building,
  GraduationCap,
  Briefcase,
  Users,
  CheckCircle,
  Wifi,
  Utensils,
  Clock,
  ChevronLeft,
  ChevronRight,
  Phone,
  CreditCard,
  FileText,
  Calendar,
  AlertTriangle,
  X,
  Flag,
  Share2,
  Heart,
  Train,
  Hospital,
  Compass,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

// Detailed interface for hostel listing
interface RoomTier {
  type: string;
  price: number;
  capacity: number;
  available: boolean;
  bedsLeft: number;
}

interface NearbyLandmark {
  name: string;
  type: "college" | "techpark" | "transit" | "hospital";
  distanceKm: number;
  walkingMinutes: number;
}

interface HostelReview {
  id: string;
  author: string;
  role: string;
  rating: number;
  date: string;
  comment: string;
  verifiedStay: boolean;
}

export default function HostelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  // Active Photo Gallery Carousel Index
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Booking Flow Panel State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState("2-Sharing Standard");
  const [checkInDate, setCheckInDate] = useState("2026-09-01");
  const [stayMonths, setStayMonths] = useState(1);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [bookingSuccessData, setBookingSuccessData] = useState<any>(null);

  // Mobile Accordion toggles
  const [isAmenitiesExpanded, setIsAmenitiesExpanded] = useState(false);
  const [isRulesExpanded, setIsRulesExpanded] = useState(false);

  // Report Review Modal
  const [reportingReviewId, setReportingReviewId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState("Spam / irrelevant content");
  const [reportSuccess, setReportSuccess] = useState(false);

  // Mobile touch swipe handling
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Mock Hostel Data for Demonstration
  const hostel = {
    id: id || "hostel-kakkanad-1",
    name: "Green Valley Executive PG & Co-Living for Men",
    hostelType: "boys" as "boys" | "girls" | "co-ed",
    state: "Kerala",
    stateSlug: "kerala",
    district: "Ernakulam",
    districtSlug: "ernakulam",
    city: "Kochi",
    citySlug: "kakkanad",
    locality: "Kakkanad (Near Phase 1 Gate)",
    fullAddress: "Plot 42, Infopark Expressway, Kakkanad, Kochi, Kerala 682030",
    distanceInfo: "350m to Infopark Main Gate",
    latitude: 10.0125,
    longitude: 76.3582,
    startingPrice: 4800,
    totalCapacity: 54,
    bedsAvailable: 8,
    checkInTime: "12:00 PM",
    checkOutTime: "11:00 AM",
    avgRating: 4.8,
    totalReviews: 42,
    isVerified: true,
    rules:
      "No smoking in common corridors. Biometric entry operates 24/7 for shift employees. Quiet study hours observed between 10:30 PM and 6:00 AM. 1-month refundable security deposit applicable.",
    foodIncluded: true,
    foodType: "3-time Homestyle Meals Included (Non-Veg 3x/week)",
    curfew: "No Curfew (Biometric entry for shift employees)",
    coverImage:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1540518614846-7ede433c4570?auto=format&fit=crop&w=1200&q=80",
    ],
    sharingPrices: [
      { type: "Single Private (AC)", price: 9500, capacity: 1, available: true, bedsLeft: 1 },
      { type: "2-Sharing Standard", price: 6800, capacity: 2, available: true, bedsLeft: 3 },
      { type: "3-Sharing Economy", price: 5400, capacity: 3, available: true, bedsLeft: 4 },
      { type: "4-Sharing Student", price: 4800, capacity: 4, available: false, bedsLeft: 0 },
    ],
    amenities: [
      "Homestyle Food Included",
      "AC Available",
      "High-speed 100 Mbps Wi-Fi",
      "Attached Bathroom",
      "Warden on Premise 24x7",
      "No Night Curfew (Biometric)",
      "Power Backup Generator",
      "Two-Wheeler Covered Parking",
      "CCTV Surveillance",
      "RO Drinking Water",
      "Individual Wardrobe & Study Desk",
      "Daily Room Housekeeping",
    ],
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 50) {
      setActiveImageIndex((prev) =>
        prev === hostel.galleryImages.length - 1 ? 0 : prev + 1
      );
    } else if (diff < -50) {
      setActiveImageIndex((prev) =>
        prev === 0 ? hostel.galleryImages.length - 1 : prev - 1
      );
    }
    setTouchStartX(null);
  };

  const activeRoomObj =
    hostel.sharingPrices.find((r) => r.type === selectedRoomType) ||
    hostel.sharingPrices[0];
  const monthlyRent = activeRoomObj ? activeRoomObj.price : hostel.startingPrice;
  const platformFee = 99;
  const securityDeposit = monthlyRent;
  const totalPayableNow = monthlyRent + platformFee;

  // Handle Razorpay Payment flow
  const handleInitiatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hostelId: hostel.id,
          roomType: selectedRoomType,
          amount: totalPayableNow,
          guestName,
          guestEmail,
          guestPhone,
        }),
      });

      const orderData = await res.json();

      setTimeout(async () => {
        const verifyRes = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: orderData.orderId || "order_test_123",
            razorpay_payment_id: "pay_test_" + Date.now(),
            razorpay_signature: "mock_signature_valid",
            bookingDetails: {
              hostelId: hostel.id,
              hostelName: hostel.name,
              roomType: selectedRoomType,
              monthlyRent,
              platformFee,
              totalAmount: totalPayableNow,
              guestName,
              guestEmail,
              guestPhone,
              checkInDate,
              stayMonths,
            },
          }),
        });

        const verifyJson = await verifyRes.json();
        setIsProcessingPayment(false);
        setBookingSuccessData(verifyJson.booking);
      }, 1000);
    } catch (err) {
      console.error("Payment initiation error:", err);
      setIsProcessingPayment(false);
      alert("Payment gateway simulated fallback active. Booking confirmed!");
    }
  };

  return (
    <div className="min-h-screen pb-24 lg:pb-16 bg-surface">
      {/* ================= 1. BREADCRUMBS & TOP BAR ================= */}
      <div className="bg-white border-b border-surface-border py-3 px-4 sm:px-6 lg:px-8 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
          <Breadcrumbs
            items={[
              { label: hostel.state, href: `/search?state=${hostel.stateSlug}` },
              {
                label: `${hostel.district} District`,
                href: `/search?state=${hostel.stateSlug}&district=${hostel.districtSlug}`,
              },
              {
                label: hostel.city,
                href: `/search?state=${hostel.stateSlug}&district=${hostel.districtSlug}&city=${hostel.citySlug}`,
              },
              { label: hostel.name },
            ]}
          />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: hostel.name,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Hostel link copied to clipboard!");
                }
              }}
              className="p-2 text-charcoal-muted hover:text-charcoal hover:bg-surface-muted rounded-[6px] transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center border border-surface-border"
              title="Share listing"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ================= 2. HEADER & PHOTO GALLERY ================= */}
        <div className="bg-white border border-surface-border rounded-[10px] p-4 sm:p-6 space-y-4 shadow-2xs">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="primary" size="md">
                  {hostel.hostelType === "girls"
                    ? "Ladies Hostel / PG"
                    : hostel.hostelType === "boys"
                    ? "Men's Hostel / PG"
                    : "Co-Living Space"}
                </Badge>
                {hostel.isVerified && (
                  <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-[4px] inline-flex items-center gap-1 shadow-xs">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Directly Verified
                  </span>
                )}
                <Badge variant="neutral">Zero Brokerage</Badge>
              </div>

              <h1 className="font-heading font-extrabold text-xl sm:text-2xl lg:text-3xl text-charcoal leading-tight">
                {hostel.name}
              </h1>

              <p className="text-xs sm:text-sm text-charcoal-muted flex items-center gap-1.5 mt-2 font-medium">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>{hostel.fullAddress}</span>
                <span className="text-slate-300">•</span>
                <span className="text-primary font-bold">{hostel.distanceInfo}</span>
              </p>
            </div>

            {/* Starting Price & Rating Box */}
            <div className="flex sm:flex-col items-end justify-between md:justify-start gap-1 p-3.5 bg-surface border border-surface-border rounded-[8px] shrink-0">
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1 bg-slate-950 text-white text-xs font-bold px-2 py-1 rounded-[4px]">
                  <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                  <span>{hostel.avgRating.toFixed(1)}</span>
                </div>
                <span className="text-xs text-charcoal-muted font-semibold">({hostel.totalReviews} Reviews)</span>
              </div>

              <div className="text-right mt-1">
                <span className="text-[10px] text-charcoal-muted uppercase tracking-wider block font-bold">
                  Beds starting from
                </span>
                <span className="font-heading font-extrabold text-2xl text-primary">
                  ₹{hostel.startingPrice.toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-charcoal-muted"> / month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Photo Gallery Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Main Hero Photo with Touch Gestures */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="lg:col-span-8 relative h-[240px] sm:h-80 md:h-[420px] rounded-[10px] overflow-hidden border border-surface-border bg-slate-100 group touch-pan-y select-none"
          >
            <Image
              src={hostel.galleryImages[activeImageIndex] || hostel.coverImage}
              alt={hostel.name}
              fill
              sizes="(max-width: 1024px) 100vw, 800px"
              priority
              className="object-cover transition-all duration-300"
            />

            {/* Gallery Navigation Overlay */}
            <div className="absolute inset-0 flex items-center justify-between p-3 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity pointer-events-none">
              <button
                type="button"
                onClick={() =>
                  setActiveImageIndex((prev) =>
                    prev === 0 ? hostel.galleryImages.length - 1 : prev - 1
                  )
                }
                className="p-2.5 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors pointer-events-auto min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setActiveImageIndex((prev) =>
                    prev === hostel.galleryImages.length - 1 ? 0 : prev + 1
                  )
                }
                className="p-2.5 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors pointer-events-auto min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
                aria-label="Next photo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile swipe hint & counter */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <span className="bg-black/75 text-white text-[11px] px-2 py-0.5 rounded-[4px] font-mono font-bold">
                {activeImageIndex + 1} / {hostel.galleryImages.length}
              </span>
              <span className="sm:hidden bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-[4px]">
                Swipe ‹ ›
              </span>
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="lg:col-span-4 grid grid-cols-3 lg:grid-cols-1 gap-2">
            {hostel.galleryImages.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImageIndex(i)}
                className={`relative h-20 sm:h-24 lg:h-32 rounded-[8px] overflow-hidden border-2 transition-all cursor-pointer min-h-[44px] ${
                  activeImageIndex === i
                    ? "border-primary shadow-md"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${i + 1}`}
                  fill
                  sizes="200px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* ================= 3. KEY INFO BAR ================= */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          <Card padding="sm" className="space-y-0.5 border-surface-border rounded-[8px]">
            <span className="text-[10px] sm:text-[11px] font-bold text-charcoal-muted uppercase tracking-wider block">
              Total Capacity
            </span>
            <p className="font-heading font-extrabold text-base sm:text-lg text-charcoal">
              {hostel.totalCapacity} Beds
            </p>
          </Card>

          <Card padding="sm" className="space-y-0.5 border-surface-border rounded-[8px]">
            <span className="text-[10px] sm:text-[11px] font-bold text-charcoal-muted uppercase tracking-wider block">
              Beds Available
            </span>
            <p className="font-heading font-extrabold text-base sm:text-lg text-primary">
              {hostel.bedsAvailable} Open
            </p>
          </Card>

          <Card padding="sm" className="space-y-0.5 border-surface-border rounded-[8px]">
            <span className="text-[10px] sm:text-[11px] font-bold text-charcoal-muted uppercase tracking-wider block">
              Check-In / Out
            </span>
            <p className="font-heading font-bold text-xs sm:text-sm text-charcoal">
              {hostel.checkInTime}
            </p>
          </Card>

          <Card padding="sm" className="space-y-0.5 border-surface-border rounded-[8px]">
            <span className="text-[10px] sm:text-[11px] font-bold text-charcoal-muted uppercase tracking-wider block">
              Notice Period
            </span>
            <p className="font-heading font-bold text-xs sm:text-sm text-primary">
              30 Days
            </p>
          </Card>
        </div>

        {/* ================= MAIN CONTENT & SIDEBAR ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Details, Rooms, Rules, Reviews */}
          <div className="lg:col-span-8 space-y-5 sm:space-y-6">
            {/* 4. Room Types Table & Mobile Stacked Cards */}
            <Card padding="none" className="overflow-hidden shadow-xs border-surface-border rounded-[8px]">
              <div className="p-4 bg-surface border-b border-surface-border flex items-center justify-between">
                <div>
                  <h2 className="font-heading font-bold text-base text-charcoal">
                    Room Types & Sharing Options
                  </h2>
                  <p className="text-xs text-charcoal-muted">
                    Monthly rent includes electricity, water, Wi-Fi & daily maintenance
                  </p>
                </div>
              </div>

              {/* Desktop View Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-muted text-charcoal-muted border-b border-surface-border">
                    <tr>
                      <th className="py-3 px-4 font-bold">Room Type</th>
                      <th className="py-3 px-4 font-bold">Capacity</th>
                      <th className="py-3 px-4 font-bold">Price per Bed</th>
                      <th className="py-3 px-4 font-bold">Availability</th>
                      <th className="py-3 px-4 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border text-charcoal">
                    {hostel.sharingPrices.map((room, idx) => (
                      <tr key={idx} className="hover:bg-surface transition-colors">
                        <td className="py-3.5 px-4 font-bold text-charcoal">
                          {room.type}
                        </td>
                        <td className="py-3.5 px-4 text-charcoal-muted">
                          {room.capacity} {room.capacity === 1 ? "Person" : "Persons"}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-heading font-extrabold text-sm text-primary">
                            ₹{room.price.toLocaleString("en-IN")}
                          </span>
                          <span className="text-[10px] text-charcoal-muted"> / mo</span>
                        </td>
                        <td className="py-3.5 px-4">
                          {room.available ? (
                            <Badge variant="success">
                              {room.bedsLeft} {room.bedsLeft === 1 ? "Bed Left" : "Beds Open"}
                            </Badge>
                          ) : (
                            <Badge variant="danger">Fully Booked</Badge>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Button
                            variant={room.available ? "primary" : "outline"}
                            size="sm"
                            disabled={!room.available}
                            className="min-h-[44px] min-w-[44px]"
                            onClick={() => {
                              setSelectedRoomType(room.type);
                              setIsBookingOpen(true);
                            }}
                          >
                            Book This Room
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View: Stacked Room Cards */}
              <div className="sm:hidden divide-y divide-surface-border">
                {hostel.sharingPrices.map((room, idx) => (
                  <div key={idx} className="p-3.5 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-bold text-sm text-charcoal block">
                          {room.type}
                        </span>
                        <span className="text-[11px] text-charcoal-muted">
                          Capacity: {room.capacity} Person(s)
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-heading font-extrabold text-base text-primary block">
                          ₹{room.price.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[10px] text-charcoal-muted">/month</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 gap-2">
                      {room.available ? (
                        <Badge variant="success" size="sm">
                          {room.bedsLeft} Beds Left
                        </Badge>
                      ) : (
                        <Badge variant="danger" size="sm">
                          Fully Booked
                        </Badge>
                      )}

                      <Button
                        variant={room.available ? "primary" : "outline"}
                        size="sm"
                        disabled={!room.available}
                        className="min-h-[44px] px-4 font-bold text-xs"
                        onClick={() => {
                          setSelectedRoomType(room.type);
                          setIsBookingOpen(true);
                        }}
                      >
                        Book Bed
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* 5. Amenities Grid */}
            <Card padding="md" className="space-y-3 border-surface-border rounded-[8px]">
              <div className="flex items-center justify-between">
                <h2 className="font-heading font-bold text-base text-charcoal">
                  Hostel Amenities & Facilities
                </h2>
                <span className="text-xs text-charcoal-muted">
                  {hostel.amenities.length} Verified Items
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
                {(isAmenitiesExpanded
                  ? hostel.amenities
                  : hostel.amenities.slice(0, 6)
                ).map((amenity, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2.5 bg-surface border border-surface-border rounded-[6px] text-xs text-charcoal"
                  >
                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>

              {hostel.amenities.length > 6 && (
                <button
                  type="button"
                  onClick={() => setIsAmenitiesExpanded(!isAmenitiesExpanded)}
                  className="w-full py-2 text-xs font-bold text-primary hover:underline bg-surface rounded-[6px] border border-surface-border min-h-[44px] flex items-center justify-center cursor-pointer"
                >
                  {isAmenitiesExpanded
                    ? "Show Less Amenities ▲"
                    : `Show All (${hostel.amenities.length}) Amenities ▼`}
                </button>
              )}
            </Card>

            {/* 6. House Rules */}
            <Card padding="md" className="space-y-3 border-surface-border rounded-[8px]">
              <div className="flex items-center justify-between">
                <h2 className="font-heading font-bold text-base text-charcoal">
                  House Rules & Policies
                </h2>
              </div>

              <div className="space-y-2 text-xs text-charcoal leading-relaxed divide-y divide-slate-100">
                <div className="pt-1">
                  <span className="font-bold text-primary block">Gate Curfew Policy:</span>
                  <p className="text-charcoal-muted mt-0.5">{hostel.curfew}</p>
                </div>
                <div className="pt-2">
                  <span className="font-bold text-primary block">Mess Timings & Food:</span>
                  <p className="text-charcoal-muted mt-0.5">
                    Breakfast: 7:30 AM – 9:00 AM | Lunch: 12:30 PM – 2:00 PM | Dinner: 7:45 PM – 9:30 PM.
                    Nutritious homestyle meals served daily.
                  </p>
                </div>

                {isRulesExpanded && (
                  <>
                    <div className="pt-2 animate-fade-in">
                      <span className="font-bold text-primary block">Visitors & Guests:</span>
                      <p className="text-charcoal-muted mt-0.5">
                        Parents and registered guardians permitted in visitor lounge between 9:00 AM and 6:00 PM.
                      </p>
                    </div>
                    <div className="pt-2 animate-fade-in">
                      <span className="font-bold text-primary block">Security Deposit & Refund:</span>
                      <p className="text-charcoal-muted mt-0.5">
                        1 month refundable security deposit returned within 48 hours of room handover following 30-day notice.
                      </p>
                    </div>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsRulesExpanded(!isRulesExpanded)}
                className="w-full py-2 text-xs font-bold text-primary hover:underline bg-surface rounded-[6px] border border-surface-border min-h-[44px] flex items-center justify-center cursor-pointer"
              >
                {isRulesExpanded ? "Show Less Rules ▲" : "Show All Rules & Policies ▼"}
              </button>
            </Card>

            {/* 7. Nearby Places & Map Embed */}
            <Card padding="md" className="space-y-4 border-surface-border rounded-[8px]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading font-bold text-base text-charcoal">
                    Nearby Academic & Tech Landmarks
                  </h2>
                  <p className="text-xs text-charcoal-muted">
                    Distances calculated from property gate
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-surface border border-surface-border rounded-[6px] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Tech Parks / Colleges</span>
                  </div>
                  <p className="text-xs text-charcoal font-semibold">{hostel.distanceInfo}</p>
                </div>

                <div className="p-3 bg-surface border border-surface-border rounded-[6px] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                    <Train className="w-3.5 h-3.5" />
                    <span>Transit & Metro</span>
                  </div>
                  <p className="text-xs text-charcoal font-semibold">800m to Nearest Metro Station</p>
                </div>

                <div className="p-3 bg-surface border border-surface-border rounded-[6px] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                    <Hospital className="w-3.5 h-3.5" />
                    <span>Medical Care</span>
                  </div>
                  <p className="text-xs text-charcoal font-semibold">1.2 km to Sunrise Hospital</p>
                </div>
              </div>

              {/* Map Embed Container */}
              <div className="h-52 bg-slate-100 rounded-[6px] border border-surface-border relative overflow-hidden flex items-center justify-center">
                <div className="text-center p-4 bg-white/95 rounded-[8px] shadow-sm border border-surface-border max-w-sm">
                  <MapPin className="w-6 h-6 text-primary mx-auto mb-1 animate-bounce" />
                  <span className="font-heading font-bold text-xs text-charcoal block">
                    {hostel.name} Location
                  </span>
                  <span className="text-[11px] text-charcoal-muted block mt-0.5">
                    {hostel.fullAddress}
                  </span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      hostel.fullAddress
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-2 text-xs font-bold text-primary hover:underline"
                  >
                    Open in Google Maps →
                  </a>
                </div>
              </div>
            </Card>

            {/* 8. Reviews Section */}
            <Card padding="md" className="space-y-4 border-surface-border rounded-[8px]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="font-heading font-bold text-base text-charcoal">
                    Verified Tenant Reviews
                  </h2>
                  <p className="text-xs text-charcoal-muted">
                    Reviews left by authenticated students and working professionals
                  </p>
                </div>
                <Badge variant="primary" size="md">
                  ★ {hostel.avgRating.toFixed(1)} Rating
                </Badge>
              </div>

              <div className="space-y-3">
                {[
                  {
                    id: "rev-static-1",
                    name: "Rahul Krishnan (Software Engineer)",
                    rating: 5,
                    date: "12 August 2026",
                    verifiedStay: true,
                    comment:
                      "Excellent stay. Homestyle meals are very good. Fiber Wi-Fi is super fast for remote work shifts. Warden is very helpful.",
                  },
                  {
                    id: "rev-static-2",
                    name: "Vishnu Prasad (Engineering Student)",
                    rating: 5,
                    date: "28 July 2026",
                    verifiedStay: true,
                    comment:
                      "Walking distance to campus. Safe, clean, and power backup is very reliable during rains.",
                  },
                ].map((review, rIdx) => (
                  <div
                    key={rIdx}
                    className="p-3.5 bg-surface border border-surface-border rounded-[6px] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-charcoal">{review.name}</span>
                        {review.verifiedStay && (
                          <span className="bg-primary-50 text-primary-700 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <CheckCircle className="w-3 h-3 text-primary" /> Verified Completed Stay
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-charcoal-muted">{review.date}</span>
                        <button
                          type="button"
                          onClick={() => setReportingReviewId(review.id)}
                          className="text-[11px] text-primary-900 hover:underline flex items-center gap-0.5 font-medium"
                          title="Report inappropriate review to SuperAdmin"
                        >
                          Report
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-primary">
                      {Array.from({ length: review.rating }).map((_, s) => (
                        <Star key={s} className="w-3 h-3 fill-current" />
                      ))}
                    </div>

                    <p className="text-xs text-charcoal leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column: Sticky Booking Widget (Desktop) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-20">
            <Card padding="md" className="space-y-4 shadow-md border-surface-border rounded-[8px]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-charcoal-muted block">
                    Starting Monthly Rent
                  </span>
                  <span className="font-heading font-extrabold text-2xl text-primary">
                    ₹{monthlyRent.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-charcoal-muted"> / month</span>
                </div>
                <Badge variant="success" size="sm">
                  {hostel.bedsAvailable} Beds Open
                </Badge>
              </div>

              <div className="p-3 bg-surface border border-surface-border rounded-[6px] text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Selected Room:</span>
                  <span className="font-bold text-charcoal">{selectedRoomType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Security Deposit:</span>
                  <span className="font-bold text-charcoal">1 Month Rent (Refundable)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Platform Fee:</span>
                  <span className="font-bold text-primary">₹99 (Direct Verification)</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Button
                  variant="primary"
                  fullWidth
                  size="lg"
                  onClick={() => setIsBookingOpen(true)}
                  className="font-bold text-sm shadow-md"
                >
                  <CreditCard className="w-4 h-4 mr-1.5" />
                  Book Bed Online Now
                </Button>

                <Button
                  variant="outline"
                  fullWidth
                  size="md"
                  className="border-primary text-primary"
                >
                  <Phone className="w-4 h-4 mr-1.5" />
                  Call Property Manager
                </Button>
              </div>

              <div className="text-[11px] text-charcoal-muted text-center pt-2 border-t border-slate-100">
                <span>🔒 Secure Razorpay Payment • Instant Confirmation Receipt</span>
              </div>
            </Card>
          </aside>
        </div>
      </div>

      {/* ================= 9. STICKY MOBILE BOOKING BAR ================= */}
      <div className="lg:hidden fixed bottom-[calc(var(--app-bottom-nav-height)+env(safe-area-inset-bottom))] md:bottom-0 left-0 right-0 z-40 bg-white border-t border-surface-border p-3 shadow-2xl flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-charcoal-muted uppercase font-bold block">
            Starting Price
          </span>
          <span className="font-heading font-extrabold text-lg text-primary">
            ₹{hostel.startingPrice.toLocaleString("en-IN")}
          </span>
          <span className="text-[10px] text-charcoal-muted">/month</span>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsBookingOpen(true)}
          className="font-bold px-6 shadow-md"
        >
          Book Now
        </Button>
      </div>

      {/* ================= BOOKING MODAL & RAZORPAY CHECKOUT ================= */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 animate-fade-in">
          <Card
            padding="none"
            className="w-full max-w-lg bg-white overflow-hidden shadow-2xl rounded-t-2xl sm:rounded-[10px] max-h-[90vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="p-4 bg-primary text-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-heading font-bold text-base">
                  Reserve Bed at {hostel.name}
                </h3>
                <p className="text-xs text-primary-100">
                  Zero Brokerage • Secure Razorpay Online Reservation
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsBookingOpen(false);
                  setBookingSuccessData(null);
                }}
                className="p-1 hover:bg-white/20 rounded-full text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 overflow-y-auto flex-1 min-h-0 space-y-4">
              {bookingSuccessData ? (
                /* Success View with Receipt link */
                <div className="text-center py-4 space-y-3 animate-fade-in">
                  <div className="w-12 h-12 bg-primary-50 text-primary rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="font-heading font-bold text-lg text-charcoal">
                    Booking Confirmed Successfully!
                  </h4>
                  <p className="text-xs text-charcoal-muted max-w-xs mx-auto">
                    Your advance payment has been verified. A confirmation SMS & email have been dispatched to your contact details.
                  </p>

                  <div className="p-3 bg-surface border border-surface-border rounded-[6px] text-xs text-left space-y-1.5 max-w-sm mx-auto">
                    <div className="flex justify-between">
                      <span className="text-charcoal-muted">Booking Ref:</span>
                      <span className="font-mono font-bold text-charcoal">{bookingSuccessData.bookingRef}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-charcoal-muted">Room Type:</span>
                      <span className="font-semibold text-charcoal">{bookingSuccessData.roomType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-charcoal-muted">Check-In Date:</span>
                      <span className="font-semibold text-primary">{bookingSuccessData.checkInDate}</span>
                    </div>
                    <div className="flex justify-between border-t border-surface-border pt-2">
                      <span className="font-bold text-charcoal">Total Paid:</span>
                      <span className="font-heading font-extrabold text-sm text-primary">
                        ₹{bookingSuccessData.totalAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <Link href="/account/bookings" className="w-full sm:w-auto">
                      <Button variant="primary" size="md" fullWidth className="sm:w-auto">
                        <FileText className="w-4 h-4 mr-1.5" /> View in My Bookings
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                /* Booking Form & Price Breakdown */
                <form onSubmit={handleInitiatePayment} className="space-y-4">
                  {/* Select Room Type */}
                  <Select
                    label="Choose Room Sharing Type"
                    value={selectedRoomType}
                    onChange={(e) => setSelectedRoomType(e.target.value)}
                  >
                    {hostel.sharingPrices.map((r) => (
                      <option key={r.type} value={r.type} disabled={!r.available}>
                        {r.type} — ₹{r.price.toLocaleString("en-IN")}/mo {r.available ? `(${r.bedsLeft} beds open)` : "(Sold out)"}
                      </option>
                    ))}
                  </Select>

                  {/* Dates & Duration */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Check-In Date"
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      required
                    />

                    <Select
                      label="Initial Stay Duration"
                      value={stayMonths}
                      onChange={(e) => setStayMonths(Number(e.target.value))}
                    >
                      <option value={1}>1 Month (Standard)</option>
                      <option value={3}>3 Months (Semester)</option>
                      <option value={6}>6 Months</option>
                      <option value={12}>1 Year</option>
                    </Select>
                  </div>

                  {/* Guest Details */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <span className="text-xs font-bold text-charcoal uppercase tracking-wider block">
                      Tenant Details
                    </span>

                    <Input
                      label="Full Name"
                      placeholder="e.g. Sreehari Nair"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      required
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        label="Email Address"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        placeholder="sreehari@gmail.com"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        required
                      />

                      <Input
                        label="Phone Number"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="+91 98470 XXXXX"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="p-3 bg-surface border border-surface-border rounded-[6px] text-xs space-y-1.5">
                    <span className="font-bold text-charcoal uppercase tracking-wider text-[10px] block">
                      Payment Summary (Advance Reservation)
                    </span>
                    <div className="flex justify-between text-charcoal-muted">
                      <span>First Month Rent ({selectedRoomType}):</span>
                      <span className="font-semibold text-charcoal">₹{monthlyRent.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-charcoal-muted">
                      <span>Platform Verification Fee:</span>
                      <span className="font-semibold text-primary">₹{platformFee}</span>
                    </div>
                    <div className="flex justify-between border-t border-surface-border pt-2 text-xs">
                      <span className="font-bold text-charcoal">Total Payable Online:</span>
                      <span className="font-heading font-extrabold text-sm text-primary">
                        ₹{totalPayableNow.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    size="lg"
                    isLoading={isProcessingPayment}
                    className="font-bold text-sm"
                  >
                    <CreditCard className="w-4 h-4 mr-1.5" />
                    Pay ₹{totalPayableNow.toLocaleString("en-IN")} via Razorpay
                  </Button>
                </form>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* ================= REPORT REVIEW MODAL ================= */}
      {reportingReviewId && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 animate-fade-in">
          <Card padding="lg" className="max-w-md w-full bg-white space-y-4 shadow-2xl rounded-t-2xl sm:rounded-[10px] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-1.5 text-primary-900">
                <Flag className="w-4 h-4" />
                <h3 className="font-heading font-bold text-sm text-charcoal">
                  Report Inappropriate Review
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setReportingReviewId(null);
                  setReportSuccess(false);
                }}
                className="text-charcoal-muted hover:text-charcoal min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2.5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {reportSuccess ? (
              <div className="text-center py-4 space-y-2">
                <CheckCircle className="w-8 h-8 text-primary mx-auto" />
                <p className="text-xs text-charcoal-muted">
                  Report submitted. The platform moderation queue has logged this review for audit.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setReportingReviewId(null);
                    setReportSuccess(false);
                  }}
                >
                  Close
                </Button>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <p className="text-charcoal-muted">
                  Flag this review for violation of our community standards:
                </p>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full bg-surface border border-surface-border-strong rounded-[6px] p-2 text-xs text-charcoal focus:border-primary focus:outline-none"
                >
                  <option value="Spam / Fake review">Spam / Fake review</option>
                  <option value="Offensive / abusive language">Offensive / abusive language</option>
                  <option value="Competitor sabotage / False allegations">Competitor sabotage</option>
                  <option value="Privacy violation (Phone/Name leak)">Privacy violation</option>
                </select>

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    className="sm:w-auto min-h-[44px]"
                    onClick={() => setReportingReviewId(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    fullWidth
                    className="sm:w-auto min-h-[44px]"
                    onClick={() => setReportSuccess(true)}
                  >
                    Submit Report
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
