import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Resume } from "@/models/Resume";
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

    const resume = await Resume.findOne({ _id: id, user_id: userId });
    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404, headers: corsHeaders });
    }

    return NextResponse.json({ success: true, resume }, { headers: corsHeaders });
  } catch (err: any) {
    console.error("[GET RESUME DETAIL ERROR]", err);
    return NextResponse.json({ error: err.message || "Failed to load resume details" }, { status: 500, headers: corsHeaders });
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
    const { title, personal_details, summary, education, experience, skills, projects } = body;

    await connectToDatabase();

    const resume = await Resume.findOne({ _id: id, user_id: userId });
    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404, headers: corsHeaders });
    }

    if (title !== undefined) resume.title = title;
    if (personal_details !== undefined) resume.personal_details = personal_details;
    if (summary !== undefined) resume.summary = summary;
    if (education !== undefined) resume.education = education;
    if (experience !== undefined) resume.experience = experience;
    if (skills !== undefined) resume.skills = skills;
    if (projects !== undefined) resume.projects = projects;

    await resume.save();

    return NextResponse.json({ success: true, resume }, { headers: corsHeaders });
  } catch (err: any) {
    console.error("[PUT RESUME ERROR]", err);
    return NextResponse.json({ error: err.message || "Failed to update resume" }, { status: 500, headers: corsHeaders });
  }
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

    const result = await Resume.deleteOne({ _id: id, user_id: userId });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Resume not found or not owned by user" }, { status: 404, headers: corsHeaders });
    }

    return NextResponse.json({ success: true, message: "Resume deleted successfully" }, { headers: corsHeaders });
  } catch (err: any) {
    console.error("[DELETE RESUME ERROR]", err);
    return NextResponse.json({ error: err.message || "Failed to delete resume" }, { status: 500, headers: corsHeaders });
  }
}
