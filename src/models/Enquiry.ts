import mongoose, { Schema, Model, Document } from "mongoose";

export interface IEnquiry extends Document {
  hostelId: mongoose.Types.ObjectId;
  name: string;
  phone: string;
  moveInDate?: string;
  roomType?: string;
  message?: string;
  status: "new" | "contacted" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    hostelId: {
      type: Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Student / Tenant name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Contact phone number is required"],
      trim: true,
    },
    moveInDate: {
      type: String,
      default: "",
    },
    roomType: {
      type: String,
      default: "Any / Flexible",
    },
    message: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
      index: true,
    },
  },
  { timestamps: true }
);

const Enquiry: Model<IEnquiry> =
  mongoose.models.Enquiry || mongoose.model<IEnquiry>("Enquiry", EnquirySchema);

export default Enquiry;
