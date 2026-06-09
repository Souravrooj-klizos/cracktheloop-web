import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { Referral } from "@/models/Referral";
import { Plan } from "@/models/Plan";
import { ReferralSetting } from "@/models/ReferralSetting";
import { logCreditTransaction, logSubscriptionHistory } from "@/lib/transactions";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-05-27.dahlia" as any,
});

// Plan map: base credits & tier names
const PLAN_MAP: Record<string, { tier: string; credits: number }> = {
  "price_1TeCnyEkHwm1l3fZV45CSLvV": { tier: "starter", credits: 100 },
  "price_1TeCpEEkHwm1l3fZej0zzJhb": { tier: "pro", credits: 300 },
  "price_1TeCpaEkHwm1l3fZj9f7Gh31": { tier: "elite", credits: 1000 },
};

// Referral multipliers (from plans.md)
const REFERRED_USER_MULTIPLIER = 1.2;  // +20% credits for referred buyer
const REFERRER_BONUS_RATIO = 0.5;  // +50% of base credits for referrer

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ""
      );
    } catch (err: any) {
      console.error(`[WEBHOOK ERROR] Signature verification failed:`, err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    console.log(`[WEBHOOK] Received Stripe Event: ${event.type}`);

    await connectToDatabase();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const email = session.customer_email || session.customer_details?.email;
        const customerId = session.customer as string;

        console.log(`[WEBHOOK] checkout.session.completed triggered for ${email || 'unknown email'}`);

        let user = null;
        if (email) {
          user = await User.findOne({ email });
        }
        if (!user && customerId) {
          user = await User.findOne({ stripe_customer_id: customerId });
        }

        if (!user) {
          console.warn(`[WEBHOOK WARNING] No user found for checkout session ${session.id}`);
          break;
        }

        // Retrieve the line items of the checkout session to find the purchased Price ID
        let priceId = "";
        try {
          const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
          if (lineItems.data.length > 0) {
            priceId = lineItems.data[0].price?.id || "";
          }
        } catch (err: any) {
          console.error(`[WEBHOOK ERROR] Failed to list line items for checkout session ${session.id}:`, err.message);
        }

        console.log(`[WEBHOOK] Resolving plan for Price ID: "${priceId}", Amount paid: ${session.amount_total} cents`);

        // Resolve plan dynamically from database
        let plan: { tier: string; credits: number; price: number; name: string } | null = null;
        if (priceId) {
          const dbPlan = await Plan.findOne({ price_id: priceId, is_active: true });
          if (dbPlan) {
            const nameLower = dbPlan.name.toLowerCase();
            let tier = "starter";
            if (nameLower.includes("pro")) tier = "pro";
            else if (nameLower.includes("elite") || nameLower.includes("enterprise")) tier = "elite";
            else if (dbPlan.price > 35) tier = "elite";
            else if (dbPlan.price > 20) tier = "pro";

            plan = {
              tier,
              credits: dbPlan.credits,
              price: dbPlan.price,
              name: dbPlan.name
            };
          }
        }

        if (!plan) {
          // Fallback mapping based on session.amount_total (in cents)
          const amount = session.amount_total ?? 0;
          if (amount <= 0) {
            console.warn(`[WEBHOOK WARNING] Skipping zero amount checkout session: ${session.id}`);
            break;
          } else if (amount < 2000) {
            plan = { tier: "starter", credits: 100, price: 15, name: "Starter Pass" };
          } else if (amount < 3500) {
            plan = { tier: "pro", credits: 200, price: 25, name: "Pro Pass" };
          } else {
            plan = { tier: "elite", credits: 500, price: 49, name: "Enterprise Pass" };
          }
          console.log(`[WEBHOOK WARNING] Plan not registered in DB or priceId mismatch. Amount fallback used → tier: ${plan.tier}, credits: ${plan.credits}`);
        }

        // Fetch Referral Setting parameters from DB
        const refSetting = await ReferralSetting.findOne({});
        const referredMultiplier = refSetting?.purchase_referred_multiplier ?? 1.2;
        const referrerRatio = refSetting?.purchase_referrer_ratio ?? 0.5;

        // Apply credit top-up logic: add plan credits to user's existing balance
        const baseCredits = plan.credits;
        let userCreditedAmount = baseCredits;
        let isReferredPurchase = false;

        user.is_subscribed = true;
        user.subscription_tier = plan.tier;
        user.stripe_customer_id = customerId;
        user.plan_allocated_credits = baseCredits;

        // Process referral reward (only mark converted in Referral collection)
        const referral = await Referral.findOne({ referred_user: user._id });
        if (referral) {
          if (!referral.purchase_bonus_paid) {
            referral.status = "subscribed";
            referral.purchase_bonus_paid = true;
            referral.purchase_tier = plan.tier;
            await referral.save();
            console.log(`[REFERRAL] Marked referee ${user.email} referral converted (no purchase bonus awarded).`);
          }
        } else if (user.referred_by) {
          // Fallback if referral record was missing but user.referred_by exists
          const referrer = await User.findOne({ referral_code: user.referred_by });
          if (referrer && referrer._id.toString() !== user._id.toString()) {
            await Referral.create({
              referrer: referrer._id,
              referred_user: user._id,
              referral_code: user.referred_by,
              status: "subscribed",
              trial_bonus_paid: false,
              purchase_bonus_paid: true,
              referrer_purchase_bonus: 0,
              referred_purchase_bonus: 0,
              purchase_tier: plan.tier,
            });
            console.log(`[REFERRAL FALLBACK] Created subscribed referral for ${user.email} (no purchase bonus awarded).`);
          }
        }

        // Credit the user's account (top-up: current + base credits of the plan)
        user.credits = (user.credits || 0) + baseCredits;
        user.total_gain_credits = (user.total_gain_credits || 0) + baseCredits;
        await user.save();

        console.log(`[WEBHOOK SUCCESS] Top-up complete for ${user.email}. Added ${baseCredits} credits. New total: ${user.credits}`);

        // Log transaction history
        await logCreditTransaction(user._id, baseCredits, "add", "subscription_purchase");

        await logSubscriptionHistory(
          user._id,
          plan.tier,
          "renew",
          baseCredits,
          session.id
        );

        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`[WEBHOOK] Checkout session expired: ${session.id}`);
        break;
      }

      case "customer.created": {
        const customer = event.data.object as Stripe.Customer;
        console.log(`[WEBHOOK] Stripe customer created: ${customer.id}`);
        if (customer.email) {
          const user = await User.findOne({ email: customer.email });
          if (user) {
            user.stripe_customer_id = customer.id;
            await user.save();
            console.log(`[WEBHOOK] Linked Stripe customer ID ${customer.id} to user ${user.email} on customer.created`);
          }
        }
        break;
      }

      case "customer.updated": {
        const customer = event.data.object as Stripe.Customer;
        console.log(`[WEBHOOK] Stripe customer updated: ${customer.id}`);
        break;
      }

      case "customer.deleted": {
        const customer = event.data.object as Stripe.Customer;
        console.log(`[WEBHOOK] Stripe customer deleted: ${customer.id}`);
        const user = await User.findOne({ stripe_customer_id: customer.id });
        if (user) {
          const oldTier = user.subscription_tier || "free";
          user.is_subscribed = false;
          user.subscription_tier = "free";
          user.credits = 0;
          user.plan_allocated_credits = 0;
          user.stripe_customer_id = undefined;
          user.stripe_subscription_id = undefined;
          await user.save();
          await logSubscriptionHistory(
            user._id,
            oldTier,
            "cancel",
            0,
            "deleted_customer"
          );
          console.log(`[WEBHOOK] Revoked subscription and cleared Stripe IDs for deleted customer: ${user.email}`);
        }
        break;
      }

      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        let user = await User.findOne({ stripe_customer_id: customerId });

        if (!user) {
          try {
            const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
            if (customer && customer.email) {
              user = await User.findOne({ email: customer.email });
              if (user) {
                user.stripe_customer_id = customerId;
              }
            }
          } catch (err: any) {
            console.error(`[WEBHOOK] Error retrieving customer for subscription.created:`, err.message);
          }
        }

        if (user) {
          user.stripe_subscription_id = subscription.id;
          const status = subscription.status;
          if (status === "active" || status === "trialing") {
            user.is_subscribed = true;
          }
          await user.save();
          console.log(`[WEBHOOK] Linked subscription ${subscription.id} for user ${user.email} on subscription.created (status: ${status})`);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        let user = await User.findOne({
          $or: [
            { stripe_subscription_id: subscription.id },
            { stripe_customer_id: customerId }
          ]
        });

        if (user) {
          user.stripe_subscription_id = subscription.id;
          const status = subscription.status;
          const isActive = status === "active" || status === "trialing";

          if (isActive) {
            user.is_subscribed = true;
            const priceId = subscription.items.data[0]?.price.id;
            if (priceId && PLAN_MAP[priceId]) {
              const plan = PLAN_MAP[priceId];
              const oldTier = user.subscription_tier || "free";
              if (user.subscription_tier !== plan.tier) {
                user.subscription_tier = plan.tier;
                user.plan_allocated_credits = plan.credits;
                const action = oldTier === "free" ? "start" : "change";
                await logSubscriptionHistory(
                  user._id,
                  plan.tier,
                  action,
                  plan.credits,
                  subscription.id
                );
                console.log(`[WEBHOOK] Subscription updated to tier: ${plan.tier} for user ${user.email}`);
              }
            }
          } else {
            const oldTier = user.subscription_tier || "free";
            user.is_subscribed = false;
            user.subscription_tier = "free";
            user.credits = 0;
            user.plan_allocated_credits = 0;
            await logSubscriptionHistory(
              user._id,
              oldTier,
              "cancel",
              0,
              subscription.id
            );
            console.log(`[WEBHOOK] Subscription inactive (status: ${status}) for user ${user.email}`);
          }
          await user.save();
        }
        break;
      }

      case "customer.subscription.paused": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const user = await User.findOne({ stripe_customer_id: customerId });
        if (user) {
          user.is_subscribed = false;
          await user.save();
          console.log(`[WEBHOOK] Subscription paused for user ${user.email}`);
        }
        break;
      }

      case "customer.subscription.resumed": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const user = await User.findOne({ stripe_customer_id: customerId });
        if (user) {
          const isActive = subscription.status === "active" || subscription.status === "trialing";
          if (isActive) {
            user.is_subscribed = true;
            await user.save();
            console.log(`[WEBHOOK] Subscription resumed for user ${user.email}`);
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const user = await User.findOne({ stripe_customer_id: customerId });
        if (user) {
          user.is_subscribed = false;
          await user.save();
          console.warn(`[WEBHOOK] Payment failed for ${user.email}. Access suspended.`);
        }
        break;
      }

      case "invoice.payment_action_required": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const user = await User.findOne({ stripe_customer_id: customerId });
        if (user) {
          user.is_subscribed = false;
          await user.save();
          console.warn(`[WEBHOOK] Payment action required for ${user.email}. Access suspended.`);
        }
        break;
      }

      case "invoice.upcoming": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`[WEBHOOK] Upcoming invoice for customer ${invoice.customer}: attempt on ${invoice.next_payment_attempt ? new Date(invoice.next_payment_attempt * 1000).toISOString() : 'unknown'}`);
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        console.log(`[WEBHOOK] Charge refunded: ${charge.id}`);
        const user = await User.findOne({ stripe_customer_id: charge.customer as string });
        if (user) {
          const oldTier = user.subscription_tier || "free";
          user.is_subscribed = false;
          user.subscription_tier = "free";
          const lostCredits = user.credits || 0;
          user.credits = 0;
          user.plan_allocated_credits = 0;

          if (lostCredits > 0) {
            user.total_burn_credits = (user.total_burn_credits || 0) + lostCredits;
            await logCreditTransaction(user._id, lostCredits, "burn", "charge_refunded");
          }
          await logSubscriptionHistory(
            user._id,
            oldTier,
            "cancel",
            0,
            charge.payment_intent as string || ""
          );
          await user.save();
          console.log(`[WEBHOOK] Refund processed. Revoked subscription/credits for user: ${user.email}`);
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as any;
        const subscriptionId = invoice.subscription as string;
        const customerId = invoice.customer as string;

        // Find the user - prioritise email lookup
        let user = null;
        if (invoice.customer_email) {
          user = await User.findOne({ email: invoice.customer_email });
        }
        if (!user) {
          user = await User.findOne({
            $or: [
              { stripe_subscription_id: subscriptionId },
              { stripe_customer_id: customerId },
            ],
          });
        }

        if (!user) {
          console.warn(`[WEBHOOK] No user found for invoice ${invoice.id}`);
          break;
        }

        user.is_subscribed = true;
        user.stripe_subscription_id = subscriptionId;
        user.stripe_customer_id = customerId;

        // Resolve price ID from invoice line items
        const lineItems = invoice.lines?.data || [];
        let priceId = "";
        if (lineItems.length > 0) {
          priceId =
            lineItems[0].price?.id ||
            lineItems[0].plan?.id ||
            (typeof lineItems[0].price === "string" ? lineItems[0].price : "") ||
            "";
        }
        console.log(`[WEBHOOK] Price ID: "${priceId}", Amount paid: ${invoice.amount_paid}`);

        // Determine base tier & credits
        let plan = PLAN_MAP[priceId];
        if (!plan) {
          // Fallback: derive from amount_paid (cents)
          const amount = invoice.amount_paid ?? 0;
          if (amount <= 0) break;
          else if (amount < 2500) plan = { tier: "starter", credits: 100 };
          else if (amount < 5000) plan = { tier: "pro", credits: 300 };
          else plan = { tier: "elite", credits: 1000 };
          console.log(`[WEBHOOK WARNING] No priceId match. Used amount_paid fallback → tier: ${plan.tier}`);
        }

        // Determine action
        const oldTier = user.subscription_tier || "free";
        const action = oldTier === "free" ? "start" : (oldTier === plan.tier ? "renew" : "change");

        user.subscription_tier = plan.tier;
        user.plan_allocated_credits = plan.credits;

        // ── Referral Bonus Logic (Only mark converted, no purchase bonus) ──
        const referral = await Referral.findOne({ referred_user: user._id });
        if (referral) {
          if (!referral.purchase_bonus_paid) {
            referral.status = "subscribed";
            referral.purchase_bonus_paid = true;
            referral.purchase_tier = plan.tier;
            await referral.save();
            console.log(`[REFERRAL] Marked referee ${user.email} referral converted (no purchase bonus awarded).`);
          }
        } else if (user.referred_by) {
          // Fallback if referral record was missing but user.referred_by exists
          const referrer = await User.findOne({ referral_code: user.referred_by });
          if (referrer && referrer._id.toString() !== user._id.toString()) {
            await Referral.create({
              referrer: referrer._id,
              referred_user: user._id,
              referral_code: user.referred_by,
              status: "subscribed",
              trial_bonus_paid: false,
              purchase_bonus_paid: true,
              referrer_purchase_bonus: 0,
              referred_purchase_bonus: 0,
              purchase_tier: plan.tier,
            });
            console.log(`[REFERRAL FALLBACK] Created subscribed referral for ${user.email} (no purchase bonus awarded).`);
          }
        }

        user.credits = plan.credits;
        user.total_gain_credits = (user.total_gain_credits || 0) + plan.credits;
        await logCreditTransaction(user._id, plan.credits, "add", "subscription_purchase");
        // ─────────────────────────────────────────────────────────────────

        await logSubscriptionHistory(
          user._id,
          plan.tier,
          action,
          plan.credits,
          subscriptionId
        );

        await user.save();
        console.log(`[WEBHOOK] Subscription active for ${user.email}. Tier: ${user.subscription_tier}, Credits: ${user.credits}`);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const user = await User.findOne({
          $or: [
            { stripe_subscription_id: subscription.id },
            { stripe_customer_id: subscription.customer as string }
          ]
        });
        if (user) {
          const oldTier = user.subscription_tier || "free";
          const lostCredits = user.credits || 0;

          user.is_subscribed = false;
          user.subscription_tier = "free";
          user.credits = 0;
          user.plan_allocated_credits = 0;

          if (lostCredits > 0) {
            user.total_burn_credits = (user.total_burn_credits || 0) + lostCredits;
            await logCreditTransaction(user._id, lostCredits, "burn", "subscription_ended");
          }
          await logSubscriptionHistory(
            user._id,
            oldTier,
            "cancel",
            0,
            subscription.id
          );

          await user.save();
          console.log(`[WEBHOOK] Subscription revoked for: ${user.email}`);
        }
        break;
      }

      default:
        console.log(`[WEBHOOK] Unhandled event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("[WEBHOOK ERROR] Event processing failed:", error);
    return NextResponse.json(
      { error: "Webhook event handler execution error" },
      { status: 500 }
    );
  }
}

