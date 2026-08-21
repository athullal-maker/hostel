import mongoose, { Schema, Model } from "mongoose";
import { IState } from "@/types";

const StateSchema = new Schema<IState>(
  {
    name: {
      type: String,
      required: [true, "State name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "State slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

const State: Model<IState> =
  mongoose.models.State || mongoose.model<IState>("State", StateSchema);

export default State;
