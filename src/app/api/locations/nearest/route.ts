import { NextRequest, NextResponse } from "next/server";

// Coordinates of key Kerala student & IT hubs for reverse geo-matching
const KERALA_GEO_HUBS = [
  {
    city: { name: "Kakkanad (Infopark / SmartCity)", slug: "kakkanad" },
    district: { name: "Ernakulam (Kochi)", slug: "ernakulam" },
    state: { name: "Kerala", slug: "kerala" },
    lat: 10.0159,
    lng: 76.3419,
  },
  {
    city: { name: "Kalamassery (CUSAT / Medical College)", slug: "kalamassery" },
    district: { name: "Ernakulam (Kochi)", slug: "ernakulam" },
    state: { name: "Kerala", slug: "kerala" },
    lat: 10.0434,
    lng: 76.3243,
  },
  {
    city: { name: "Edappally (Metro & Transit Hub)", slug: "edappally" },
    district: { name: "Ernakulam (Kochi)", slug: "ernakulam" },
    state: { name: "Kerala", slug: "kerala" },
    lat: 10.0261,
    lng: 76.3085,
  },
  {
    city: { name: "Kaloor (JLN Stadium Metro)", slug: "kaloor" },
    district: { name: "Ernakulam (Kochi)", slug: "ernakulam" },
    state: { name: "Kerala", slug: "kerala" },
    lat: 9.9984,
    lng: 76.2917,
  },
  {
    city: { name: "Kazhakkoottam (Technopark Phase 1, 2, 3)", slug: "kazhakkoottam" },
    district: { name: "Thiruvananthapuram", slug: "thiruvananthapuram" },
    state: { name: "Kerala", slug: "kerala" },
    lat: 8.5686,
    lng: 76.8731,
  },
  {
    city: { name: "Sreekariyam (CET Campus)", slug: "sreekariyam" },
    district: { name: "Thiruvananthapuram", slug: "thiruvananthapuram" },
    state: { name: "Kerala", slug: "kerala" },
    lat: 8.5471,
    lng: 76.9163,
  },
  {
    city: { name: "Chathamangalam (NIT Calicut)", slug: "chathamangalam-nit" },
    district: { name: "Kozhikode (Calicut)", slug: "kozhikode" },
    state: { name: "Kerala", slug: "kerala" },
    lat: 11.3216,
    lng: 75.9336,
  },
  {
    city: { name: "Mavoor Road (Calicut City Hub)", slug: "mavoor-road" },
    district: { name: "Kozhikode (Calicut)", slug: "kozhikode" },
    state: { name: "Kerala", slug: "kerala" },
    lat: 11.2588,
    lng: 75.7804,
  },
  {
    city: { name: "Gandhinagar (Govt Medical College)", slug: "gandhinagar-kottayam" },
    district: { name: "Kottayam", slug: "kottayam" },
    state: { name: "Kerala", slug: "kerala" },
    lat: 9.6192,
    lng: 76.5367,
  },
  {
    city: { name: "Pala (St. Thomas / Tuition Hub)", slug: "pala" },
    district: { name: "Kottayam", slug: "kottayam" },
    state: { name: "Kerala", slug: "kerala" },
    lat: 9.7126,
    lng: 76.6836,
  },
  {
    city: { name: "Thrissur Town (Swaraj Round / Govt Engg College)", slug: "thrissur-town" },
    district: { name: "Thrissur", slug: "thrissur" },
    state: { name: "Kerala", slug: "kerala" },
    lat: 10.5276,
    lng: 76.2144,
  },
];

// Haversine formula to calculate distance in km
function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const latStr = searchParams.get("lat");
    const lngStr = searchParams.get("lng");

    if (!latStr || !lngStr) {
      return NextResponse.json(
        { success: false, error: "Latitude and Longitude are required" },
        { status: 400 }
      );
    }

    const userLat = parseFloat(latStr);
    const userLng = parseFloat(lngStr);

    let closestHub = KERALA_GEO_HUBS[0];
    let minDistance = calculateDistanceKm(
      userLat,
      userLng,
      closestHub.lat,
      closestHub.lng
    );

    for (let i = 1; i < KERALA_GEO_HUBS.length; i++) {
      const hub = KERALA_GEO_HUBS[i];
      const dist = calculateDistanceKm(userLat, userLng, hub.lat, hub.lng);
      if (dist < minDistance) {
        minDistance = dist;
        closestHub = hub;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        state: closestHub.state,
        district: closestHub.district,
        city: closestHub.city,
        distanceKm: Math.round(minDistance * 10) / 10,
      },
    });
  } catch (error) {
    console.error("Nearest location error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to resolve nearest location" },
      { status: 500 }
    );
  }
}
