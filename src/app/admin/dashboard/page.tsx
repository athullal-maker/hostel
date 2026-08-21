"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Bed,
  Users,
  PlusCircle,
  Clock,
  ShieldCheck,
  Edit,
  TrendingUp,
  MapPin,
  Calendar,
  AlertTriangle,
  FileText,
  Trash2,
  CheckCircle,
  XCircle,
  Utensils,
  Image as ImageIcon,
  Layers,
  Sparkles,
  Phone,
  Save,
  MessageSquare,
  Lock,
  Star,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "hostel" | "rooms" | "bookings" | "reviews"
  >("overview");

  // Hostel State
  const [hostelData, setHostelData] = useState({
    id: "hostel-kakkanad-1",
    name: "Green Valley Executive PG for Men",
    locality: "Kakkanad (Near Phase 1 Gate)",
    city: "Kochi, Ernakulam",
    fullAddress: "Plot 42, Infopark Expressway, Kakkanad, Kochi, Kerala 682030",
    status: "approved" as "approved" | "pending" | "rejected",
    totalCapacity: 54,
    checkInTime: "12:00 PM",
    checkOutTime: "11:00 AM",
    curfew: "No Curfew (Biometric Entry for Shift Employees)",
    foodType: "3-time Homestyle Meals Included (Non-Veg 3x/wk)",
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
    ],
  });

  // Room Inventory State
  const [rooms, setRooms] = useState([
    {
      id: "r1",
      type: "Single Private (AC)",
      capacity: 1,
      price: 9500,
      bedsAvailable: 1,
      amenities: "AC, Attached Bath, Balcony, Wardrobe",
    },
    {
      id: "r2",
      type: "2-Sharing Standard",
      capacity: 2,
      price: 6800,
      bedsAvailable: 3,
      amenities: "Attached Bath, Study Table, Balcony",
    },
    {
      id: "r3",
      type: "3-Sharing Economy",
      capacity: 3,
      price: 5400,
      bedsAvailable: 4,
      amenities: "Attached Bath, Ceiling Fan, Wi-Fi",
    },
    {
      id: "r4",
      type: "4-Sharing Student",
      capacity: 4,
      price: 4800,
      bedsAvailable: 0,
      amenities: "Shared Bath, Locker Cupboard",
    },
  ]);

  // Bookings State
  const [bookings, setBookings] = useState([
    {
      id: "bk-1",
      ref: "KB-849201",
      tenantName: "Sreehari Nair",
      phone: "+91 98470 12345",
      roomType: "Single Private (AC)",
      checkInDate: "25 Aug 2026",
      amount: 9599,
      status: "confirmed" as "confirmed" | "completed" | "cancelled",
    },
    {
      id: "bk-2",
      ref: "KB-849202",
      tenantName: "Arjun Varma",
      phone: "+91 94470 98765",
      roomType: "2-Sharing Standard",
      checkInDate: "01 Sep 2026",
      amount: 6899,
      status: "confirmed" as "confirmed" | "completed" | "cancelled",
    },
    {
      id: "bk-3",
      ref: "KB-719342",
      tenantName: "Deepak Menon",
      phone: "+91 98950 44321",
      roomType: "3-Sharing Economy",
      checkInDate: "10 Jun 2026",
      amount: 5499,
      status: "completed" as "confirmed" | "completed" | "cancelled",
    },
  ]);

  // Read-only Reviews State
  const [reviews] = useState([
    {
      id: "rv-1",
      author: "Rahul Krishnan",
      role: "Infopark Software Engineer",
      rating: 5,
      date: "12 Aug 2026",
      comment:
        "Excellent stay. Homestyle meals are very good. Fiber Wi-Fi is super fast for remote work shifts. Warden is very cooperative.",
    },
    {
      id: "rv-2",
      author: "Vishnu Prasad",
      role: "CUSAT Engineering Student",
      rating: 5,
      date: "28 Jul 2026",
      comment:
        "Walking distance to campus. Safe, clean, and power backup is very reliable during rains.",
    },
  ]);

  // Add Room modal form state
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [newRoom, setNewRoom] = useState({
    type: "",
    capacity: 2,
    price: 6000,
    bedsAvailable: 2,
    amenities: "",
  });

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoom.type) return;

    setRooms([
      ...rooms,
      {
        id: "r-" + Date.now(),
        type: newRoom.type,
        capacity: newRoom.capacity,
        price: newRoom.price,
        bedsAvailable: newRoom.bedsAvailable,
        amenities: newRoom.amenities,
      },
    ]);

    setNewRoom({
      type: "",
      capacity: 2,
      price: 6000,
      bedsAvailable: 2,
      amenities: "",
    });
    setIsAddingRoom(false);
  };

  const handleDeleteRoom = (roomId: string) => {
    if (confirm("Are you sure you want to delete this room type?")) {
      setRooms(rooms.filter((r) => r.id !== roomId));
    }
  };

  const handleBookingStatusChange = (
    bookingId: string,
    newStatus: "confirmed" | "completed" | "cancelled"
  ) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 bg-surface">
      {/* Admin Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { label: "Admin Portal" },
          { label: hostelData.name },
          { label: "Management Dashboard" },
        ]}
      />

      {/* Pending SuperAdmin Approval Warning Banner */}
      {hostelData.status === "pending" && (
        <div className="p-4 bg-primary-50 border-2 border-primary rounded-[8px] flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="text-xs text-primary-700">
            <span className="font-bold block text-sm">
              Your hostel is awaiting superadmin approval and won&apos;t appear in search yet.
            </span>
            Our field verification team will audit the property documents and premise safety before public listing.
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-surface-border rounded-[10px] p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-charcoal-muted">
              Hostel Admin Dashboard
            </span>
            <Badge variant={hostelData.status === "approved" ? "success" : "warning"}>
              {hostelData.status === "approved" ? "Live on Search" : "Pending Audit"}
            </Badge>
          </div>
          <h1 className="font-heading text-2xl font-extrabold text-charcoal mt-1">
            {hostelData.name}
          </h1>
          <p className="text-xs text-charcoal-muted flex items-center gap-1 mt-0.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            {hostelData.locality}, {hostelData.city}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <Link href={`/hostel/${hostelData.id}`} target="_blank" className="w-full sm:w-auto">
            <Button variant="outline" size="sm" fullWidth className="min-h-[44px] sm:min-h-0">
              View Public Page
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            fullWidth
            className="min-h-[44px] sm:min-h-0 sm:w-auto"
            onClick={() => {
              setActiveTab("rooms");
              setIsAddingRoom(true);
            }}
          >
            <PlusCircle className="w-3.5 h-3.5 mr-1" />
            Add Room
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1.5 border-b border-surface-border pb-2 text-xs overflow-x-auto flex-nowrap [-webkit-overflow-scrolling:touch]">
        {[
          { id: "overview", label: "Overview Metrics" },
          { id: "hostel", label: "My Property Profile" },
          { id: "rooms", label: "Rooms & Pricing" },
          { id: "bookings", label: "Tenant Bookings" },
          { id: "reviews", label: "Tenant Reviews" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-[6px] font-bold transition-colors cursor-pointer shrink-0 ${
              activeTab === tab.id
                ? "bg-primary text-white shadow-xs"
                : "bg-white text-charcoal-muted hover:bg-surface-muted border border-surface-border"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ================= 1. OVERVIEW TAB ================= */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card padding="md" className="space-y-1 border-surface-border rounded-[8px]">
              <div className="flex items-center justify-between text-charcoal-muted text-xs font-bold">
                <span>Current Occupancy</span>
                <Bed className="w-4 h-4 text-primary" />
              </div>
              <p className="text-2xl font-extrabold text-charcoal font-heading">
                85%
              </p>
              <p className="text-[11px] text-primary font-bold">
                46 of {hostelData.totalCapacity} beds filled
              </p>
            </Card>

            <Card padding="md" className="space-y-1 border-surface-border rounded-[8px]">
              <div className="flex items-center justify-between text-charcoal-muted text-xs font-bold">
                <span>Bookings This Month</span>
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <p className="text-2xl font-extrabold text-primary font-heading">
                {bookings.length}
              </p>
              <p className="text-[11px] text-charcoal-muted">New advance bookings</p>
            </Card>

            <Card padding="md" className="space-y-1 border-surface-border rounded-[8px]">
              <div className="flex items-center justify-between text-charcoal-muted text-xs font-bold">
                <span>Monthly Rent Collection</span>
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <p className="text-2xl font-extrabold text-primary font-heading">
                ₹2,48,000
              </p>
              <p className="text-[11px] text-charcoal-muted">0% brokerage deducted</p>
            </Card>

            <Card padding="md" className="space-y-1 border-surface-border rounded-[8px]">
              <div className="flex items-center justify-between text-charcoal-muted text-xs font-bold">
                <span>Listing Status</span>
                <ShieldCheck className="w-4 h-4 text-primary" />
              </div>
              <p className="text-2xl font-extrabold text-primary font-heading">
                Live
              </p>
              <p className="text-[11px] text-charcoal-muted">Verified Property</p>
            </Card>
          </div>

          {/* Quick Bookings Action Table */}
          <Card padding="none" className="overflow-hidden border-surface-border rounded-[8px]">
            <div className="p-4 bg-surface border-b border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="font-heading font-bold text-base text-charcoal">
                Recent Inquiries & Bookings
              </h3>
              <button
                type="button"
                onClick={() => setActiveTab("bookings")}
                className="text-xs text-primary font-bold hover:underline self-start sm:self-auto"
              >
                View All Bookings →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-muted text-charcoal-muted border-b border-surface-border">
                  <tr>
                    <th className="py-2.5 px-4 font-bold">Tenant Name</th>
                    <th className="py-2.5 px-4 font-bold hidden sm:table-cell">Room Type</th>
                    <th className="py-2.5 px-4 font-bold hidden md:table-cell">Check-In</th>
                    <th className="py-2.5 px-4 font-bold">Amount</th>
                    <th className="py-2.5 px-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border text-charcoal">
                  {bookings.map((b) => (
                    <tr key={b.id}>
                      <td className="py-3 px-4 font-semibold">{b.tenantName}</td>
                      <td className="py-3 px-4 hidden sm:table-cell">{b.roomType}</td>
                      <td className="py-3 px-4 hidden md:table-cell">{b.checkInDate}</td>
                      <td className="py-3 px-4 font-extrabold text-primary">
                        ₹{b.amount.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="success">{b.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ================= 2. MY HOSTEL PROFILE TAB ================= */}
      {activeTab === "hostel" && (
        <Card padding="lg" className="space-y-6 border-surface-border rounded-[8px]">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-heading font-bold text-lg text-charcoal">
              Edit Property Details & Facilities
            </h2>
            <p className="text-xs text-charcoal-muted">
              Keep your hostel descriptions, food meal plan, and house rules up to date.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Hostel details updated successfully!");
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Hostel Name"
                value={hostelData.name}
                onChange={(e) =>
                  setHostelData({ ...hostelData, name: e.target.value })
                }
                required
              />

              <Input
                label="Locality / Landmark"
                value={hostelData.locality}
                onChange={(e) =>
                  setHostelData({ ...hostelData, locality: e.target.value })
                }
                required
              />
            </div>

            <Input
              label="Full Postal Address"
              value={hostelData.fullAddress}
              onChange={(e) =>
                setHostelData({ ...hostelData, fullAddress: e.target.value })
              }
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Gate Curfew Policy"
                value={hostelData.curfew}
                onChange={(e) =>
                  setHostelData({ ...hostelData, curfew: e.target.value })
                }
              />

              <Input
                label="Check-In Time"
                value={hostelData.checkInTime}
                onChange={(e) =>
                  setHostelData({ ...hostelData, checkInTime: e.target.value })
                }
              />

              <Input
                label="Check-Out Time"
                value={hostelData.checkOutTime}
                onChange={(e) =>
                  setHostelData({ ...hostelData, checkOutTime: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal mb-1">
                Homestyle Meal Plan Description
              </label>
              <textarea
                value={hostelData.foodType}
                onChange={(e) =>
                  setHostelData({ ...hostelData, foodType: e.target.value })
                }
                rows={2}
                className="w-full bg-white text-xs text-charcoal p-3 border border-surface-border-strong rounded-[6px] focus:outline-none focus:border-primary"
              />
            </div>

            <Button type="submit" variant="primary" size="md">
              <Save className="w-4 h-4 mr-1.5" />
              Save Property Profile
            </Button>
          </form>
        </Card>
      )}

      {/* ================= 3. ROOMS & INVENTORY TAB ================= */}
      {activeTab === "rooms" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-surface-border rounded-[8px] p-4">
            <div>
              <h2 className="font-heading font-bold text-base text-charcoal">
                Room Types & Sharing Rates
              </h2>
              <p className="text-xs text-charcoal-muted">
                Manage sharing capacity, monthly rental rates, and live bed availability
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              fullWidth
              className="min-h-[44px] sm:w-auto sm:min-h-0"
              onClick={() => setIsAddingRoom(!isAddingRoom)}
            >
              <PlusCircle className="w-3.5 h-3.5 mr-1" />
              {isAddingRoom ? "Cancel" : "Add Room Type"}
            </Button>
          </div>

          {/* Add Room Form */}
          {isAddingRoom && (
            <Card padding="md" className="space-y-4 border-primary/30 bg-primary-50/20 rounded-[8px]">
              <h3 className="font-heading font-bold text-sm text-primary">
                Add New Room Sharing Tier
              </h3>
              <form onSubmit={handleAddRoom} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <Input
                    label="Room Type Name"
                    placeholder="e.g. 2-Sharing Deluxe (AC)"
                    value={newRoom.type}
                    onChange={(e) =>
                      setNewRoom({ ...newRoom, type: e.target.value })
                    }
                    required
                  />

                  <Input
                    label="Sharing Capacity (Persons)"
                    type="number"
                    min={1}
                    max={10}
                    value={newRoom.capacity}
                    onChange={(e) =>
                      setNewRoom({
                        ...newRoom,
                        capacity: Number(e.target.value),
                      })
                    }
                    required
                  />

                  <Input
                    label="Monthly Rent per Bed (₹)"
                    type="number"
                    min={1000}
                    value={newRoom.price}
                    onChange={(e) =>
                      setNewRoom({ ...newRoom, price: Number(e.target.value) })
                    }
                    required
                  />

                  <Input
                    label="Beds Available Now"
                    type="number"
                    min={0}
                    value={newRoom.bedsAvailable}
                    onChange={(e) =>
                      setNewRoom({
                        ...newRoom,
                        bedsAvailable: Number(e.target.value),
                      })
                    }
                    required
                  />
                </div>

                <Input
                  label="Amenities"
                  placeholder="e.g. AC, Attached Bath, Balcony, Wi-Fi"
                  value={newRoom.amenities}
                  onChange={(e) =>
                    setNewRoom({ ...newRoom, amenities: e.target.value })
                  }
                />

                <Button type="submit" variant="primary" size="sm">
                  Save New Room Type
                </Button>
              </form>
            </Card>
          )}

          {/* Rooms: Desktop Table + Mobile Stacked Cards */}
          <Card padding="none" className="overflow-hidden border-surface-border rounded-[8px]">
            {/* Desktop View Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-muted text-charcoal-muted border-b border-surface-border">
                  <tr>
                    <th className="py-3 px-4 font-bold">Room Type</th>
                    <th className="py-3 px-4 font-bold">Capacity</th>
                    <th className="py-3 px-4 font-bold">Monthly Price per Bed</th>
                    <th className="py-3 px-4 font-bold">Beds Available</th>
                    <th className="py-3 px-4 font-bold">Amenities</th>
                    <th className="py-3 px-4 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border text-charcoal">
                  {rooms.map((r) => (
                    <tr key={r.id}>
                      <td className="py-3 px-4 font-bold">{r.type}</td>
                      <td className="py-3 px-4">{r.capacity} Person(s)</td>
                      <td className="py-3 px-4 font-extrabold text-primary">
                        ₹{r.price.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-4">
                        {r.bedsAvailable > 0 ? (
                          <Badge variant="success">{r.bedsAvailable} Beds Open</Badge>
                        ) : (
                          <Badge variant="danger">Full (0 Beds)</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-charcoal-muted">{r.amenities}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteRoom(r.id)}
                          className="text-primary-900 hover:text-primary-800 p-2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center cursor-pointer"
                          title="Delete room type"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View: Stacked Room Cards */}
            <div className="md:hidden divide-y divide-surface-border">
              {rooms.map((r) => (
                <div key={r.id} className="p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-bold text-sm text-charcoal block">{r.type}</span>
                      <span className="text-xs text-charcoal-muted">{r.capacity} Person(s) Sharing</span>
                    </div>
                    <span className="font-heading font-extrabold text-base text-primary">
                      ₹{r.price.toLocaleString("en-IN")}/mo
                    </span>
                  </div>

                  <p className="text-xs text-charcoal-muted">{r.amenities}</p>

                  <div className="flex items-center justify-between pt-1">
                    {r.bedsAvailable > 0 ? (
                      <Badge variant="success">{r.bedsAvailable} Beds Open</Badge>
                    ) : (
                      <Badge variant="danger">Full</Badge>
                    )}

                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteRoom(r.id)}
                      className="min-h-[44px]"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ================= 4. BOOKINGS TAB ================= */}
      {activeTab === "bookings" && (
        <Card padding="none" className="overflow-hidden border-surface-border rounded-[8px]">
          <div className="p-4 bg-surface border-b border-surface-border flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-base text-charcoal">
                Tenant Bookings & Inquiries
              </h2>
              <p className="text-xs text-charcoal-muted">
                Direct booking records received via Razorpay
              </p>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-muted text-charcoal-muted border-b border-surface-border">
                <tr>
                  <th className="py-3 px-4 font-bold">Booking Ref</th>
                  <th className="py-3 px-4 font-bold">Tenant Name & Contact</th>
                  <th className="py-3 px-4 font-bold">Room Type</th>
                  <th className="py-3 px-4 font-bold">Check-In Date</th>
                  <th className="py-3 px-4 font-bold">Advance Paid</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border text-charcoal">
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td className="py-3 px-4 font-mono font-bold">{b.ref}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold block">{b.tenantName}</span>
                      <span className="text-[11px] text-charcoal-muted">{b.phone}</span>
                    </td>
                    <td className="py-3 px-4">{b.roomType}</td>
                    <td className="py-3 px-4">{b.checkInDate}</td>
                    <td className="py-3 px-4 font-extrabold text-primary">
                      ₹{b.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          b.status === "confirmed"
                            ? "success"
                            : b.status === "completed"
                            ? "neutral"
                            : "danger"
                        }
                      >
                        {b.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      {b.status === "confirmed" && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleBookingStatusChange(b.id, "completed")}
                            className="text-xs font-bold text-primary hover:underline p-2 min-h-[44px]"
                          >
                            Mark Checked-In
                          </button>
                          <span className="text-slate-300">|</span>
                          <button
                            type="button"
                            onClick={() => handleBookingStatusChange(b.id, "cancelled")}
                            className="text-xs font-bold text-primary-900 hover:underline p-2 min-h-[44px]"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View: Stacked Booking Cards */}
          <div className="md:hidden divide-y divide-surface-border">
            {bookings.map((b) => (
              <div key={b.id} className="p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-charcoal">{b.ref}</span>
                  <Badge
                    variant={
                      b.status === "confirmed"
                        ? "success"
                        : b.status === "completed"
                        ? "neutral"
                        : "danger"
                    }
                  >
                    {b.status}
                  </Badge>
                </div>

                <div>
                  <span className="font-bold text-sm text-charcoal block">{b.tenantName}</span>
                  <span className="text-xs text-charcoal-muted block">{b.phone}</span>
                  <span className="text-xs font-bold text-primary block mt-0.5">{b.roomType}</span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <span className="text-charcoal-muted">Check-In: {b.checkInDate}</span>
                  <span className="font-heading font-extrabold text-sm text-primary">
                    ₹{b.amount.toLocaleString("en-IN")}
                  </span>
                </div>

                {b.status === "confirmed" && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Button
                      variant="primary"
                      size="sm"
                      fullWidth
                      className="min-h-[44px]"
                      onClick={() => handleBookingStatusChange(b.id, "completed")}
                    >
                      Checked-In
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      fullWidth
                      className="min-h-[44px]"
                      onClick={() => handleBookingStatusChange(b.id, "cancelled")}
                    >
                      Cancel Stay
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ================= 5. REVIEWS TAB ================= */}
      {activeTab === "reviews" && (
        <Card padding="none" className="overflow-hidden border-surface-border rounded-[8px]">
          <div className="p-4 bg-surface border-b border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-heading font-bold text-base text-charcoal">
                Verified Resident Reviews & Ratings
              </h2>
              <p className="text-xs text-charcoal-muted">
                Reviews left by verified tenants who completed their booking at your hostel
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-primary-50 border border-primary/30 px-3 py-1.5 rounded-[6px] self-start sm:self-auto">
              <Lock className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="text-xs font-bold text-primary">Read-Only (SuperAdmin Moderated)</span>
            </div>
          </div>

          <div className="divide-y divide-surface-border">
            {reviews.map((r) => (
              <div key={r.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-charcoal">{r.author}</span>
                    <span className="text-[11px] text-charcoal-muted block">{r.role}</span>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-primary">
                      {Array.from({ length: r.rating }).map((_, s) => (
                        <Star key={s} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] text-charcoal-muted">{r.date}</span>
                  </div>
                </div>

                <p className="text-xs text-charcoal leading-relaxed">
                  {r.comment}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
