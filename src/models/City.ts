import mongoose, { Schema, Model } from "mongoose";
import { ICity } from "@/types";

const CitySchema = new Schema<ICity>(
  {
    name: {
      type: String,
      required: [true, "City/Town name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "City slug is required"],
      trim: true,
      lowercase: true,
    },
    districtId: {
      type: Schema.Types.ObjectId,
      ref: "District",
      required: [true, "District ID reference is required"],
    },
  },
  { timestamps: true }
);

CitySchema.index({ slug: 1, districtId: 1 }, { unique: true });

const City: Model<ICity> =
  mongoose.models.City || mongoose.model<ICity>("City", CitySchema);

export default City;
