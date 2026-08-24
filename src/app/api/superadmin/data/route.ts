import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Hostel from "@/models/Hostel";
import Review from "@/models/Review";
import Enquiry from "@/models/Enquiry";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "superadmin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();

    // Fetch all hostels with populated admin & city
    const hostels = await Hostel.find({})
      .populate("adminId", "name email phone")
      .populate("cityId", "name slug")
      .sort({ createdAt: -1 })
      .lean();

    // Fetch all admins
    const admins = await User.find({ role: "admin" })
      .sort({ createdAt: -1 })
      .select("-passwordHash")
      .lean();

    // Fetch all regular users
    const users = await User.find({ role: "user" })
      .sort({ createdAt: -1 })
      .select("-passwordHash")
      .lean();

    // Fetch all reviews
    const reviews = await Review.find({})
      .populate("hostelId", "name")
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .lean();

    // Fetch all enquiries
    const enquiries = await Enquiry.find({})
      .populate("hostelId", "name")
      .sort({ createdAt: -1 })
      .lean();

    // Map hostels for easy frontend rendering
    const formattedHostels = hostels.map((h: any) => ({
      id: h._id.toString(),
      name: h.name,
      locality: h.fullAddress?.split(",")?.[0]?.trim() || "Kerala",
      city: h.cityId?.name || "Kochi",
      type: h.hostelType || "boys",
      adminName: h.adminId?.name || "Hostel Admin",
      phone: h.adminId?.phone || "+91 98470 XXXXX",
      status: h.status || "pending",
      capacity: h.totalCapacity || 30,
      coverImage: h.coverImage,
      galleryImages: h.galleryImages || [],
      amenities: h.amenities || [],
      avgRating: h.avgRating || 4.5,
    }));

    const formattedAdmins = admins.map((a: any) => {
      // find assigned hostel
      const assignedHostel = hostels.find(
        (h: any) => h.adminId?._id?.toString() === a._id.toString() || h.adminId?.toString() === a._id.toString()
      );
      return {
        id: a._id.toString(),
        name: a.name,
        email: a.email,
        phone: a.phone || "Not provided",
        hostelName: assignedHostel ? assignedHostel.name : "Unassigned Property",
        createdAt: new Date(a.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      };
    });

    const formattedUsers = users.map((u: any) => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      phone: u.phone || "Not provided",
      role: u.role,
      status: "active",
      joinedDate: new Date(u.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    }));

    const formattedReviews = reviews.map((r: any) => ({
      id: r._id.toString(),
      hostelId: r.hostelId?._id?.toString() || "",
      hostelName: r.hostelId?.name || "Kerala Hostel",
      author: r.userId?.name || "Verified Resident",
      rating: r.rating || 5,
      comment: r.comment,
      isReported: r.isReported || false,
      reportReason: r.reportReason || "Flagged for moderation",
      reportedAt: r.reportedAt
        ? new Date(r.reportedAt).toLocaleDateString("en-IN")
        : new Date(r.createdAt).toLocaleDateString("en-IN"),
    }));

    return NextResponse.json({
      success: true,
      data: {
        hostels: formattedHostels,
        admins: formattedAdmins,
        users: formattedUsers,
        reviews: formattedReviews,
        enquiries,
        stats: {
          totalHostels: formattedHostels.length,
          pendingHostels: formattedHostels.filter((h: any) => h.status === "pending").length,
          activeHostels: formattedHostels.filter((h: any) => h.status === "approved").length,
          totalAdmins: formattedAdmins.length,
          totalUsers: formattedUsers.length,
          totalEnquiries: enquiries.length,
        },
      },
    });
  } catch (error) {
    console.error("SuperAdmin data fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch superadmin data" },
      { status: 500 }
    );
  }
}
