"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Utensils,
  ArrowRight,
  GraduationCap,
  Briefcase,
  Star,
  Building,
} from "lucide-react";
import Card from "@/components/ui/Card";
import HostelCard from "@/components/hostel/HostelCard";
import SearchHeroBar from "@/components/location/SearchHeroBar";

export default function HomePage() {
  const popularHubs = [
    {
      name: "Kakkanad & Infopark",
      district: "Ernakulam, Kochi",
      slug: "kakkanad",
      count: "48+ Hostels & PGs",
      tag: "IT & Tech Corridor",
      icon: Briefcase,
    },
    {
      name: "CUSAT Campus & Kalamassery",
      district: "Ernakulam, Kochi",
      slug: "kalamassery",
      count: "36+ Student Hostels",
      tag: "University Hub",
      icon: GraduationCap,
    },
    {
      name: "Technopark Phase 1-3",
      district: "Kazhakkoottam, TVM",
      slug: "kazhakkoottam",
      count: "52+ PGs & Co-Living",
      tag: "Major Tech Park",
      icon: Briefcase,
    },
    {
      name: "NIT Calicut Chathamangalam",
      district: "Kozhikode",
      slug: "chathamangalam-nit",
      count: "24+ Hostels",
      tag: "National Institute",
      icon: GraduationCap,
    },
    {
      name: "CET Engineering Campus",
      district: "Sreekariyam, TVM",
      slug: "sreekariyam",
      count: "28+ Hostels",
      tag: "Engineering Hub",
      icon: GraduationCap,
    },
    {
      name: "Edappally Metro Corridor",
      district: "Ernakulam, Kochi",
      slug: "edappally",
      count: "30+ Executive PGs",
      tag: "Metro Transit Hub",
      icon: Building,
    },
  ];

  return (
    <div className="space-y-10 sm:space-y-16 pb-12 sm:pb-20 bg-white relative overflow-hidden">
      {/* Subtle Ambient Background Mesh for Modern Atmosphere */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-purple-200/30 via-violet-100/20 to-transparent blur-3xl rounded-full -z-10" />

      {/* ================= HERO SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Headline, Pill & Search Bar (7 columns) */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            {/* Stylish Headline with Toxic Violet Gradient */}
            <h1 className="text-4xl sm:text-6xl lg:text-[64px] font-extrabold text-charcoal tracking-tight leading-[1.05]">
              Your Stay.{" "}
              <span className="bg-gradient-to-r from-purple-600 via-primary-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-xs">
                Your Way.
              </span>
            </h1>

            {/* Glassmorphism Food & Freedom Pill */}
            <div className="inline-flex flex-wrap items-center gap-2.5 px-4 py-2.5 bg-gradient-to-r from-purple-50/90 via-white to-purple-50/60 border border-purple-200/80 rounded-2xl text-xs sm:text-sm font-semibold shadow-xs backdrop-blur-sm">
              <div className="w-6 h-6 rounded-lg bg-primary text-white flex items-center justify-center shadow-2xs shrink-0">
                <Utensils className="w-3.5 h-3.5" />
              </div>
              <span className="text-charcoal font-bold">
                Make your own food or take a subscription
              </span>
              <span className="hidden sm:inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                0% Brokerage
              </span>
            </div>

            {/* Search Bar Component */}
            <div className="pt-1">
              <SearchHeroBar />
            </div>
          </div>

          {/* Right Column: Visual Card with Metallic Chrome Frame & Ambient Glow */}
          <div className="lg:col-span-5 relative">
            {/* Ambient Violet Glow behind card */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-purple-600/30 to-indigo-600/30 rounded-[34px] blur-xl opacity-70 -z-10" />

            <div className="relative rounded-[28px] sm:rounded-[34px] overflow-hidden bg-gradient-to-br from-white via-purple-50/60 to-purple-100/50 p-2.5 sm:p-3 shadow-2xl border border-purple-200/70">
              <div className="relative h-[280px] sm:h-[360px] lg:h-[450px] rounded-[20px] sm:rounded-[26px] overflow-hidden bg-purple-100">
                <Image
                  src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1000&q=80"
                  alt="Young roommates relaxing happily together in modern co-living space"
                  fill
                  priority
                  className="object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />

                {/* Floating Top-Left Hub Badge */}
                <div className="absolute top-3.5 left-3.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white tracking-wide border border-white/20">
                  📍 Kochi • TVM • Calicut
                </div>

                {/* Floating Top-Right Rating Badge */}
                <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-white/80 flex items-center gap-1.5 text-xs font-bold text-charcoal">
                  <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                  <span>4.8 / 5.0</span>
                  <span className="text-[10px] text-charcoal-muted font-normal">
                    (2,400+ Verified)
                  </span>
                </div>

                {/* Floating Bottom Trust Strip */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-white/90 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-xs">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-extrabold text-xs text-charcoal block">
                        100% Zero Brokerage
                      </span>
                      <span className="text-[10px] text-charcoal-muted">
                        Direct manager contact & instant pricing
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-primary bg-primary-50 px-2.5 py-1 rounded-lg border border-primary/20 shrink-0">
                    Verified ✓
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MAJOR ACADEMIC & IT HUBS GRID ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border pb-2">
          <div>
            <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-charcoal">
              Top Student & Tech Clusters
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-muted">
              Browse verified accommodation directly mapped around top universities and IT corridors.
            </p>
          </div>
          <Link
            href="/search"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1 py-1 -my-1 self-start sm:self-auto shrink-0"
          >
            All Districts <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularHubs.map((hub, idx) => {
            const Icon = hub.icon;
            return (
              <Link key={idx} href={`/search?city=${hub.slug}`}>
                <Card
                  hoverEffect
                  padding="md"
                  className="flex items-start justify-between gap-3 h-full group border-surface-border rounded-2xl bg-white hover:border-primary"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-3 bg-primary-100 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-extrabold text-primary tracking-wider">
                        {hub.tag}
                      </span>
                      <h3 className="font-heading font-bold text-sm text-charcoal group-hover:text-primary transition-colors">
                        {hub.name}
                      </h3>
                      <p className="text-xs text-charcoal-muted mt-0.5">{hub.district}</p>
                      <span className="inline-block mt-2 text-[11px] font-bold text-primary">
                        {hub.count} →
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ================= FEATURED VERIFIED HOSTELS SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border pb-2">
          <div>
            <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-charcoal">
              Featured Verified Properties
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-muted">
              Verified by resident audits for cleanliness, safety, power backup, and food quality.
            </p>
          </div>
          <Link
            href="/search"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1 py-1 -my-1 self-start sm:self-auto shrink-0"
          >
            View All ({popularHubs.length * 8}) Listings <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-4">
          <HostelCard
            id="hostel-kakkanad-1"
            name="Green Valley Executive PG for Men"
            hostelType="boys"
            locality="Kakkanad (Near Phase 1 Gate)"
            city="Kochi, Ernakulam"
            distanceInfo="350m to Infopark Main Gate"
            coverImage="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=700&q=80"
            startingPrice={4800}
            sharingPrices={[
              { type: "Single (AC)", price: 9500, available: true },
              { type: "2-Sharing", price: 6800, available: true },
              { type: "3-Sharing", price: 5400, available: true },
              { type: "4-Sharing", price: 4800, available: false },
            ]}
            avgRating={4.8}
            totalReviews={42}
            isVerified={true}
            foodIncluded={true}
            foodType="3-time Homestyle Meals Included (Non-Veg 3x/week)"
            curfew="No Curfew (Biometric entry for shift employees)"
            hasAC={true}
            hasWifi={true}
          />

          <HostelCard
            id="hostel-cusat-2"
            name="Ahalya Heritage Ladies Hostel"
            hostelType="girls"
            locality="Kalamassery (CUSAT Campus Area)"
            city="Kochi, Ernakulam"
            distanceInfo="200m to CUSAT Engineering Block"
            coverImage="https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=700&q=80"
            startingPrice={4200}
            sharingPrices={[
              { type: "Single (AC)", price: 8500, available: false },
              { type: "2-Sharing", price: 6000, available: true },
              { type: "3-Sharing", price: 4800, available: true },
              { type: "4-Sharing", price: 4200, available: true },
            ]}
            avgRating={4.9}
            totalReviews={56}
            isVerified={true}
            foodIncluded={true}
            foodType="Homestyle Kerala Meals with Vegetarian & Fish options"
            curfew="Gate closes 9:30 PM (Biometric security)"
            hasAC={true}
            hasWifi={true}
          />

          <HostelCard
            id="hostel-kazhakkoottam-3"
            name="TechnoNest Luxury Co-Living PG"
            hostelType="co-ed"
            locality="Kazhakkoottam"
            city="Trivandrum"
            distanceInfo="500m to Technopark Phase 3 Gate"
            coverImage="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=700&q=80"
            startingPrice={6500}
            sharingPrices={[
              { type: "Studio Suite", price: 14000, available: true },
              { type: "Single (AC)", price: 10500, available: true },
              { type: "2-Sharing", price: 7500, available: true },
              { type: "3-Sharing", price: 6500, available: true },
            ]}
            avgRating={4.7}
            totalReviews={38}
            isVerified={true}
            foodIncluded={false}
            foodType="Self-cooking Kitchen with induction + optional tiffin delivery"
            curfew="24/7 Access (Smart card locks)"
            hasAC={true}
            hasWifi={true}
          />
        </div>
      </section>
    </div>
  );
}
