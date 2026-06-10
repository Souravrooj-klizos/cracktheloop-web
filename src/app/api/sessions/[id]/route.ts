import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { InterviewSession } from "@/models/InterviewSession";
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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized. Valid token required." }, { status: 401, headers: corsHeaders });
  }

  try {
    const { id } = await params;
    await connectToDatabase();

    const session = await InterviewSession.findOne({ _id: id, user_id: userId }).populate("resume_id");
    if (!session) {
      // Fallback: search by session_id field if the user query passed the UUID
      const fallbackSession = await InterviewSession.findOne({ session_id: id, user_id: userId }).populate("resume_id");
      if (!fallbackSession) {
        return NextResponse.json({ error: "Session not found" }, { status: 404, headers: corsHeaders });
      }
      return NextResponse.json({ success: true, session: fallbackSession }, { headers: corsHeaders });
    }

    return NextResponse.json({ success: true, session }, { headers: corsHeaders });
  } catch (err: any) {
    console.error("[GET SESSION DETAIL ERROR]", err);
    return NextResponse.json({ error: err.message || "Failed to load session details" }, { status: 500, headers: corsHeaders });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized. Valid token required." }, { status: 401, headers: corsHeaders });
  }

  try {
    const { id } = await params;
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
      status,
      transcript,
    } = body;

    await connectToDatabase();

    let session = await InterviewSession.findOne({ _id: id, user_id: userId });
    if (!session) {
      session = await InterviewSession.findOne({ session_id: id, user_id: userId });
    }

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404, headers: corsHeaders });
    }

    if (role !== undefined) session.role = role;
    if (company !== undefined) session.company = company;
    if (language !== undefined) session.language = language;
    if (behavior_tone !== undefined) session.behavior_tone = behavior_tone;
    if (job_description !== undefined) session.job_description = job_description;
    if (instructions !== undefined) session.instructions = instructions;
    if (ai_model !== undefined) session.ai_model = ai_model;
    if (resume_id !== undefined) session.resume_id = resume_id || null;
    if (status !== undefined) session.status = status;
    if (transcript !== undefined) session.transcript = transcript;

    await session.save();

    return NextResponse.json({ success: true, session }, { headers: corsHeaders });
  } catch (err: any) {
    console.error("[PUT SESSION ERROR]", err);
    return NextResponse.json({ error: err.message || "Failed to update session" }, { status: 500, headers: corsHeaders });
  }
}

// Add PATCH compatibility to map both routes
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return PUT(req, { params });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized. Valid token required." }, { status: 401, headers: corsHeaders });
  }

  try {
    const { id } = await params;
    await connectToDatabase();

    // Delete by MongoDB ObjectId first, fallback to session_id UUID
    let result = await InterviewSession.deleteOne({ _id: id, user_id: userId });
    if (result.deletedCount === 0) {
      result = await InterviewSession.deleteOne({ session_id: id, user_id: userId });
    }

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Session not found or not owned by user" }, { status: 404, headers: corsHeaders });
    }

    return NextResponse.json({ success: true, message: "Session deleted successfully" }, { headers: corsHeaders });
  } catch (err: any) {
    console.error("[DELETE SESSION ERROR]", err);
    return NextResponse.json({ error: err.message || "Failed to delete session" }, { status: 500, headers: corsHeaders });
  }
}
