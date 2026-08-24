import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Hostel from "@/models/Hostel";
import Room from "@/models/Room";
import City from "@/models/City";
import Enquiry from "@/models/Enquiry";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user.role !== "admin" && session.user.role !== "superadmin")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();

    // 1. Find hostel owned by this admin
    let hostel = await Hostel.findOne({ adminId: session.user.id })
      .populate("cityId", "name slug")
      .lean();

    // 2. Fallback: Check if assigned by SuperAdmin via user.hostelId
    if (!hostel) {
      const userDoc = await User.findById(session.user.id);
      if (userDoc && (userDoc as any).hostelId) {
        hostel = await Hostel.findById((userDoc as any).hostelId)
          .populate("cityId", "name slug")
          .lean();
        if (hostel) {
          // Sync bidirectional ownership
          await Hostel.findByIdAndUpdate(hostel._id, { $set: { adminId: session.user.id } });
        }
      }
    }

    // 3. If still none found, create a dedicated starter hostel exclusively for this admin
    if (!hostel) {
      let city = (await City.findOne({ slug: "kochi" })) || (await City.findOne({}));
      if (city) {
        const created = await Hostel.create({
          adminId: session.user.id,
          name: `${session.user.name || "Admin"}'s Hostel`,
          description: "Comfortable, safe, and hygienic hostel accommodation in Kerala with homestyle food and Wi-Fi.",
          cityId: city._id,
          fullAddress: "Kakkanad, Kochi, Kerala",
          location: {
            type: "Point",
            coordinates: [76.357, 10.0159],
          },
          hostelType: "boys",
          totalCapacity: 30,
          status: "approved",
          amenities: ["Homestyle Food Included", "High-speed 100 Mbps Wi-Fi", "Two-Wheeler Parking"],
          coverImage: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
          galleryImages: [
            "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
          ],
        });
        hostel = await Hostel.findById(created._id).populate("cityId", "name slug").lean();
      }
    }

    // Fetch rooms for this hostel
    const rooms = hostel ? await Room.find({ hostelId: hostel._id }).lean() : [];

    // Fetch enquiries/leads for this hostel
    const enquiries = hostel ? await Enquiry.find({ hostelId: hostel._id }).sort({ createdAt: -1 }).lean() : [];

    return NextResponse.json({
      success: true,
      data: {
        hostel,
        rooms,
        enquiries,
      },
    });
  } catch (error) {
    console.error("Error fetching admin hostel data:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch hostel" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user.role !== "admin" && session.user.role !== "superadmin")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    await connectDB();

    let hostel = await Hostel.findOne({ adminId: session.user.id });

    if (!hostel) {
      const userDoc = await User.findById(session.user.id);
      if (userDoc && (userDoc as any).hostelId) {
        hostel = await Hostel.findById((userDoc as any).hostelId);
        if (hostel) {
          hostel.adminId = session.user.id as any;
        }
      }
    }

    if (!hostel) {
      let city = (await City.findOne({ slug: "kochi" })) || (await City.findOne({}));
      hostel = await Hostel.create({
        adminId: session.user.id,
        name: body.name || "My Hostel",
        description: body.foodType || "Quality hostel accommodation",
        cityId: city?._id,
        fullAddress: body.fullAddress || "Kochi, Kerala",
        location: {
          type: "Point",
          coordinates: [76.357, 10.0159],
        },
        hostelType: body.hostelType || "boys",
        totalCapacity: body.totalCapacity || 30,
        amenities: body.amenities || [],
        rules: body.curfew || "",
        checkInTime: body.checkInTime || "12:00 PM",
        checkOutTime: body.checkOutTime || "11:00 AM",
        coverImage: body.coverImage || "",
        galleryImages: body.galleryImages || [],
        status: "approved",
      });
    } else {
      hostel.name = body.name || hostel.name;
      hostel.fullAddress = body.fullAddress || hostel.fullAddress;
      hostel.hostelType = body.hostelType || hostel.hostelType;
      hostel.totalCapacity = body.totalCapacity || hostel.totalCapacity;
      hostel.amenities = body.amenities || hostel.amenities;
      hostel.rules = body.curfew || hostel.rules;
      hostel.checkInTime = body.checkInTime || hostel.checkInTime;
      hostel.checkOutTime = body.checkOutTime || hostel.checkOutTime;
      hostel.coverImage = body.coverImage || hostel.coverImage;
      hostel.galleryImages = body.galleryImages || hostel.galleryImages;
      if (body.foodType) {
        hostel.description = body.foodType;
      }
      await hostel.save();
    }

    // Save rooms if provided
    if (body.rooms && Array.isArray(body.rooms)) {
      await Room.deleteMany({ hostelId: hostel._id });
      for (const r of body.rooms) {
        await Room.create({
          hostelId: hostel._id,
          roomType: r.type || r.roomType,
          capacity: r.capacity || 2,
          pricePerBed: r.price || r.pricePerBed || 5000,
          bedsAvailable: r.bedsAvailable ?? 2,
          amenities: typeof r.amenities === "string" ? r.amenities.split(",").map((s: string) => s.trim()) : r.amenities || [],
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Hostel profile and room inventory saved to database",
      data: hostel,
    });
  } catch (error) {
    console.error("Error saving admin hostel data:", error);
    return NextResponse.json({ success: false, error: "Failed to save hostel" }, { status: 500 });
  }
}
