import { NextResponse } from "next/server";
import { seedComprehensiveData } from "@/lib/seedComprehensiveData";

export async function POST() {
  try {
    const result = await seedComprehensiveData();
    return NextResponse.json({
      success: true,
      message: "Comprehensive database seed completed successfully",
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
