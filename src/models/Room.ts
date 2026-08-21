import mongoose, { Schema, Model } from "mongoose";
import { IRoom } from "@/types";

const RoomSchema = new Schema<IRoom>(
  {
    hostelId: {
      type: Schema.Types.ObjectId,
      ref: "Hostel",
      required: [true, "Hostel ID reference is required"],
      index: true,
    },
    roomType: {
      type: String,
      required: [true, "Room type is required (e.g. Single, 2-Sharing, 3-Sharing, 4-Sharing)"],
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, "Room capacity is required"],
      min: 1,
    },
    pricePerBed: {
      type: Number,
      required: [true, "Monthly price per bed is required"],
      min: 0,
    },
    bedsAvailable: {
      type: Number,
      required: [true, "Number of beds available is required"],
      min: 0,
    },
    amenities: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

RoomSchema.index({ hostelId: 1, roomType: 1 });

const Room: Model<IRoom> =
  mongoose.models.Room || mongoose.model<IRoom>("Room", RoomSchema);

export default Room;
