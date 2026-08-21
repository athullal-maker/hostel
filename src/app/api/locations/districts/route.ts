import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { District, State } from "@/models";
import { KERALA_DISTRICTS_DATA, seedKeralaLocations } from "@/lib/seedKeralaLocations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const stateId = searchParams.get("stateId");
    const stateSlug = searchParams.get("stateSlug") || "kerala";

    await connectDB();

    let query: Record<string, unknown> = {};

    if (stateId) {
      query.stateId = stateId;
    } else if (stateSlug) {
      const state = await State.findOne({ slug: stateSlug });
      if (state) {
        query.stateId = state._id;
      }
    }

    let districts = await District.find(query).sort({ name: 1 }).lean();

    if (!districts || districts.length === 0) {
      await seedKeralaLocations();
      districts = await District.find(query).sort({ name: 1 }).lean();
    }

    return NextResponse.json({
      success: true,
      data: districts,
    });
  } catch (error) {
    console.error("Error fetching districts:", error);
    // Static fallback
    const fallbackDistricts = KERALA_DISTRICTS_DATA.map((d, index) => ({
      _id: `dist-${d.slug}`,
      name: d.name,
      slug: d.slug,
      stateId: "state-kerala",
    }));

    return NextResponse.json({
      success: true,
      data: fallbackDistricts,
    });
  }
}
