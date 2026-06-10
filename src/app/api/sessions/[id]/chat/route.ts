import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { InterviewSession } from "@/models/InterviewSession";
import { Resume } from "@/models/Resume";
import { TokenUsage } from "@/models/TokenUsage";
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
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized. Valid token required." }, { status: 401, headers: corsHeaders });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { prompt } = body;

    if (!prompt || !prompt.trim()) {
      return NextResponse.json({ error: "Prompt/message is required" }, { status: 400, headers: corsHeaders });
    }

    await connectToDatabase();

    // Look up session (ObjectId or UUID session_id)
    let session = await InterviewSession.findOne({ _id: mongoose.Types.ObjectId.isValid(id) ? id : null, user_id: userId });
    if (!session) {
      session = await InterviewSession.findOne({ session_id: id, user_id: userId });
    }

    if (!session) {
      return NextResponse.json({ error: "Interview session not found or access denied" }, { status: 404, headers: corsHeaders });
    }

    const openAiApiKey = process.env.OPENAI_API_KEY;
    if (!openAiApiKey) {
      return NextResponse.json({ error: "Server API Key is not configured." }, { status: 500, headers: corsHeaders });
    }

    // Load resume text if linked
    let resumeText = "No resume attached.";
    if (session.resume_id) {
      const resumeDoc = await Resume.findById(session.resume_id);
      if (resumeDoc) {
        resumeText = `Skills: ${(resumeDoc.skills || []).join(", ")}\n`;
        resumeText += `Summary: ${resumeDoc.summary || ""}\n`;
        resumeText += `Work Experience:\n`;
        (resumeDoc.experience || []).forEach((exp: any) => {
          resumeText += `- ${exp.position} at ${exp.company} (${exp.start_date} - ${exp.end_date})\n  Description: ${exp.description || ""}\n`;
        });
      }
    }

    const transcriptText = (session.transcript || [])
      .map((t: any) => `${t.sender.toUpperCase()}: ${t.text}`)
      .join("\n");

    const reportText = session.report
      ? `Scores: Communication=${session.report.communication_score}, Technical=${session.report.technical_score}, Overall=${session.report.overall_score}\nFeedback: ${session.report.feedback}\nImprovement Guide: ${session.report.improvement_guide}`
      : "No AI evaluation report generated yet.";

    const systemPrompt = `You are a world-class AI Interview Coach and mentor. 
Your goal is to guide the candidate on how to perform better in their interviews based on the context of their mock interview call session.

Here is the context of the session:
- Interview Role: ${session.role}
- Company: ${session.company || "General"}
- Job Description: ${session.job_description || "Not provided"}
- Instructions: ${session.instructions || "None"}
- Candidate's Resume/Background:
"""
${resumeText}
"""
- Recorded Session Transcript:
"""
${transcriptText}
"""
- AI Evaluation Report:
"""
${reportText}
"""

Guidelines for your response:
1. Speak in a helpful, coaching, encouraging, and highly constructive tone.
2. Directly reference specific exchanges from the transcript or specific scores from the report when answering.
3. Provide clear, actionable examples. If they ask how to explain a technical topic better, provide a sample verbatim response they can practice.
4. Keep the coach responses concise and structured.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openAiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        stream: true
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(errorText, { status: response.status, headers: corsHeaders });
    }

    const reader = (response.body as any).getReader();
    const decoder = new TextDecoder();
    let responseText = "";

    const customStream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");
            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed.startsWith("data: ")) {
                const data = trimmed.slice(6);
                if (data === "[DONE]") continue;
                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content || "";
                  responseText += content;
                } catch (_) {}
              }
            }
          }
          controller.close();

          // Stream completed! Calculate tokens and log usage
          const inputTokens = Math.ceil((systemPrompt.length + prompt.length) / 3.8);
          const outputTokens = Math.ceil(responseText.length / 3.8);
          const totalTokens = inputTokens + outputTokens;
          const cost = ((inputTokens * 0.15) + (outputTokens * 0.60)) / 1000000;

          try {
            await TokenUsage.create({
              user_id: userId,
              session_id: session.session_id || session._id.toString(),
              model_name: "gpt-4o-mini",
              input_tokens: inputTokens,
              output_tokens: outputTokens,
              prompt_tokens: inputTokens,
              completion_tokens: outputTokens,
              total_tokens: totalTokens,
              cost: cost,
              request_type: "chat_assistance",
              metadata: {
                session_id: session._id,
                role: session.role,
                company: session.company,
                user_prompt: prompt
              }
            });
          } catch (dbErr) {
            console.error("[TOKEN USAGE ERROR] Failed to save chat assistance token usage:", dbErr);
          }
        } catch (err) {
          controller.error(err);
        }
      }
    });

    return new Response(customStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        ...corsHeaders
      },
    });
  } catch (err: any) {
    console.error("[CHAT ASSISTANCE ERROR]", err);
    return NextResponse.json({ error: err.message || "Failed to process chat assistance request" }, { status: 500, headers: corsHeaders });
  }
}
