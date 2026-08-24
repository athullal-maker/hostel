import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Hostel from "@/models/Hostel";
import City from "@/models/City";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "superadmin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { name, email, phone, password, assignedHostel } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check existing
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    const defaultPassword = password || "Admin@2026";
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    const newAdmin = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || "",
      passwordHash,
      role: "admin",
    });

    // Find default city (or first available)
    let city = await City.findOne({ slug: "kochi" });
    if (!city) {
      city = await City.findOne({});
    }

    // Provision the initial hostel document assigned to this admin
    if (assignedHostel && city) {
      await Hostel.create({
        adminId: newAdmin._id,
        name: assignedHostel.trim(),
        description: `${assignedHostel} - Verified hostel accommodation with homestyle Kerala food, high-speed Wi-Fi, and 24x7 security.`,
        cityId: city._id,
        fullAddress: `${assignedHostel}, Kakkanad, Kochi, Kerala`,
        location: {
          type: "Point",
          coordinates: [76.357, 10.0159], // Kakkanad coordinates
        },
        hostelType: "boys",
        totalCapacity: 40,
        amenities: [
          "Homestyle Food Included",
          "High-speed 100 Mbps Wi-Fi",
          "Warden 24x7",
          "Two-Wheeler Parking",
          "RO Purified Water",
          "Power Backup Generator",
        ],
        status: "approved",
        coverImage: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
        galleryImages: [
          "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80",
        ],
      });
    }

    return NextResponse.json({
      success: true,
      message: `Admin account provisioned successfully. Default password is ${defaultPassword}`,
      data: {
        id: newAdmin._id.toString(),
        name: newAdmin.name,
        email: newAdmin.email,
        phone: newAdmin.phone,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    console.error("Error provisioning admin:", error);
    return NextResponse.json(
      { success: false, error: "Failed to provision admin account" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "superadmin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { id, name, email, phone, password, assignedHostelId } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, error: "Admin ID is required" }, { status: 400 });
    }

    await connectDB();

    const updateData: any = {};
    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.toLowerCase().trim();
    if (phone !== undefined) updateData.phone = phone.trim();
    if (password && password.trim().length >= 6) {
      const hash = await bcrypt.hash(password.trim(), 10);
      updateData.passwordHash = hash;
      updateData.password = hash;
    }

    const updatedUser = await User.findByIdAndUpdate(id, { $set: updateData }, { new: true });

    if (assignedHostelId) {
      // Reassign this hostel to the admin
      await Hostel.updateMany({ adminId: id }, { $unset: { adminId: "" } });
      await Hostel.findByIdAndUpdate(assignedHostelId, { $set: { adminId: id } });
      if (updatedUser) {
        (updatedUser as any).hostelId = assignedHostelId;
        await updatedUser.save();
      }
    }

    return NextResponse.json({
      success: true,
      message: "Admin account updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating admin:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update admin account" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "superadmin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get("id");

    if (!adminId) {
      return NextResponse.json({ success: false, error: "Admin ID is required" }, { status: 400 });
    }

    await connectDB();

    await User.findByIdAndDelete(adminId);
    // Unassign hostels belonging to this admin
    await Hostel.updateMany({ adminId }, { $unset: { adminId: "" } });

    return NextResponse.json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting admin:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete admin account" },
      { status: 500 }
    );
  }
}
