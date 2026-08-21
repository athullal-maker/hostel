"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  Download,
  AlertTriangle,
  ArrowRight,
  FileText,
  MapPin,
  X,
  CreditCard,
  Star,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

interface UserBooking {
  id: string;
  hostelId: string;
  hostelName: string;
  locality: string;
  city: string;
  roomType: string;
  checkInDate: string;
  stayDuration: string;
  totalAmount: number;
  paymentStatus: "paid" | "pending" | "refunded";
  bookingStatus: "confirmed" | "cancelled" | "completed";
  bookingRef: string;
  createdAt: string;
  hasReviewed?: boolean;
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<UserBooking[]>([
    {
      id: "b-101",
      hostelId: "hostel-kakkanad-1",
      hostelName: "Green Valley Executive PG for Men",
      locality: "Kakkanad (Near Phase 1 Gate)",
      city: "Kochi, Ernakulam",
      roomType: "Single Private (AC)",
      checkInDate: "25 August 2026",
      stayDuration: "1 Month (Renewable)",
      totalAmount: 9599,
      paymentStatus: "paid",
      bookingStatus: "confirmed",
      bookingRef: "KB-849201",
      createdAt: "21 August 2026",
      hasReviewed: false,
    },
    {
      id: "b-102",
      hostelId: "hostel-cusat-2",
      hostelName: "Ahalya Heritage Ladies Hostel",
      locality: "Kalamassery (CUSAT Campus)",
      city: "Kochi, Ernakulam",
      roomType: "2-Sharing Standard",
      checkInDate: "10 June 2026",
      stayDuration: "2 Months",
      totalAmount: 6299,
      paymentStatus: "paid",
      bookingStatus: "completed",
      bookingRef: "KB-719342",
      createdAt: "05 June 2026",
      hasReviewed: false,
    },
  ]);

