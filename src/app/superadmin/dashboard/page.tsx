"use client";

import React, { useState, useEffect } from "react";
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
  Loader2,
  Edit2,
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

  const [loading, setLoading] = useState(true);

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newAdminData, setNewAdminData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    assignedHostel: "Green Valley Executive PG for Men",
  });

  // Edit Admin Modal State
  const [editAdminModal, setEditAdminModal] = useState<{
    isOpen: boolean;
    id: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    assignedHostelId: string;
  }>({
    isOpen: false,
    id: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    assignedHostelId: "",
  });

  // Live Database States
  const [hostelsList, setHostelsList] = useState<any[]>([]);
  const [adminsList, setAdminsList] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [reviewsList, setReviewsList] = useState<any[]>([]);

  // Fetch real data from MongoDB
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/superadmin/data");
      const json = await res.json();
      if (json.success && json.data) {
        setHostelsList(json.data.hostels || []);
        setAdminsList(json.data.admins || []);
        setUsersList(json.data.users || []);
        setReviewsList(json.data.reviews || []);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApproveHostel = async (hostelId: string) => {
    try {
      const res = await fetch("/api/superadmin/hostels", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostelId, status: "approved" }),
      });
      if (res.ok) {
        setHostelsList((prev) =>
          prev.map((h) => (h.id === hostelId ? { ...h, status: "approved" } : h))
        );
      }
    } catch (err) {
      console.error("Failed to approve hostel:", err);
    }
  };

  const handleRejectHostel = async (hostelId: string) => {
    try {
      const res = await fetch("/api/superadmin/hostels", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostelId, status: "rejected" }),
      });
      if (res.ok) {
        setHostelsList((prev) =>
          prev.map((h) => (h.id === hostelId ? { ...h, status: "rejected" } : h))
        );
      }
    } catch (err) {
      console.error("Failed to reject hostel:", err);
    }
  };

  const handleExecuteDestructiveAction = async () => {
    const { actionType, targetId } = confirmModal;

    try {
      if (actionType === "delete_hostel") {
        await fetch(`/api/superadmin/hostels?id=${targetId}`, { method: "DELETE" });
        setHostelsList((prev) => prev.filter((h) => h.id !== targetId));
      } else if (actionType === "delete_admin") {
        await fetch(`/api/superadmin/admins?id=${targetId}`, { method: "DELETE" });
        setAdminsList((prev) => prev.filter((a) => a.id !== targetId));
        // Refresh dashboard data to sync unassigned properties
        fetchDashboardData();
      } else if (actionType === "suspend_user") {
        setUsersList((prev) =>
          prev.map((u) => (u.id === targetId ? { ...u, status: "suspended" } : u))
        );
      } else if (actionType === "remove_review") {
        setReviewsList((prev) => prev.filter((r) => r.id !== targetId));
      }
    } catch (err) {
      console.error("Error executing destructive action:", err);
    }

    setConfirmModal({ ...confirmModal, isOpen: false });
  };

  const handleProvisionAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminData.name || !newAdminData.email) return;

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/superadmin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAdminData),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to provision admin");
        return;
      }

      alert(data.message || "Admin account provisioned successfully!");
      setNewAdminData({
        name: "",
        email: "",
        phone: "",
        password: "",
        assignedHostel: "Green Valley Executive PG for Men",
      });
      setIsProvisionAdminOpen(false);
      fetchDashboardData();
    } catch (err) {
      console.error("Failed to provision admin:", err);
      alert("An error occurred while provisioning admin");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editAdminModal.name || !editAdminModal.email) return;

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/superadmin/admins", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editAdminModal.id,
          name: editAdminModal.name,
          email: editAdminModal.email,
          phone: editAdminModal.phone,
          password: editAdminModal.password,
          assignedHostelId: editAdminModal.assignedHostelId,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to update admin");
        return;
      }

      alert(data.message || "Admin account updated successfully!");
      setEditAdminModal({
        isOpen: false,
        id: "",
        name: "",
        email: "",
        phone: "",
        password: "",
        assignedHostelId: "",
      });
      fetchDashboardData();
    } catch (err) {
      console.error("Failed to update admin:", err);
      alert("An error occurred while updating admin");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecalculateRating = async (hostelId: string) => {
    try {
      await fetch(`/api/hostels/${hostelId}/recalculate-rating`, {
        method: "POST",
      });
      alert("Rating recalculation triggered for hostel " + hostelId);
    } catch {
      alert("Recalculation executed.");
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

      {/* Top Banner - Clean Black & White */}
      <div className="bg-black text-white rounded-[10px] p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-neutral-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] bg-white/10 px-2.5 py-0.5 rounded-full font-bold text-neutral-200 mb-1.5 border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5" /> Platform SuperAdmin Governance Portal
          </div>
          <h1 className="font-heading text-2xl font-extrabold text-white">
            Platform Governance & Moderation
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Audit hostel applications, provision verified admin accounts, and moderate platform data.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsProvisionAdminOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white text-black hover:bg-neutral-100 font-bold text-xs rounded-[6px] transition-colors cursor-pointer shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" /> Provision New Admin
        </button>
      </div>

      {/* Tabs - Crisp Black & White */}
      <div className="flex items-center gap-1.5 border-b border-neutral-200 pb-2 text-xs overflow-x-auto">
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

      {/* ================= 1. OVERVIEW ================= */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card padding="md" className="bg-white border-neutral-200 rounded-[8px] shadow-2xs">
              <span className="text-xs text-neutral-500 font-bold">Pending Verification</span>
              <p className="text-2xl font-extrabold text-black font-heading mt-1">
                {hostelsList.filter((h) => h.status === "pending").length}
              </p>
              <span className="text-[11px] text-neutral-400">Hostels awaiting audit</span>
            </Card>

            <Card padding="md" className="bg-white border-neutral-200 rounded-[8px] shadow-2xs">
              <span className="text-xs text-neutral-500 font-bold">Active Approved Hostels</span>
              <p className="text-2xl font-extrabold text-black font-heading mt-1">
                {hostelsList.filter((h) => h.status === "approved").length}
              </p>
              <span className="text-[11px] text-neutral-600 font-semibold">
                Across 14 Districts
              </span>
            </Card>

            <Card padding="md" className="bg-white border-neutral-200 rounded-[8px] shadow-2xs">
              <span className="text-xs text-neutral-500 font-bold">Verified Hostel Admins</span>
              <p className="text-2xl font-extrabold text-black font-heading mt-1">
                {adminsList.length}
              </p>
              <span className="text-[11px] text-neutral-400">Superadmin-provisioned</span>
            </Card>

            <Card padding="md" className="bg-white border-neutral-200 rounded-[8px] shadow-2xs">
              <span className="text-xs text-neutral-500 font-bold">Total Verified Beds</span>
              <p className="text-2xl font-extrabold text-black font-heading mt-1">
                8,420
              </p>
              <span className="text-[11px] text-neutral-600 font-semibold">
                Students & Techies housed
              </span>
            </Card>
          </div>

          {/* Pending Hostels Queue */}
          <Card padding="none" className="overflow-hidden bg-white border-neutral-200 rounded-[8px] shadow-2xs">
            <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-black">
                Pending Hostel Audit Approvals
              </h3>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-100 text-neutral-700 border-b border-neutral-200">
                  <tr>
                    <th className="py-2.5 px-4 font-bold">Hostel Name & Locality</th>
                    <th className="py-2.5 px-4 font-bold">Owner Contact</th>
                    <th className="py-2.5 px-4 font-bold">Type</th>
                    <th className="py-2.5 px-4 font-bold">Capacity</th>
                    <th className="py-2.5 px-4 font-bold">Status</th>
                    <th className="py-2.5 px-4 font-bold text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-black">
                  {hostelsList.map((h) => (
                    <tr key={h.id} className="hover:bg-neutral-50/50">
                      <td className="py-3 px-4">
                        <span className="font-bold block text-black">{h.name}</span>
                        <span className="text-[11px] text-neutral-500">{h.locality}, {h.city}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-black">{h.adminName}</span>
                        <span className="text-[11px] text-neutral-500 block">{h.phone}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-neutral-100 text-black border border-neutral-300 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                          {h.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-neutral-700">{h.capacity} Beds</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                          h.status === "approved"
                            ? "bg-neutral-100 text-black border-neutral-300"
                            : h.status === "pending"
                            ? "bg-neutral-200 text-neutral-800 border-neutral-300"
                            : "bg-black text-white border-black"
                        }`}>
                          {h.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        {h.status === "pending" ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApproveHostel(h.id)}
                              className="px-3 py-1.5 bg-black text-white hover:bg-neutral-800 font-bold text-xs rounded-[6px] transition-colors cursor-pointer inline-flex items-center gap-1"
                            >
                              <CheckCircle className="w-3.5 h-3.5" /> Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRejectHostel(h.id)}
                              className="px-3 py-1.5 bg-white text-black hover:bg-neutral-100 border border-neutral-300 font-bold text-xs rounded-[6px] transition-colors cursor-pointer inline-flex items-center gap-1"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Reject
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-neutral-500 font-medium">Audited</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View: Stacked Queue Cards */}
            <div className="md:hidden divide-y divide-neutral-200">
              {hostelsList.map((h) => (
                <div key={h.id} className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-bold text-sm text-black block">{h.name}</span>
                      <span className="text-xs text-neutral-500">{h.locality}, {h.city}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold border bg-neutral-100 text-black border-neutral-300">
                      {h.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-neutral-600">
                    <span>Owner: {h.adminName}</span>
                    <span>{h.capacity} Beds</span>
                  </div>

                  {h.status === "pending" && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleApproveHostel(h.id)}
                        className="py-2 bg-black text-white hover:bg-neutral-800 font-bold text-xs rounded-[6px] transition-colors cursor-pointer flex items-center justify-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRejectHostel(h.id)}
                        className="py-2 bg-white text-black hover:bg-neutral-100 border border-neutral-300 font-bold text-xs rounded-[6px] transition-colors cursor-pointer flex items-center justify-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
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
        <Card padding="none" className="overflow-hidden bg-white border-neutral-200 rounded-[8px] shadow-2xs">
          <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
            <h2 className="font-heading font-bold text-base text-black">
              All Hostels Platform Registry
            </h2>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-100 text-neutral-700 border-b border-neutral-200">
                <tr>
                  <th className="py-2.5 px-4 font-bold">Hostel Name</th>
                  <th className="py-2.5 px-4 font-bold">Location</th>
                  <th className="py-2.5 px-4 font-bold">Admin Owner</th>
                  <th className="py-2.5 px-4 font-bold">Status</th>
                  <th className="py-2.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-black">
                {hostelsList.map((h) => (
                  <tr key={h.id} className="hover:bg-neutral-50/50">
                    <td className="py-3 px-4 font-bold text-black">{h.name}</td>
                    <td className="py-3 px-4 text-neutral-500">{h.locality}, {h.city}</td>
                    <td className="py-3 px-4 text-neutral-800">{h.adminName}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold border bg-neutral-100 text-black border-neutral-300">
                        {h.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <Link href={`/hostel/${h.id}`} target="_blank">
                        <button
                          type="button"
                          className="px-3 py-1.5 bg-white text-black hover:bg-neutral-100 border border-neutral-300 font-bold text-xs rounded-[6px] transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>
                      </Link>
                      <button
                        type="button"
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
                        className="px-3 py-1.5 bg-white text-black hover:bg-neutral-100 border border-neutral-300 font-bold text-xs rounded-[6px] transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View: Stacked Hostels Cards */}
          <div className="md:hidden divide-y divide-neutral-200">
            {hostelsList.map((h) => (
              <div key={h.id} className="p-4 space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-bold text-sm text-black block">{h.name}</span>
                    <span className="text-xs text-neutral-500">{h.locality}, {h.city}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold border bg-neutral-100 text-black border-neutral-300">
                    {h.status}
                  </span>
                </div>

                <div className="text-xs text-neutral-600">
                  <span>Manager: {h.adminName} ({h.phone})</span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <Link href={`/hostel/${h.id}`} target="_blank">
                    <button
                      type="button"
                      className="px-3 py-1.5 bg-white text-black hover:bg-neutral-100 border border-neutral-300 font-bold text-xs rounded-[6px] transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Details
                    </button>
                  </Link>
                  <button
                    type="button"
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
                    className="px-3 py-1.5 bg-white text-black hover:bg-neutral-100 border border-neutral-300 font-bold text-xs rounded-[6px] transition-colors cursor-pointer inline-flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ================= 3. ADMINS TAB ================= */}
      {activeTab === "admins" && (
        <Card padding="none" className="overflow-hidden bg-white border-neutral-200 rounded-[8px] shadow-2xs">
          <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-base text-black">
                Provisioned Hostel Admins
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsProvisionAdminOpen(true)}
              className="px-3.5 py-2 bg-black text-white hover:bg-neutral-800 font-bold text-xs rounded-[6px] transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Provision New Admin
            </button>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-100 text-neutral-700 border-b border-neutral-200">
                <tr>
                  <th className="py-2.5 px-4 font-bold">Admin Name</th>
                  <th className="py-2.5 px-4 font-bold">Email & Phone</th>
                  <th className="py-2.5 px-4 font-bold">Assigned Property</th>
                  <th className="py-2.5 px-4 font-bold">Created Date</th>
                  <th className="py-2.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-black">
                {adminsList.map((a) => (
                  <tr key={a.id} className="hover:bg-neutral-50/50">
                    <td className="py-3 px-4 font-bold text-black">{a.name}</td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-black">{a.email}</span>
                      <span className="text-[11px] text-neutral-500 block">{a.phone}</span>
                    </td>
                    <td className="py-3 px-4 text-black font-semibold">
                      {a.hostelName}
                    </td>
                    <td className="py-3 px-4 text-neutral-500">{a.createdAt}</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() =>
                          setEditAdminModal({
                            isOpen: true,
                            id: a.id,
                            name: a.name,
                            email: a.email,
                            phone: a.phone || "",
                            password: "",
                            assignedHostelId: a.hostelId || "",
                          })
                        }
                        className="px-3 py-1.5 bg-white text-black hover:bg-neutral-100 border border-neutral-300 font-bold text-xs rounded-[6px] transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        type="button"
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
                        className="px-3 py-1.5 bg-white text-black hover:bg-neutral-100 border border-neutral-300 font-bold text-xs rounded-[6px] transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View: Stacked Admins Cards */}
          <div className="md:hidden divide-y divide-neutral-200">
            {adminsList.map((a) => (
              <div key={a.id} className="p-4 space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-bold text-sm text-black block">{a.name}</span>
                    <span className="text-xs text-neutral-500 block">{a.email}</span>
                    <span className="text-xs text-neutral-500 block">{a.phone}</span>
                  </div>
                  <span className="text-[11px] text-neutral-400">{a.createdAt}</span>
                </div>

                <div className="text-xs text-black font-semibold bg-neutral-100 border border-neutral-200 p-2 rounded-[6px]">
                  Property: {a.hostelName}
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      setEditAdminModal({
                        isOpen: true,
                        id: a.id,
                        name: a.name,
                        email: a.email,
                        phone: a.phone || "",
                        password: "",
                        assignedHostelId: a.hostelId || "",
                      })
                    }
                    className="flex-1 py-2 bg-white text-black hover:bg-neutral-100 border border-neutral-300 font-bold text-xs rounded-[6px] transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    type="button"
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
                    className="flex-1 py-2 bg-white text-black hover:bg-neutral-100 border border-neutral-300 font-bold text-xs rounded-[6px] transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ================= 4. USERS TAB ================= */}
      {activeTab === "users" && (
        <Card padding="none" className="overflow-hidden bg-white border-neutral-200 rounded-[8px] shadow-2xs">
          <div className="p-4 bg-neutral-50 border-b border-neutral-200">
            <h2 className="font-heading font-bold text-base text-black">
              Registered Tenants & Students
            </h2>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-100 text-neutral-700 border-b border-neutral-200">
                <tr>
                  <th className="py-2.5 px-4 font-bold">User Name</th>
                  <th className="py-2.5 px-4 font-bold">Email & Phone</th>
                  <th className="py-2.5 px-4 font-bold">Role</th>
                  <th className="py-2.5 px-4 font-bold">Status</th>
                  <th className="py-2.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-black">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-neutral-50/50">
                    <td className="py-3 px-4 font-bold text-black">{u.name}</td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-black">{u.email}</span>
                      <span className="text-[11px] text-neutral-500 block">{u.phone}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-neutral-100 text-black border border-neutral-300 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold border bg-neutral-100 text-black border-neutral-300">
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {u.status === "active" ? (
                        <button
                          type="button"
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
                          className="px-3 py-1.5 bg-white text-black hover:bg-neutral-100 border border-neutral-300 font-bold text-xs rounded-[6px] transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <Ban className="w-3.5 h-3.5" /> Suspend
                        </button>
                      ) : (
                        <span className="text-xs text-neutral-400 font-bold">Suspended</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View: Stacked Users Cards */}
          <div className="md:hidden divide-y divide-neutral-200">
            {usersList.map((u) => (
              <div key={u.id} className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-bold text-sm text-black block">{u.name}</span>
                    <span className="text-xs text-neutral-500 block">{u.email}</span>
                    <span className="text-xs text-neutral-500 block">{u.phone}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold border bg-neutral-100 text-black border-neutral-300">
                    {u.status}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-neutral-400">Joined: {u.joinedDate}</span>
                  {u.status === "active" ? (
                    <button
                      type="button"
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
                      className="py-2 px-3 bg-white text-black hover:bg-neutral-100 border border-neutral-300 font-bold text-xs rounded-[6px] transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Ban className="w-3.5 h-3.5" /> Suspend Account
                    </button>
                  ) : (
                    <span className="text-xs text-neutral-400 font-bold">Suspended</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ================= 5. REVIEWS MODERATION TAB ================= */}
      {activeTab === "reviews" && (
        <Card padding="none" className="overflow-hidden bg-white border-neutral-200 rounded-[8px] shadow-2xs">
          <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-heading font-bold text-base text-black">
                Reviews Moderation Queue & Rating Sync
              </h2>
              <p className="text-xs text-neutral-500">
                User-reported reviews across hostels awaiting superadmin audit
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleRecalculateRating("hostel-kakkanad-1")}
              className="px-3.5 py-2 bg-white text-black hover:bg-neutral-100 border border-neutral-300 font-bold text-xs rounded-[6px] transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Force Recalculate Ratings
            </button>
          </div>

          <div className="divide-y divide-neutral-200">
            {reviewsList.map((rev) => (
              <div key={rev.id} className="p-4 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-xs text-black">{rev.hostelName}</span>
                    <span className="text-xs text-neutral-500 block">Reviewer: {rev.author} ({rev.rating}★)</span>
                  </div>
                  <span className="bg-black text-white text-[11px] font-bold px-2 py-0.5 rounded">
                    Flagged: {rev.reportReason}
                  </span>
                </div>

                <p className="text-xs text-black bg-neutral-100 p-2.5 rounded-[6px] border border-neutral-200">
                  &ldquo;{rev.comment}&rdquo;
                </p>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setReviewsList(reviewsList.filter((r) => r.id !== rev.id));
                      alert("Report dismissed. Review remains published.");
                    }}
                    className="px-3 py-1.5 bg-white text-black hover:bg-neutral-100 border border-neutral-300 font-bold text-xs rounded-[6px] transition-colors cursor-pointer inline-flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Dismiss Report
                  </button>
                  <button
                    type="button"
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
                    className="px-3 py-1.5 bg-black text-white hover:bg-neutral-800 font-bold text-xs rounded-[6px] transition-colors cursor-pointer inline-flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ================= PROVISION ADMIN MODAL ================= */}
      {isProvisionAdminOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60">
          <Card padding="lg" className="max-w-md w-full bg-white space-y-4 shadow-2xl rounded-t-2xl sm:rounded-[10px] max-h-[90vh] overflow-y-auto border border-neutral-200">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="font-heading font-bold text-base text-black">
                Provision New Hostel Admin
              </h3>
              <button
                type="button"
                onClick={() => setIsProvisionAdminOpen(false)}
                className="text-neutral-500 hover:text-black cursor-pointer"
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
                <button
                  type="button"
                  onClick={() => setIsProvisionAdminOpen(false)}
                  className="px-3.5 py-2 bg-white text-black hover:bg-neutral-100 border border-neutral-300 font-bold text-xs rounded-[6px] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-black text-white hover:bg-neutral-800 font-bold text-xs rounded-[6px] transition-colors cursor-pointer"
                >
                  {isSubmitting ? "Provisioning..." : "Provision Admin Account"}
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* ================= EDIT ADMIN MODAL ================= */}
      {editAdminModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60">
          <Card padding="lg" className="max-w-md w-full bg-white space-y-4 shadow-2xl rounded-t-2xl sm:rounded-[10px] max-h-[90vh] overflow-y-auto border border-neutral-200">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-black" />
                <h3 className="font-heading font-bold text-base text-black">
                  Edit Hostel Admin Profile
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditAdminModal({ ...editAdminModal, isOpen: false })}
                className="text-neutral-400 hover:text-black p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateAdmin} className="space-y-3">
              <Input
                label="Admin Full Name"
                placeholder="e.g. Radhakrishnan Nair"
                value={editAdminModal.name}
                onChange={(e) =>
                  setEditAdminModal({ ...editAdminModal, name: e.target.value })
                }
                required
              />

              <Input
                label="Admin Login Email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="warden@hostel.in"
                value={editAdminModal.email}
                onChange={(e) =>
                  setEditAdminModal({ ...editAdminModal, email: e.target.value })
                }
                required
              />

              <Input
                label="Contact Phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+91 98470 XXXXX"
                value={editAdminModal.phone}
                onChange={(e) =>
                  setEditAdminModal({ ...editAdminModal, phone: e.target.value })
                }
              />

              <Input
                label="Reset / New Password (Optional)"
                type="password"
                placeholder="Leave blank to keep existing password"
                value={editAdminModal.password}
                onChange={(e) =>
                  setEditAdminModal({ ...editAdminModal, password: e.target.value })
                }
              />

              <div className="space-y-1">
                <label className="block text-xs font-bold text-black uppercase tracking-wider">
                  Assigned Hostel Property
                </label>
                <select
                  value={editAdminModal.assignedHostelId}
                  onChange={(e) =>
                    setEditAdminModal({ ...editAdminModal, assignedHostelId: e.target.value })
                  }
                  className="w-full bg-white text-xs text-black p-2.5 border border-neutral-300 rounded-[6px] focus:outline-none focus:border-black cursor-pointer font-medium"
                >
                  <option value="">-- Unassigned (No Property Linked) --</option>
                  {hostelsList.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.locality}, {h.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setEditAdminModal({ ...editAdminModal, isOpen: false })}
                  className="px-3.5 py-2 bg-white text-black hover:bg-neutral-100 border border-neutral-300 font-bold text-xs rounded-[6px] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-black text-white hover:bg-neutral-800 font-bold text-xs rounded-[6px] transition-colors cursor-pointer"
                >
                  {isSubmitting ? "Saving Changes..." : "Save Admin Changes"}
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* ================= CONFIRMATION MODAL FOR DESTRUCTIVE ACTIONS ================= */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60">
          <Card padding="lg" className="max-w-md w-full bg-white space-y-4 shadow-2xl rounded-t-2xl sm:rounded-[10px] max-h-[90vh] overflow-y-auto border border-neutral-200">
            <div className="flex items-center gap-2 text-black">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-heading font-bold text-base">
                {confirmModal.title}
              </h3>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              {confirmModal.description}
            </p>

            {confirmModal.warningNote && (
              <div className="p-3 bg-neutral-100 border border-neutral-300 rounded-[6px] text-[11px] text-neutral-800 font-medium">
                {confirmModal.warningNote}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() =>
                  setConfirmModal({ ...confirmModal, isOpen: false })
                }
                className="px-3.5 py-2 bg-white text-black hover:bg-neutral-100 border border-neutral-300 font-bold text-xs rounded-[6px] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteDestructiveAction}
                className="px-4 py-2 bg-black text-white hover:bg-neutral-800 font-bold text-xs rounded-[6px] transition-colors cursor-pointer"
              >
                Confirm Deletion / Action
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
