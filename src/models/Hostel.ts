import mongoose, { Schema, Model } from "mongoose";
import { IHostel } from "@/types";

const GeoPointSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  { _id: false }
);

const HostelSchema = new Schema<IHostel>(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Hostel admin/owner ID is required"],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Hostel name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Hostel description is required"],
    },
    cityId: {
      type: Schema.Types.ObjectId,
      ref: "City",
      required: [true, "City reference is required"],
      index: true,
    },
    fullAddress: {
      type: String,
      required: [true, "Full address is required"],
    },
    location: {
      type: GeoPointSchema,
      required: true,
    },
    hostelType: {
      type: String,
      enum: ["boys", "girls", "co-ed"],
      required: [true, "Hostel type (boys/girls/co-ed) is required"],
    },
    totalCapacity: {
      type: Number,
      required: [true, "Total capacity is required"],
      min: 1,
    },
    amenities: {
      type: [String],
      default: [],
    },
    rules: {
      type: String,
      default: "",
    },
    checkInTime: {
      type: String,
      default: "12:00 PM",
    },
    checkOutTime: {
      type: String,
      default: "11:00 AM",
    },
    coverImage: {
      type: String,
      default: "",
    },
    galleryImages: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "suspended"],
      default: "pending",
      index: true,
    },
    avgRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

// 2dsphere index for geospatial "hostels near me" and radius queries
HostelSchema.index({ location: "2dsphere" });
HostelSchema.index({ name: "text", fullAddress: "text", description: "text" });

const Hostel: Model<IHostel> =
  mongoose.models.Hostel || mongoose.model<IHostel>("Hostel", HostelSchema);

export default Hostel;
