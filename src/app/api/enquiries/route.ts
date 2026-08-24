import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";
import Hostel from "@/models/Hostel";

// Public endpoint: Student / Tenant submits lead inquiry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hostelId, name, phone, moveInDate, roomType, message } = body;

    if (!hostelId || !name || !phone) {
      return NextResponse.json(
        { success: false, error: "Hostel, name, and phone number are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const enquiry = await Enquiry.create({
      hostelId,
      name: name.trim(),
      phone: phone.trim(),
      moveInDate: moveInDate || "",
      roomType: roomType || "Flexible",
      message: message || "",
      status: "new",
    });

    return NextResponse.json({
      success: true,
      message: "Enquiry submitted successfully! Hostel manager will contact you shortly.",
      data: enquiry,
    });
  } catch (error) {
    console.error("Error submitting enquiry:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit enquiry" },
      { status: 500 }
    );
  }
}

import User from "@/models/User";

// Protected endpoint: Admins or SuperAdmin fetch leads
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    let query: any = {};
    if (session.user.role === "admin") {
      // Find admin's hostels
      const hostels = await Hostel.find({ adminId: session.user.id }).select("_id");
      let hostelIds = hostels.map((h) => h._id.toString());
      if (hostelIds.length === 0) {
        const userDoc = await User.findById(session.user.id);
        if (userDoc && (userDoc as any).hostelId) {
          hostelIds.push((userDoc as any).hostelId.toString());
        }
      }
      query.hostelId = { $in: hostelIds };
    }

    const enquiries = await Enquiry.find(query)
      .populate("hostelId", "name fullAddress")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: enquiries,
    });
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch enquiries" },
      { status: 500 }
    );
  }
}

// Protected endpoint: Update inquiry status (new -> contacted -> closed)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { enquiryId, status } = await request.json();
    await connectDB();

    const enquiry = await Enquiry.findById(enquiryId);
    if (!enquiry) {
      return NextResponse.json({ success: false, error: "Enquiry not found" }, { status: 404 });
    }

    // Role check: if admin, ensure enquiry belongs to their hostel
    if (session.user.role === "admin") {
      const hostel = await Hostel.findById(enquiry.hostelId);
      const isOwner =
        hostel &&
        (hostel.adminId?.toString() === session.user.id.toString() ||
          (await User.findById(session.user.id).then((u: any) => u?.hostelId?.toString() === enquiry.hostelId?.toString())));

      if (!isOwner) {
        return NextResponse.json(
          { success: false, error: "Forbidden: You do not own this hostel" },
          { status: 403 }
        );
      }
    }

    enquiry.status = status;
    await enquiry.save();

    return NextResponse.json({
      success: true,
      data: enquiry,
    });
  } catch (error) {
    console.error("Error updating enquiry status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update enquiry status" },
      { status: 500 }
    );
  }
}
