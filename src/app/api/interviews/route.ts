import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { InterviewSession } from "@/models/InterviewSession";
import { User } from "@/models/User";
import { logCreditTransaction } from "@/lib/transactions";
import jwt from "jsonwebtoken";

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "cracktheloop_secret_auth_key_2026_z8y";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

function getUserIdFromRequest(req: Request) {
  const authHeader = req.headers.get("authorization");
  const jwtToken = authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
  if (!jwtToken) return null;
  try {
    const decoded: any = jwt.verify(jwtToken, NEXTAUTH_SECRET);
    return decoded.user_id;
  } catch (err) {
    return null;
  }
}

export async function POST(req: Request) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized. Valid token required." }, { status: 401, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { role, company, transcript } = body;

    if (!role || !transcript || !Array.isArray(transcript) || transcript.length === 0) {
      return NextResponse.json({ error: "A non-empty transcript is required to save an interview session" }, { status: 400, headers: corsHeaders });
    }

    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404, headers: corsHeaders });
    }

    // Trial limit check (maximum 1 saved interview session)
    if (user.subscription_tier === "trial") {
      const interviewCount = await InterviewSession.countDocuments({ user_id: userId });
      if (interviewCount >= 1) {
        return NextResponse.json(
          { error: "Free Trial limit reached. You can only save exactly 1 interview session. Please purchase a plan to continue." },
          { status: 403, headers: corsHeaders }
        );
      }
    }

    // Calculate duration of the interview
    let durationSeconds = 0;
    if (transcript.length > 1) {
      const timestamps = transcript.map((t: any) => new Date(t.timestamp).getTime()).filter((t: number) => !isNaN(t));
      if (timestamps.length > 1) {
        const minTime = Math.min(...timestamps);
        const maxTime = Math.max(...timestamps);
        durationSeconds = (maxTime - minTime) / 1000;
      }
    }

    const durationMinutes = durationSeconds / 60;
    
    // Credit calculation: 1 credit per minute, minimum 10 credits
    let creditsToDeduct = 10;
    if (durationMinutes > 10) {
      creditsToDeduct = 10 + Math.ceil(durationMinutes - 10);
    }

    if (user.credits < creditsToDeduct) {
      return NextResponse.json(
        { error: `Insufficient credits. Saving this session requires ${creditsToDeduct} credits, but you only have ${user.credits} remaining.` },
        { status: 402, headers: corsHeaders }
      );
    }

    const newSession = new InterviewSession({
      user_id: userId,
      role,
      company: company || null,
      transcript: transcript.map((turn: any) => {
        let cleanSender = turn.sender;
        if (cleanSender === "user") {
          cleanSender = "candidate";
        }
        return {
          sender: cleanSender,
          text: turn.text,
          timestamp: turn.timestamp ? new Date(turn.timestamp) : new Date()
        };
      })
    });

    await newSession.save();

    // Deduct credits and save user
    user.credits = Math.max(0, user.credits - creditsToDeduct);
    user.total_burn_credits = (user.total_burn_credits || 0) + creditsToDeduct;
    await user.save();

    await logCreditTransaction(user._id, creditsToDeduct, "burn", "interview_save");

    console.log(`[INTERVIEW COMPLETED] Saved session for ${user.email}. Charged ${creditsToDeduct} credits (duration: ${durationMinutes.toFixed(2)} min). Remaining: ${user.credits}`);

    return NextResponse.json({ success: true, interview: newSession }, { headers: corsHeaders });
  } catch (err: any) {
    console.error("[INTERVIEWS POST ERROR]", err);
    return NextResponse.json({ error: err.message || "Failed to save session" }, { status: 500, headers: corsHeaders });
  }
}

export async function GET(req: Request) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized. Valid token required." }, { status: 401, headers: corsHeaders });
  }

  try {
    await connectToDatabase();

    // Query and populate the user_id relation, sorted by creation timestamp descending
    const sessions = await InterviewSession.find({ user_id: userId })
      .populate("user_id")
      .sort({ created_at: -1 });

    return NextResponse.json({ success: true, interviews: sessions }, { headers: corsHeaders });
  } catch (err: any) {
    console.error("[INTERVIEWS GET ERROR]", err);
    return NextResponse.json({ error: err.message || "Failed to load sessions" }, { status: 500, headers: corsHeaders });
  }
}
