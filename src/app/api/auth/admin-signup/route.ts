import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, password } = body;

    // 1. Basic validation
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Admin / Manager name is required" },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "A valid email address is required" },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          error: "Password must be at least 6 characters long",
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Clean up obsolete/orphaned MongoDB indexes (such as legacy username_1 index)
    try {
      if (User.collection) {
        const indexes = await User.collection.indexes();
        const hasUsernameIndex = indexes.some((idx) => idx.name === "username_1");
        if (hasUsernameIndex) {
          await User.collection.dropIndex("username_1");
        }
      }
    } catch {
      // Ignore index cleanup errors
    }

    // 2. Check if user already exists
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "An account with this email address already exists",
        },
        { status: 409 }
      );
    }

    // 3. Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 4. Create admin user with role: 'admin'
    const newAdmin = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone ? phone.trim() : undefined,
      passwordHash,
      role: "admin",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Admin account registered successfully",
        user: {
          id: newAdmin._id.toString(),
          name: newAdmin.name,
          email: newAdmin.email,
          role: newAdmin.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Admin registration error:", error);

    // Handle MongoDB duplicate key error gracefully
    if (error?.code === 11000) {
      // If error is due to an orphaned username index, try dropping it
      if (error.keyPattern?.username || error.message?.includes("username_1")) {
        try {
          await User.collection.dropIndex("username_1");
        } catch {
          // Ignore
        }
        return NextResponse.json(
          {
            success: false,
            error: "Database index updated. Please submit the form again.",
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: "An account with this email address already exists",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to register admin account",
      },
      { status: 500 }
    );
  }
}
