"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { 
  Shield, 
  ArrowLeft, 
  FileText, 
  Award, 
  Download, 
  Sparkles, 
  Loader2,
  Calendar,
  MessageSquare,
  Volume2,
  User,
  HelpCircle
} from "lucide-react";

export default function InterviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("ctl_token");

    if (!savedToken) {
      router.push("/login");
      return;
    }
    setToken(savedToken);

    async function loadSession() {
      try {
        const res = await fetch(`/api/interviews/${id}`, {
          headers: { "Authorization": `Bearer ${savedToken}` }
        });
        const data = await res.json();
        if (res.ok) {
          setSession(data.interview);
        } else {
          alert(data.message || data.error || "Failed to load session details");
          router.push("/dashboard/interviews");
        }
      } catch (err) {
        console.error(err);
        router.push("/dashboard/interviews");
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, [id, router]);

  async function handleGenerateReport() {
    setGeneratingReport(true);
    try {
      const res = await fetch(`/api/interviews/${id}/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ provider: "openai", apiKey: "server" })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Failed to create evaluation");
      setSession((prev: any) => ({ ...prev, report: data.report }));
      alert("Evaluation Report generated successfully!");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setGeneratingReport(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-(--bg-mist) flex justify-center items-center">
        <Loader2 className="w-10 h-10 text-(--accent) animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-(--bg-mist) text-(--text-primary) flex flex-col relative pb-16 print:bg-white print:text-black">
      
      {/* Hide elements when printing */}
      <style jsx global>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .print-card {
            border: 1px solid #ddd !important;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
          }
          .print-title {
            color: black !important;
          }
        }
      `}</style>

      {/* Background radial glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-(--accent)/3 blur-[120px] pointer-events-none select-none no-print"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/3 blur-[120px] pointer-events-none select-none no-print"></div>

      {/* Header */}
      <header className="w-full max-w-[1600px] mx-auto px-6 md:px-10 py-6 flex justify-between items-center relative z-20 no-print">
        <button 
          onClick={() => router.push("/dashboard/interviews")}
          className="flex items-center gap-2 hover:text-slate-800 transition font-bold text-xs text-slate-500 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Interviews List
        </button>
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-[#E8503A] hover:bg-[#F06B57] text-white rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition active:scale-95 shadow-md shadow-[#E8503A]/10"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            Export to PDF
          </button>
        </div>
      </header>

      <main className="w-full max-w-[1600px] mx-auto px-6 md:px-10 pt-6 flex flex-col gap-8 relative z-20 print:pt-0">
        
        {/* Title and metadata block */}
        <section className="border-b border-slate-200 pb-6 flex justify-between items-start print:border-black print:pb-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-black tracking-tight text-slate-800 print:text-black" style={{ fontFamily: "var(--font-display)" }}>
              {session.role} Evaluation Report
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500 print:text-black/80 font-semibold mt-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-(--accent) no-print" /> 
                Date: {new Date(session.created_at).toLocaleDateString([], { month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </span>
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-indigo-500 no-print" /> 
                Turns: {session.transcript?.length || 0} spoken turns
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-600 no-print" />
                Company: {session.company || "General Session"}
              </span>
            </div>
          </div>
        </section>

        {/* Evaluation Summary Report Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main report grading card */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-white border border-(--border-light) rounded-[12px] p-6 shadow-sm print-card">
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 pb-3 print:text-black print:border-black select-none">
                <Award className="w-4 h-4 text-(--accent)" />
                Grading Performance
              </h2>

              {session.report ? (
                <div className="flex flex-col gap-5 mt-4">
                  {/* Overall score */}
                  <div className="flex flex-col items-center py-4 bg-slate-50 border border-slate-200 rounded-xl print-card">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black select-none">Overall Score</span>
                    <span className="text-4xl font-black text-emerald-600 mt-1">{session.report.overall_score}/100</span>
                  </div>

                  {/* Individual metrics */}
                  <div className="flex flex-col gap-3 font-semibold text-xs">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <span className="text-slate-500 print:text-black/80">Communication Flow</span>
                      <span className="text-slate-800 print:text-black font-extrabold">{session.report.communication_score}/100</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 print:text-black/80">Technical Accuracy</span>
                      <span className="text-slate-800 print:text-black font-extrabold">{session.report.technical_score}/100</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 flex flex-col items-center gap-4">
                  <p className="text-xs text-slate-400 italic font-medium">No report has been compiled for this interview yet.</p>
                  <button
                    onClick={handleGenerateReport}
                    disabled={generatingReport}
                    className="no-print w-full py-3 bg-[#E8503A] hover:bg-[#F06B57] text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md shadow-[#E8503A]/10 hover:brightness-110 active:scale-95 transition flex justify-center items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {generatingReport ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Analyzing Transcript...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        Generate AI Evaluation
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Recalibrate / re-generate option */}
            {session.report && (
              <button
                onClick={handleGenerateReport}
                disabled={generatingReport}
                className="no-print w-full py-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold flex justify-center items-center gap-1.5 transition active:scale-95 text-slate-800 hover:text-slate-900 cursor-pointer disabled:opacity-50"
              >
                {generatingReport ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-(--accent)" />}
                Re-generate Report Evaluation
              </button>
            )}
          </div>

          {/* Detailed Feedback & Improvements */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Feedback card */}
            <div className="bg-white border border-(--border-light) rounded-[12px] p-6 shadow-sm print-card">
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 print:text-black print:border-black select-none">
                📋 Interview Evaluation Feedback
              </h2>
              {session.report ? (
                <p className="text-xs text-slate-700 leading-relaxed font-medium mt-4 whitespace-pre-wrap select-text print:text-black">
                  {session.report.feedback}
                </p>
              ) : (
                <p className="text-xs text-slate-400 italic mt-4 text-center py-4">Generate the AI Evaluation report to view qualitative feedback.</p>
              )}
            </div>

            {/* Improvement Guide card */}
            <div className="bg-white border border-(--border-light) rounded-[12px] p-6 shadow-sm print-card">
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 print:text-black print:border-black select-none">
                🚀 Reconciled Technical Improvement Guide
              </h2>
              {session.report ? (
                <p className="text-xs text-slate-700 leading-relaxed font-medium mt-4 whitespace-pre-wrap select-text print:text-black">
                  {session.report.improvement_guide}
                </p>
              ) : (
                <p className="text-xs text-slate-400 italic mt-4 text-center py-4">Generate the AI Evaluation report to view technical guidance details.</p>
              )}
            </div>

          </div>

        </section>

        {/* Complete conversation transcript timeline */}
        <section className="bg-white border border-(--border-light) rounded-[12px] p-6 md:p-8 shadow-sm print-card">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 print:text-black print:border-black select-none">
            💬 Chronological Conversation Log
          </h2>

          <div className="flex flex-col gap-4 mt-6 divide-y divide-slate-100 print:divide-black/10">
            {session.transcript && session.transcript.length > 0 ? (
              session.transcript.map((turn: any, index: number) => (
                <div key={index} className="flex flex-col gap-1.5 pt-4 first:pt-0">
                  <div className="flex justify-between items-center select-none">
                    <span className={`text-[9px] font-black uppercase tracking-wider ${
                      turn.sender === "interviewer" ? "text-sky-600" :
                      turn.sender === "candidate" ? "text-purple-600" :
                      "text-emerald-600"
                    }`}>
                      {turn.sender === "interviewer" ? "🗣️ Interviewer" :
                       turn.sender === "candidate" ? "🎙️ You" :
                       "🤖 Copilot"}
                    </span>
                    <span className="text-[8px] text-slate-400 font-semibold">
                      {new Date(turn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <p className={`text-xs px-4 py-3 rounded-[12px] border leading-relaxed font-medium select-text print:text-black print:bg-slate-100 print:border-slate-200 ${
                    turn.sender === "interviewer" ? "bg-sky-50 text-sky-800 border-sky-100/60" :
                    turn.sender === "candidate" ? "bg-purple-50 text-purple-800 border-purple-100/60" :
                    "bg-(--accent-soft) text-slate-800 border-(--accent)/15"
                  }`}>
                    {turn.text}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic py-4 text-center">No transcript data saved.</p>
            )}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full max-w-[1600px] mx-auto px-6 md:px-10 pt-24 text-center text-xs text-slate-400 mt-auto select-none flex justify-between items-center border-t border-slate-100 no-print">
        <span>© 2026 CrackTheLoop. All rights reserved.</span>
        <span className="flex items-center gap-1 text-emerald-600/70 font-semibold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          Stealth Evasion Shield Enabled
        </span>
      </footer>
    </div>
  );
}
