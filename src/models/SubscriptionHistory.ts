import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubscriptionHistory extends Document {
  user_id: mongoose.Types.ObjectId;
  plan_tier: string;
  action: "start" | "change" | "expire" | "renew" | "cancel";
  credits_allocated: number;
  stripe_subscription_id?: string;
  created_at: Date;
}

const SubscriptionHistorySchema = new Schema<ISubscriptionHistory>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    plan_tier: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      enum: ["start", "change", "expire", "renew", "cancel"],
      required: true,
    },
    credits_allocated: {
      type: Number,
      required: true,
    },
    stripe_subscription_id: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: false,
    },
    versionKey: false,
  }
);

if (mongoose.models["SubscriptionHistory"]) {
  delete (mongoose.models as any)["SubscriptionHistory"];
}
export const SubscriptionHistory: Model<ISubscriptionHistory> =
  mongoose.models.SubscriptionHistory ||
  mongoose.model<ISubscriptionHistory>("SubscriptionHistory", SubscriptionHistorySchema);
