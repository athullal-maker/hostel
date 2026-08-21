import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole, AuthError } from "@/lib/authGuard";
import connectDB from "@/lib/mongodb";
import { Review, Hostel } from "@/models";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/hostels/[id]/recalculate-rating
 * Calculates and caches the average rating on the Hostel document from all active reviews.
 */
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id: hostelId } = await context.params;
    const session = await getServerSession(authOptions);
    requireRole(session, ["admin", "superadmin"]);

    await connectDB();

    await Review.calcAverageRating(hostelId);

    const updatedHostel = await Hostel.findById(hostelId).select("name avgRating");

    return NextResponse.json({
      success: true,
      message: "Hostel average rating recalculated and cached successfully",
      data: updatedHostel,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode }
      );
    }

    console.error("Error recalculating rating:", error);
    return NextResponse.json(
      { success: false, error: "Failed to recalculate rating" },
      { status: 500 }
    );
  }
}
