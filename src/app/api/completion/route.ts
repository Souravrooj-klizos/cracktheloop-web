import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import jwt from "jsonwebtoken";

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "cracktheloop_secret_auth_key_2026_z8y";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { provider, prompt, apiKey, role, jobDescription, candidateResume, token, history, sessionId } = body;

    if (!role || !role.trim()) {
      return NextResponse.json(
        { error: "Interview role is required" },
        { status: 400 }
      );
    }

    const authHeader = req.headers.get("authorization");
    const jwtToken = token || (authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null);

    if (!jwtToken) {
      return NextResponse.json(
        { error: "Authentication token is required to make Copilot requests" },
        { status: 401 }
      );
    }

    let decoded: any;
    try {
      decoded = jwt.verify(jwtToken, NEXTAUTH_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Invalid or expired session token" }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findById(decoded.user_id);

    if (!user) {
      return NextResponse.json({ error: "User account not found" }, { status: 404 });
    }

    if (!user.is_subscribed && user.subscription_tier !== "trial") {
      return NextResponse.json(
        { error: "Active subscription or trial required to run AI Copilot" },
        { status: 402 }
      );
    }

    if (user.subscription_tier === "trial") {
      if (user.trial_expires_at && new Date() > user.trial_expires_at) {
        return NextResponse.json(
          { error: "Your 7-day Free Trial has expired. Please purchase a plan to continue." },
          { status: 402 }
        );
      }
    }

    if ((user.credits || 0) < 10) {
      return NextResponse.json(
        { error: "Insufficient credits. At least 10 credits are required to run AI Copilot." },
        { status: 402 }
      );
    }

    // Use server key if available and no client key is provided
    const serverOpenAIKey = process.env.OPENAI_API_KEY;
    const useServerKeys = !!serverOpenAIKey && (!apiKey || apiKey.trim() === "" || apiKey === "server");
    const finalApiKey = useServerKeys ? serverOpenAIKey : apiKey;

    if (!finalApiKey) {
      return NextResponse.json({ error: "API Key is required" }, { status: 400 });
    }

    const providerLower = useServerKeys ? "openai" : provider.toLowerCase();

    // Construct dynamic system prompt
    const roleLower = role.toLowerCase();
    const isSenior = roleLower.includes("senior")
        || roleLower.includes("lead")
        || roleLower.includes("architect")
        || roleLower.includes("principal")
        || roleLower.includes("staff");

    let sysPrompt = `You are the inner mind and immediate technical autopilot of an expert candidate interviewing for the role of: ${role}.
Your goal is to provide the candidate with extremely direct, technically precise, and stealthy real-time guidance.

CORE PERSONA & CONTEXT:
- Embody a world-class practitioner matching the role of ${role}.
`;

    if (isSenior) {
      sysPrompt += `        - Seniority Level: SENIOR/LEAD. Focus heavily on architectural patterns, scalability trade-offs, system safety, operational monitoring, and production-grade reliability.\n`;
    } else {
      sysPrompt += `        - Seniority Level: MID/STANDARD. Focus heavily on clean, elegant, bug-free, and highly performant technical implementations, syntax, or exact execution steps.\n`;
    }

    sysPrompt += `        
CRITICAL RULES:
1. STEALTH: NEVER mention the name 'CrackTheLoop', 'copilot', 'software', or 'overlay'. Be a quiet inner technical voice.
2. FORMAL VERBATIM RESPONSE: Write your response strictly as a highly formal, professional, first-person candidate answer. Avoid any casual terms or conversational fluff.
3. NO META-LANGUAGE: Do NOT start with any conversational preambles, greetings, or meta-introductions. Start directly with the technical answer.
4. RESPONSE FORMAT: Provide a structured, technically deep, yet concise response. Do not use robotic absolute brevity (do not restrict to 25 words or just 1 short bullet point). Make it a natural, professional first-person explanation (typically 2-4 clear sentences or a structured explanation/bullet points) with a genuine human/senior developer touch. Analyze the question thoroughly and explain details where necessary to show deep competence.
`;

    if (jobDescription && jobDescription.trim()) {
      sysPrompt += `\nTARGET JOB DETAILS (prioritize aligning answer with these tools/technologies):\n${jobDescription.trim()}\n`;
    }

    if (candidateResume && candidateResume.trim()) {
      sysPrompt += `\nCANDIDATE'S ACTUAL EXPERIENCE (anchor your first-person perspective organically using these technologies/methods where relevant):\n${candidateResume.trim()}\n`;
    }

    if (history && Array.isArray(history) && history.length > 0) {
      // Keep only the last 15 turns of history to prevent token bloat
      const recentHistory = history.slice(-15);
      let historyText = "\nCONVERSATION HISTORY TO KEEP IN MIND:\n";
      recentHistory.forEach((turn: any) => {
        const senderLabel = turn.sender === "interviewer" ? "Interviewer" : "Candidate (You)";
        historyText += `[${senderLabel}]: ${turn.text}\n`;
      });
      sysPrompt += historyText;
    }

    console.log(`[COMPLETION API] Processing request for Role: "${role}"`);
    console.log(`[COMPLETION API] Job Description injected: ${jobDescription ? `Yes (${jobDescription.trim().length} chars)` : "No"}`);
    console.log(`[COMPLETION API] Candidate Resume injected: ${candidateResume ? `Yes (${candidateResume.trim().length} chars)` : "No"}`);
    console.log(`[COMPLETION API] Conversation History injected: ${history && Array.isArray(history) ? `Yes (${history.length} turns)` : "No"}`);
    console.log(`[COMPLETION API] Final System Prompt Size: ${sysPrompt.length} chars`);
    console.log(`[COMPLETION API] Provider: ${providerLower}`);

    let url = "";
    let headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    let reqBody: any = {};

    switch (providerLower) {
      case "groq":
        url = "https://api.groq.com/v1/chat/completions";
        headers["Authorization"] = `Bearer ${finalApiKey}`;
        reqBody = {
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: sysPrompt },
            { role: "user", content: prompt },
          ],
          stream: true,
        };
        break;
      case "openai":
        url = "https://api.openai.com/v1/chat/completions";
        headers["Authorization"] = `Bearer ${finalApiKey}`;
        reqBody = {
          model: "gpt-5.4-mini",
          messages: [
            { role: "system", content: sysPrompt },
            { role: "user", content: prompt },
          ],
          stream: true,
        };
        break;
      case "xai":
        url = "https://api.x.ai/v1/chat/completions";
        headers["Authorization"] = `Bearer ${finalApiKey}`;
        reqBody = {
          model: "grok-beta",
          messages: [
            { role: "system", content: sysPrompt },
            { role: "user", content: prompt },
          ],
          stream: true,
        };
        break;
      case "anthropic":
        url = "https://api.anthropic.com/v1/messages";
        headers["x-api-key"] = finalApiKey;
        headers["anthropic-version"] = "2023-06-01";
        reqBody = {
          model: "claude-3-5-haiku-20241022",
          system: sysPrompt,
          messages: [
            { role: "user", content: prompt },
          ],
          max_tokens: 150,
          stream: true,
        };
        break;
      case "gemini":
        url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${finalApiKey}`;
        reqBody = {
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          systemInstruction: {
            parts: [{ text: sysPrompt }],
          },
        };
        break;
      default:
        return NextResponse.json({ error: `Unsupported provider: ${provider}` }, { status: 400 });
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(reqBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(errorText, {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
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
                  let content = "";
                  if (providerLower === "openai") {
                    content = parsed.choices?.[0]?.delta?.content || "";
                  } else if (providerLower === "groq") {
                    content = parsed.choices?.[0]?.delta?.content || "";
                  } else if (providerLower === "xai") {
                    content = parsed.choices?.[0]?.delta?.content || "";
                  } else if (providerLower === "anthropic") {
                    if (parsed.type === "content_block_delta") {
                      content = parsed.delta?.text || "";
                    }
                  } else if (providerLower === "gemini") {
                    content = parsed.candidates?.[0]?.content?.parts?.[0]?.text || "";
                  }
                  responseText += content;
                } catch (_) {}
              }
            }
          }
          controller.close();

          // Stream completed! Calculate tokens and save to database
          const inputTokens = Math.ceil((sysPrompt.length + prompt.length) / 3.8);
          const outputTokens = Math.ceil(responseText.length / 3.8);

          // Determine pricing (Standard rates as of 2026)
          let inputPricePerM = 0.15;
          let outputPricePerM = 0.60;
          let modelName = providerLower;

          if (providerLower === "openai") {
            modelName = "gpt-5.4-mini";
            inputPricePerM = 0.75;
            outputPricePerM = 4.50;
          } else if (providerLower === "groq") {
            modelName = "llama-3.1-8b-instant";
            inputPricePerM = 0.15;
            outputPricePerM = 0.60;
          }

          const cost = ((inputTokens * inputPricePerM) + (outputTokens * outputPricePerM)) / 1000000;

          // Save TokenUsage
          if (sessionId) {
            try {
              const { TokenUsage } = await import("@/models/TokenUsage");
              await TokenUsage.create({
                user_id: user._id,
                session_id: sessionId,
                model_name: modelName,
                input_tokens: inputTokens,
                output_tokens: outputTokens,
                cost: cost,
              });
              console.log(`[TOKEN USAGE] Logged for session ${sessionId}: model=${modelName}, input=${inputTokens}, output=${outputTokens}, cost=$${cost.toFixed(6)}`);
            } catch (dbErr) {
              console.error("[TOKEN USAGE ERROR] Failed to save token usage:", dbErr);
            }
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
      },
    });
  } catch (error: any) {
    console.error("[CORS PROXY ERROR]", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
