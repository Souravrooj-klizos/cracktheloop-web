import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { Referral } from "@/models/Referral";
import { ReferralSetting } from "@/models/ReferralSetting";
import { logCreditTransaction, logSubscriptionHistory } from "@/lib/transactions";
import jwt from "jsonwebtoken";

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "cracktheloop_secret_auth_key_2026_z8y";

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  const jwtToken = authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;

  if (!jwtToken) {
    return NextResponse.json({ error: "Unauthorized. Token missing." }, { status: 401 });
  }

  try {
    const decoded: any = jwt.verify(jwtToken, NEXTAUTH_SECRET);
    await connectToDatabase();

    const user = await User.findById(decoded.user_id);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Check if the user already has a subscription or trial active
    if (user.subscription_tier !== "free" && user.subscription_tier !== undefined) {
      return NextResponse.json({ error: "You already have an active subscription or trial plan." }, { status: 400 });
    }

    // Fetch referral settings dynamically from MongoDB
    const refSetting = await ReferralSetting.findOne({});
    const trialBase = refSetting?.trial_base_credits ?? 15;
    const trialReferredBonus = refSetting?.trial_referred_bonus ?? 3;
    const trialReferrerBonus = refSetting?.trial_referrer_bonus ?? 8;
    const trialExpiryDays = refSetting ? (refSetting.trial_expiry_days ?? refSetting.trial_expiration_days ?? -1) : -1;

    user.subscription_tier = "trial";
    user.plan_allocated_credits = trialBase;

    // Apply trial expiration if dynamic setting is configured (> 0)
    if (trialExpiryDays > 0) {
      user.trial_expires_at = new Date(Date.now() + trialExpiryDays * 24 * 60 * 60 * 1000);
      console.log(`[TRIAL ACTIVATION] Setting trial expiration date to ${user.trial_expires_at.toISOString()}`);
    } else {
      user.trial_expires_at = undefined;
      console.log(`[TRIAL ACTIVATION] Setting trial with NO expiration date (trialExpiryDays: ${trialExpiryDays})`);
    }

    let grantedCredits = trialBase;
    let isReferred = false;

    // Apply Referral Credit Bonuses using Referral collection
    const referral = await Referral.findOne({ referred_user: user._id });
    if (referral && !referral.trial_bonus_paid) {
      const referrer = await User.findById(referral.referrer);
      if (referrer) {
        // Referred user gets base + referred bonus
        grantedCredits = trialBase + trialReferredBonus;
        isReferred = true;

        // Referrer gets referrer bonus
        referrer.credits = (referrer.credits || 0) + trialReferrerBonus;
        referrer.total_gain_credits = (referrer.total_gain_credits || 0) + trialReferrerBonus;
        await referrer.save();

        referral.status = "trial_activated";
        referral.trial_bonus_paid = true;
        referral.referrer_trial_bonus = trialReferrerBonus;
        referral.referred_trial_bonus = trialReferredBonus;
        await referral.save();
        
        console.log(`[REFERRAL SUCCESS] Trial activated for ${user.email}. Referrer ${referrer.email} credited +${trialReferrerBonus} credits, referee got +${trialReferredBonus} credits.`);
        await logCreditTransaction(referrer._id, trialReferrerBonus, "add", "referral_trial_bonus");
      }
    } else if (!referral && user.referred_by) {
      // Fallback: If referral record was missing but user.referred_by exists
      const referrer = await User.findOne({ referral_code: user.referred_by });
      if (referrer && referrer._id.toString() !== user._id.toString()) {
        grantedCredits = trialBase + trialReferredBonus;
        isReferred = true;
        referrer.credits = (referrer.credits || 0) + trialReferrerBonus;
        referrer.total_gain_credits = (referrer.total_gain_credits || 0) + trialReferrerBonus;
        await referrer.save();

        await Referral.create({
          referrer: referrer._id,
          referred_user: user._id,
          referral_code: user.referred_by,
          status: "trial_activated",
          trial_bonus_paid: true,
          purchase_bonus_paid: false,
          referrer_trial_bonus: trialReferrerBonus,
          referred_trial_bonus: trialReferredBonus,
        });
        console.log(`[REFERRAL FALLBACK] Trial activated for ${user.email} (created referral). Referrer ${referrer.email} got +${trialReferrerBonus} credits.`);
        await logCreditTransaction(referrer._id, trialReferrerBonus, "add", "referral_trial_bonus");
      }
    }

    user.credits = grantedCredits;
    user.total_gain_credits = (user.total_gain_credits || 0) + grantedCredits;
    await user.save();

    // Log user trial credit transaction and subscription history
    if (isReferred) {
      await logCreditTransaction(user._id, trialBase, "add", "trial_activation");
      await logCreditTransaction(user._id, trialReferredBonus, "add", "referral_trial_bonus");
    } else {
      await logCreditTransaction(user._id, trialBase, "add", "trial_activation");
    }

    await logSubscriptionHistory(user._id, "trial", "start", trialBase);

    console.log(`[TRIAL ACTIVATION] Activated trial with ${grantedCredits} credits for ${user.email}`);

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name || "",
        is_subscribed: user.is_subscribed,
        subscription_tier: user.subscription_tier,
        credits: user.credits,
        referral_code: user.referral_code || "",
        referred_by: user.referred_by || "",
        trial_expires_at: user.trial_expires_at,
      }
    });
  } catch (err: any) {
    console.error("[TRIAL ACTIVATION ERROR]", err);
    return NextResponse.json({ error: err.message || "Failed to activate trial" }, { status: 500 });
  }
}
