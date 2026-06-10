import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Resume } from "@/models/Resume";
import { TokenUsage } from "@/models/TokenUsage";
import jwt from "jsonwebtoken";
import * as pdfParseNamespace from "pdf-parse";
const pdfParse = ((pdfParseNamespace as any).default || pdfParseNamespace) as any;
import mammoth from "mammoth";

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

export async function POST(req: NextRequest) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized. Valid token required." }, { status: 401, headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string) || "My Resume";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400, headers: corsHeaders });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    let extractedText = "";

    if (file.name.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ arrayBuffer });
      extractedText = result.value;
    } else if (file.name.endsWith(".pdf")) {
      const data = await pdfParse(buffer);
      extractedText = data.text;
    } else if (file.name.endsWith(".txt")) {
      extractedText = new TextDecoder().decode(buffer);
    } else {
      return NextResponse.json(
        { error: "Unsupported file format. Please upload PDF, DOCX, or TXT." },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!extractedText || !extractedText.trim()) {
      return NextResponse.json({ error: "No text content could be extracted from the file." }, { status: 400, headers: corsHeaders });
    }

    // Call OpenAI to parse extracted text into structured JSON
    const openAiApiKey = process.env.OPENAI_API_KEY;
    if (!openAiApiKey) {
      return NextResponse.json({ error: "Server configuration error (OpenAI key missing)." }, { status: 500, headers: corsHeaders });
    }

    const sysPrompt = `You are an expert ATS (Applicant Tracking System) parser. Analyze the input resume text and output a JSON object matching the following structure:
{
  "personal_details": {
    "name": "Full Name",
    "email": "Email Address",
    "phone": "Phone Number",
    "location": "Location (City, Country)"
  },
  "summary": "Professional summary or introduction",
  "education": [
    {
      "school": "School or University Name",
      "degree": "Degree (e.g. Bachelor of Science)",
      "field_of_study": "Field of Study",
      "start_date": "Start date or year",
      "end_date": "End date or year, or 'Present'",
      "description": "Any additional description"
    }
  ],
  "experience": [
    {
      "company": "Company Name",
      "position": "Job Title",
      "location": "Location (City, Country)",
      "start_date": "Start date",
      "end_date": "End date or 'Present'",
      "description": "Responsibilities and accomplishments"
    }
  ],
  "skills": ["Skill 1", "Skill 2"],
  "projects": [
    {
      "title": "Project Name",
      "description": "Project description",
      "technologies": ["Tech 1", "Tech 2"]
    }
  ]
}
Ensure all properties match exactly. If any section or detail is missing, set it to an empty array [] or empty string "". Do not invent information. Ensure it is a valid JSON.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openAiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: sysPrompt },
          { role: "user", content: `Extracted Resume Text:\n"""\n${extractedText}\n"""` },
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to parse resume with AI");
    }

    const choice = data.choices?.[0];
    const parsedData = JSON.parse(choice.message.content);

    // Save to database
    await connectToDatabase();
    const resume = new Resume({
      user_id: userId,
      title,
      personal_details: parsedData.personal_details,
      summary: parsedData.summary,
      education: parsedData.education || [],
      experience: parsedData.experience || [],
      skills: parsedData.skills || [],
      projects: parsedData.projects || [],
    });
    await resume.save();

    // Log token usage
    const usage = data.usage;
    if (usage) {
      const promptTokens = usage.prompt_tokens || 0;
      const completionTokens = usage.completion_tokens || 0;
      const totalTokens = usage.total_tokens || 0;
      const cost = (promptTokens * 0.15 + completionTokens * 0.6) / 1000000;

      const tokenUsage = new TokenUsage({
        user_id: userId,
        session_id: "resume_parse_" + resume._id,
        model_name: "gpt-4o-mini",
        input_tokens: promptTokens,
        output_tokens: completionTokens,
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        total_tokens: totalTokens,
        cost,
        request_type: "resume_parse",
        metadata: { resume_id: resume._id },
      });
      await tokenUsage.save();
    }

    return NextResponse.json({ success: true, resume }, { headers: corsHeaders });
  } catch (err: any) {
    console.error("[RESUME UPLOAD ERROR]", err);
    return NextResponse.json({ error: err.message || "Failed to upload and parse resume" }, { status: 500, headers: corsHeaders });
  }
}
