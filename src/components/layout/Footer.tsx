"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  Cookie,
} from "lucide-react";

export const Footer: React.FC = () => {
  const [cookieConsent, setCookieConsent] = useState(true);

  return (
    <footer className="bg-primary-50 text-charcoal border-t border-primary-200 mt-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-9 gap-8 lg:gap-6">
          {/* Column 1: Brand Wordmark & Corporate Office (4 cols on lg) */}
          <div className="lg:col-span-3 space-y-4">
            <Link href="/" className="inline-block">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-2xl sm:text-3xl text-charcoal tracking-tight">
                  Kerala<span className="text-primary">Hostels</span>
                </span>
                <span className="text-[11px] font-bold bg-primary-50 text-primary px-1.5 py-0.5 rounded border border-primary/20">
                  .in
                </span>
              </div>
            </Link>

            <div className="space-y-1 text-xs text-charcoal-muted leading-relaxed pt-2">
              <h5 className="font-heading font-bold text-sm text-charcoal">
                Corporate Office
              </h5>
              <p className="pt-1">
                Plot 42, Infopark Expressway, Kakkanad, Kochi, Kerala
              </p>
              <p>India - 682030</p>
            </div>
          </div>

          {/* Column 2: Product (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="font-heading font-bold text-base text-charcoal">
              Product
            </h5>
            <ul className="space-y-2 text-xs text-charcoal-muted">
              <li>
                <Link href="/search" className="hover:text-primary transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-primary transition-colors">
                  Scholar FAQs
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-primary transition-colors">
                  How it Works
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-primary font-bold text-primary transition-colors">
                  List Your Property
                </Link>
              </li>
              <li>
                <Link href="/style-guide" className="hover:text-primary transition-colors">
                  Resident Club
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-primary transition-colors">
                  Amenities
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-primary transition-colors">
                  Testimonials
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-3">
            <h5 className="font-heading font-bold text-base text-charcoal">
              Company
            </h5>
            <ul className="space-y-2 text-xs text-charcoal-muted">
              <li>
                <Link href="/search" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-primary transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-primary transition-colors">
                  T&C
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-primary transition-colors">
                  Disclaimers
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-primary transition-colors">
                  Sitemap
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-primary transition-colors">
                  Why Choose Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Us & Stay In Touch (2.5 cols on lg) */}
          <div className="lg:col-span-2 space-y-5">
            <div className="space-y-3">
              <h5 className="font-heading font-bold text-base text-charcoal">
                Contact Us
              </h5>
              <div className="space-y-2 text-xs text-charcoal-muted">
                <a
                  href="tel:+918884518010"
                  className="flex items-center gap-2 hover:text-primary font-medium transition-colors"
                >
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <span>+91 8884518010</span>
                </a>
                <a
                  href="mailto:info@keralahostels.in"
                  className="flex items-center gap-2 hover:text-primary font-medium transition-colors"
                >
                  <Mail className="w-4 h-4 text-primary shrink-0" />
                  <span>info@keralahostels.in</span>
                </a>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <h5 className="font-heading font-bold text-sm text-charcoal">
                Stay In Touch
              </h5>
              <div className="flex items-center gap-3 text-charcoal-muted">
                {/* Facebook SVG */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary transition-colors p-1"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                {/* YouTube SVG */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary transition-colors p-1"
                  aria-label="YouTube"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                {/* LinkedIn SVG */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary transition-colors p-1"
                  aria-label="LinkedIn"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                {/* Instagram SVG */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary transition-colors p-1"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Micro Copy & Copyright */}
        <div className="border-t border-primary-200 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal-muted gap-3">
          <p>© {new Date().getFullYear()} KeralaHostels.in • All Rights Reserved</p>
          <div className="flex gap-4 font-medium">
            <span className="hover:text-primary cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-primary cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-primary cursor-pointer">Zero Brokerage Guarantee</span>
          </div>
        </div>
      </div>

      {/* Floating Cookie Consent Pill — parked above the mobile bottom tab
          bar (via the safe-area-aware offset) and pinned bottom-left on
          desktop where there's no tab bar to clear. */}
      {cookieConsent && (
        <div className="fixed inset-x-4 bottom-[calc(var(--app-bottom-nav-height)+env(safe-area-inset-bottom)+12px)] sm:inset-x-auto sm:left-4 sm:bottom-4 z-40 bg-white/95 backdrop-blur-sm border border-surface-border-strong rounded-2xl shadow-xl px-4 py-2.5 flex items-center gap-3 text-xs text-charcoal animate-fade-in sm:max-w-sm">
          <Cookie className="w-4 h-4 text-primary shrink-0" />
          <span className="font-medium text-[11px]">
            This website uses cookies. <strong className="font-bold cursor-pointer underline">Learn more.</strong>
          </span>
          <button
            type="button"
            onClick={() => setCookieConsent(false)}
            className="bg-primary hover:bg-primary-700 text-white text-[11px] font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            Ok
          </button>
        </div>
      )}
    </footer>
  );
};

export default Footer;
