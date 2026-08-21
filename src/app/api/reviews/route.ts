import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole, AuthError } from "@/lib/authGuard";
import connectDB from "@/lib/mongodb";
import { Review, Booking, Hostel } from "@/models";

/**
 * POST /api/reviews
 * Creates a review & rating.
 * STRICT REQUIREMENT: Only users with a COMPLETED booking for this hostel can leave a review.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user = requireRole(session, ["user", "admin", "superadmin"]);

    const body = await request.json();
    const { hostelId, bookingId, rating, comment } = body;

    // 1. Basic validation
    if (!hostelId || !bookingId) {
      return NextResponse.json(
        { success: false, error: "Hostel ID and Booking ID are required" },
        { status: 400 }
      );
    }

    const ratingNum = Number(rating);
    if (!ratingNum || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json(
        { success: false, error: "Rating must be a number between 1 and 5" },
        { status: 400 }
      );
    }

    if (!comment || typeof comment !== "string" || comment.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: "Review comment must be at least 5 characters long" },
        { status: 400 }
      );
    }

    await connectDB();

    // 2. Security & Verification Check: Verify that the user has a COMPLETED booking for this hostel
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking record not found" },
        { status: 404 }
      );
    }

    // Verify user ownership of the booking
    if (booking.userId.toString() !== user.id.toString()) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: You can only review hostels for your own verified stays",
        },
        { status: 403 }
      );
    }

    // Verify booking matches the hostel
    if (booking.hostelId.toString() !== hostelId.toString()) {
      return NextResponse.json(
        { success: false, error: "Booking does not match the selected hostel" },
        { status: 400 }
      );
    }

    // Verify that the booking status is 'completed'
    if (booking.bookingStatus !== "completed") {
      return NextResponse.json(
        {
          success: false,
          error:
            "Verified Stay Policy: Reviews can only be submitted after your booking status is 'completed'.",
        },
        { status: 403 }
      );
    }

    // 3. Prevent duplicate reviews for the same booking
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      return NextResponse.json(
        {
          success: false,
          error: "You have already submitted a review for this completed stay.",
        },
        { status: 409 }
      );
    }

    // 4. Create Review (Post-save hook automatically updates Hostel.avgRating)
    const newReview = await Review.create({
      hostelId,
      userId: user.id,
      bookingId,
      rating: ratingNum,
      comment: comment.trim(),
      isRemoved: false,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Review submitted successfully! Hostel average rating has been updated.",
        data: newReview,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode }
      );
    }

    console.error("Error creating review:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create review",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/reviews?hostelId=...
 * Fetches active public reviews for a hostel.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hostelId = searchParams.get("hostelId");

    if (!hostelId) {
      return NextResponse.json(
        { success: false, error: "Hostel ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const reviews = await Review.find({
      hostelId,
      isRemoved: { $ne: true },
    })
      .populate("userId", "name")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
