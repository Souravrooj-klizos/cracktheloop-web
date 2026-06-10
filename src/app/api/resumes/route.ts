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

export async function GET(req: NextRequest) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized. Valid token required." }, { status: 401, headers: corsHeaders });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "date_desc";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    await connectToDatabase();

    const query: any = { user_id: userId };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { skills: { $regex: search, $options: "i" } },
        { "personal_details.name": { $regex: search, $options: "i" } },
      ];
    }

    let sortQuery: any = { created_at: -1 };
    if (sort === "date_asc") {
      sortQuery = { created_at: 1 };
    } else if (sort === "title_asc") {
      sortQuery = { title: 1 };
    } else if (sort === "title_desc") {
      sortQuery = { title: -1 };
    }

    const total = await Resume.countDocuments(query);
    const resumes = await Resume.find(query)
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        success: true,
        resumes,
        total,
        page,
        limit,
        totalPages,
      },
      { headers: corsHeaders }
    );
  } catch (err: any) {
    console.error("[GET RESUMES ERROR]", err);
    return NextResponse.json({ error: err.message || "Failed to load resumes" }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(req: Request) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized. Valid token required." }, { status: 401, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { title, personal_details, summary, education, experience, skills, projects } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Resume title is required" }, { status: 400, headers: corsHeaders });
    }

    await connectToDatabase();

    const resume = new Resume({
      user_id: userId,
      title: title.trim(),
      personal_details: personal_details || {},
      summary: summary || "",
      education: education || [],
      experience: experience || [],
      skills: skills || [],
      projects: projects || [],
    });

    await resume.save();

    return NextResponse.json({ success: true, resume }, { headers: corsHeaders });
  } catch (err: any) {
    console.error("[POST RESUME ERROR]", err);
    return NextResponse.json({ error: err.message || "Failed to create resume" }, { status: 500, headers: corsHeaders });
  }
}
