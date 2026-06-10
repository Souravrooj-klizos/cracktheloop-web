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

export async function GET(req: NextRequest) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized. Valid token required." }, { status: 401, headers: corsHeaders });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const sort = searchParams.get("sort") || "date_desc";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    await connectToDatabase();

    const query: any = { user_id: userId };

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { role: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    let sortQuery: any = { created_at: -1 };
    if (sort === "date_asc") {
      sortQuery = { created_at: 1 };
    } else if (sort === "role_asc") {
      sortQuery = { role: 1 };
    }

    const total = await InterviewSession.countDocuments(query);
    const sessions = await InterviewSession.find(query)
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("resume_id");

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        success: true,
        sessions,
        total,
        page,
        limit,
        totalPages,
      },
      { headers: corsHeaders }
    );
  } catch (err: any) {
    console.error("[GET SESSIONS ERROR]", err);
    return NextResponse.json({ error: err.message || "Failed to load sessions" }, { status: 500, headers: corsHeaders });
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

    const session = new InterviewSession({
      user_id: userId,
      role: role.trim(),
      company: company || "General Interview Session",
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
    console.error("[POST SESSION ERROR]", err);
    return NextResponse.json({ error: err.message || "Failed to create session" }, { status: 500, headers: corsHeaders });
  }
}
