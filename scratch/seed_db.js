const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Read .env.local
const envFile = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
let MONGODB_URI = '';
envFile.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && k.trim() === 'MONGODB_URI') {
    MONGODB_URI = v.join('=').trim().replace(/^["']|["']$/g, '');
  }
});

if (!MONGODB_URI) {
  console.error("No MONGODB_URI found in .env.local");
  process.exit(1);
}

async function run() {
  console.log("Connecting to MongoDB:", MONGODB_URI);
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB!");

  const db = mongoose.connection.db;

  // 1. Setup State, District, City
  let keralaState = await db.collection('states').findOne({ slug: 'kerala' });
  if (!keralaState) {
    const res = await db.collection('states').insertOne({
      name: 'Kerala',
      slug: 'kerala',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    keralaState = { _id: res.insertedId, name: 'Kerala', slug: 'kerala' };
  }

  const districts = [
    { name: 'Ernakulam (Kochi)', slug: 'ernakulam' },
    { name: 'Thiruvananthapuram', slug: 'thiruvananthapuram' },
    { name: 'Kozhikode (Calicut)', slug: 'kozhikode' }
  ];

  const districtMap = {};
  for (const d of districts) {
    let distDoc = await db.collection('districts').findOne({ slug: d.slug });
    if (!distDoc) {
      const res = await db.collection('districts').insertOne({
        name: d.name,
        slug: d.slug,
        stateId: keralaState._id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      distDoc = { _id: res.insertedId, name: d.name, slug: d.slug };
    }
    districtMap[d.slug] = distDoc._id;
  }

  const cities = [
    { name: 'Kakkanad (Infopark)', slug: 'kakkanad', dist: 'ernakulam' },
    { name: 'Kalamassery (CUSAT)', slug: 'kalamassery', dist: 'ernakulam' },
    { name: 'Edappally (Metro Hub)', slug: 'edappally', dist: 'ernakulam' },
    { name: 'Kazhakkoottam (Technopark)', slug: 'kazhakkoottam', dist: 'thiruvananthapuram' },
    { name: 'Chathamangalam (NIT Calicut)', slug: 'chathamangalam-nit', dist: 'kozhikode' },
  ];

  const cityMap = {};
  for (const c of cities) {
    let cityDoc = await db.collection('cities').findOne({ slug: c.slug });
    if (!cityDoc) {
      const res = await db.collection('cities').insertOne({
        name: c.name,
        slug: c.slug,
        districtId: districtMap[c.dist],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      cityDoc = { _id: res.insertedId, name: c.name, slug: c.slug };
    }
    cityMap[c.slug] = cityDoc._id;
  }

  const superAdminPassword = await bcrypt.hash("SuperAdmin@123", 10);
  const adminPassword = await bcrypt.hash("Admin@123", 10);
  const studentPassword = await bcrypt.hash("Student@123", 10);

  // 2. SuperAdmin
  await db.collection('users').updateOne(
    { email: "superadmin@keralahostels.in" },
    {
      $set: {
        name: "Platform SuperAdmin",
        email: "superadmin@keralahostels.in",
        password: superAdminPassword,
        role: "superadmin",
        phone: "+91 88845 18010",
        isPhoneVerified: true,
        isEmailVerified: true,
        city: "Kochi",
        state: "Kerala",
        updatedAt: new Date()
      },
      $setOnInsert: { createdAt: new Date() }
    },
    { upsert: true }
  );

  // 3. Hostels List
  const hostelsData = [
    {
      adminEmail: "admin.kakkanad@keralahostels.in",
      adminName: "Rajesh Menon (Green Valley PG)",
      hostel: {
        name: "Green Valley Executive PG for Men",
        slug: "green-valley-executive-pg-men-kakkanad",
        hostelType: "boys",
        description: "Premium executive PG located just 350 meters from Infopark Phase 1 Express Gate. Ideal for IT professionals working at TCS, Cognizant, and Wipro. Includes 3-time hot homestyle Kerala meals, high-speed fiber Wi-Fi, 24x7 power backup generator, and biometric security.",
        cityId: cityMap['kakkanad'],
        fullAddress: "Plot 42, Infopark Expressway, Kusumagiri, Kakkanad, Kochi",
        pincode: "682030",
        location: { type: "Point", coordinates: [76.3572, 10.0159] },
        phone: "+91 98470 11223",
        whatsapp: "+91 98470 11223",
        email: "greenvalley.pg@gmail.com",
        amenities: ["Homestyle Food Included", "AC Available", "High-speed 100 Mbps Wi-Fi", "Attached Bathroom", "Warden 24x7", "No Night Curfew", "Power Backup Generator", "Two-Wheeler Parking", "Washing Machine / Laundry", "CCTV Surveillance"],
        rules: "Visitors allowed in common lounge until 9:00 PM. Clean biometric entry with zero lockouts for shift workers. Quiet hours 11:00 PM - 6:00 AM.",
        foodType: "3-time Homestyle Kerala Meals Included (Fish Curry 3x/week, Chicken Biryani on Sundays, Veg meals daily). Self-cooking microwave station available.",
        coverImage: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80",
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
        createdAt: new Date(),
        updatedAt: new Date()
      },
      rooms: [
        { name: "Single Private Executive Room", roomType: "single", capacity: 1, totalBeds: 5, occupiedBeds: 4, monthlyRent: 10500, depositAmount: 15000, hasAC: true, hasAttachedBath: true, isActive: true },
        { name: "2-Sharing Standard AC Room", roomType: "2-sharing", capacity: 2, totalBeds: 20, occupiedBeds: 16, monthlyRent: 7000, depositAmount: 10000, hasAC: true, hasAttachedBath: true, isActive: true },
        { name: "3-Sharing Economy Non-AC Room", roomType: "3-sharing", capacity: 3, totalBeds: 20, occupiedBeds: 17, monthlyRent: 5500, depositAmount: 8000, hasAC: false, hasAttachedBath: true, isActive: true },
      ],
      enquiries: [
        { name: "Arjun Nair", phone: "+91 98471 88990", moveInDate: "2026-09-01", roomType: "2-Sharing Standard", message: "Hi, I am joining TCS Infopark next week. Is 2-sharing AC room available with food?", status: "new" },
        { name: "Sreehari Menon", phone: "+91 97445 11223", moveInDate: "2026-09-05", roomType: "Single Private Room", message: "Looking for a quiet single room with AC and desk. Can I visit tomorrow?", status: "contacted" },
        { name: "Karthik R", phone: "+91 94460 77889", moveInDate: "2026-08-28", roomType: "3-Sharing Economy", message: "Need immediate accommodation near Infopark Gate 1.", status: "new" }
      ]
    },
    {
      adminEmail: "admin.cusat@keralahostels.in",
      adminName: "Deepa Varma (Royal Palm Ladies Hostel)",
      hostel: {
        name: "Royal Palm Luxury Ladies Hostel & PG",
        slug: "royal-palm-ladies-hostel-kalamassery-cusat",
        hostelType: "girls",
        description: "Modern and secure ladies hostel situated 400m from CUSAT Main Campus Gate and Kalamassery Metro Station. Equipped with biometric facial recognition entry, 24/7 lady resident warden, CCTV surveillance, and dedicated study desks.",
        cityId: cityMap['kalamassery'],
        fullAddress: "Behind CUSAT South Gate, University Road, Kalamassery, Kochi",
        pincode: "682022",
        location: { type: "Point", coordinates: [76.3218, 10.0468] },
        phone: "+91 94471 22334",
        whatsapp: "+91 94471 22334",
        email: "royalpalmladies@gmail.com",
        amenities: ["Homestyle Food Included", "AC Available", "High-speed 100 Mbps Wi-Fi", "Attached Bathroom", "Warden 24x7", "Power Backup Generator", "Two-Wheeler Parking", "Washing Machine / Laundry", "CCTV Surveillance", "Daily Housekeeping"],
        rules: "Biometric in-time 9:30 PM for regular students. Late pass available for lab/project work and exam prep. Purely women-only premises.",
        foodType: "Nutritious Kerala & South Indian meals cooked by in-house chef. Special evening snacks and tea provided daily.",
        coverImage: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
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
        createdAt: new Date(),
        updatedAt: new Date()
      },
      rooms: [
        { name: "2-Sharing Premium AC", roomType: "2-sharing", capacity: 2, totalBeds: 24, occupiedBeds: 20, monthlyRent: 7500, depositAmount: 10000, hasAC: true, hasAttachedBath: true, isActive: true },
        { name: "3-Sharing Standard Non-AC", roomType: "3-sharing", capacity: 3, totalBeds: 24, occupiedBeds: 21, monthlyRent: 6000, depositAmount: 8000, hasAC: false, hasAttachedBath: true, isActive: true },
        { name: "4-Sharing Budget Friendly", roomType: "4-sharing", capacity: 4, totalBeds: 12, occupiedBeds: 10, monthlyRent: 5000, depositAmount: 6000, hasAC: false, hasAttachedBath: true, isActive: true },
      ],
      enquiries: [
        { name: "Sneha Joseph", phone: "+91 97441 22334", moveInDate: "2026-09-02", roomType: "2-Sharing Premium AC", message: "Hi Deepa ma'am, I am joining CUSAT MSc Physics. Is 2-sharing room available?", status: "new" },
        { name: "Meera Krishnan", phone: "+91 98462 33445", moveInDate: "2026-09-10", roomType: "3-Sharing Standard", message: "Please share fee structure and food timing details.", status: "contacted" }
      ]
    },
    {
      adminEmail: "admin.technopark@keralahostels.in",
      adminName: "Vishnu Pillai (Technopark Suites)",
      hostel: {
        name: "Technopark Premium Co-Living Suites",
        slug: "technopark-premium-coliving-kazhakkoottam",
        hostelType: "co-ed",
        description: "Modern co-living space specifically designed for software engineers and tech startups in Trivandrum. Located 600m from Technopark Phase 1 Main Gate. Features soundproof private pod rooms, community lounge, gym, high-speed fiber internet, and self-cooking kitchen.",
        cityId: cityMap['kazhakkoottam'],
        fullAddress: "Opposite Technopark Club House, Kazhakkoottam, Trivandrum",
        pincode: "695581",
        location: { type: "Point", coordinates: [76.8797, 8.5581] },
        phone: "+91 97442 33445",
        whatsapp: "+91 97442 33445",
        email: "technoparksuites@gmail.com",
        amenities: ["AC Available", "High-speed 100 Mbps Wi-Fi", "Attached Bathroom", "No Night Curfew", "Power Backup Generator", "Two-Wheeler Parking", "Washing Machine / Laundry", "CCTV Surveillance"],
        rules: "24/7 keycard access with zero curfew restrictions. Shift workers and remote techies welcome. Common rooftop deck open till midnight.",
        foodType: "Flexible meal plans: Fully functional modular kitchen with induction, microwave & fridge. Optional Kerala lunch & dinner tiffin box delivery.",
        coverImage: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80",
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
        createdAt: new Date(),
        updatedAt: new Date()
      },
      rooms: [
        { name: "Studio Pod Single Suite", roomType: "single", capacity: 1, totalBeds: 10, occupiedBeds: 8, monthlyRent: 11000, depositAmount: 15000, hasAC: true, hasAttachedBath: true, isActive: true },
        { name: "2-Sharing Executive Suite", roomType: "2-sharing", capacity: 2, totalBeds: 24, occupiedBeds: 20, monthlyRent: 7500, depositAmount: 10000, hasAC: true, hasAttachedBath: true, isActive: true },
        { name: "3-Sharing Techie Room", roomType: "3-sharing", capacity: 3, totalBeds: 16, occupiedBeds: 12, monthlyRent: 6500, depositAmount: 9000, hasAC: true, hasAttachedBath: true, isActive: true },
      ],
      enquiries: [
        { name: "Adil Farooq", phone: "+91 99951 44556", moveInDate: "2026-09-01", roomType: "Studio Pod Single Suite", message: "Hi, I work night shifts at Infosys Technopark. Is 24/7 keycard entry allowed?", status: "new" }
      ]
    },
    {
      adminEmail: "admin.nit@keralahostels.in",
      adminName: "Sajid Mohammed (Malabar Heights)",
      hostel: {
        name: "Malabar Heights Scholars PG",
        slug: "malabar-heights-scholars-pg-nit-calicut",
        hostelType: "boys",
        description: "Peaceful, student-oriented accommodation located 500m from NIT Calicut Main Gate. Offers peaceful study atmosphere, high-speed Wi-Fi, homestyle Malabar food, generator backup, and bike parking.",
        cityId: cityMap['chathamangalam-nit'],
        fullAddress: "NIT Post, REC Campus Road, Chathamangalam, Calicut",
        pincode: "673601",
        location: { type: "Point", coordinates: [75.9333, 11.3216] },
        phone: "+91 96335 44556",
        whatsapp: "+91 96335 44556",
        email: "malabarheightspg@gmail.com",
        amenities: ["Homestyle Food Included", "High-speed 100 Mbps Wi-Fi", "Attached Bathroom", "Warden 24x7", "Power Backup Generator", "Two-Wheeler Parking", "Washing Machine / Laundry", "CCTV Surveillance"],
        rules: "Quiet study environment after 10 PM. No smoking or alcohol allowed on premises. Late gate entry permitted for library study students.",
        foodType: "Homestyle Malabar meals (Breakfast, Lunch & Dinner included). Non-veg served 4 days a week with special biryani on Wednesdays.",
        coverImage: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80",
        galleryImages: [
          "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1000&q=80",
        ],
        startingPrice: 4800,
        totalCapacity: 40,
        approved: true,
        status: "approved",
        avgRating: 4.8,
        totalReviews: 19,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      rooms: [
        { name: "2-Sharing Study Room", roomType: "2-sharing", capacity: 2, totalBeds: 16, occupiedBeds: 14, monthlyRent: 6000, depositAmount: 8000, hasAC: false, hasAttachedBath: true, isActive: true },
        { name: "3-Sharing Scholar Room", roomType: "3-sharing", capacity: 3, totalBeds: 24, occupiedBeds: 20, monthlyRent: 4800, depositAmount: 6000, hasAC: false, hasAttachedBath: true, isActive: true },
      ],
      enquiries: [
        { name: "Gautham Jayaraj", phone: "+91 98473 55667", moveInDate: "2026-09-01", roomType: "2-Sharing Study Room", message: "Hi, I am joining NIT Calicut B.Tech. Are there laundry facilities and food included?", status: "new" }
      ]
    },
    {
      adminEmail: "admin.edappally@keralahostels.in",
      adminName: "Anand Kurian (Metro View PG)",
      hostel: {
        name: "Metro View Executive PG & Co-Living",
        slug: "metro-view-executive-pg-edappally",
        hostelType: "co-ed",
        description: "Brand-new modern PG situated just 200m from Edappally Metro Station and Lulu Mall Kochi. Excellent connectivity across Ernakulam district, with fully furnished AC rooms, attached baths, and 24x7 security.",
        cityId: cityMap['edappally'],
        fullAddress: "Near Toll Gate, Pipeline Road, Edappally, Kochi",
        pincode: "682024",
        location: { type: "Point", coordinates: [76.3082, 10.0261] },
        phone: "+91 98460 55667",
        whatsapp: "+91 98460 55667",
        email: "metroview.edappally@gmail.com",
        amenities: ["Homestyle Food Included", "AC Available", "High-speed 100 Mbps Wi-Fi", "Attached Bathroom", "No Night Curfew", "Power Backup Generator", "Two-Wheeler Parking", "Washing Machine / Laundry", "CCTV Surveillance"],
        rules: "24/7 keycard access with zero curfew restrictions. Shift workers and remote techies welcome.",
        foodType: "Delicious 3-time South & North Indian meals included. Filtered RO water and microwave available on every floor.",
        coverImage: "https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1200&q=80",
        galleryImages: [
          "https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1000&q=80",
        ],
        startingPrice: 6000,
        totalCapacity: 35,
        approved: true,
        status: "approved",
        avgRating: 4.8,
        totalReviews: 16,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      rooms: [
        { name: "Single AC Studio", roomType: "single", capacity: 1, totalBeds: 5, occupiedBeds: 4, monthlyRent: 11500, depositAmount: 15000, hasAC: true, hasAttachedBath: true, isActive: true },
        { name: "2-Sharing Executive AC", roomType: "2-sharing", capacity: 2, totalBeds: 18, occupiedBeds: 15, monthlyRent: 7500, depositAmount: 10000, hasAC: true, hasAttachedBath: true, isActive: true },
        { name: "3-Sharing Standard", roomType: "3-sharing", capacity: 3, totalBeds: 12, occupiedBeds: 10, monthlyRent: 6000, depositAmount: 8000, hasAC: false, hasAttachedBath: true, isActive: true },
      ],
      enquiries: [
        { name: "Nandana Suresh", phone: "+91 97449 66778", moveInDate: "2026-08-30", roomType: "2-Sharing Executive AC", message: "Is it within walking distance to Edappally metro? How is the food quality?", status: "new" }
      ]
    }
  ];

  for (const item of hostelsData) {
    // Upsert Admin User
    const adminUser = await db.collection('users').findOneAndUpdate(
      { email: item.adminEmail },
      {
        $set: {
          name: item.adminName,
          email: item.adminEmail,
          password: adminPassword,
          role: "admin",
          phone: item.hostel.phone,
          isPhoneVerified: true,
          isEmailVerified: true,
          city: "Kochi",
          state: "Kerala",
          updatedAt: new Date()
        },
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true, returnDocument: 'after' }
    );

    const adminId = adminUser._id || (await db.collection('users').findOne({ email: item.adminEmail }))._id;

    // Upsert Hostel
    const { createdAt, ...hostelFields } = item.hostel;
    const hostelRes = await db.collection('hostels').findOneAndUpdate(
      { slug: item.hostel.slug },
      {
        $set: {
          ...hostelFields,
          ownerId: adminId,
          updatedAt: new Date()
        },
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true, returnDocument: 'after' }
    );

    const hostelId = hostelRes._id || (await db.collection('hostels').findOne({ slug: item.hostel.slug }))._id;

    // Link Admin to Hostel
    await db.collection('users').updateOne(
      { _id: adminId },
      { $set: { hostelId: hostelId } }
    );

    // Upsert Rooms
    for (const r of item.rooms) {
      await db.collection('rooms').updateOne(
        { hostelId: hostelId, name: r.name },
        {
          $set: {
            ...r,
            hostelId: hostelId,
            updatedAt: new Date()
          },
          $setOnInsert: { createdAt: new Date() }
        },
        { upsert: true }
      );
    }

    // Upsert Enquiries
    for (const enq of item.enquiries) {
      await db.collection('enquiries').updateOne(
        { hostelId: hostelId, name: enq.name },
        {
          $set: {
            ...enq,
            hostelId: hostelId,
            updatedAt: new Date()
          },
          $setOnInsert: { createdAt: new Date() }
        },
        { upsert: true }
      );
    }

    // Insert Sample Reviews
    await db.collection('reviews').updateOne(
      { hostelId: hostelId, authorName: "Gokul Krishna" },
      {
        $set: {
          hostelId: hostelId,
          authorName: "Gokul Krishna",
          rating: 5,
          comment: "Staying here for 8 months. Best homestyle Kerala food in this area, genuine zero brokerage, and warden is very supportive!",
          foodRating: 5,
          cleanlinessRating: 5,
          valueRating: 5,
          isVerifiedResident: true,
          isPublished: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );
  }

  // 4. Sample Student Users
  const students = [
    { name: "Rahul S", email: "rahul.student@gmail.com", phone: "+91 98470 00111" },
    { name: "Anjali Menon", email: "anjali.menon@gmail.com", phone: "+91 98470 00222" },
    { name: "Fahad Ali", email: "fahad.ali@gmail.com", phone: "+91 98470 00333" },
  ];

  for (const s of students) {
    await db.collection('users').updateOne(
      { email: s.email },
      {
        $set: {
          name: s.name,
          email: s.email,
          password: studentPassword,
          role: "user",
          phone: s.phone,
          isPhoneVerified: true,
          isEmailVerified: true,
          city: "Kochi",
          state: "Kerala",
          updatedAt: new Date()
        },
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true }
    );
  }

  console.log("🎉 ALL SEED DATA POPULATED INTO MONGODB SUCCESSFULLY!");
  await mongoose.disconnect();
}

run().catch(err => {
  console.error("Seed error:", err);
  process.exit(1);
});
