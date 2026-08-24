import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Hostel from "@/models/Hostel";
import Room from "@/models/Room";

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "superadmin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { hostelId, status } = await request.json();
    if (!hostelId || !status) {
      return NextResponse.json({ success: false, error: "Hostel ID and status are required" }, { status: 400 });
    }

    await connectDB();

    const updated = await Hostel.findByIdAndUpdate(
      hostelId,
      { status },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: "Hostel not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Hostel status updated to ${status}`,
      data: updated,
    });
  } catch (error) {
    console.error("Error updating hostel status:", error);
    return NextResponse.json({ success: false, error: "Failed to update hostel" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "superadmin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const hostelId = searchParams.get("id");

    if (!hostelId) {
      return NextResponse.json({ success: false, error: "Hostel ID is required" }, { status: 400 });
    }

    await connectDB();

    await Hostel.findByIdAndDelete(hostelId);
    await Room.deleteMany({ hostelId });

    return NextResponse.json({
      success: true,
      message: "Hostel and inventory deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting hostel:", error);
    return NextResponse.json({ success: false, error: "Failed to delete hostel" }, { status: 500 });
  }
}
