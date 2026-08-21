import mongoose, { Schema, Model } from "mongoose";
import { INearbyPlace } from "@/types";

const NearbyPlaceSchema = new Schema<INearbyPlace>(
  {
    hostelId: {
      type: Schema.Types.ObjectId,
      ref: "Hostel",
      required: [true, "Hostel ID reference is required"],
      index: true,
    },
    placeName: {
      type: String,
      required: [true, "Place name is required"],
      trim: true,
    },
    placeType: {
      type: String,
      enum: ["college", "hospital", "busstand", "railway", "other"],
      required: [true, "Place type is required"],
    },
    distanceKm: {
      type: Number,
      required: [true, "Distance in km is required"],
      min: 0,
    },
  },
  { timestamps: true }
);

NearbyPlaceSchema.index({ hostelId: 1, placeType: 1 });

const NearbyPlace: Model<INearbyPlace> =
  mongoose.models.NearbyPlace ||
  mongoose.model<INearbyPlace>("NearbyPlace", NearbyPlaceSchema);

export default NearbyPlace;
