"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  MapPin,
  Utensils,
  Wifi,
  Phone,
  Search,
  Check,
  Copy,
  Layers,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  Calendar,
  Building,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import HostelCard from "@/components/hostel/HostelCard";

export default function StyleGuidePage() {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<"all" | "boys" | "girls" | "co-ed">("boys");

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(label);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const colorTokens = [
    {
      group: "Brand Blue Scale (colors.primary)",
      desc: "One hue for the whole product — primary actions, links, ratings, and status badges all draw from this single blue scale",
      swatches: [
        { name: "50", hex: "#EFF6FF", cssClass: "bg-primary-50", textClass: "text-primary" },
        { name: "100", hex: "#DBEAFE", cssClass: "bg-primary-100", textClass: "text-primary" },
        { name: "300", hex: "#93C5FD", cssClass: "bg-primary-300", textClass: "text-primary-900" },
        { name: "500 (light)", hex: "#3B82F6", cssClass: "bg-primary-500", textClass: "text-white" },
        { name: "600 (DEFAULT)", hex: "#2563EB", cssClass: "bg-primary", textClass: "text-white" },
        { name: "700 (dark)", hex: "#1D4ED8", cssClass: "bg-primary-700", textClass: "text-white" },
        { name: "800", hex: "#1E40AF", cssClass: "bg-primary-800", textClass: "text-white" },
        { name: "900", hex: "#1E3A8A", cssClass: "bg-primary-900", textClass: "text-white" },
      ],
    },
    {
      group: "Surface & Backgrounds (colors.surface)",
      desc: "Clean modern slate-50 background and crisp white cards with subtle borders",
      swatches: [
        { name: "DEFAULT (Page BG)", hex: "#F8FAFC", cssClass: "bg-surface", textClass: "text-charcoal" },
        { name: "card (Solid White)", hex: "#FFFFFF", cssClass: "bg-white", textClass: "text-charcoal" },
        { name: "muted (Sub-surface)", hex: "#F1F5F9", cssClass: "bg-surface-muted", textClass: "text-charcoal" },
        { name: "border (Divider)", hex: "#E2E8F0", cssClass: "bg-surface-border", textClass: "text-charcoal" },
        { name: "border-strong", hex: "#CBD5E1", cssClass: "bg-surface-border-strong", textClass: "text-charcoal" },
      ],
    },
    {
      group: "Charcoal Slate (colors.charcoal)",
      desc: "High-contrast slate charcoal typography scale",
      swatches: [
        { name: "DEFAULT (Heading)", hex: "#0F172A", cssClass: "bg-charcoal", textClass: "text-white" },
        { name: "muted (Body / Secondary)", hex: "#64748B", cssClass: "bg-charcoal-muted", textClass: "text-white" },
        { name: "subtle (Muted Icons)", hex: "#94A3B8", cssClass: "bg-charcoal-subtle", textClass: "text-white" },
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-12 bg-surface">
      {/* Header & Style Guide Introduction */}
      <div className="bg-white border border-surface-border rounded-[10px] p-4 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 border border-primary/20 rounded-[4px] text-xs font-bold text-primary mb-3">
            Hostel Booker • Single-Hue Blue Theme & Design Tokens v3.0
          </div>
          <h1 className="font-heading text-xl sm:text-4xl font-extrabold text-charcoal tracking-tight">
            Design System & Living Style Guide
          </h1>
          <p className="text-sm sm:text-base text-charcoal-muted max-w-3xl mt-2 leading-relaxed">
            A focused, mobile-first hostel &amp; co-living design system. One brand blue drives every action and status
            indicator, paired with slate charcoal typography and dense info cards.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100 text-xs">
            <div>
              <span className="text-charcoal-muted block font-bold">Heading Font</span>
              <span className="font-heading font-extrabold text-charcoal text-sm">Work Sans / System Bold</span>
            </div>
            <div>
              <span className="text-charcoal-muted block font-bold">Body Font</span>
              <span className="font-body text-charcoal text-sm">Work Sans</span>
            </div>
            <div>
              <span className="text-charcoal-muted block font-bold">Border Radius</span>
              <span className="font-mono text-charcoal text-sm">6px / 8px / 10px</span>
            </div>
            <div>
              <span className="text-charcoal-muted block font-bold">Primary Brand</span>
              <span className="font-mono text-primary font-bold text-sm">#2563EB (Blue)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Color Palette Tokens */}
      <section className="space-y-6">
        <div className="border-b border-surface-border pb-2">
          <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-charcoal">
            1. Color Tokens & Brand System
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-muted">
            Click any swatch to copy its hex token directly into clipboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {colorTokens.map((group, idx) => (
            <Card key={idx} padding="md" className="space-y-3 border-surface-border rounded-[8px]">
              <div>
                <h3 className="font-heading font-bold text-sm text-charcoal">
                  {group.group}
                </h3>
                <p className="text-xs text-charcoal-muted mt-0.5">{group.desc}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                {group.swatches.map((swatch, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => copyToClipboard(swatch.hex, `${group.group}-${swatch.name}`)}
                    className="flex flex-col text-left group cursor-pointer"
                  >
                    <div
                      className={`h-16 rounded-[6px] border border-black/10 flex items-end p-2 transition-transform group-hover:scale-102 ${swatch.cssClass}`}
                    >
                      <span className={`text-[10px] font-mono font-bold ${swatch.textClass}`}>
                        {swatch.hex}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-charcoal mt-1">
                      {swatch.name}
                    </span>
                    <span className="text-[10px] text-charcoal-muted font-mono">
                      {copiedToken === `${group.group}-${swatch.name}` ? "Copied!" : "Click to copy"}
                    </span>
                  </button>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 2. Buttons & Interactive States */}
      <section className="space-y-6">
        <div className="border-b border-surface-border pb-2">
          <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-charcoal">
            2. Buttons & Interactive Controls
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-muted">
            Solid fills with rounded corners and high-tactility active scale states.
          </p>
        </div>

        <Card padding="lg" className="space-y-6 border-surface-border rounded-[8px]">
          <div className="space-y-2">
            <h3 className="text-xs uppercase font-bold text-charcoal-muted tracking-wider">
              Button Variants (Active & Hover Supported)
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" size="md">
                Primary
              </Button>
              <Button variant="outline" size="md">
                Outline Standard
              </Button>
              <Button variant="ghost" size="md">
                Ghost Action
              </Button>
              <Button variant="danger" size="md">
                Danger Action
              </Button>
              <Button variant="primary" size="md" isLoading>
                Loading
              </Button>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-100">
            <h3 className="text-xs uppercase font-bold text-charcoal-muted tracking-wider">
              Button Sizes & Touch Targets
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" size="sm">
                Small (sm)
              </Button>
              <Button variant="primary" size="md">
                Medium (md - 44px)
              </Button>
              <Button variant="primary" size="lg">
                Large (lg - 48px)
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* 3. Badges & Tags */}
      <section className="space-y-6">
        <div className="border-b border-surface-border pb-2">
          <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-charcoal">
            3. Badges & Property Tags
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-muted">
            Status and category indicators.
          </p>
        </div>

        <Card padding="lg" className="space-y-4 border-surface-border rounded-[8px]">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary">Men&apos;s / Boys PG</Badge>
            <Badge variant="outline">Ladies / Girls PG</Badge>
            <Badge variant="neutral">Co-Living Space</Badge>
            <Badge variant="success">8 Beds Available</Badge>
            <Badge variant="danger">Fully Booked</Badge>
            <Badge variant="warning">Pending Audit</Badge>
            <Badge variant="neutral">AC Room</Badge>
            <Badge variant="outline">Wi-Fi 100 Mbps</Badge>
          </div>
        </Card>
      </section>

      {/* 4. Complete Property Card Demonstration */}
      <section className="space-y-6">
        <div className="border-b border-surface-border pb-2">
          <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-charcoal">
            4. Live Property Card Component
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-muted">
            Dense, information-rich card with sharing pricing breakdown and zero brokerage indicators.
          </p>
        </div>

        <HostelCard
          id="hostel-style-demo"
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
      </section>
    </div>
  );
}
