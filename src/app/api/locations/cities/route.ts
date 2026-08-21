import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { City, District } from "@/models";
import { KERALA_DISTRICTS_DATA } from "@/lib/seedKeralaLocations";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const districtId = searchParams.get("districtId");
  const districtSlug =
    searchParams.get("districtSlug") ||
    (districtId ? districtId.replace("dist-", "") : "");

  try {
    await connectDB();

    let query: Record<string, unknown> = {};

    if (districtId && !districtId.startsWith("dist-")) {
      query.districtId = districtId;
    } else if (districtSlug) {
      const district = await District.findOne({ slug: districtSlug });
      if (district) {
        query.districtId = district._id;
      }
    }

    const cities = await City.find(query).sort({ name: 1 }).lean();

    if (cities && cities.length > 0) {
      return NextResponse.json({
        success: true,
        data: cities,
      });
    }

    // Static fallback matching the district
    if (districtSlug) {
      const distData = KERALA_DISTRICTS_DATA.find(
        (d) => d.slug.toLowerCase() === districtSlug.toLowerCase()
      );
      if (distData) {
        return NextResponse.json({
          success: true,
          data: distData.cities.map((c) => ({
            _id: `city-${c.slug}`,
            name: c.name,
            slug: c.slug,
            districtId: districtId || `dist-${districtSlug}`,
          })),
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: [],
    });
  } catch (error) {
    console.error("MongoDB not reachable, using Kerala static fallback for cities:", error);

    if (districtSlug) {
      const distData = KERALA_DISTRICTS_DATA.find(
        (d) => d.slug.toLowerCase() === districtSlug.toLowerCase()
      );
      if (distData) {
        return NextResponse.json({
          success: true,
          data: distData.cities.map((c) => ({
            _id: `city-${c.slug}`,
            name: c.name,
            slug: c.slug,
            districtId: districtId || `dist-${districtSlug}`,
          })),
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: [],
    });
  }
}
