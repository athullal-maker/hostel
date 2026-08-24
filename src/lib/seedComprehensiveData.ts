import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import {
  State,
  District,
  City,
  User,
  Hostel,
  Room,
  NearbyPlace,
  Review,
} from "@/models";
import Enquiry from "@/models/Enquiry";
import { seedKeralaLocations } from "./seedKeralaLocations";

export async function seedComprehensiveData() {
  await connectDB();
  console.log("🌱 Starting Comprehensive Seed for KeralaHostels Platform...");

  // 1. Seed Locations (State, Districts, Cities)
  await seedKeralaLocations();

  const keralaState = await State.findOne({ slug: "kerala" });
  const ernakulam = await District.findOne({ slug: "ernakulam" });
  const tvm = await District.findOne({ slug: "thiruvananthapuram" });
  const calicut = await District.findOne({ slug: "kozhikode" });

  const kakkanadCity = await City.findOne({ slug: "kakkanad" });
  const kalamasseryCity = await City.findOne({ slug: "kalamassery" });
  const kazhakkoottamCity = await City.findOne({ slug: "kazhakkoottam" });
  const nitCity = await City.findOne({ slug: "chathamangalam-nit" });
  const edappallyCity = await City.findOne({ slug: "edappally" });

  // 2. Hash default passwords
  const superAdminPassword = await bcrypt.hash("SuperAdmin@123", 10);
  const adminPassword = await bcrypt.hash("Admin@123", 10);
  const userPassword = await bcrypt.hash("Student@123", 10);

  // 3. Upsert SuperAdmin
  const superAdmin = await User.findOneAndUpdate(
    { email: "superadmin@keralahostels.in" },
    {
      name: "Platform SuperAdmin",
      email: "superadmin@keralahostels.in",
      password: superAdminPassword,
      role: "superadmin",
      phone: "+91 88845 18010",
      isPhoneVerified: true,
      isEmailVerified: true,
      city: "Kochi",
      state: "Kerala",
    },
    { upsert: true, new: true }
  );

  // 4. Create Hostels Data
  const hostelsSeedData = [
    {
      adminEmail: "admin.kakkanad@keralahostels.in",
      adminName: "Rajesh Menon",
      hostel: {
        name: "Green Valley Executive PG for Men",
        slug: "green-valley-executive-pg-men-kakkanad",
        hostelType: "boys",
        description:
          "Premium executive PG located just 350 meters from Infopark Phase 1 Express Gate. Ideal for IT professionals working at TCS, Cognizant, and Wipro. Includes 3-time hot homestyle Kerala meals, high-speed fiber Wi-Fi, 24x7 power backup generator, and biometric security.",
        cityId: kakkanadCity?._id,
        fullAddress: "Plot 42, Infopark Expressway, Kusumagiri, Kakkanad",
        pincode: "682030",
        location: {
          type: "Point",
          coordinates: [76.3572, 10.0159],
        },
        phone: "+91 98470 11223",
        whatsapp: "+91 98470 11223",
        email: "greenvalley.pg@gmail.com",
        amenities: [
          "Homestyle Food Included",
          "AC Available",
          "High-speed 100 Mbps Wi-Fi",
          "Attached Bathroom",
          "Warden 24x7",
          "No Night Curfew",
          "Power Backup Generator",
          "Two-Wheeler Parking",
          "Washing Machine / Laundry",
          "CCTV Surveillance",
        ],
        rules:
          "Visitors allowed in common lounge until 9:00 PM. Clean biometric entry with zero lockouts for shift workers. Quiet hours 11:00 PM - 6:00 AM.",
        foodType:
          "3-time Homestyle Kerala Meals Included (Fish Curry 3x/week, Chicken Biryani on Sundays, Veg meals daily). Self-cooking microwave station available.",
        coverImage:
          "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80",
        galleryImages: [
          "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80",
        ],
        startingPrice: 5500,
        totalCapacity: 45,
        approved: true,
        status: "approved",
        avgRating: 4.8,
        totalReviews: 28,
      },
      rooms: [
        { name: "Single Private Executive Room", type: "single", capacity: 1, totalBeds: 5, occupiedBeds: 4, monthlyRent: 10500, depositAmount: 15000, hasAC: true, hasAttachedBath: true },
        { name: "2-Sharing Standard AC Room", type: "2-sharing", capacity: 2, totalBeds: 20, occupiedBeds: 16, monthlyRent: 7000, depositAmount: 10000, hasAC: true, hasAttachedBath: true },
        { name: "3-Sharing Economy Non-AC Room", type: "3-sharing", capacity: 3, totalBeds: 20, occupiedBeds: 17, monthlyRent: 5500, depositAmount: 8000, hasAC: false, hasAttachedBath: true },
      ],
      nearby: [
        { name: "Infopark Phase 1 Main Gate", placeType: "it_park", distanceKm: 0.35, walkingTimeMinutes: 4 },
        { name: "SmartCity Kochi Hub", placeType: "it_park", distanceKm: 1.2, walkingTimeMinutes: 14 },
        { name: "Kakkanad Bus Terminal", placeType: "bus_stop", distanceKm: 1.8, walkingTimeMinutes: 20 },
      ],
    },
    {
      adminEmail: "admin.cusat@keralahostels.in",
      adminName: "Deepa Varma",
      hostel: {
        name: "Royal Palm Luxury Ladies Hostel & PG",
        slug: "royal-palm-ladies-hostel-kalamassery-cusat",
        hostelType: "girls",
        description:
          "Modern and secure ladies hostel situated 400m from CUSAT Main Campus Gate and Kalamassery Metro Station. Equipped with biometric facial recognition entry, 24/7 lady resident warden, CCTV surveillance, and dedicated study desks.",
        cityId: kalamasseryCity?._id,
        fullAddress: "Behind CUSAT South Gate, University Road, Kalamassery",
        pincode: "682022",
        location: {
          type: "Point",
          coordinates: [76.3218, 10.0468],
        },
        phone: "+91 94471 22334",
        whatsapp: "+91 94471 22334",
        email: "royalpalmladies@gmail.com",
        amenities: [
          "Homestyle Food Included",
          "AC Available",
          "High-speed 100 Mbps Wi-Fi",
          "Attached Bathroom",
          "Warden 24x7",
          "Power Backup Generator",
          "Two-Wheeler Parking",
          "Washing Machine / Laundry",
          "CCTV Surveillance",
          "Daily Housekeeping",
        ],
        rules:
          "Biometric in-time 9:30 PM for regular students. Late pass available for lab/project work and exam prep. Purely women-only premises.",
        foodType:
          "Nutritious Kerala & South Indian meals cooked by in-house chef. Special evening snacks and tea provided daily.",
        coverImage:
          "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
        galleryImages: [
          "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80",
        ],
        startingPrice: 5000,
        totalCapacity: 60,
        approved: true,
        status: "approved",
        avgRating: 4.9,
        totalReviews: 34,
      },
      rooms: [
        { name: "2-Sharing Premium AC", type: "2-sharing", capacity: 2, totalBeds: 24, occupiedBeds: 20, monthlyRent: 7500, depositAmount: 10000, hasAC: true, hasAttachedBath: true },
        { name: "3-Sharing Standard Non-AC", type: "3-sharing", capacity: 3, totalBeds: 24, occupiedBeds: 21, monthlyRent: 6000, depositAmount: 8000, hasAC: false, hasAttachedBath: true },
        { name: "4-Sharing Budget Friendly", type: "4-sharing", capacity: 4, totalBeds: 12, occupiedBeds: 10, monthlyRent: 5000, depositAmount: 6000, hasAC: false, hasAttachedBath: true },
      ],
      nearby: [
        { name: "CUSAT Main University Campus", placeType: "college", distanceKm: 0.4, walkingTimeMinutes: 5 },
        { name: "CUSAT Metro Station", placeType: "metro", distanceKm: 0.7, walkingTimeMinutes: 8 },
        { name: "Ernakulam Govt Medical College", placeType: "hospital", distanceKm: 2.1, walkingTimeMinutes: 25 },
      ],
    },
    {
      adminEmail: "admin.technopark@keralahostels.in",
      adminName: "Vishnu Pillai",
      hostel: {
        name: "Technopark Premium Co-Living Suites",
        slug: "technopark-premium-coliving-kazhakkoottam",
        hostelType: "co-ed",
        description:
          "Modern co-living space specifically designed for software engineers and tech startups in Trivandrum. Located 600m from Technopark Phase 1 Main Gate. Features soundproof private pod rooms, community lounge, gym, high-speed fiber internet, and self-cooking kitchen.",
        cityId: kazhakkoottamCity?._id,
        fullAddress: "Opposite Technopark Club House, Kazhakkoottam, Trivandrum",
        pincode: "695581",
        location: {
          type: "Point",
          coordinates: [76.8797, 8.5581],
        },
        phone: "+91 97442 33445",
        whatsapp: "+91 97442 33445",
        email: "technoparksuites@gmail.com",
        amenities: [
          "AC Available",
          "High-speed 100 Mbps Wi-Fi",
          "Attached Bathroom",
          "No Night Curfew",
          "Power Backup Generator",
          "Two-Wheeler Parking",
          "Washing Machine / Laundry",
          "CCTV Surveillance",
        ],
        rules:
          "24/7 keycard access with zero curfew restrictions. Shift workers and remote techies welcome. Common rooftop deck open till midnight.",
        foodType:
          "Flexible meal plans: Fully functional modular kitchen with induction, microwave & fridge. Optional Kerala lunch & dinner tiffin box delivery.",
        coverImage:
          "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80",
        galleryImages: [
          "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80",
          "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80",
        ],
        startingPrice: 6500,
        totalCapacity: 50,
        approved: true,
        status: "approved",
        avgRating: 4.7,
        totalReviews: 22,
      },
      rooms: [
        { name: "Studio Pod Single Suite", type: "single", capacity: 1, totalBeds: 10, occupiedBeds: 8, monthlyRent: 11000, depositAmount: 15000, hasAC: true, hasAttachedBath: true },
        { name: "2-Sharing Executive Suite", type: "2-sharing", capacity: 2, totalBeds: 24, occupiedBeds: 20, monthlyRent: 7500, depositAmount: 10000, hasAC: true, hasAttachedBath: true },
        { name: "3-Sharing Techie Room", type: "3-sharing", capacity: 3, totalBeds: 16, occupiedBeds: 12, monthlyRent: 6500, depositAmount: 9000, hasAC: true, hasAttachedBath: true },
      ],
      nearby: [
        { name: "Technopark Phase 1 Main Gate", placeType: "it_park", distanceKm: 0.6, walkingTimeMinutes: 7 },
        { name: "Kazhakkoottam Railway Station", placeType: "transit", distanceKm: 1.1, walkingTimeMinutes: 13 },
        { name: "Kerala University Kariavattom Campus", placeType: "college", distanceKm: 2.0, walkingTimeMinutes: 24 },
      ],
    },
    {
      adminEmail: "admin.nit@keralahostels.in",
      adminName: "Sajid Mohammed",
      hostel: {
        name: "Malabar Heights Scholars PG",
        slug: "malabar-heights-scholars-pg-nit-calicut",
        hostelType: "boys",
        description:
          "Peaceful, student-oriented accommodation located 500m from NIT Calicut Main Gate. Offers peaceful study atmosphere, high-speed Wi-Fi, homestyle Malabar food, generator backup, and bike parking.",
        cityId: nitCity?._id,
        fullAddress: "NIT Post, REC Campus Road, Chathamangalam, Calicut",
        pincode: "673601",
        location: {
          type: "Point",
          coordinates: [75.9333, 11.3216],
        },
        phone: "+91 96335 44556",
        whatsapp: "+91 96335 44556",
        email: "malabarheightspg@gmail.com",
        amenities: [
          "Homestyle Food Included",
          "High-speed 100 Mbps Wi-Fi",
          "Attached Bathroom",
          "Warden 24x7",
          "Power Backup Generator",
          "Two-Wheeler Parking",
          "Washing Machine / Laundry",
          "CCTV Surveillance",
        ],
        rules:
          "Quiet study environment after 10 PM. No smoking or alcohol allowed on premises. Late gate entry permitted for library study students.",
        foodType:
          "Homestyle Malabar meals (Breakfast, Lunch & Dinner included). Non-veg served 4 days a week with special biryani on Wednesdays.",
        coverImage:
          "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80",
        galleryImages: [
          "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1000&q=80",
        ],
        startingPrice: 4800,
        totalCapacity: 40,
        approved: true,
        status: "approved",
        avgRating: 4.8,
        totalReviews: 19,
      },
      rooms: [
        { name: "2-Sharing Study Room", type: "2-sharing", capacity: 2, totalBeds: 16, occupiedBeds: 14, monthlyRent: 6000, depositAmount: 8000, hasAC: false, hasAttachedBath: true },
        { name: "3-Sharing Scholar Room", type: "3-sharing", capacity: 3, totalBeds: 24, occupiedBeds: 20, monthlyRent: 4800, depositAmount: 6000, hasAC: false, hasAttachedBath: true },
      ],
      nearby: [
        { name: "NIT Calicut Main Gate", placeType: "college", distanceKm: 0.5, walkingTimeMinutes: 6 },
        { name: "REC Chathamangalam Bus Stop", placeType: "bus_stop", distanceKm: 0.3, walkingTimeMinutes: 4 },
      ],
    },
    {
      adminEmail: "admin.edappally@keralahostels.in",
      adminName: "Anand Kurian",
      hostel: {
        name: "Metro View Executive PG & Co-Living",
        slug: "metro-view-executive-pg-edappally",
        hostelType: "co-ed",
        description:
          "Brand-new modern PG situated just 200m from Edappally Metro Station and Lulu Mall Kochi. Excellent connectivity across Ernakulam district, with fully furnished AC rooms, attached baths, and 24x7 security.",
        cityId: edappallyCity?._id,
        fullAddress: "Near Toll Gate, Pipeline Road, Edappally, Kochi",
        pincode: "682024",
        location: {
          type: "Point",
          coordinates: [76.3082, 10.0261],
        },
        phone: "+91 98460 55667",
        whatsapp: "+91 98460 55667",
        email: "metroview.edappally@gmail.com",
        amenities: [
          "Homestyle Food Included",
          "AC Available",
          "High-speed 100 Mbps Wi-Fi",
          "Attached Bathroom",
          "No Night Curfew",
          "Power Backup Generator",
          "Two-Wheeler Parking",
          "Washing Machine / Laundry",
          "CCTV Surveillance",
        ],
        rules:
          "24/7 keycard access with zero curfew restrictions. Shift workers and remote techies welcome.",
        foodType:
          "Delicious 3-time South & North Indian meals included. Filtered RO water and microwave available on every floor.",
        coverImage:
          "https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1200&q=80",
        galleryImages: [
          "https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1000&q=80",
        ],
        startingPrice: 6000,
        totalCapacity: 35,
        approved: true,
        status: "approved",
        avgRating: 4.8,
        totalReviews: 16,
      },
      rooms: [
        { name: "Single AC Studio", type: "single", capacity: 1, totalBeds: 5, occupiedBeds: 4, monthlyRent: 11500, depositAmount: 15000, hasAC: true, hasAttachedBath: true },
        { name: "2-Sharing Executive AC", type: "2-sharing", capacity: 2, totalBeds: 18, occupiedBeds: 15, monthlyRent: 7500, depositAmount: 10000, hasAC: true, hasAttachedBath: true },
        { name: "3-Sharing Standard", type: "3-sharing", capacity: 3, totalBeds: 12, occupiedBeds: 10, monthlyRent: 6000, depositAmount: 8000, hasAC: false, hasAttachedBath: true },
      ],
      nearby: [
        { name: "Edappally Metro Station", placeType: "metro", distanceKm: 0.2, walkingTimeMinutes: 3 },
        { name: "Lulu International Shopping Mall", placeType: "mall", distanceKm: 0.5, walkingTimeMinutes: 6 },
        { name: "Amrita Institute of Medical Sciences", placeType: "hospital", distanceKm: 2.8, walkingTimeMinutes: 35 },
      ],
    },
  ];

  let seededHostelsCount = 0;
  let seededRoomsCount = 0;
  let seededEnquiriesCount = 0;
  let seededReviewsCount = 0;

  for (const item of hostelsSeedData) {
    // A. Upsert Admin User
    const adminUser = await User.findOneAndUpdate(
      { email: item.adminEmail },
      {
        name: item.adminName,
        email: item.adminEmail,
        password: adminPassword,
        role: "admin",
        phone: item.hostel.phone,
        isPhoneVerified: true,
        isEmailVerified: true,
        city: item.hostel.fullAddress.split(",").pop()?.trim() || "Kochi",
        state: "Kerala",
      },
      { upsert: true, new: true }
    );

    // B. Upsert Hostel
    let hostel = await Hostel.findOne({ slug: item.hostel.slug });
    if (!hostel) {
      hostel = await Hostel.create({
        ...item.hostel,
        location: {
          type: "Point" as const,
          coordinates: item.hostel.location.coordinates,
        },
        adminId: adminUser._id as any,
      } as any);
    } else {
      Object.assign(hostel, item.hostel, { adminId: adminUser._id });
      await hostel.save();
    }
    seededHostelsCount++;

    // Link admin user to their hostel
    (adminUser as any).hostelId = hostel._id;
    await adminUser.save();

    // C. Upsert Rooms for this hostel
    for (const r of item.rooms) {
      await Room.findOneAndUpdate(
        { hostelId: hostel._id, name: r.name },
        {
          hostelId: hostel._id,
          name: r.name,
          roomType: r.type,
          capacity: r.capacity,
          totalBeds: r.totalBeds,
          occupiedBeds: r.occupiedBeds,
          monthlyRent: r.monthlyRent,
          depositAmount: r.depositAmount,
          hasAC: r.hasAC,
          hasAttachedBath: r.hasAttachedBath,
          isActive: true,
        },
        { upsert: true }
      );
      seededRoomsCount++;
    }

    // D. Upsert Nearby Places
    for (const nb of item.nearby) {
      await NearbyPlace.findOneAndUpdate(
        { hostelId: hostel._id, name: nb.name },
        {
          hostelId: hostel._id,
          name: nb.name,
          placeType: nb.placeType,
          distanceKm: nb.distanceKm,
          walkingTimeMinutes: nb.walkingTimeMinutes,
        },
        { upsert: true }
      );
    }

    // E. Create realistic Student Enquiries for Admin Panel
    const sampleEnquiries = [
      {
        name: "Arjun Nair",
        phone: "+91 98471 88990",
        moveInDate: "2026-09-01",
        roomType: "2-Sharing Standard",
        message: "Hi, I am joining TCS Infopark next week. Is 2-sharing AC room available with food?",
        status: "new" as const,
      },
      {
        name: "Sneha Joseph",
        phone: "+91 97445 11223",
        moveInDate: "2026-09-05",
        roomType: "Single Private Room",
        message: "Hello! Looking for a quiet private room for CUSAT M.Tech studies. Please call back.",
        status: "contacted" as const,
      },
      {
        name: "Karthik R",
        phone: "+91 94460 77889",
        moveInDate: "2026-08-28",
        roomType: "3-Sharing Economy",
        message: "Can I visit tomorrow evening at 6 PM to see the room and food facility?",
        status: "new" as const,
      },
    ];

    for (const enq of sampleEnquiries) {
      await Enquiry.findOneAndUpdate(
        { hostelId: hostel._id, name: enq.name },
        {
          hostelId: hostel._id,
          name: enq.name,
          phone: enq.phone,
          moveInDate: enq.moveInDate,
          roomType: enq.roomType,
          message: enq.message,
          status: enq.status,
        },
        { upsert: true }
      );
      seededEnquiriesCount++;
    }

    // F. Create authentic student reviews
    const sampleReviews = [
      {
        authorName: "Gokul Krishna",
        rating: 5,
        comment:
          "Staying here for 8 months. Best homestyle Kerala food in this area, genuine zero brokerage, and warden is very supportive!",
        foodRating: 5,
        cleanlinessRating: 5,
        valueRating: 5,
        isVerifiedResident: true,
      },
      {
        authorName: "Ananya Pillai",
        rating: 5,
        comment:
          "Super fast Wi-Fi and 100% reliable power backup. Walking distance to office gates, highly recommended for tech professionals!",
        foodRating: 4.8,
        cleanlinessRating: 5,
        valueRating: 5,
        isVerifiedResident: true,
      },
    ];

    for (const rev of sampleReviews) {
      await Review.findOneAndUpdate(
        { hostelId: hostel._id, authorName: rev.authorName },
        {
          hostelId: hostel._id,
          authorName: rev.authorName,
          rating: rev.rating,
          comment: rev.comment,
          foodRating: rev.foodRating,
          cleanlinessRating: rev.cleanlinessRating,
          valueRating: rev.valueRating,
          isVerifiedResident: rev.isVerifiedResident,
          isPublished: true,
        },
        { upsert: true }
      );
      seededReviewsCount++;
    }
  }

  // 5. Create 3 Sample Student Users
  const studentUsers = [
    { name: "Rahul S", email: "rahul.student@gmail.com", phone: "+91 98470 00111" },
    { name: "Anjali Menon", email: "anjali.menon@gmail.com", phone: "+91 98470 00222" },
    { name: "Fahad Ali", email: "fahad.ali@gmail.com", phone: "+91 98470 00333" },
  ];

  for (const s of studentUsers) {
    await User.findOneAndUpdate(
      { email: s.email },
      {
        name: s.name,
        email: s.email,
        password: userPassword,
        role: "user",
        phone: s.phone,
        isPhoneVerified: true,
        isEmailVerified: true,
        city: "Kochi",
        state: "Kerala",
      },
      { upsert: true }
    );
  }

  console.log("✅ Comprehensive Seeding Complete!");
  return {
    superAdmin: superAdmin.email,
    hostels: seededHostelsCount,
    rooms: seededRoomsCount,
    enquiries: seededEnquiriesCount,
    reviews: seededReviewsCount,
    studentUsers: studentUsers.length,
  };
}
