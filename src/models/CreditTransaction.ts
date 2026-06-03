import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICreditTransaction extends Omit<Document, "model"> {
  user_id: mongoose.Types.ObjectId;
  amount: number;
  type: "add" | "burn";
  event: string;
  model?: string;
  created_at: Date;
}

const CreditTransactionSchema = new Schema<ICreditTransaction>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["add", "burn"],
      required: true,
    },
    event: {
      type: String,
      required: true,
    },
    model: {
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

if (mongoose.models["CreditTransaction"]) {
  delete (mongoose.models as any)["CreditTransaction"];
}
export const CreditTransaction: Model<ICreditTransaction> =
  mongoose.models.CreditTransaction ||
  mongoose.model<ICreditTransaction>("CreditTransaction", CreditTransactionSchema);
