import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireHostelOwnership, AuthError } from "@/lib/authGuard";
import Hostel from "@/models/Hostel";
import connectDB from "@/lib/mongodb";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/admin/hostels/[id]
 * Updates hostel details. Only accessible by the hostel owner (adminId) or superadmin.
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id: hostelId } = await context.params;
    const session = await getServerSession(authOptions);

    // 1. Guard check: verifies session and ownership before touching update logic
    // Throws AuthError (401/403/404) if unauthorized or not found
    await requireHostelOwnership(session, hostelId);

    const body = await request.json();

    // Prevent unauthorized mutation of protected administrative fields
    const disallowedUpdates = ["_id", "adminId", "avgRating", "createdAt", "updatedAt"];
    for (const field of disallowedUpdates) {
      delete body[field];
    }

    // Only superadmin can directly change approval status
    if (body.status && session?.user?.role !== "superadmin") {
      delete body.status;
    }

    await connectDB();

    const updatedHostel = await Hostel.findByIdAndUpdate(
      hostelId,
      { $set: body },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: "Hostel updated successfully",
      data: updatedHostel,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode }
      );
    }

    console.error("Error updating hostel:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/hostels/[id]
 * Retrieves hostel details for the admin owner or superadmin.
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id: hostelId } = await context.params;
    const session = await getServerSession(authOptions);

    const hostel = await requireHostelOwnership(session, hostelId);

    return NextResponse.json({
      success: true,
      data: hostel,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode }
      );
    }

    console.error("Error fetching admin hostel:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
