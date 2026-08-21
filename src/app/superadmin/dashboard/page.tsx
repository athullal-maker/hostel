"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Building2,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  Plus,
  Trash2,
  AlertTriangle,
  Eye,
  Search,
  MessageSquare,
  Ban,
  RefreshCw,
  Check,
  X,
  FileText,
  Building,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function SuperAdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "hostels" | "admins" | "users" | "reviews"
  >("overview");

  // Destructive Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    warningNote?: string;
    actionType: "delete_admin" | "delete_hostel" | "suspend_user" | "remove_review";
    targetId: string;
  }>({
    isOpen: false,
    title: "",
    description: "",
    warningNote: "",
    actionType: "delete_hostel",
    targetId: "",
  });

  // Provision Admin Modal State
  const [isProvisionAdminOpen, setIsProvisionAdminOpen] = useState(false);
  const [newAdminData, setNewAdminData] = useState({
    name: "",
    email: "",
    phone: "",
    assignedHostel: "Green Valley Executive PG for Men",
  });

  // Mock Hostels Registry State
  const [hostelsList, setHostelsList] = useState([
    {
      id: "hostel-kakkanad-1",
      name: "Green Valley Executive PG for Men",
      locality: "Kakkanad",
      city: "Kochi, Ernakulam",
      type: "boys",
      adminName: "Manoj Kumar",
      phone: "+91 98470 11223",
      status: "approved",
      capacity: 54,
    },
    {
      id: "hostel-cusat-2",
      name: "Ahalya Heritage Ladies Hostel",
      locality: "Kalamassery",
      city: "Kochi, Ernakulam",
      type: "girls",
      adminName: "Geetha Nair",
      phone: "+91 94470 33445",
      status: "approved",
      capacity: 40,
    },
    {
      id: "hostel-kazhakkoottam-3",
      name: "TechnoNest Luxury Co-Living",
      locality: "Kazhakkoottam",
      city: "Trivandrum",
      type: "co-ed",
      adminName: "Alex Thomas",
      phone: "+91 98950 55667",
      status: "approved",
      capacity: 80,
    },
    {
      id: "hostel-pending-4",
      name: "St. Mary's Working Women's PG",
      locality: "Edappally",
      city: "Kochi, Ernakulam",
      type: "girls",
      adminName: "Mary Joseph",
      phone: "+91 94460 77889",
      status: "pending",
      capacity: 32,
    },
  ]);

  // Mock Admins List
  const [adminsList, setAdminsList] = useState([
    {
      id: "adm-1",
      name: "Manoj Kumar",
      email: "manoj@greenvalley.in",
      phone: "+91 98470 11223",
      hostelName: "Green Valley Executive PG for Men",
      createdAt: "10 Aug 2026",
    },
    {
      id: "adm-2",
      name: "Geetha Nair",
      email: "geetha@ahalya.in",
      phone: "+91 94470 33445",
      hostelName: "Ahalya Heritage Ladies Hostel",
      createdAt: "14 Aug 2026",
    },
    {
      id: "adm-3",
      name: "Alex Thomas",
      email: "alex@technonest.in",
      phone: "+91 98950 55667",
      hostelName: "TechnoNest Luxury Co-Living",
      createdAt: "18 Aug 2026",
    },
  ]);

  // Mock Registered Regular Users List
  const [usersList, setUsersList] = useState([
    {
      id: "usr-1",
      name: "Sreehari Nair",
      email: "sreehari.nair@gmail.com",
      phone: "+91 98470 12345",
      role: "user",
      status: "active",
      joinedDate: "21 Aug 2026",
    },
    {
      id: "usr-2",
      name: "Arjun Varma",
      email: "arjun.varma@gmail.com",
      phone: "+91 94470 98765",
      role: "user",
      status: "active",
      joinedDate: "19 Aug 2026",
    },
    {
      id: "usr-3",
      name: "Nandana Ramesh",
      email: "nandana.r@gmail.com",
      phone: "+91 97450 67890",
      role: "user",
      status: "active",
      joinedDate: "15 Aug 2026",
    },
    {
      id: "usr-4",
      name: "Spam Account",
      email: "bot992@tempmail.com",
      phone: "+91 90000 00000",
      role: "user",
      status: "suspended",
      joinedDate: "01 Aug 2026",
    },
  ]);

  // Moderation Review Queue
  const [reviewsList, setReviewsList] = useState([
    {
      id: "rev-rep-1",
      hostelId: "hostel-kakkanad-1",
      hostelName: "Green Valley Executive PG for Men",
      author: "Disgruntled User",
      rating: 1,
      comment: "Worst food ever. Warden takes money and does nothing!",
      isReported: true,
      reportReason: "Competitor sabotage / False allegations",
      reportedAt: "21 Aug 2026",
    },
    {
      id: "rev-rep-2",
      hostelId: "hostel-cusat-2",
      hostelName: "Ahalya Heritage Ladies Hostel",
      author: "Spam Bot",
      rating: 5,
      comment: "Call 9800000000 for instant personal loans discount!!",
      isReported: true,
      reportReason: "Spam / Commercial solicitation",
      reportedAt: "20 Aug 2026",
    },
  ]);

  const handleApproveHostel = (hostelId: string) => {
    setHostelsList((prev) =>
      prev.map((h) => (h.id === hostelId ? { ...h, status: "approved" } : h))
    );
  };

  const handleRejectHostel = (hostelId: string) => {
    setHostelsList((prev) =>
      prev.map((h) => (h.id === hostelId ? { ...h, status: "rejected" } : h))
    );
  };

  const handleExecuteDestructiveAction = () => {
    const { actionType, targetId } = confirmModal;

    if (actionType === "delete_hostel") {
      setHostelsList((prev) => prev.filter((h) => h.id !== targetId));
    } else if (actionType === "delete_admin") {
      setAdminsList((prev) => prev.filter((a) => a.id !== targetId));
    } else if (actionType === "suspend_user") {
      setUsersList((prev) =>
        prev.map((u) => (u.id === targetId ? { ...u, status: "suspended" } : u))
      );
    } else if (actionType === "remove_review") {
      setReviewsList((prev) => prev.filter((r) => r.id !== targetId));
    }

    setConfirmModal({ ...confirmModal, isOpen: false });
  };

  const handleProvisionAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminData.name || !newAdminData.email) return;

    setAdminsList([
      ...adminsList,
      {
        id: "adm-" + Date.now(),
        name: newAdminData.name,
        email: newAdminData.email,
        phone: newAdminData.phone,
        hostelName: newAdminData.assignedHostel,
        createdAt: "Today",
      },
    ]);

    setNewAdminData({
      name: "",
      email: "",
      phone: "",
      assignedHostel: "Green Valley Executive PG for Men",
    });
    setIsProvisionAdminOpen(false);
    alert("Admin account provisioned successfully!");
  };

  const handleRecalculateRating = async (hostelId: string) => {
    try {
      await fetch(`/api/hostels/${hostelId}/recalculate-rating`, {
        method: "POST",
      });
      alert("Rating recalculation triggered for hostel " + hostelId);
    } catch {
      alert("Recalculation executed (Simulation).");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 bg-surface">
      {/* SuperAdmin Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { label: "SuperAdmin" },
          { label: "Governance Portal" },
        ]}
      />

      {/* Top Banner */}
      <div className="bg-charcoal text-white rounded-[10px] p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-4 border-primary">
        <div>
          <div className="inline-flex items-center gap-1 text-[11px] bg-white/10 px-2 py-0.5 rounded font-bold text-primary-500 mb-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Platform SuperAdmin Governance Portal
          </div>
          <h1 className="font-heading text-2xl font-extrabold text-white">
            Platform Governance & Moderation
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Audit hostel applications, provision verified admin accounts, and moderate platform data.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsProvisionAdminOpen(true)}
          className="font-bold shadow-sm"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Provision New Admin
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 border-b border-surface-border pb-2 text-xs overflow-x-auto">
        {[
          { id: "overview", label: "Overview Metrics" },
          { id: "hostels", label: `Hostels (${hostelsList.length})` },
          { id: "admins", label: `Admins (${adminsList.length})` },
          { id: "users", label: `Users (${usersList.length})` },
          { id: "reviews", label: `Reviews Moderation (${reviewsList.length})` },
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

      {/* ================= 1. OVERVIEW ================= */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card padding="md" className="border-surface-border rounded-[8px]">
              <span className="text-xs text-charcoal-muted font-bold">Pending Verification</span>
              <p className="text-2xl font-extrabold text-primary font-heading mt-1">
                {hostelsList.filter((h) => h.status === "pending").length}
              </p>
              <span className="text-[11px] text-charcoal-muted">Hostels awaiting audit</span>
            </Card>

            <Card padding="md" className="border-surface-border rounded-[8px]">
              <span className="text-xs text-charcoal-muted font-bold">Active Approved Hostels</span>
              <p className="text-2xl font-extrabold text-primary font-heading mt-1">
                {hostelsList.filter((h) => h.status === "approved").length}
              </p>
              <span className="text-[11px] text-primary font-bold">
                Across 14 Districts
              </span>
            </Card>

            <Card padding="md" className="border-surface-border rounded-[8px]">
              <span className="text-xs text-charcoal-muted font-bold">Verified Hostel Admins</span>
              <p className="text-2xl font-extrabold text-charcoal font-heading mt-1">
                {adminsList.length}
              </p>
              <span className="text-[11px] text-charcoal-muted">Superadmin-provisioned</span>
            </Card>

            <Card padding="md" className="border-surface-border rounded-[8px]">
              <span className="text-xs text-charcoal-muted font-bold">Total Verified Beds</span>
              <p className="text-2xl font-extrabold text-charcoal font-heading mt-1">
                8,420
              </p>
              <span className="text-[11px] text-primary font-bold">
                Students & Techies housed
              </span>
            </Card>
          </div>

          {/* Pending Hostels Queue */}
          <Card padding="none" className="overflow-hidden border-surface-border rounded-[8px]">
            <div className="p-4 bg-surface border-b border-surface-border flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-charcoal">
                Pending Hostel Audit Approvals
              </h3>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-muted text-charcoal-muted border-b border-surface-border">
                  <tr>
                    <th className="py-2.5 px-4 font-bold">Hostel Name & Locality</th>
                    <th className="py-2.5 px-4 font-bold">Owner Contact</th>
                    <th className="py-2.5 px-4 font-bold">Type</th>
                    <th className="py-2.5 px-4 font-bold">Capacity</th>
                    <th className="py-2.5 px-4 font-bold">Status</th>
                    <th className="py-2.5 px-4 font-bold text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border text-charcoal">
                  {hostelsList.map((h) => (
                    <tr key={h.id}>
                      <td className="py-3 px-4">
                        <span className="font-bold block">{h.name}</span>
                        <span className="text-[11px] text-charcoal-muted">{h.locality}, {h.city}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span>{h.adminName}</span>
                        <span className="text-[11px] text-charcoal-muted block">{h.phone}</span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={h.type === "girls" ? "primary" : "outline"}>
                          {h.type}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-medium">{h.capacity} Beds</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            h.status === "approved"
                              ? "success"
                              : h.status === "pending"
                              ? "warning"
                              : "danger"
                          }
                        >
                          {h.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        {h.status === "pending" ? (
                          <>
                            <Button
                              variant="primary"
                              size="sm"
                              className="min-h-[44px]"
                              onClick={() => handleApproveHostel(h.id)}
                            >
                              <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approve
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              className="min-h-[44px]"
                              onClick={() => handleRejectHostel(h.id)}
                            >
                              <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                            </Button>
                          </>
                        ) : (
                          <span className="text-xs text-charcoal-muted font-medium">Audited</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View: Stacked Queue Cards */}
            <div className="md:hidden divide-y divide-surface-border">
              {hostelsList.map((h) => (
                <div key={h.id} className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-bold text-sm text-charcoal block">{h.name}</span>
                      <span className="text-xs text-charcoal-muted">{h.locality}, {h.city}</span>
                    </div>
                    <Badge variant={h.status === "approved" ? "success" : "warning"}>
                      {h.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs text-charcoal-muted">
                    <span>Owner: {h.adminName}</span>
                    <span>{h.capacity} Beds</span>
                  </div>

                  {h.status === "pending" && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Button
                        variant="primary"
                        size="sm"
                        fullWidth
                        className="min-h-[44px]"
                        onClick={() => handleApproveHostel(h.id)}
                      >
                        <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        fullWidth
                        className="min-h-[44px]"
                        onClick={() => handleRejectHostel(h.id)}
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ================= 2. HOSTELS TAB ================= */}
      {activeTab === "hostels" && (
        <Card padding="none" className="overflow-hidden border-surface-border rounded-[8px]">
          <div className="p-4 bg-surface border-b border-surface-border flex items-center justify-between">
            <h2 className="font-heading font-bold text-base text-charcoal">
              All Hostels Platform Registry
            </h2>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-muted text-charcoal-muted border-b border-surface-border">
                <tr>
                  <th className="py-2.5 px-4 font-bold">Hostel Name</th>
                  <th className="py-2.5 px-4 font-bold">Location</th>
                  <th className="py-2.5 px-4 font-bold">Admin Owner</th>
                  <th className="py-2.5 px-4 font-bold">Status</th>
                  <th className="py-2.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border text-charcoal">
                {hostelsList.map((h) => (
                  <tr key={h.id}>
                    <td className="py-3 px-4 font-bold text-primary">{h.name}</td>
                    <td className="py-3 px-4 text-charcoal-muted">{h.locality}, {h.city}</td>
                    <td className="py-3 px-4">{h.adminName}</td>
                    <td className="py-3 px-4">
                      <Badge variant={h.status === "approved" ? "success" : "warning"}>
                        {h.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <Link href={`/hostel/${h.id}`} target="_blank">
                        <Button variant="outline" size="sm" className="min-h-[44px]">
                          <Eye className="w-3.5 h-3.5 mr-1" /> View
                        </Button>
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        className="min-h-[44px]"
                        onClick={() =>
                          setConfirmModal({
                            isOpen: true,
                            title: `Delete Hostel: ${h.name}`,
                            description:
                              "Are you sure you want to completely delete this hostel and its associated room inventory?",
                            warningNote: "This action cannot be undone.",
                            actionType: "delete_hostel",
                            targetId: h.id,
                          })
                        }
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View: Stacked Hostels Cards */}
          <div className="md:hidden divide-y divide-surface-border">
            {hostelsList.map((h) => (
              <div key={h.id} className="p-4 space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-bold text-sm text-charcoal block">{h.name}</span>
                    <span className="text-xs text-charcoal-muted">{h.locality}, {h.city}</span>
                  </div>
                  <Badge variant={h.status === "approved" ? "success" : "warning"}>
                    {h.status}
                  </Badge>
                </div>

                <div className="text-xs text-charcoal-muted">
                  <span>Manager: {h.adminName} ({h.phone})</span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <Link href={`/hostel/${h.id}`} target="_blank">
                    <Button variant="outline" size="sm" className="min-h-[44px]">
                      <Eye className="w-3.5 h-3.5 mr-1" /> View Details
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    className="min-h-[44px]"
                    onClick={() =>
                      setConfirmModal({
                        isOpen: true,
                        title: `Delete Hostel: ${h.name}`,
                        description:
                          "Are you sure you want to completely delete this hostel and its associated room inventory?",
                        warningNote: "This action cannot be undone.",
                        actionType: "delete_hostel",
                        targetId: h.id,
                      })
                    }
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ================= 3. ADMINS TAB ================= */}
      {activeTab === "admins" && (
        <Card padding="none" className="overflow-hidden border-surface-border rounded-[8px]">
          <div className="p-4 bg-surface border-b border-surface-border flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-base text-charcoal">
                Provisioned Hostel Admins
              </h2>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsProvisionAdminOpen(true)}
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Provision New Admin
            </Button>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-muted text-charcoal-muted border-b border-surface-border">
                <tr>
                  <th className="py-2.5 px-4 font-bold">Admin Name</th>
                  <th className="py-2.5 px-4 font-bold">Email & Phone</th>
                  <th className="py-2.5 px-4 font-bold">Assigned Property</th>
                  <th className="py-2.5 px-4 font-bold">Created Date</th>
                  <th className="py-2.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border text-charcoal">
                {adminsList.map((a) => (
                  <tr key={a.id}>
                    <td className="py-3 px-4 font-bold">{a.name}</td>
                    <td className="py-3 px-4">
                      <span>{a.email}</span>
                      <span className="text-[11px] text-charcoal-muted block">{a.phone}</span>
                    </td>
                    <td className="py-3 px-4 text-primary font-bold">
                      {a.hostelName}
                    </td>
                    <td className="py-3 px-4 text-charcoal-muted">{a.createdAt}</td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="danger"
                        size="sm"
                        className="min-h-[44px]"
                        onClick={() =>
                          setConfirmModal({
                            isOpen: true,
                            title: `Delete Admin Account: ${a.name}`,
                            description: `Are you sure you want to revoke and delete admin privileges for ${a.email}?`,
                            warningNote:
                              "Deleting an admin will automatically unassign their managed hostel property.",
                            actionType: "delete_admin",
                            targetId: a.id,
                          })
                        }
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete Admin
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View: Stacked Admins Cards */}
          <div className="md:hidden divide-y divide-surface-border">
            {adminsList.map((a) => (
              <div key={a.id} className="p-4 space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-bold text-sm text-charcoal block">{a.name}</span>
                    <span className="text-xs text-charcoal-muted block">{a.email}</span>
                    <span className="text-xs text-charcoal-muted block">{a.phone}</span>
                  </div>
                  <span className="text-[11px] text-charcoal-muted">{a.createdAt}</span>
                </div>

                <div className="text-xs text-primary font-bold bg-primary-50 p-2 rounded-[6px]">
                  Property: {a.hostelName}
                </div>

                <div className="flex justify-end pt-1">
                  <Button
                    variant="danger"
                    size="sm"
                    className="min-h-[44px] w-full"
                    onClick={() =>
                      setConfirmModal({
                        isOpen: true,
                        title: `Delete Admin Account: ${a.name}`,
                        description: `Are you sure you want to revoke and delete admin privileges for ${a.email}?`,
                        warningNote:
                          "Deleting an admin will automatically unassign their managed hostel property.",
                        actionType: "delete_admin",
                        targetId: a.id,
                      })
                    }
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete Admin Privileges
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ================= 4. USERS TAB ================= */}
      {activeTab === "users" && (
        <Card padding="none" className="overflow-hidden border-surface-border rounded-[8px]">
          <div className="p-4 bg-surface border-b border-surface-border">
            <h2 className="font-heading font-bold text-base text-charcoal">
              Registered Tenants & Students
            </h2>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-muted text-charcoal-muted border-b border-surface-border">
                <tr>
                  <th className="py-2.5 px-4 font-bold">User Name</th>
                  <th className="py-2.5 px-4 font-bold">Email & Phone</th>
                  <th className="py-2.5 px-4 font-bold">Role</th>
                  <th className="py-2.5 px-4 font-bold">Status</th>
                  <th className="py-2.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border text-charcoal">
                {usersList.map((u) => (
                  <tr key={u.id}>
                    <td className="py-3 px-4 font-bold">{u.name}</td>
                    <td className="py-3 px-4">
                      <span>{u.email}</span>
                      <span className="text-[11px] text-charcoal-muted block">{u.phone}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="neutral">{u.role}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={u.status === "active" ? "success" : "danger"}>
                        {u.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {u.status === "active" ? (
                        <Button
                          variant="danger"
                          size="sm"
                          className="min-h-[44px]"
                          onClick={() =>
                            setConfirmModal({
                              isOpen: true,
                              title: `Suspend User Account: ${u.name}`,
                              description: `Are you sure you want to suspend user account ${u.email}?`,
                              warningNote: "The user will be blocked from logging in.",
                              actionType: "suspend_user",
                              targetId: u.id,
                            })
                          }
                        >
                          <Ban className="w-3.5 h-3.5 mr-1" /> Suspend
                        </Button>
                      ) : (
                        <span className="text-xs text-primary-900 font-bold">Suspended</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View: Stacked Users Cards */}
          <div className="md:hidden divide-y divide-surface-border">
            {usersList.map((u) => (
              <div key={u.id} className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-bold text-sm text-charcoal block">{u.name}</span>
                    <span className="text-xs text-charcoal-muted block">{u.email}</span>
                    <span className="text-xs text-charcoal-muted block">{u.phone}</span>
                  </div>
                  <Badge variant={u.status === "active" ? "success" : "danger"}>
                    {u.status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-charcoal-muted">Joined: {u.joinedDate}</span>
                  {u.status === "active" ? (
                    <Button
                      variant="danger"
                      size="sm"
                      className="min-h-[44px]"
                      onClick={() =>
                        setConfirmModal({
                          isOpen: true,
                          title: `Suspend User Account: ${u.name}`,
                          description: `Are you sure you want to suspend user account ${u.email}?`,
                          warningNote: "The user will be blocked from logging in.",
                          actionType: "suspend_user",
                          targetId: u.id,
                        })
                      }
                    >
                      <Ban className="w-3.5 h-3.5 mr-1" /> Suspend Account
                    </Button>
                  ) : (
                    <span className="text-xs text-primary-900 font-bold">Suspended</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ================= 5. REVIEWS MODERATION TAB ================= */}
      {activeTab === "reviews" && (
        <Card padding="none" className="overflow-hidden border-surface-border rounded-[8px]">
          <div className="p-4 bg-surface border-b border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-heading font-bold text-base text-charcoal">
                Reviews Moderation Queue & Rating Sync
              </h2>
              <p className="text-xs text-charcoal-muted">
                User-reported reviews across hostels awaiting superadmin audit
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRecalculateRating("hostel-kakkanad-1")}
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Force Recalculate Ratings
            </Button>
          </div>

          <div className="divide-y divide-surface-border">
            {reviewsList.map((rev) => (
              <div key={rev.id} className="p-4 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-xs text-charcoal">{rev.hostelName}</span>
                    <span className="text-xs text-charcoal-muted block">Reviewer: {rev.author} ({rev.rating}★)</span>
                  </div>
                  <Badge variant="danger">
                    Flagged: {rev.reportReason}
                  </Badge>
                </div>

                <p className="text-xs text-charcoal bg-primary-50 p-2.5 rounded-[6px] border border-primary/20">
                  &ldquo;{rev.comment}&rdquo;
                </p>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setReviewsList(reviewsList.filter((r) => r.id !== rev.id));
                      alert("Report dismissed. Review remains published.");
                    }}
                  >
                    <Check className="w-3.5 h-3.5 mr-1" /> Dismiss Report
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() =>
                      setConfirmModal({
                        isOpen: true,
                        title: `Remove Flagged Review`,
                        description: `Are you sure you want to permanently remove this review from ${rev.hostelName}?`,
                        warningNote: "This will trigger recalculation of the hostel's average rating.",
                        actionType: "remove_review",
                        targetId: rev.id,
                      })
                    }
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete Review
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ================= PROVISION ADMIN MODAL ================= */}
      {isProvisionAdminOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60">
          <Card padding="lg" className="max-w-md w-full bg-white space-y-4 shadow-2xl rounded-t-2xl sm:rounded-[10px] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-heading font-bold text-base text-charcoal">
                Provision New Hostel Admin
              </h3>
              <button
                type="button"
                onClick={() => setIsProvisionAdminOpen(false)}
                className="text-charcoal-muted hover:text-charcoal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleProvisionAdmin} className="space-y-3">
              <Input
                label="Admin Full Name"
                placeholder="e.g. Radhakrishnan Nair"
                value={newAdminData.name}
                onChange={(e) =>
                  setNewAdminData({ ...newAdminData, name: e.target.value })
                }
                required
              />

              <Input
                label="Admin Login Email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="warden@hostel.in"
                value={newAdminData.email}
                onChange={(e) =>
                  setNewAdminData({ ...newAdminData, email: e.target.value })
                }
                required
              />

              <Input
                label="Contact Phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+91 98470 XXXXX"
                value={newAdminData.phone}
                onChange={(e) =>
                  setNewAdminData({ ...newAdminData, phone: e.target.value })
                }
                required
              />

              <Input
                label="Assigned Property Name"
                value={newAdminData.assignedHostel}
                onChange={(e) =>
                  setNewAdminData({
                    ...newAdminData,
                    assignedHostel: e.target.value,
                  })
                }
                required
              />

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsProvisionAdminOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Provision Admin Account
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* ================= CONFIRMATION MODAL FOR DESTRUCTIVE ACTIONS ================= */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60">
          <Card padding="lg" className="max-w-md w-full bg-white space-y-4 shadow-2xl rounded-t-2xl sm:rounded-[10px] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-2 text-primary-900">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-heading font-bold text-base">
                {confirmModal.title}
              </h3>
            </div>

            <p className="text-xs text-charcoal leading-relaxed">
              {confirmModal.description}
            </p>

            {confirmModal.warningNote && (
              <div className="p-3 bg-primary-50 border border-primary-900/20 rounded-[6px] text-[11px] text-primary-900">
                {confirmModal.warningNote}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setConfirmModal({ ...confirmModal, isOpen: false })
                }
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleExecuteDestructiveAction}
              >
                Confirm Deletion / Action
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
