import React from "react";
import Link from "next/link";
import { Compass, Search, Home, MapPin, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10 sm:py-16 bg-surface">
      <Card
        padding="lg"
        className="max-w-lg w-full text-center space-y-6 border-2 border-surface-border bg-white shadow-md rounded-[10px]"
      >
        <div className="w-14 h-14 bg-primary-50 text-primary rounded-full flex items-center justify-center mx-auto border border-primary/20">
          <Compass className="w-7 h-7" />
        </div>

        <div>
          <span className="font-mono text-xs uppercase font-bold text-primary tracking-wider block">
            404 • Listing / Page Not Found
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-charcoal mt-1">
            Looking for Hostels & PGs?
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-2 leading-relaxed">
            The page or hostel listing you are looking for might have been relocated, unlisted, or the URL might be mistyped.
          </p>
        </div>

        {/* Popular Kerala Hub Quick Links */}
        <div className="p-4 bg-surface border border-surface-border rounded-[8px] text-xs text-left space-y-2">
          <span className="font-bold text-charcoal text-[11px] uppercase tracking-wider block">
            Popular Student & IT Hubs:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <Link
              href="/search?state=kerala&district=ernakulam&city=kakkanad"
              className="text-primary hover:underline flex items-center gap-1 font-bold"
            >
              <MapPin className="w-3 h-3 text-primary" /> Kakkanad Infopark
            </Link>
            <Link
              href="/search?state=kerala&district=ernakulam&city=kalamassery"
              className="text-primary hover:underline flex items-center gap-1 font-bold"
            >
              <MapPin className="w-3 h-3 text-primary" /> CUSAT Campus Area
            </Link>
            <Link
              href="/search?state=kerala&district=thiruvananthapuram&city=kazhakkoottam"
              className="text-primary hover:underline flex items-center gap-1 font-bold"
            >
              <MapPin className="w-3 h-3 text-primary" /> Technopark Phase 3
            </Link>
            <Link
              href="/search?state=kerala&district=kozhikode&city=chathamangalam-nit"
              className="text-primary hover:underline flex items-center gap-1 font-bold"
            >
              <MapPin className="w-3 h-3 text-primary" /> NIT Calicut Campus
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/search" className="w-full sm:w-auto">
            <Button variant="primary" fullWidth size="md">
              <Search className="w-4 h-4 mr-1.5" /> Browse All Properties
            </Button>
          </Link>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" fullWidth size="md">
              <Home className="w-4 h-4 mr-1.5" /> Return to Homepage
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
