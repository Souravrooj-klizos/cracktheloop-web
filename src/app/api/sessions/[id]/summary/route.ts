import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { InterviewSession } from "@/models/InterviewSession";
import { User } from "@/models/User";
import { TokenUsage } from "@/models/TokenUsage";
import { logCreditTransaction } from "@/lib/transactions";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

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

export async function POST(
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

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404, headers: corsHeaders });
    }

    // Trial report limit check (maximum 1 report generated)
    if (user.subscription_tier === "trial") {
      const reportCount = await InterviewSession.countDocuments({
        user_id: userId,
        report: { $exists: true, $ne: null }
      });
      if (reportCount >= 1) {
        return NextResponse.json(
          { error: "Free Trial limit reached. You can only generate exactly 1 AI report. Please purchase a plan to continue." },
          { status: 403, headers: corsHeaders }
        );
      }
    }

    // Look up session (supports MongoDB ObjectId and custom UUID session_id)
    let session = await InterviewSession.findOne({ _id: mongoose.Types.ObjectId.isValid(id) ? id : null, user_id: userId });
    if (!session) {
      session = await InterviewSession.findOne({ session_id: id, user_id: userId });
    }

    if (!session) {
      return NextResponse.json({ error: "Interview session not found or access denied" }, { status: 404, headers: corsHeaders });
    }

    if (!session.transcript || session.transcript.length === 0) {
      return NextResponse.json({ error: "Cannot evaluate an empty interview transcript" }, { status: 400, headers: corsHeaders });
    }

    const openAiApiKey = process.env.OPENAI_API_KEY;
    if (!openAiApiKey) {
      return NextResponse.json({ error: "Server API Key is not configured." }, { status: 500, headers: corsHeaders });
    }

    // Build the grading prompt for the LLM
    const transcriptText = session.transcript
      .map((t: any) => `${t.sender.toUpperCase()}: ${t.text}`)
      .join("\n");

    const systemPrompt = `You are a Principal Engineering Recruiter and Technical Interviewer.
Your job is to analyze the provided interview transcript and generate a structured evaluation report.
Analyze candidate's communication flow, correctness of technical details, and accuracy in response to questions.

Provide scores out of 100.
You MUST output ONLY a valid JSON object matching this structure (no markdown formatting, no code block tickmarks):
{
  "communication_score": number,
  "technical_score": number,
  "overall_score": number,
  "feedback": "summary string",
  "improvement_guide": "reconciliation guide string"
}`;

    const userPrompt = `Interview Role: ${session.role}
Company: ${session.company || "General"}

Transcript:
${transcriptText}

Generate the evaluation report.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openAiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LLM provider returned error: ${errorText}`);
    }

    const result = await response.json();
    let textOutput = result.choices?.[0]?.message?.content || "";

    // Clean up any markdown code fences or preambles in case the model ignored formatting rules
    let cleanedOutput = textOutput.trim();
    cleanedOutput = cleanedOutput.replace(/```json/g, "").replace(/```/g, "").trim();

    // Safely extract the first valid JSON object block if the LLM output includes preambles
    const firstBrace = cleanedOutput.indexOf('{');
    const lastBrace = cleanedOutput.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleanedOutput = cleanedOutput.substring(firstBrace, lastBrace + 1);
    }

    let evaluation: any;
    try {
      evaluation = JSON.parse(cleanedOutput);
    } catch (parseErr) {
      console.error("[REPORT GENERATION] Failed to parse LLM response JSON:", cleanedOutput, parseErr);
      throw new Error("Invalid report JSON returned by the AI provider");
    }

    // Save report in Mongoose document
    session.report = {
      communication_score: Number(evaluation.communication_score) || 0,
      technical_score: Number(evaluation.technical_score) || 0,
      overall_score: Number(evaluation.overall_score) || 0,
      feedback: evaluation.feedback || "",
      improvement_guide: evaluation.improvement_guide || ""
    };
    session.status = "completed"; // mark completed on summary generation!

    await session.save();

    // Parse token usage from the API response
    let promptTokens = 0;
    let completionTokens = 0;
    let totalTokens = 0;

    if (result.usage) {
      promptTokens = result.usage.prompt_tokens || result.usage.input_tokens || 0;
      completionTokens = result.usage.completion_tokens || result.usage.output_tokens || 0;
      totalTokens = result.usage.total_tokens || (promptTokens + completionTokens);
    }

    // Fallback estimation if no usage statistics are available from provider
    if (promptTokens === 0) {
      promptTokens = Math.ceil((systemPrompt.length + userPrompt.length) / 3.8);
    }
    if (completionTokens === 0) {
      completionTokens = Math.ceil(textOutput.length / 3.8);
    }
    if (totalTokens === 0) {
      totalTokens = promptTokens + completionTokens;
    }

    const aiCost = ((promptTokens * 2.50) + (completionTokens * 10.00)) / 1000000;

    // Log TokenUsage to database
    try {
      await TokenUsage.create({
        user_id: user._id,
        session_id: session.session_id || session._id.toString(),
        model_name: "gpt-4o",
        input_tokens: promptTokens,
        output_tokens: completionTokens,
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        total_tokens: totalTokens,
        cost: aiCost,
        request_type: "report",
        metadata: {
          session_id: session._id,
          role: session.role,
          company: session.company,
          transcript_length: session.transcript.length,
          provider: "openai"
        }
      });
    } catch (dbErr) {
      console.error("[TOKEN USAGE ERROR] Failed to log report token usage:", dbErr);
    }

    // Burn 5 credits for evaluation report
    user.credits = Math.max(0, (user.credits || 0) - 5);
    user.total_burn_credits = (user.total_burn_credits || 0) + 5;
    await user.save();
    await logCreditTransaction(user._id, 5, "burn", "report_evaluation", "gpt-4o");

    console.log(`[REPORT GENERATION] Compiled report for ${user.email}. Charged 5 credits. Remaining: ${user.credits}`);

    return NextResponse.json({ success: true, report: session.report }, { headers: corsHeaders });
  } catch (err: any) {
    console.error("[REPORT GENERATION ERROR]", err);
    return NextResponse.json({ error: err.message || "Failed to generate report evaluation" }, { status: 500, headers: corsHeaders });
  }
}
