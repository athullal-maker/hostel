import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { State } from "@/models";
import { seedKeralaLocations } from "@/lib/seedKeralaLocations";

export async function GET() {
  try {
    await connectDB();

    let states = await State.find().sort({ name: 1 }).lean();

    // Auto-seed Kerala locations if empty
    if (!states || states.length === 0) {
      await seedKeralaLocations();
      states = await State.find().sort({ name: 1 }).lean();
    }

    return NextResponse.json({
      success: true,
      data: states,
    });
  } catch (error) {
    console.error("Error fetching states:", error);
    // Fallback static data if MongoDB is unreachable during initial load
    return NextResponse.json({
      success: true,
      data: [{ _id: "state-kerala", name: "Kerala", slug: "kerala" }],
    });
  }
}
