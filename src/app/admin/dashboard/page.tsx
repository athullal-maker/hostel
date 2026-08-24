"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
  Phone,
  Save,
  MessageSquare,
  Lock,
  Star,
  Upload,
  Plus,
  Camera,
  Loader2,
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

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Hostel State
  const [hostelData, setHostelData] = useState({
    id: "",
    name: "Green Valley Executive PG for Men",
    hostelType: "boys" as "boys" | "girls" | "co-ed",
    locality: "Kakkanad (Near Phase 1 Gate)",
    city: "Kochi, Ernakulam",
    fullAddress: "Plot 42, Infopark Expressway, Kakkanad, Kochi, Kerala 682030",
    status: "approved" as "approved" | "pending" | "rejected",
    totalCapacity: 54,
    checkInTime: "12:00 PM",
    checkOutTime: "11:00 AM",
    curfew: "No Curfew (Biometric Entry for Shift Employees)",
    foodType: "3-time Homestyle Meals Included (Non-Veg 3x/wk)",
    coverImage:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80",
    ],
    amenities: [
      "Homestyle Food Included",
      "AC Available",
      "High-speed 100 Mbps Wi-Fi",
    ],
  });

  // Image addition state
  const [newImageUrl, setNewImageUrl] = useState("");
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // Room Inventory State
  const [rooms, setRooms] = useState<any[]>([
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
  ]);

  // Bookings & Enquiries State
  const [bookings, setBookings] = useState<any[]>([]);

  // Fetch real data from MongoDB
  const fetchHostelData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/my-hostel");
      const json = await res.json();
      if (json.success && json.data?.hostel) {
        const h = json.data.hostel;
        setHostelData({
          id: h._id,
          name: h.name || "",
          hostelType: h.hostelType || "boys",
          locality: h.fullAddress?.split(",")?.[0]?.trim() || "Kakkanad",
          city: h.cityId?.name || "Kochi, Ernakulam",
          fullAddress: h.fullAddress || "",
          status: h.status || "approved",
          totalCapacity: h.totalCapacity || 30,
          checkInTime: h.checkInTime || "12:00 PM",
          checkOutTime: h.checkOutTime || "11:00 AM",
          curfew: h.rules || "No Curfew (24x7 Entry)",
          foodType: h.description || "Homestyle Kerala Meals Included",
          coverImage: h.coverImage || "",
          galleryImages: h.galleryImages || [],
          amenities: h.amenities || [],
        });

        if (json.data.rooms && json.data.rooms.length > 0) {
          setRooms(
            json.data.rooms.map((r: any) => ({
              id: r._id,
              type: r.roomType,
              capacity: r.capacity,
              price: r.pricePerBed,
              bedsAvailable: r.bedsAvailable,
              amenities: Array.isArray(r.amenities) ? r.amenities.join(", ") : r.amenities,
            }))
          );
        }

        if (json.data.enquiries) {
          setBookings(
            json.data.enquiries.map((e: any, index: number) => ({
              id: e._id,
              ref: `KB-${849200 + index}`,
              tenantName: e.name,
              phone: e.phone,
              roomType: e.roomType || "Standard Sharing",
              checkInDate: e.moveInDate || "Immediate",
              amount: 6500,
              status: e.status === "new" ? "confirmed" : e.status,
            }))
          );
        }
      }
    } catch (err) {
      console.error("Failed to load admin hostel data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostelData();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const res = await fetch("/api/admin/my-hostel", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...hostelData,
          rooms,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setProfileSaveSuccess(true);
        setTimeout(() => setProfileSaveSuccess(false), 5000);
      } else {
        alert(data.error || "Failed to save hostel profile");
      }
    } catch (err) {
      console.error("Error saving hostel profile:", err);
      alert("Failed to save hostel profile");
    } finally {
      setIsSaving(false);
    }
  };

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

    const updatedRooms = [
      ...rooms,
      {
        id: "r-" + Date.now(),
        type: newRoom.type,
        capacity: newRoom.capacity,
        price: newRoom.price,
        bedsAvailable: newRoom.bedsAvailable,
        amenities: newRoom.amenities,
      },
    ];

    setRooms(updatedRooms);

    setNewRoom({
      type: "",
      capacity: 2,
      price: 6000,
      bedsAvailable: 2,
      amenities: "",
    });
    setIsAddingRoom(false);

    // Save to DB in background
    fetch("/api/admin/my-hostel", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...hostelData, rooms: updatedRooms }),
    }).catch(console.error);
  };

  const handleDeleteRoom = (roomId: string) => {
    if (confirm("Are you sure you want to delete this room type?")) {
      const updatedRooms = rooms.filter((r) => r.id !== roomId);
      setRooms(updatedRooms);

      fetch("/api/admin/my-hostel", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...hostelData, rooms: updatedRooms }),
      }).catch(console.error);
    }
  };

  const handleBookingStatusChange = async (
    bookingId: string,
    newStatus: "confirmed" | "completed" | "cancelled"
  ) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );
    try {
      await fetch("/api/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enquiryId: bookingId, status: newStatus }),
      });
    } catch (err) {
      console.error("Error updating enquiry status:", err);
    }
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

      {/* Pending SuperAdmin Approval Warning Banner - Clean Neutral */}
      {hostelData.status === "pending" && (
        <div className="p-4 bg-neutral-100 border border-neutral-300 rounded-[8px] flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-black shrink-0 mt-0.5" />
          <div className="text-xs text-neutral-800">
            <span className="font-bold block text-sm text-black">
              Your hostel is awaiting superadmin approval and won&apos;t appear in search yet.
            </span>
            Our field verification team will audit the property documents and premise safety before public listing.
          </div>
        </div>
      )}

      {/* Top Header - Clean Black & White */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-neutral-200 rounded-[10px] p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-neutral-500">
              Hostel Admin Dashboard
            </span>
            <span className="bg-neutral-100 text-black border border-neutral-300 font-bold px-2 py-0.5 rounded text-[11px]">
              {hostelData.status === "approved" ? "Live on Search" : "Pending Audit"}
            </span>
          </div>
          <h1 className="font-heading text-2xl font-extrabold text-black mt-1">
            {hostelData.name}
          </h1>
          <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-black" />
            {hostelData.locality}, {hostelData.city}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <Link href={`/hostel/${hostelData.id}`} target="_blank" className="w-full sm:w-auto">
            <button
              type="button"
              className="w-full sm:w-auto px-4 py-2 bg-white text-black hover:bg-neutral-100 border border-neutral-300 font-bold text-xs rounded-[6px] transition-colors cursor-pointer shadow-2xs"
            >
              View Public Page
            </button>
          </Link>
          <button
            type="button"
            className="w-full sm:w-auto px-4 py-2 bg-black text-white hover:bg-neutral-800 font-bold text-xs rounded-[6px] transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 shadow-2xs"
            onClick={() => {
              setActiveTab("rooms");
              setIsAddingRoom(true);
            }}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Add Room
          </button>
        </div>
      </div>

      {/* Tab Navigation - Crisp Black & White */}
      <div className="flex items-center gap-1.5 border-b border-neutral-200 pb-2 text-xs overflow-x-auto flex-nowrap [-webkit-overflow-scrolling:touch]">
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
            className={`px-3.5 py-2 rounded-[6px] font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === tab.id
                ? "bg-black text-white border border-black shadow-xs"
                : "bg-white text-neutral-600 hover:text-black hover:bg-neutral-100 border border-neutral-200"
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
            <Card padding="md" className="space-y-1 bg-white border-neutral-200 rounded-[8px] shadow-2xs">
              <div className="flex items-center justify-between text-neutral-500 text-xs font-bold">
                <span>Current Occupancy</span>
                <Bed className="w-4 h-4 text-black" />
              </div>
              <p className="text-2xl font-extrabold text-black font-heading">
                85%
              </p>
              <p className="text-[11px] text-neutral-600 font-semibold">
                46 of {hostelData.totalCapacity} beds filled
              </p>
            </Card>

            <Card padding="md" className="space-y-1 bg-white border-neutral-200 rounded-[8px] shadow-2xs">
              <div className="flex items-center justify-between text-neutral-500 text-xs font-bold">
                <span>Bookings This Month</span>
                <Calendar className="w-4 h-4 text-black" />
              </div>
              <p className="text-2xl font-extrabold text-black font-heading">
                {bookings.length}
              </p>
              <p className="text-[11px] text-neutral-400">New advance bookings</p>
            </Card>

            <Card padding="md" className="space-y-1 bg-white border-neutral-200 rounded-[8px] shadow-2xs">
              <div className="flex items-center justify-between text-neutral-500 text-xs font-bold">
                <span>Monthly Rent Collection</span>
                <TrendingUp className="w-4 h-4 text-black" />
              </div>
              <p className="text-2xl font-extrabold text-black font-heading">
                ₹2,48,000
              </p>
              <p className="text-[11px] text-neutral-400">0% brokerage deducted</p>
            </Card>

            <Card padding="md" className="space-y-1 bg-white border-neutral-200 rounded-[8px] shadow-2xs">
              <div className="flex items-center justify-between text-neutral-500 text-xs font-bold">
                <span>Listing Status</span>
                <ShieldCheck className="w-4 h-4 text-black" />
              </div>
              <p className="text-2xl font-extrabold text-black font-heading">
                Live
              </p>
              <p className="text-[11px] text-neutral-400">Verified Property</p>
            </Card>
          </div>

          {/* Quick Bookings Action Table */}
          <Card padding="none" className="overflow-hidden bg-white border-neutral-200 rounded-[8px] shadow-2xs">
            <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="font-heading font-bold text-base text-black">
                Recent Inquiries & Bookings
              </h3>
              <button
                type="button"
                onClick={() => setActiveTab("bookings")}
                className="text-xs text-black font-bold hover:underline self-start sm:self-auto"
              >
                View All Bookings →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-100 text-neutral-700 border-b border-neutral-200">
                  <tr>
                    <th className="py-2.5 px-4 font-bold">Tenant Name</th>
                    <th className="py-2.5 px-4 font-bold hidden sm:table-cell">Room Type</th>
                    <th className="py-2.5 px-4 font-bold hidden md:table-cell">Check-In</th>
                    <th className="py-2.5 px-4 font-bold">Amount</th>
                    <th className="py-2.5 px-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-black">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-neutral-50/50">
                      <td className="py-3 px-4 font-semibold">{b.tenantName}</td>
                      <td className="py-3 px-4 hidden sm:table-cell text-neutral-600">{b.roomType}</td>
                      <td className="py-3 px-4 hidden md:table-cell text-neutral-500">{b.checkInDate}</td>
                      <td className="py-3 px-4 font-extrabold text-black">
                        ₹{b.amount.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold border bg-neutral-100 text-black border-neutral-300">
                          {b.status}
                        </span>
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
        <Card padding="lg" className="space-y-6 bg-white border-neutral-200 rounded-[8px] shadow-2xs">
          <div className="border-b border-neutral-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-heading font-bold text-lg text-black">
                Edit Property Details, Photos & Facilities
              </h2>
              <p className="text-xs text-neutral-500">
                Manage hostel media gallery, room rules, meal plan, and verified amenities.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded text-xs font-bold border bg-neutral-100 text-black border-neutral-300">
              {hostelData.status === "approved" ? "Verified & Live" : "Pending Audit"}
            </span>
          </div>

          {profileSaveSuccess && (
            <div className="p-3.5 bg-neutral-100 border border-neutral-300 rounded-[8px] flex items-center justify-between gap-2 text-xs text-black font-bold animate-fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-black shrink-0" />
                <span>Property details and photo gallery saved successfully!</span>
              </div>
              <button
                type="button"
                onClick={() => setProfileSaveSuccess(false)}
                className="text-neutral-500 hover:text-black p-1 text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          <form
            onSubmit={handleSaveProfile}
            className="space-y-6"
          >
            {/* 1. Basic Details */}
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-sm text-black flex items-center gap-1.5 border-b border-neutral-200 pb-2">
                <Building2 className="w-4 h-4 text-black" />
                Basic Property Identity
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Input
                    label="Hostel / PG Name"
                    value={hostelData.name}
                    onChange={(e) =>
                      setHostelData({ ...hostelData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <Select
                  label="Hostel Type / Category"
                  value={hostelData.hostelType}
                  onChange={(e) =>
                    setHostelData({
                      ...hostelData,
                      hostelType: e.target.value as "boys" | "girls" | "co-ed",
                    })
                  }
                >
                  <option value="boys">Boys Hostel / PG</option>
                  <option value="girls">Girls Hostel / PG</option>
                  <option value="co-ed">Co-Ed Co-Living</option>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Locality / Landmark (e.g. Kakkanad Infopark)"
                  value={hostelData.locality}
                  onChange={(e) =>
                    setHostelData({ ...hostelData, locality: e.target.value })
                  }
                  required
                />

                <Input
                  label="City / District"
                  value={hostelData.city}
                  onChange={(e) =>
                    setHostelData({ ...hostelData, city: e.target.value })
                  }
                  required
                />
              </div>

              <Input
                label="Full Postal Address with PIN code"
                value={hostelData.fullAddress}
                onChange={(e) =>
                  setHostelData({ ...hostelData, fullAddress: e.target.value })
                }
                required
              />
            </div>

            {/* 2. Photo & Image Gallery Manager */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-neutral-200 pb-2">
                <h3 className="font-heading font-bold text-sm text-black flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-black" />
                  Hostel Photos & Media Gallery ({hostelData.galleryImages.length} images)
                </h3>
                <span className="text-[11px] text-neutral-500">
                  High-quality images increase booking inquiries by up to 300%
                </span>
              </div>

              {/* Cover Photo Highlight */}
              <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-[8px] space-y-3">
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="relative w-full sm:w-48 h-32 rounded-[6px] overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200 shadow-2xs">
                    {hostelData.coverImage ? (
                      <Image
                        src={hostelData.coverImage}
                        alt="Primary Cover Photo"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400">
                        No Cover Set
                      </div>
                    )}
                    <span className="absolute bottom-1.5 left-1.5 bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                      Primary Search Cover
                    </span>
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <span className="text-xs font-bold text-black block">
                      Main Search Cover Photo URL
                    </span>
                    <p className="text-[11px] text-neutral-500">
                      This photo is displayed on student search cards, featured listings, and page headers.
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={hostelData.coverImage}
                        onChange={(e) =>
                          setHostelData({ ...hostelData, coverImage: e.target.value })
                        }
                        placeholder="https://example.com/cover-image.jpg"
                        className="flex-1 bg-white text-xs text-black p-2 border border-neutral-300 rounded-[6px] focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Gallery Grid */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-black block">
                  Gallery Showcase Photos
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {hostelData.galleryImages.map((imgUrl, index) => (
                    <div
                      key={index}
                      className="group relative rounded-[8px] overflow-hidden border border-neutral-200 aspect-4/3 bg-neutral-100 shadow-2xs"
                    >
                      <Image
                        src={imgUrl}
                        alt={`Hostel photo ${index + 1}`}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        unoptimized
                      />

                      {/* Cover Badge */}
                      {hostelData.coverImage === imgUrl && (
                        <span className="absolute top-1.5 left-1.5 bg-black text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          Cover
                        </span>
                      )}

                      {/* Hover Overlay Controls */}
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2 text-white">
                        {hostelData.coverImage !== imgUrl && (
                          <button
                            type="button"
                            onClick={() =>
                              setHostelData({ ...hostelData, coverImage: imgUrl })
                            }
                            className="text-[10px] bg-white text-black font-bold px-2 py-1 rounded hover:bg-neutral-200 transition-colors w-full cursor-pointer text-center"
                          >
                            Set as Cover
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            const newGallery = hostelData.galleryImages.filter(
                              (_, i) => i !== index
                            );
                            setHostelData({
                              ...hostelData,
                              galleryImages: newGallery,
                              coverImage:
                                hostelData.coverImage === imgUrl && newGallery.length > 0
                                  ? newGallery[0]
                                  : hostelData.coverImage,
                            });
                          }}
                          className="text-[10px] bg-black text-white border border-neutral-700 font-bold px-2 py-1 rounded hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1 w-full cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Photo Form & Local File Upload */}
              <div className="p-4 bg-neutral-50 border border-dashed border-neutral-400 rounded-[8px] space-y-3">
                <span className="text-xs font-bold text-black block">
                  Add New Photo to Gallery
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                  <div className="sm:col-span-8">
                    <input
                      type="url"
                      placeholder="Paste image URL (e.g., Unsplash, Cloudinary, Imgur, direct image link)"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="w-full bg-white text-xs text-black p-2.5 border border-neutral-300 rounded-[6px] focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="sm:col-span-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (!newImageUrl.trim()) return;
                        setHostelData({
                          ...hostelData,
                          galleryImages: [...hostelData.galleryImages, newImageUrl.trim()],
                          coverImage: hostelData.coverImage || newImageUrl.trim(),
                        });
                        setNewImageUrl("");
                      }}
                      className="w-full py-2 bg-black text-white hover:bg-neutral-800 font-bold text-xs rounded-[6px] transition-colors cursor-pointer inline-flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add URL
                    </button>
                  </div>
                </div>

                {/* Upload from Local Device & Sample Library */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-200 text-xs">
                  {/* Local Device Picker */}
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-300 rounded-[6px] text-black font-semibold hover:bg-neutral-100 cursor-pointer text-xs transition-colors shadow-2xs">
                    <Upload className="w-3.5 h-3.5 text-black" />
                    <span>Upload Image from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const result = event.target?.result as string;
                            if (result) {
                              setHostelData({
                                ...hostelData,
                                galleryImages: [...hostelData.galleryImages, result],
                                coverImage: hostelData.coverImage || result,
                              });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>

                  {/* Preset Photos Quick Add */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-neutral-500">Quick Presets:</span>
                    {[
                      {
                        label: "Deluxe Bedroom",
                        url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80",
                      },
                      {
                        label: "Mess Dining Hall",
                        url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
                      },
                      {
                        label: "Building Exterior",
                        url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
                      },
                    ].map((sample) => (
                      <button
                        key={sample.label}
                        type="button"
                        onClick={() => {
                          if (!hostelData.galleryImages.includes(sample.url)) {
                            setHostelData({
                              ...hostelData,
                              galleryImages: [...hostelData.galleryImages, sample.url],
                            });
                          }
                        }}
                        className="text-[10px] bg-white border border-neutral-300 text-black font-bold px-2 py-1 rounded hover:bg-neutral-100 transition-colors cursor-pointer"
                      >
                        + {sample.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. House Rules & Timings */}
            <div className="space-y-4 pt-2">
              <h3 className="font-heading font-bold text-sm text-black flex items-center gap-1.5 border-b border-neutral-200 pb-2">
                <Clock className="w-4 h-4 text-black" />
                Timings & Entry Policies
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Gate Curfew Policy"
                  value={hostelData.curfew}
                  onChange={(e) =>
                    setHostelData({ ...hostelData, curfew: e.target.value })
                  }
                  placeholder="e.g. No Curfew / Biometric 24x7"
                />

                <Input
                  label="Standard Check-In Time"
                  value={hostelData.checkInTime}
                  onChange={(e) =>
                    setHostelData({ ...hostelData, checkInTime: e.target.value })
                  }
                />

                <Input
                  label="Standard Check-Out Time"
                  value={hostelData.checkOutTime}
                  onChange={(e) =>
                    setHostelData({ ...hostelData, checkOutTime: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1">
                  Homestyle Meal Plan & Mess Description
                </label>
                <textarea
                  value={hostelData.foodType}
                  onChange={(e) =>
                    setHostelData({ ...hostelData, foodType: e.target.value })
                  }
                  rows={2}
                  className="w-full bg-white text-xs text-black p-3 border border-neutral-300 rounded-[6px] focus:outline-none focus:border-black"
                  placeholder="e.g. 3-time Homestyle Kerala Meals Included with Non-Veg options 3x/week"
                />
              </div>
            </div>

            {/* 4. Amenities Checklist */}
            <div className="space-y-3 pt-2">
              <h3 className="font-heading font-bold text-sm text-black flex items-center gap-1.5 border-b border-neutral-200 pb-2">
                <ShieldCheck className="w-4 h-4 text-black" />
                Verified Amenities & Facilities
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  "Homestyle Food Included",
                  "AC Available",
                  "High-speed 100 Mbps Wi-Fi",
                  "Attached Bathroom",
                  "Warden 24x7",
                  "No Night Curfew",
                  "Power Backup Generator",
                  "Two-Wheeler Parking",
                  "CCTV Surveillance",
                  "RO Purified Water",
                  "Biometric Access",
                  "Study Lounge",
                ].map((amenity) => {
                  const isChecked = hostelData.amenities.includes(amenity);
                  return (
                    <label
                      key={amenity}
                      className={`flex items-center gap-2 p-2.5 rounded-[6px] border text-xs cursor-pointer transition-colors ${
                        isChecked
                          ? "bg-neutral-100 border-black text-black font-bold"
                          : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setHostelData({
                              ...hostelData,
                              amenities: [...hostelData.amenities, amenity],
                            });
                          } else {
                            setHostelData({
                              ...hostelData,
                              amenities: hostelData.amenities.filter(
                                (a) => a !== amenity
                              ),
                            });
                          }
                        }}
                        className="rounded-[2px] accent-black"
                      />
                      <span>{amenity}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-black text-white hover:bg-neutral-800 font-bold text-xs rounded-[6px] transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
              >
                <Save className="w-4 h-4" />
                Save Property Profile & Photos
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* ================= 3. ROOMS & INVENTORY TAB ================= */}
      {activeTab === "rooms" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-neutral-200 rounded-[8px] p-4 shadow-2xs">
            <div>
              <h2 className="font-heading font-bold text-base text-black">
                Room Types & Sharing Rates
              </h2>
              <p className="text-xs text-neutral-500">
                Manage sharing capacity, monthly rental rates, and live bed availability
              </p>
            </div>

            <button
              type="button"
              className="px-4 py-2 bg-black text-white hover:bg-neutral-800 font-bold text-xs rounded-[6px] transition-colors cursor-pointer inline-flex items-center justify-center gap-1 shadow-2xs"
              onClick={() => setIsAddingRoom(!isAddingRoom)}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              {isAddingRoom ? "Cancel" : "Add Room Type"}
            </button>
          </div>

          {/* Add Room Form */}
          {isAddingRoom && (
            <Card padding="md" className="space-y-4 border-neutral-300 bg-neutral-50 rounded-[8px] shadow-2xs">
              <h3 className="font-heading font-bold text-sm text-black">
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

                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white hover:bg-neutral-800 font-bold text-xs rounded-[6px] transition-colors cursor-pointer"
                >
                  Save New Room Type
                </button>
              </form>
            </Card>
          )}

          {/* Rooms: Desktop Table + Mobile Stacked Cards */}
          <Card padding="none" className="overflow-hidden bg-white border-neutral-200 rounded-[8px] shadow-2xs">
            {/* Desktop View Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-100 text-neutral-700 border-b border-neutral-200">
                  <tr>
                    <th className="py-3 px-4 font-bold">Room Type</th>
                    <th className="py-3 px-4 font-bold">Capacity</th>
                    <th className="py-3 px-4 font-bold">Monthly Price per Bed</th>
                    <th className="py-3 px-4 font-bold">Beds Available</th>
                    <th className="py-3 px-4 font-bold">Amenities</th>
                    <th className="py-3 px-4 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-black">
                  {rooms.map((r) => (
                    <tr key={r.id} className="hover:bg-neutral-50/50">
                      <td className="py-3 px-4 font-bold">{r.type}</td>
                      <td className="py-3 px-4 text-neutral-600">{r.capacity} Person(s)</td>
                      <td className="py-3 px-4 font-extrabold text-black">
                        ₹{r.price.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                          r.bedsAvailable > 0
                            ? "bg-neutral-100 text-black border-neutral-300"
                            : "bg-black text-white border-black"
                        }`}>
                          {r.bedsAvailable > 0 ? `${r.bedsAvailable} Beds Open` : "Full (0 Beds)"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-neutral-500">{r.amenities}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteRoom(r.id)}
                          className="px-2 py-1 bg-white text-black hover:bg-neutral-100 border border-neutral-300 font-bold text-xs rounded transition-colors cursor-pointer"
                          title="Delete room type"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View: Stacked Room Cards */}
            <div className="md:hidden divide-y divide-neutral-200">
              {rooms.map((r) => (
                <div key={r.id} className="p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-bold text-sm text-black block">{r.type}</span>
                      <span className="text-xs text-neutral-500">{r.capacity} Person(s) Sharing</span>
                    </div>
                    <span className="font-heading font-extrabold text-base text-black">
                      ₹{r.price.toLocaleString("en-IN")}/mo
                    </span>
                  </div>

                  <p className="text-xs text-neutral-500">{r.amenities}</p>

                  <div className="flex items-center justify-between pt-1">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                      r.bedsAvailable > 0
                        ? "bg-neutral-100 text-black border-neutral-300"
                        : "bg-black text-white border-black"
                    }`}>
                      {r.bedsAvailable > 0 ? `${r.bedsAvailable} Beds Open` : "Full"}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDeleteRoom(r.id)}
                      className="px-3 py-1.5 bg-white text-black hover:bg-neutral-100 border border-neutral-300 font-bold text-xs rounded transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ================= 4. BOOKINGS TAB ================= */}
      {activeTab === "bookings" && (
        <Card padding="none" className="overflow-hidden bg-white border-neutral-200 rounded-[8px] shadow-2xs">
          <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-base text-black">
                Tenant Bookings & Inquiries
              </h2>
              <p className="text-xs text-neutral-500">
                Direct booking records received for this property
              </p>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-100 text-neutral-700 border-b border-neutral-200">
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
              <tbody className="divide-y divide-neutral-200 text-black">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-neutral-50/50">
                    <td className="py-3 px-4 font-mono font-bold text-black">{b.ref}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold block text-black">{b.tenantName}</span>
                      <span className="text-[11px] text-neutral-500">{b.phone}</span>
                    </td>
                    <td className="py-3 px-4 text-neutral-600">{b.roomType}</td>
                    <td className="py-3 px-4 text-neutral-500">{b.checkInDate}</td>
                    <td className="py-3 px-4 font-extrabold text-black">
                      ₹{b.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold border bg-neutral-100 text-black border-neutral-300">
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      {b.status === "confirmed" && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleBookingStatusChange(b.id, "completed")}
                            className="px-2.5 py-1 bg-black text-white hover:bg-neutral-800 font-bold text-xs rounded transition-colors cursor-pointer"
                          >
                            Mark Checked-In
                          </button>
                          <button
                            type="button"
                            onClick={() => handleBookingStatusChange(b.id, "cancelled")}
                            className="px-2.5 py-1 bg-white text-black hover:bg-neutral-100 border border-neutral-300 font-bold text-xs rounded transition-colors cursor-pointer"
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
          <div className="md:hidden divide-y divide-neutral-200">
            {bookings.map((b) => (
              <div key={b.id} className="p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-black">{b.ref}</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold border bg-neutral-100 text-black border-neutral-300">
                    {b.status}
                  </span>
                </div>

                <div>
                  <span className="font-bold text-sm text-black block">{b.tenantName}</span>
                  <span className="text-xs text-neutral-500 block">{b.phone}</span>
                  <span className="text-xs font-semibold text-neutral-700 block mt-0.5">{b.roomType}</span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-neutral-200">
                  <span className="text-neutral-500">Check-In: {b.checkInDate}</span>
                  <span className="font-heading font-extrabold text-sm text-black">
                    ₹{b.amount.toLocaleString("en-IN")}
                  </span>
                </div>

                {b.status === "confirmed" && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      className="py-2 bg-black text-white hover:bg-neutral-800 font-bold text-xs rounded transition-colors cursor-pointer"
                      onClick={() => handleBookingStatusChange(b.id, "completed")}
                    >
                      Checked-In
                    </button>
                    <button
                      type="button"
                      className="py-2 bg-white text-black hover:bg-neutral-100 border border-neutral-300 font-bold text-xs rounded transition-colors cursor-pointer"
                      onClick={() => handleBookingStatusChange(b.id, "cancelled")}
                    >
                      Cancel Stay
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ================= 5. REVIEWS TAB ================= */}
      {activeTab === "reviews" && (
        <Card padding="none" className="overflow-hidden bg-white border-neutral-200 rounded-[8px] shadow-2xs">
          <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-heading font-bold text-base text-black">
                Verified Resident Reviews & Ratings
              </h2>
              <p className="text-xs text-neutral-500">
                Reviews left by verified tenants who completed their booking at your hostel
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-neutral-100 border border-neutral-300 px-3 py-1.5 rounded-[6px] self-start sm:self-auto">
              <Lock className="w-3.5 h-3.5 text-black shrink-0" />
              <span className="text-xs font-bold text-black">Read-Only (SuperAdmin Moderated)</span>
            </div>
          </div>

          <div className="divide-y divide-neutral-200">
            {reviews.map((r) => (
              <div key={r.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-black">{r.author}</span>
                    <span className="text-[11px] text-neutral-500 block">{r.role}</span>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-0.5 text-black">
                      {Array.from({ length: r.rating }).map((_, s) => (
                        <Star key={s} className="w-3 h-3 fill-black text-black" />
                      ))}
                    </div>
                    <span className="text-[10px] text-neutral-400">{r.date}</span>
                  </div>
                </div>

                <p className="text-xs text-neutral-800 leading-relaxed bg-neutral-50 p-2.5 rounded-[6px] border border-neutral-200">
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
