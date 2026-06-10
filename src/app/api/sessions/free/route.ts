import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { InterviewSession } from "@/models/InterviewSession";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";

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
    const {
      role,
      company,
      language,
      behavior_tone,
      job_description,
      instructions,
      ai_model,
      resume_id,
      sessionId,
    } = body;

    if (!role || !role.trim()) {
      return NextResponse.json({ error: "Job role/name is required" }, { status: 400, headers: corsHeaders });
    }

    await connectToDatabase();

    // Enforce cooldown or other constraints if needed for free sessions
    // For example, we can check if they have created a free session in the last 12 minutes
    const cooldownPeriod = 12 * 60 * 1000; // 12 minutes
    const recentFreeSession = await InterviewSession.findOne({
      user_id: userId,
      company: { $regex: /free session/i },
      created_at: { $gt: new Date(Date.now() - cooldownPeriod) }
    });

    if (recentFreeSession) {
      return NextResponse.json(
        { error: "Free session cooldown active. You can only create one free session every 12 minutes." },
        { status: 429, headers: corsHeaders }
      );
    }

    const session = new InterviewSession({
      user_id: userId,
      role: role.trim(),
      company: company || "Free Session (10 min)",
      language: language || "english",
      behavior_tone: behavior_tone || "professional",
      job_description: job_description || "",
      instructions: instructions || "",
      ai_model: ai_model || "gpt-4o-mini",
      resume_id: resume_id || null,
      session_id: sessionId || randomUUID(),
      status: "created",
      transcript: [],
    });

    await session.save();

    return NextResponse.json({ success: true, session }, { headers: corsHeaders });
  } catch (err: any) {
    console.error("[POST FREE SESSION ERROR]", err);
    return NextResponse.json({ error: err.message || "Failed to create free session" }, { status: 500, headers: corsHeaders });
  }
}
