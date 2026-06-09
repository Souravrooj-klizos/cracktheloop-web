import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Plan } from "@/models/Plan";
import { ReferralSetting } from "@/models/ReferralSetting";

export async function GET() {
  try {
    await connectToDatabase();
    const plans = await Plan.find({ is_active: true });
    const settings = await ReferralSetting.findOne({});
    return NextResponse.json({ success: true, plans, settings });
  } catch (err: any) {
    console.error("[GET PLANS ERROR]", err);
    return NextResponse.json({ error: err.message || "Failed to load plans" }, { status: 500 });
  }
}
