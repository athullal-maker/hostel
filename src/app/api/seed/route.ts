import { NextResponse } from "next/server";
import { seedKeralaLocations } from "@/lib/seedKeralaLocations";

export async function POST() {
  try {
    const result = await seedKeralaLocations();
    return NextResponse.json({
      success: true,
      message: "Kerala locations seeded successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error seeding locations:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to seed locations",
      },
      { status: 500 }
    );
  }
}
