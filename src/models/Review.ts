import mongoose, { Schema, Model } from "mongoose";
import { IReview } from "@/types";

const ReviewSchema = new Schema<IReview>(
  {
    hostelId: {
      type: Schema.Types.ObjectId,
      ref: "Hostel",
      required: [true, "Hostel ID is required"],
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
    },
    rating: {
      type: Number,
      required: [true, "Rating between 1 and 5 is required"],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, "Review comment is required"],
      trim: true,
      maxlength: 1000,
    },
    isRemoved: {
      type: Boolean,
      default: false,
      index: true,
    },
    isReported: {
      type: Boolean,
      default: false,
      index: true,
    },
    reportReason: {
      type: String,
      trim: true,
    },
    reportedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reportedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

ReviewSchema.index({ hostelId: 1, userId: 1 });

/**
 * Static method to calculate and update the average rating on the Hostel document
 */
ReviewSchema.statics.calcAverageRating = async function (
  hostelId: mongoose.Types.ObjectId | string | undefined
) {
  if (!hostelId) return;

  const targetHostelId =
    typeof hostelId === "string"
      ? new mongoose.Types.ObjectId(hostelId)
      : hostelId;

  const stats = await this.aggregate([
    {
      $match: {
        hostelId: targetHostelId,
        isRemoved: { $ne: true },
      },
    },
    {
      $group: {
        _id: "$hostelId",
        avgRating: { $avg: "$rating" },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  const Hostel = mongoose.models.Hostel;
  if (Hostel) {
    if (stats.length > 0) {
      await Hostel.findByIdAndUpdate(targetHostelId, {
        avgRating: Math.round(stats[0].avgRating * 10) / 10,
      });
    } else {
      await Hostel.findByIdAndUpdate(targetHostelId, {
        avgRating: 0,
      });
    }
  }
};

// Post-save hook to update average rating
ReviewSchema.post("save", async function () {
  const ReviewModel = this.constructor as unknown as {
    calcAverageRating: (id: unknown) => Promise<void>;
  };
  const rawHostelId = this.hostelId;
  const hostelId =
    typeof rawHostelId === "object" && rawHostelId !== null && "_id" in rawHostelId
      ? (rawHostelId as { _id: string })._id
      : (rawHostelId as string);
  await ReviewModel.calcAverageRating(hostelId);
});

// Post-findOneAndUpdate hook (e.g. when isRemoved is set to true by superadmin)
ReviewSchema.post("findOneAndUpdate", async function (doc) {
  if (doc && doc.hostelId) {
    const ReviewModel = doc.constructor as unknown as {
      calcAverageRating: (id: unknown) => Promise<void>;
    };
    if (ReviewModel && typeof ReviewModel.calcAverageRating === "function") {
      const rawHostelId = doc.hostelId;
      const hostelIdToUpdate =
        typeof rawHostelId === "object" && rawHostelId !== null && "_id" in rawHostelId
          ? (rawHostelId as { _id: string })._id
          : (rawHostelId as string);
      await ReviewModel.calcAverageRating(hostelIdToUpdate);
    }
  }
});

interface IReviewModel extends Model<IReview> {
  calcAverageRating(hostelId: mongoose.Types.ObjectId | string | undefined): Promise<void>;
}

const Review: IReviewModel =
  ((mongoose.models.Review as unknown) as IReviewModel) ||
  mongoose.model<IReview, IReviewModel>("Review", ReviewSchema);

export default Review;
