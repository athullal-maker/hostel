export type UserRole = "user" | "admin" | "superadmin";

export type HostelType = "boys" | "girls" | "co-ed";

export type HostelStatus = "pending" | "approved" | "rejected" | "suspended";

export type PaymentStatus = "pending" | "paid" | "refunded" | "failed";

export type BookingStatus = "confirmed" | "cancelled" | "completed";

export type PlaceType = "college" | "hospital" | "busstand" | "railway" | "other";

export interface IState {
  _id?: string;
  name: string;
  slug: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IDistrict {
  _id?: string;
  name: string;
  slug: string;
  stateId: string | IState;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICity {
  _id?: string;
  name: string;
  slug: string;
  districtId: string | IDistrict;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  passwordHash?: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IGeoPoint {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

export interface IHostel {
  _id?: string;
  adminId: string | IUser;
  name: string;
  description: string;
  cityId: string | ICity;
  fullAddress: string;
  location: IGeoPoint;
  hostelType: HostelType;
  totalCapacity: number;
  amenities: string[];
  rules?: string;
  checkInTime?: string;
  checkOutTime?: string;
  coverImage?: string;
  galleryImages?: string[];
  status: HostelStatus;
  avgRating: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRoom {
  _id?: string;
  hostelId: string | IHostel;
  roomType: string; // e.g. 'Single Room', '2-Sharing', '3-Sharing', '4-Sharing'
  capacity: number;
  pricePerBed: number;
  bedsAvailable: number;
  amenities: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface INearbyPlace {
  _id?: string;
  hostelId: string | IHostel;
  placeName: string;
  placeType: PlaceType;
  distanceKm: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBooking {
  _id?: string;
  userId: string | IUser;
  hostelId: string | IHostel;
  roomId: string | IRoom;
  checkInDate: Date;
  checkOutDate?: Date;
  numGuests: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  razorpayOrderId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IReview {
  _id?: string;
  hostelId: string | IHostel;
  userId: string | IUser;
  bookingId?: string | IBooking;
  rating: number; // 1 to 5
  comment: string;
  isRemoved: boolean;
  isReported?: boolean;
  reportReason?: string;
  reportedBy?: string | IUser;
  reportedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
