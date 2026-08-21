import mongoose, { Schema, Model } from "mongoose";
import { IDistrict } from "@/types";

const DistrictSchema = new Schema<IDistrict>(
  {
    name: {
      type: String,
      required: [true, "District name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "District slug is required"],
      trim: true,
      lowercase: true,
    },
    stateId: {
      type: Schema.Types.ObjectId,
      ref: "State",
      required: [true, "State ID reference is required"],
    },
  },
  { timestamps: true }
);

DistrictSchema.index({ slug: 1, stateId: 1 }, { unique: true });

const District: Model<IDistrict> =
  mongoose.models.District || mongoose.model<IDistrict>("District", DistrictSchema);

export default District;
