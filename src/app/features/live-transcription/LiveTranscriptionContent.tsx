"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, Volume2, ArrowRight, Activity, Sparkles, Shield, RefreshCw, CheckCircle, MessageSquare } from "lucide-react";
import Navbar from "../../components/landing/Navbar";
import CtaFooter from "../../components/landing/CtaFooter";
import Faq from "../../components/landing/Faq";

export default function LiveTranscriptionContent() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [bufferCount, setBufferCount] = useState(0);
  const [simulatedTranscript, setSimulatedTranscript] = useState<string[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const steps = [
    {
      title: "Audio Capture",
      desc: "Captures computer audio and microphone simultaneously without echo.",
      icon: Mic,
      color: "text-blue-500",
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
    {
      title: "Voice Balancing",
      desc: "Balances speaker volume and mic volume so both voices are equally clear.",
      icon: Volume2,
      color: "text-purple-500",
      bg: "bg-purple-50",
      border: "border-purple-200",
    },
    {
      title: "Static Cleaning",
      desc: "Cleans room background static, keystrokes, and connection fuzz on the fly.",
      icon: Activity,
      color: "text-amber-500",
      bg: "bg-amber-50",
      border: "border-amber-200",
    },
    {
      title: "Question Detection",
      desc: "Automatically detects when the interviewer finishes asking a question.",
      icon: MessageSquare,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
    },
    {
      title: "Live Formatting",
      desc: "Formats transcripts and streams talking points straight to your HUD overlay.",
      icon: Sparkles,
      color: "text-rose-500",
      bg: "bg-rose-50",
      border: "border-rose-200",
    },
  ];

  const transcriptLines = [
    "[Status] System listening active...",
    "[Mic] Mic feed verified...",
    "[Interviewer] 'So tell me about a time you resolved a performance bottleneck?'",
    "[AI Search] Question identified: Behavioral -> Performance bottleneck",
    "[HUD Display] Surfacing project: Acme Corp 40% bundle size optimization...",
    "[Tip] Maintain active eye contact and follow the STAR framework suggest below."
  ];

  useEffect(() => {
    if (isSimulating) {
      let stepIndex = 0;
      setActiveStep(0);
      intervalRef.current = setInterval(() => {
        setBufferCount((prev) => prev + 1);
        stepIndex = (stepIndex + 1) % steps.length;
        setActiveStep(stepIndex);
        
        if (stepIndex === 0 && simulatedTranscript.length < transcriptLines.length) {
          setSimulatedTranscript((prev) => [...prev, transcriptLines[prev.length]]);
        }
      }, 1500);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setActiveStep(null);
      setBufferCount(0);
      setSimulatedTranscript([]);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isSimulating]);

  const customFaqs = [
    {
      q: "How does local audio capture work?",
      a: "CrackTheLoop captures audio directly from your system's speaker buffers (the interviewer speaking) and merges it with your local microphone (your voice). This ensures both sides of the conversation are analyzed for context.",
    },
    {
      q: "Is there any lag or delay in the transcription?",
      a: "No. The end-to-end processing delay is under 850 milliseconds. This means the suggestions and talking points appear on your screen practically in real-time as the interviewer is talking.",
    },
    {
      q: "Do I need to install virtual audio drivers?",
      a: "No. Traditional platforms require installing virtual sound cables (like VB-Cable), which can mess up your speaker settings and are easily flagged. CrackTheLoop captures speaker output natively with zero driver installs.",
    },
    {
      q: "Are my audio calls recorded or saved?",
      a: "Never. Your privacy is our absolute priority. Audio chunks are converted into temporary memory buffers, processed transiently to generate suggestions, and are immediately deleted. We never record, log, or store your voice data.",
    },
    {
      q: "Does it work if I'm wearing headphones?",
      a: "Yes. The capture engine is designed to intercept speaker audio before it reaches your headphones, ensuring perfect transcription regardless of your physical audio setup."
    }
  ];

  return (
    <div className="min-h-screen bg-(--bg-mist) text-(--text-primary) flex flex-col pt-20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-6 pt-16 pb-12 text-center flex flex-col items-center gap-6 select-none">
        <div className="inline-flex items-center gap-2 bg-(--accent-soft) border border-(--accent)/20 px-4 py-1.5 rounded-full text-xs font-semibold text-(--accent)">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          Real-Time Context Extraction Engine
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-(--text-primary) leading-none max-w-3xl font-display" style={{ fontFamily: "var(--font-display)" }}>
          It Hears the Question <br />
          <span className="text-gradient-coral">Before You Finish Processing It</span>
        </h1>
        <p className="text-(--text-muted) text-base md:text-lg max-w-2xl leading-relaxed">
          CrackTheLoop captures meeting audio natively and processes questions instantly, streaming tailored reminders and STAR structure notes in under a second.
        </p>
        <div className="flex gap-4 mt-2">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#E8503A] hover:bg-[#F06B57] text-white font-bold text-sm rounded-[12px] transition active:scale-95 shadow-lg shadow-[#E8503A]/20 cursor-pointer"
          >
            {isSimulating ? "Stop Simulation" : "Simulate Audio Processing"}
            <RefreshCw className={`w-4 h-4 ${isSimulating ? "animate-spin" : ""}`} />
          </button>
        </div>
      </section>

      {/* Interactive Mockup Section */}
      <section className="w-full max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white border border-(--border-light) rounded-[20px] p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-8 flex items-center gap-2 text-slate-800" style={{ fontFamily: "var(--font-display)" }}>
            <Sparkles className="w-5 h-5 text-(--accent)" /> Conversational Flow Pipeline
          </h2>

          {/* Grid Layout of Pipeline Steps */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative select-none">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              const isActive = activeStep === idx;
              return (
                <div
                  key={step.title}
                  className={`flex flex-col items-center text-center p-5 rounded-[12px] border transition-all duration-300 ${
                    isActive
                      ? `bg-white ${step.border} border-2 shadow-md scale-105 z-10`
                      : "bg-slate-50/50 border-slate-200/60 opacity-70"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${step.bg} ${step.color} ${isActive ? "animate-bounce" : ""}`}>
                    <StepIcon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400 mb-1">Step 0{idx + 1}</span>
                  <h3 className="text-sm font-bold text-slate-800 mb-1">{step.title}</h3>
                  <p className="text-[11px] text-slate-500 leading-normal font-medium">{step.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Simulator output */}
          <div className="mt-8 bg-slate-900 rounded-[12px] p-5 font-mono text-xs text-slate-300 border border-slate-800 shadow-inner">
            <div className="flex justify-between items-center pb-3 border-b border-slate-850 mb-3 text-slate-400 select-none">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Live Processing Feed
              </span>
              <span className="text-[10px]">
                Cycles Completed: <strong className="text-emerald-400">{bufferCount}</strong>
              </span>
            </div>
            
            <div className="h-44 overflow-y-auto space-y-2 scrollbar-thin">
              {simulatedTranscript.length === 0 ? (
                <div className="text-slate-500 italic py-8 text-center select-none">
                  Click "Simulate Audio Processing" above to begin...
                </div>
              ) : (
                simulatedTranscript.map((line, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-slate-500 select-none">[{new Date().toLocaleTimeString()}]</span>
                    <span className={line.includes("Interviewer") ? "text-amber-300 font-semibold" : line.includes("AI Search") ? "text-purple-300 font-bold" : line.includes("HUD Display") ? "text-emerald-400 font-semibold" : "text-slate-300"}>
                      {line}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Details Split Layout */}
      <section className="w-full max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight mb-6 text-slate-800" style={{ fontFamily: "var(--font-display)" }}>
            Engineered for <span className="text-gradient-coral">Natural Conversation Pauses</span>
          </h2>
          <p className="text-(--text-muted) text-sm leading-relaxed mb-6 font-medium">
            In interviews, long pauses feel awkward. Our system handles audio intake in small packets, processing the audio waves continuously so you receive guidance within the natural silence of a conversation.
          </p>
          
          <div className="space-y-4">
            <div className="flex gap-3 items-start">
              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                <CheckCircle className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Clear Double-Input Stream</h4>
                <p className="text-xs text-slate-500 leading-normal">Processes what the interviewer says and what you reply, maintaining accurate session history.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                <CheckCircle className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Instant Silence Detection</h4>
                <p className="text-xs text-slate-500 leading-normal">Instantly identifies when the interviewer stops talking to trigger suggestions immediately.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                <CheckCircle className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Echo Cancellation System</h4>
                <p className="text-xs text-slate-500 leading-normal">Automatically filters out speaker feedback from your microphone, avoiding repetitive loops.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Benchmark breakdown */}
        <div className="bg-white border border-(--border-light) rounded-[20px] p-8 shadow-sm flex flex-col gap-4">
          <span className="text-[10px] text-(--accent) font-mono font-bold tracking-widest uppercase select-none">Under-The-Hood Processing Timeline</span>
          <div className="space-y-3.5 mt-2">
            {[
              { component: "Voice capture and segmentation", time: "150ms", fill: "w-[15%]" },
              { component: "Identifying question ending", time: "200ms", fill: "w-[20%]" },
              { component: "Encrypted server transit", time: "80ms", fill: "w-[8%]" },
              { component: "Conversational text transcription", time: "120ms", fill: "w-[12%]" },
              { component: "Formatting tailored suggestions", time: "300ms", fill: "w-[30%]" },
            ].map((b) => (
              <div key={b.component} className="text-xs">
                <div className="flex justify-between font-semibold text-slate-700 mb-1 select-none">
                  <span>{b.component}</span>
                  <span className="font-mono text-slate-500">{b.time}</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className={`bg-(--accent) h-full rounded-full ${b.fill}`} />
                </div>
              </div>
            ))}
            <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-xs font-bold text-slate-800 select-none">
              <span>Total Estimated Latency:</span>
              <span className="font-mono text-(--accent) text-sm bg-(--accent-soft) px-2.5 py-0.5 rounded-full">~850ms</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Custom FAQ Section */}
      <Faq faqList={customFaqs} />

      {/* CTA Footer */}
      <CtaFooter />
    </div>
  );
}