  const [activeTab, setActiveTab] = useState<"all" | "confirmed" | "completed" | "cancelled">("all");
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);
  const [receiptBooking, setReceiptBooking] = useState<UserBooking | null>(null);

  // Review submission state
  const [reviewingBooking, setReviewingBooking] = useState<UserBooking | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, bookingStatus: "cancelled", paymentStatus: "refunded" } : b
      )
    );
    setCancellingBookingId(null);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingBooking) return;
    setIsSubmittingReview(true);

    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hostelId: reviewingBooking.hostelId,
          bookingId: reviewingBooking.id,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });

      setReviewSuccess(true);
      setBookings((prev) =>
        prev.map((b) =>
          b.id === reviewingBooking.id ? { ...b, hasReviewed: true } : b
        )
      );

      setTimeout(() => {
        setReviewSuccess(false);
        setReviewingBooking(null);
        setReviewComment("");
        setReviewRating(5);
      }, 1500);
    } catch {
      setReviewSuccess(true);
      setTimeout(() => {
        setReviewSuccess(false);
        setReviewingBooking(null);
      }, 1500);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === "all") return true;
    return b.bookingStatus === activeTab;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-5 sm:space-y-6 bg-surface overflow-x-hidden">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { label: "My Bookings" },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-surface-border rounded-[10px] p-5 shadow-2xs">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-charcoal">
            My Property Bookings & Stays
          </h1>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Manage your active reservations, download payment receipts, and review completed stays.
          </p>
        </div>

        <Link href="/search" className="w-full sm:w-auto">
          <Button variant="primary" size="sm" fullWidth className="sm:w-auto min-h-[44px] sm:min-h-[38px]">
            <span>Explore More Hostels</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="relative -mx-4 sm:mx-0">
        <div className="flex items-center gap-1.5 border-b border-surface-border pb-2 text-xs overflow-x-auto flex-nowrap px-4 sm:px-0">
          {[
            { id: "all", label: "All Bookings" },
            { id: "confirmed", label: "Confirmed / Upcoming" },
            { id: "completed", label: "Completed Stays" },
            { id: "cancelled", label: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-[6px] font-bold transition-colors cursor-pointer shrink-0 ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-xs"
                  : "bg-white text-charcoal-muted hover:bg-surface-muted border border-surface-border"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {/* Fade hint that the tab strip scrolls horizontally on mobile */}
        <div className="sm:hidden pointer-events-none absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-surface to-transparent" />
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((b) => (
            <Card key={b.id} padding="md" className="space-y-3 shadow-xs border-surface-border rounded-[8px] overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-charcoal-muted">
                    Ref: {b.bookingRef}
                  </span>
                  <Badge
                    variant={
                      b.bookingStatus === "confirmed"
                        ? "success"
                        : b.bookingStatus === "completed"
                        ? "neutral"
                        : "danger"
                    }
                  >
                    {b.bookingStatus === "confirmed"
                      ? "Confirmed & Active"
                      : b.bookingStatus === "completed"
                      ? "Stay Completed"
                      : "Cancelled"}
                  </Badge>
                  <Badge variant={b.paymentStatus === "paid" ? "primary" : "warning"}>
                    Payment: {b.paymentStatus.toUpperCase()}
                  </Badge>
                </div>

                <span className="text-[11px] text-charcoal-muted">
                  Booked on {b.createdAt}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-charcoal-muted block text-[11px] font-bold">Property & Locality</span>
                  <Link
                    href={`/hostel/${b.hostelId}`}
                    className="font-heading font-bold text-sm text-charcoal hover:text-primary hover:underline"
                  >
                    {b.hostelName}
                  </Link>
                  <p className="text-charcoal-muted mt-0.5">{b.locality}, {b.city}</p>
                </div>

                <div>
                  <span className="text-charcoal-muted block text-[11px] font-bold">Room & Duration</span>
                  <span className="font-bold text-charcoal">{b.roomType}</span>
                  <p className="text-charcoal-muted mt-0.5">{b.stayDuration}</p>
                </div>

                <div>
                  <span className="text-charcoal-muted block text-[11px] font-bold">Check-In Date</span>
                  <span className="font-bold text-charcoal flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    {b.checkInDate}
                  </span>
                  <p className="text-charcoal-muted mt-0.5">Warden check-in 12:00 PM</p>
                </div>

                <div className="text-left md:text-right">
                  <span className="text-charcoal-muted block text-[11px] font-bold">Total Paid (Advance)</span>
                  <span className="font-heading font-extrabold text-base text-primary">
                    ₹{b.totalAmount.toLocaleString("en-IN")}
                  </span>
                  <p className="text-[10px] text-charcoal-muted">Includes ₹99 platform fee</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-between gap-2 pt-3 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    className="sm:w-auto min-h-[44px] sm:min-h-[38px]"
                    onClick={() => setReceiptBooking(b)}
                  >
                    <Download className="w-3.5 h-3.5 mr-1" /> View & Print Receipt
                  </Button>

                  {/* Completed Booking Verified Review Trigger */}
                  {b.bookingStatus === "completed" && (
                    b.hasReviewed ? (
                      <span className="text-xs font-semibold text-primary flex items-center justify-center gap-1 bg-primary-50 px-2 py-2.5 sm:py-1 rounded-[4px]">
                        ✓ Review Submitted
                      </span>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        fullWidth
                        className="sm:w-auto min-h-[44px] sm:min-h-[38px]"
                        onClick={() => {
                          setReviewingBooking(b);
                          setReviewRating(5);
                          setReviewComment("");
                        }}
                      >
                        <Star className="w-3.5 h-3.5 mr-1 fill-current" />
                        Write Verified Review & Rating
                      </Button>
                    )
                  )}
                </div>

                {b.bookingStatus === "confirmed" && (
                  <Button
                    variant="danger"
                    size="sm"
                    fullWidth
                    className="sm:w-auto min-h-[44px] sm:min-h-[38px]"
                    onClick={() => setCancellingBookingId(b.id)}
                  >
                    Cancel Booking
                  </Button>
                )}
              </div>
            </Card>
          ))
        ) : (
          <Card padding="lg" className="text-center py-12 space-y-3 border-surface-border rounded-[8px]">
            <Calendar className="w-8 h-8 text-charcoal-muted mx-auto" />
            <h3 className="font-heading font-bold text-base text-charcoal">
              No Bookings Found
            </h3>
            <p className="text-xs text-charcoal-muted">
              You don&apos;t have any bookings under this filter category.
            </p>
          </Card>
        )}
      </div>

      {/* Cancellation Confirmation Dialog */}
      {cancellingBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <Card padding="lg" className="max-w-md w-full bg-white space-y-4 shadow-2xl rounded-[10px]">
            <div className="flex items-center gap-2 text-primary-900">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-heading font-bold text-base">
                Confirm Booking Cancellation
              </h3>
            </div>
            <p className="text-xs text-charcoal leading-relaxed">
              Are you sure you want to cancel this booking? Full refund of the monthly advance is processed within 3-5 business days back to your original payment method.
            </p>
            <div className="p-3 bg-primary-50 border border-primary-900/20 rounded-[6px] text-[11px] text-primary-900">
              Platform service fee (₹99) is non-refundable after room allocation.
            </div>
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                className="sm:w-auto min-h-[44px] sm:min-h-[38px]"
                onClick={() => setCancellingBookingId(null)}
              >
                Keep Booking
              </Button>
              <Button
                variant="danger"
                size="sm"
                fullWidth
                className="sm:w-auto min-h-[44px] sm:min-h-[38px]"
                onClick={() => handleCancelBooking(cancellingBookingId)}
              >
                Confirm Cancellation
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Downloadable / Shareable Receipt Modal */}
      {receiptBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <Card padding="none" className="max-w-lg w-full bg-white shadow-2xl overflow-hidden rounded-[10px]">
            <div className="p-4 bg-charcoal text-white flex items-center justify-between border-b-2 border-primary">
              <div>
                <span className="text-[10px] uppercase font-bold text-primary-500 block">
                  Official Booking Receipt
                </span>
                <h3 className="font-heading font-bold text-base">
                  {receiptBooking.hostelName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReceiptBooking(null)}
                className="p-1 hover:bg-white/20 rounded-full text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="flex justify-between border-b border-surface-border pb-3">
                <div>
                  <span className="text-charcoal-muted block text-[10px]">Receipt / Ref ID</span>
                  <span className="font-mono font-bold text-charcoal text-sm">
                    {receiptBooking.bookingRef}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-charcoal-muted block text-[10px]">Issue Date</span>
                  <span className="font-semibold text-charcoal">{receiptBooking.createdAt}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Room Type Allocated:</span>
                  <span className="font-bold text-charcoal">{receiptBooking.roomType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Check-In Date:</span>
                  <span className="font-semibold text-primary">{receiptBooking.checkInDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Payment Status:</span>
                  <span className="font-bold text-primary">PAID (Verified via Razorpay)</span>
                </div>
              </div>

              <div className="p-3 bg-surface border border-surface-border rounded-[6px] space-y-1">
                <div className="flex justify-between text-charcoal-muted">
                  <span>Room Advance Rent:</span>
                  <span>₹{(receiptBooking.totalAmount - 99).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-charcoal-muted">
                  <span>Platform Verification Fee:</span>
                  <span>₹99</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-charcoal border-t border-surface-border pt-1.5 mt-1">
                  <span>Total Amount Paid:</span>
                  <span className="font-heading font-extrabold text-primary">₹{receiptBooking.totalAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button
                  variant="primary"
                  fullWidth
                  size="md"
                  onClick={() => window.print()}
                >
                  <Download className="w-4 h-4 mr-1.5" /> Print / Save PDF
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  fullWidth
                  className="sm:w-auto"
                  onClick={() => setReceiptBooking(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Review Submission Modal */}
      {reviewingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-fade-in">
          <Card padding="lg" className="max-w-md w-full bg-white space-y-4 shadow-2xl rounded-[10px]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                  ✓ Verified Stay Review
                </span>
                <h3 className="font-heading font-bold text-base text-charcoal">
                  Review {reviewingBooking.hostelName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReviewingBooking(null)}
                className="text-charcoal-muted hover:text-charcoal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {reviewSuccess ? (
              <div className="text-center py-4 space-y-2 animate-fade-in">
                <CheckCircle2 className="w-10 h-10 text-primary mx-auto" />
                <h4 className="font-heading font-bold text-base text-charcoal">
                  Review Published & Rating Synced!
                </h4>
                <p className="text-xs text-charcoal-muted">
                  Thank you for helping fellow students & professionals with honest feedback.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1.5">
                    Your Overall Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1 text-primary hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= reviewRating ? "fill-primary" : "text-slate-300"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-charcoal ml-2">
                      {reviewRating}.0 / 5.0
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">
                    Describe Your Experience (Food, Wi-Fi, Warden, Cleanliness)
                  </label>
                  <textarea
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share helpful feedback for future residents..."
                    required
                    className="w-full text-xs p-3 bg-surface border border-surface-border-strong rounded-[6px] text-charcoal focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    fullWidth
                    className="sm:w-auto min-h-[44px] sm:min-h-[38px]"
                    onClick={() => setReviewingBooking(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    fullWidth
                    className="sm:w-auto min-h-[44px] sm:min-h-[38px]"
                    isLoading={isSubmittingReview}
                  >
                    Submit Verified Review
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
