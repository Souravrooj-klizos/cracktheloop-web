/**
 * Backfill script: initializes plan_allocated_credits, total_gain_credits, and total_burn_credits
 * for legacy users that do not have these fields yet.
 * Run: node scripts/backfill-credit-fields.js
 */

const fs = require("fs");
const path = require("path");

// Load .env.local if present
try {
  const envPath = path.join(__dirname, "../.env.local");
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, "utf-8");
    envFile.split(/\r?\n/).forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || "";
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.slice(1, -1);
        }
        process.env[key] = value;
      }
    });
  }
} catch (e) {
  console.warn("Failed to load .env.local", e);
}

const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI env var is required.");
  process.exit(1);
}

const TIER_BASE_CREDITS = {
  starter: 100,
  pro: 300,
  elite: 1000,
  trial: 15,
  free: 0,
};

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB\n");

  const users = mongoose.connection.db.collection("users");

  // Find all users missing any of the three new fields
  const usersToUpdate = await users
    .find({
      $or: [
        { plan_allocated_credits: { $exists: false } },
        { total_gain_credits: { $exists: false } },
        { total_burn_credits: { $exists: false } },
      ],
    })
    .toArray();

  if (usersToUpdate.length === 0) {
    console.log("✅ All users are already up-to-date with credit tracking fields.");
    await mongoose.disconnect();
    return;
  }

  console.log(`Found ${usersToUpdate.length} user(s) missing credit tracking fields. Migrating...\n`);

  let count = 0;
  for (const user of usersToUpdate) {
    const tier = user.subscription_tier || "free";
    const baseCredits = TIER_BASE_CREDITS[tier] !== undefined ? TIER_BASE_CREDITS[tier] : 0;
    
    // Default current credits if missing
    const currentCredits = typeof user.credits === "number" ? user.credits : 0;

    const updates = {
      plan_allocated_credits: baseCredits,
      total_gain_credits: currentCredits,
      total_burn_credits: 0,
      updated_at: new Date(),
    };

    await users.updateOne({ _id: user._id }, { $set: updates });
    console.log(`  ✓ ${user.email.padEnd(35)} → plan_allocated: ${baseCredits}, gain: ${currentCredits}, burn: 0`);
    count++;
  }

  console.log(`\n✅ Done. Backfilled credit tracking fields for ${count} user(s).`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("❌ Script failed:", err);
  process.exit(1);
});
