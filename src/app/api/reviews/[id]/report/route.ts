import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole, AuthError } from "@/lib/authGuard";
import connectDB from "@/lib/mongodb";
import { Review } from "@/models";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/reviews/[id]/report
 * Allows users to report an inappropriate review to the SuperAdmin moderation queue.
 */
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id: reviewId } = await context.params;
    const session = await getServerSession(authOptions);
    const user = requireRole(session, ["user", "admin", "superadmin"]);

    const body = await request.json();
    const { reason } = body;

    if (!reason || typeof reason !== "string" || reason.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid report reason" },
        { status: 400 }
      );
    }

    await connectDB();

    const review = await Review.findById(reviewId);
    if (!review) {
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 }
      );
    }

    review.isReported = true;
    review.reportReason = reason.trim();
    review.reportedBy = user.id;
    review.reportedAt = new Date();
    await review.save();

    return NextResponse.json({
      success: true,
      message: "Review reported successfully and submitted to superadmin moderation queue.",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode }
      );
    }

    console.error("Error reporting review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to report review" },
      { status: 500 }
    );
  }
}
