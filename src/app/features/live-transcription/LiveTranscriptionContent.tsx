"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, Volume2, ArrowRight, Activity, Terminal, Shield, Cpu, RefreshCw, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
      desc: "Tap speaker loopback and local mic directly via WASAPI / Browser APIs.",
      icon: Mic,
      color: "text-blue-500",
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
    {
      title: "Channel Mixer",
      desc: "Combine stereo speaker audio and mic streams into a single unified track.",
      icon: Volume2,
      color: "text-purple-500",
      bg: "bg-purple-50",
      border: "border-purple-200",
    },
    {
      title: "Resampler Engine",
      desc: "Downsample input sampling rate from 48kHz to 16kHz mono PCM stream.",
      icon: Cpu,
      color: "text-amber-500",
      bg: "bg-amber-50",
      border: "border-amber-200",
    },
    {
      title: "PCM Cast",
      desc: "Cast 32-bit floating samples into 16-bit signed integer buffers (83% bandwidth save).",
      icon: Activity,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
    },
    {
      title: "WebSocket Stream",
      desc: "Stream chunks directly to Deepgram WebSocket endpoint for real-time transcription.",
      icon: Terminal,
      color: "text-rose-500",
      bg: "bg-rose-50",
      border: "border-rose-200",
    },
  ];

  const transcriptLines = [
    "[System] Local audio stream connected...",
    "[Mic] Test microphone connection active...",
    "[Speaker] Interviewer: 'So tell me about a time you resolved a performance bottleneck?'",
    "[System] Intent detected: Behavioral / Performance Bottleneck",
    "[Deepgram] Transcription: 'So tell me about a time you resolved a performance bottleneck?'",
    "[System] Matching resume achievements: Surfaced Acme Corp 40% bundle size reduction.",
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
      q: "How does local loopback audio capture work?",
      a: "It taps into the Win32 WASAPI system speaker loopback engine on our native desktop client, and uses native browser tab-sharing audio capture on the web app. This reads interviewer audio directly from the sound buffer, avoiding physical speaker bleed and maintaining absolute accuracy.",
    },
    {
      q: "Is there any lag or delay in transcribing live speech?",
      a: "The end-to-end transcription delay is under 950ms. This includes ~150ms WASAPI buffer slicing, ~200ms voice activity detection (VAD) silence check, ~80ms WebSocket roundtrip, and ~300ms server processing. Transcripts stream letter-by-letter as the interviewer speaks.",
    },
    {
      q: "Does it require installing virtual sound cards or virtual audio cables?",
      a: "No. Traditional interview tools require complex audio driver setups like VB-Cable or Loopback, which can conflict with systems and are easily flagged by proctoring software. CrackTheLoop captures audio at the kernel/session level natively, requiring zero virtual audio drivers.",
    },
    {
      q: "Can it separate the interviewer's voice from my microphone input?",
      a: "Yes. The system processes microphone input and system output on separate audio nodes. This enables the LLM to differentiate between the interviewer's questions and your answers, displaying separate speaker bubbles in the dashboard.",
    },
    {
      q: "Are my audio recordings saved or logged on the server?",
      a: "No, your privacy is our primary concern. Audio blocks are converted directly into transient binary buffers in memory and streamed over secure WebSockets. We do not store, log, or record any audio files or raw transcription logs on our servers.",
    },
  ];

  return (
    <div className="min-h-screen bg-(--bg-mist) text-(--text-primary) flex flex-col pt-20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-6 pt-16 pb-12 text-center flex flex-col items-center gap-6">
        <div className="inline-flex items-center gap-2 bg-(--accent-soft) border border-(--accent)/20 px-4 py-1.5 rounded-full text-xs font-semibold text-(--accent)">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          High-Fidelity Audio Engine Core
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-(--text-primary) leading-none max-w-3xl" style={{ fontFamily: "var(--font-display)" }}>
          Instant, Real-Time <br />
          <span className="text-gradient-coral">Audio Capture & Transcription</span>
        </h1>
        <p className="text-(--text-muted) text-base md:text-lg max-w-2xl leading-relaxed">
          CrackTheLoop hooks directly into your system's speaker buffers to capture and transcribe interview questions with sub-second latency, requiring zero virtual cables.
        </p>
        <div className="flex gap-4 mt-2">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#E8503A] hover:bg-[#F06B57] text-white font-bold text-sm rounded-[8px] transition active:scale-95 shadow-lg shadow-[#E8503A]/20 cursor-pointer"
          >
            {isSimulating ? "Stop Live Simulation" : "Simulate Live Audio Graph"}
            <RefreshCw className={`w-4 h-4 ${isSimulating ? "animate-spin" : ""}`} />
          </button>
        </div>
      </section>

      {/* Interactive Mockup Section */}
      <section className="w-full max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white border border-(--border-light) rounded-[12px] p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-(--accent)" /> Audio Pipeline Architecture
          </h2>

          {/* Grid Layout of Pipeline Steps */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              const isActive = activeStep === idx;
              return (
                <div
                  key={step.title}
                  className={`flex flex-col items-center text-center p-5 rounded-[8px] border transition-all duration-300 ${
                    isActive
                      ? `bg-white ${step.border} border-2 shadow-md scale-105 z-10`
                      : "bg-slate-50/50 border-slate-200 opacity-70"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${step.bg} ${step.color} ${isActive ? "animate-bounce" : ""}`}>
                    <StepIcon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400 mb-1">0{idx + 1}</span>
                  <h3 className="text-sm font-bold text-slate-800 mb-1">{step.title}</h3>
                  <p className="text-[11px] text-slate-500 leading-normal">{step.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Simulator Terminal Output */}
          <div className="mt-8 bg-slate-900 rounded-[8px] p-5 font-mono text-xs text-slate-300 border border-slate-800 shadow-inner">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800 mb-3 text-slate-400">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                Live WebSocket Audio Logs
              </span>
              <span className="text-[10px]">
                PCM buffers sent: <strong className="text-emerald-400">{bufferCount}</strong>
              </span>
            </div>
            
            <div className="h-44 overflow-y-auto space-y-2 scrollbar-thin">
              {simulatedTranscript.length === 0 ? (
                <div className="text-slate-500 italic py-8 text-center">
                  Click "Simulate Live Audio Graph" above to stream active logs...
                </div>
              ) : (
                simulatedTranscript.map((line, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-slate-500 select-none">[{new Date().toLocaleTimeString()}]</span>
                    <span className={line.includes("Interviewer") ? "text-amber-300 font-semibold" : line.includes("Intent") ? "text-purple-300 font-bold" : line.includes("Matching") ? "text-emerald-400 font-semibold" : "text-slate-300"}>
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
          <h2 className="text-3xl font-extrabold tracking-tight mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Engineered for <span className="text-gradient-coral">Absolute Low-Latency</span>
          </h2>
          <p className="text-(--text-muted) text-sm leading-relaxed mb-6">
            In interview situations, a slow response is as bad as a wrong response. CrackTheLoop uses a customized WebSocket ingestion server optimized specifically for low-latency streaming audio.
          </p>
          <div className="space-y-4">
            <div className="flex gap-3 items-start">
              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                <CheckCircle className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Linear Audio Downsampling</h4>
                <p className="text-xs text-slate-500 leading-normal">Our linear resampler scales raw 48kHz audio streams down to 16kHz on the client, saving precious CPU cycles on your machine.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                <CheckCircle className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">16-bit Mono Integer PCM Coding</h4>
                <p className="text-xs text-slate-500 leading-normal">Casts large floating-point decimal arrays into lightweight integer segments to fit frames inside MTU sizes without network fragmentation.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                <CheckCircle className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Intelligent Voice Activity Detection (VAD)</h4>
                <p className="text-xs text-slate-500 leading-normal">Uses Client-side Silero VAD to detect question endings immediately, bypassing LLM prompt delays.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-(--border-light) rounded-[12px] p-6 shadow-sm flex flex-col gap-4">
          <span className="text-[10px] text-(--accent) font-mono font-bold tracking-widest uppercase">Benchmark Latency breakdown</span>
          <div className="space-y-3.5 mt-2">
            {[
              { component: "Audio Buffer Collection & Slicing", time: "150ms", fill: "w-[15%]" },
              { component: "Voice Activity Detection (VAD) debouncer", time: "200ms", fill: "w-[20%]" },
              { component: "WebSocket Network RTT", time: "80ms", fill: "w-[8%]" },
              { component: "Deepgram speech-to-text API latency", time: "120ms", fill: "w-[12%]" },
              { component: "Fast LLM Time-to-First-Token (TTFT)", time: "300ms", fill: "w-[30%]" },
            ].map((b) => (
              <div key={b.component} className="text-xs">
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>{b.component}</span>
                  <span className="font-mono text-slate-500">{b.time}</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className={`bg-(--accent) h-full rounded-full ${b.fill}`} />
                </div>
              </div>
            ))}
            <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-xs font-bold text-slate-800">
              <span>Total Estimated End-to-End Latency:</span>
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
