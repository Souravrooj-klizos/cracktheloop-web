import { connectToDatabase } from "@/lib/db";
import { CreditTransaction } from "@/models/CreditTransaction";
import { SubscriptionHistory } from "@/models/SubscriptionHistory";
import mongoose from "mongoose";

export async function logCreditTransaction(
  userId: string | mongoose.Types.ObjectId,
  amount: number,
  type: "add" | "burn",
  event: string,
  model?: string
) {
  await connectToDatabase();
  const tx = new CreditTransaction({
    user_id: new mongoose.Types.ObjectId(userId.toString()),
    amount,
    type,
    event,
    model: model || null,
  });
  await tx.save();
  return tx;
}

export async function logSubscriptionHistory(
  userId: string | mongoose.Types.ObjectId,
  planTier: string,
  action: "start" | "change" | "expire" | "renew" | "cancel",
  creditsAllocated: number,
  stripeSubscriptionId?: string
) {
  await connectToDatabase();
  const history = new SubscriptionHistory({
    user_id: new mongoose.Types.ObjectId(userId.toString()),
    plan_tier: planTier,
    action,
    credits_allocated: creditsAllocated,
    stripe_subscription_id: stripeSubscriptionId || null,
  });
  await history.save();
  return history;
}
