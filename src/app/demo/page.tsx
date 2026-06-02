"use client";

import { useState } from "react";
import { 
  Shield, 
  Sparkles, 
  Volume2, 
  Terminal, 
  Play, 
  Check, 
  RefreshCw,
  Home,
  Zap,
  Cpu,
  Globe
} from "lucide-react";

export default function DemoPage() {
  const [simState, setSimState] = useState<"idle" | "listening" | "answering" | "done">("idle");
  const [simQuestion, setSimQuestion] = useState("");
  const [simAnswer, setSimAnswer] = useState("");
  const [simLogs, setSimLogs] = useState<string[]>([]);

  const sampleQuestions = [
    "How does virtual DOM reconciliation work in React?",
    "Explain the difference between TCP and UDP.",
    "What are index types and performance implications in PostgreSQL?"
  ];

  const sampleAnswers: Record<string, string> = {
    "How does virtual DOM reconciliation work in React?": 
      "• React creates a lightweight in-memory representation of the DOM.\n• On state change, it computes a diff between the new virtual representation and the previous snapshot.\n• Uses a heuristic O(n) algorithm to bundle changes and batch updates the real DOM efficiently.",
    "Explain the difference between TCP and UDP.": 
      "• TCP is a connection-oriented protocol ensuring reliability via 3-way handshakes and retransmissions.\n• UDP is connectionless, prioritizing speed by sending packets directly without delivery verification.\n• Use TCP for databases/web traffic, and UDP for real-time video streaming/gaming.",
    "What are index types and performance implications in PostgreSQL?": 
      "• B-Tree: Default index type, ideal for comparison operators (<, <=, =, >=, >) and sorting.\n• Hash Indexes: Excellent for quick exact equality comparisons but do not support range scans.\n• Indexes speed up reads significantly but introduce write overhead as index files must be updated."
  };

  function addLog(message: string) {
    setSimLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  }

  function startSimulation(question: string) {
    setSimState("listening");
    setSimQuestion(question);
    setSimAnswer("");
    setSimLogs([]);

    addLog("Initializing Audio Pipeline simulator...");
    addLog("Triggered loopback audio extraction node.");
    addLog("Merging stereo channels into unified audio context.");
    addLog("Downsampling capture stream to 16kHz mono PCM buffer.");
    addLog("Connecting mock WebSocket endpoint: wss://api.deepgram.com/v1/listen...");

    // Simulate speech-to-text typing out
    setTimeout(() => {
      setSimState("answering");
      addLog("WebSocket state: OPEN");
      addLog("Deepgram VAD active: endpointing = 300ms delay");
      addLog(`Speech chunk captured: "${question}"`);
      addLog("Speech finalized. Forwarding text to secure API proxy.");
      addLog("Routing request through Next.js proxy route: POST /api/completion");
      addLog("LLM Selected: Groq/llama-3.1-8b-instant");
      addLog("Awaiting Server Sent Events (SSE) token stream...");

      const fullAnswer = sampleAnswers[question];
      let currentLength = 0;
      const interval = setInterval(() => {
        currentLength += 8;
        if (currentLength >= fullAnswer.length) {
          setSimAnswer(fullAnswer);
          setSimState("done");
          addLog("Stream connection closed. Status [DONE].");
          addLog("Latency check: 0.88s (sub-second response criteria MET)");
          clearInterval(interval);
        } else {
          setSimAnswer(fullAnswer.substring(0, currentLength));
          if (currentLength % 24 === 0) {
            addLog("Received token chunk: " + JSON.stringify(fullAnswer.substring(currentLength - 24, currentLength)));
          }
        }
      }, 50);
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-[#0B0D19] text-slate-100 flex flex-col relative overflow-hidden pb-16">
      
      {/* Background Radial Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#6610F2]/10 bg-blur-glow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#0DCAF0]/10 bg-blur-glow"></div>

      {/* Navigation Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-20 select-none">
        <a href="/" className="flex items-center gap-2">
          <img src="/logo-horizontal-dark.svg" className="h-8 w-auto select-none" alt="Logo" />
        </a>
        <div className="flex items-center gap-6 font-semibold">
          <a href="/" className="text-sm text-slate-400 hover:text-white transition flex items-center gap-1">
            <Home className="w-4 h-4" /> Home
          </a>
          <a href="/features" className="text-sm text-slate-400 hover:text-white transition">Features</a>
          <a href="/pricing" className="text-sm text-slate-400 hover:text-white transition">Pricing</a>
          <a 
            href="/copilot" 
            className="text-xs px-5 py-2.5 bg-gradient-to-r from-[#6610F2] via-[#0D6EFD] to-[#0DCAF0] rounded-full font-bold hover:brightness-110 transition active:scale-95 shadow-md shadow-[#0D6EFD]/25 flex items-center gap-1.5"
          >
            <Globe className="w-3.5 h-3.5" /> Launch Copilot
          </a>
        </div>
      </header>

      {/* Title section */}
      <section className="w-full max-w-4xl mx-auto px-6 pt-12 text-center flex flex-col items-center gap-4 relative z-20 select-none">
        <div className="inline-flex items-center gap-2 bg-[#6610F2]/10 border border-[#6610F2]/30 px-4 py-1.5 rounded-full text-xs font-semibold text-purple-300">
          <Sparkles className="w-3.5 h-3.5 text-[#0DCAF0] animate-pulse" />
          Interactive Live Pipeline Demo
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight" id="demo-main-heading">
          Watch the <span className="text-gradient">Real-Time Overlay</span> Pipeline
        </h1>
        <p className="text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed">
          Click any of the technical questions below to initiate a simulated audio capture, transcription feed, LLM routing, and streaming output visualization.
        </p>
      </section>

      {/* Interactive Simulator Grid */}
      <section className="w-full max-w-5xl mx-auto px-6 pt-16 relative z-20">
        <div className="glow-card rounded-2xl p-6 md:p-8 flex flex-col gap-6 border-white/10" id="demo-simulator-container">
          
          <div className="flex justify-between items-center border-b border-white/5 pb-4 select-none">
            <div>
              <h2 className="text-lg font-bold text-white">Live Simulator Dashboard</h2>
              <p className="text-xs text-slate-400">Click a question below to test the streaming overlay pipeline</p>
            </div>
            <div className="flex items-center gap-2 bg-slate-900 border border-white/10 px-3.5 py-1.5 rounded-full text-xs">
              <span className={`w-2 h-2 rounded-full ${simState === "listening" || simState === "answering" ? "bg-emerald-400 animate-ping" : "bg-slate-600"}`}></span>
              <span className="capitalize text-slate-350 font-bold uppercase tracking-wider">Status: {simState}</span>
            </div>
          </div>

          {/* Quick Select Questions */}
          <div className="flex flex-col gap-2 select-none">
            <span className="text-xs text-slate-500 uppercase tracking-wider font-extrabold">Choose a sample question:</span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => startSimulation(q)}
                  disabled={simState === "listening" || simState === "answering"}
                  className="p-3.5 bg-[#0d1326] border border-white/5 rounded-xl text-left text-xs hover:border-sky-400/50 hover:bg-[#111933] transition cursor-pointer disabled:opacity-50 text-slate-300 font-semibold"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Outputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            
            {/* Left: Input Speech-to-Text */}
            <div className="flex flex-col gap-2">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-bold flex items-center gap-1.5 select-none">
                <Volume2 className="w-4 h-4 text-sky-400" />
                WASAPI Loopback (STT Input)
              </span>
              <div className="bg-[#0b0e1b]/80 border border-white/5 rounded-xl p-4 min-h-[150px] text-sm leading-relaxed text-slate-300 select-text">
                {simState === "idle" && <span className="text-slate-600 italic select-none">Select a question to trigger transcription...</span>}
                {simState === "listening" && (
                  <span className="text-sky-300 font-bold animate-pulse select-none flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-sky-400" />
                    Capturing Loopback: {simQuestion}
                  </span>
                )}
                {(simState === "answering" || simState === "done") && (
                  <span className="text-emerald-400 font-semibold">{simQuestion}</span>
                )}
              </div>
            </div>

            {/* Right: Transparent Overlay Mock */}
            <div className="flex flex-col gap-2">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-bold flex items-center gap-1.5 select-none">
                <Terminal className="w-4 h-4 text-emerald-400" />
                Zoom-Invisible HUD Overlay
              </span>
              <div className="bg-[#0b0e1b]/80 border border-emerald-500/10 rounded-xl p-4 min-h-[150px] text-xs leading-relaxed relative overflow-hidden shadow-inner select-text">
                <div className="absolute top-0 right-0 px-2 py-0.5 bg-emerald-500/10 text-[9px] text-emerald-400 font-bold uppercase rounded-bl-lg select-none">
                  Overlay Mock
                </div>
                {simState === "idle" && <span className="text-slate-600 italic select-none">Awaiting audio capture stream...</span>}
                {simState === "listening" && <span className="text-slate-500 italic animate-pulse select-none">Thinking (LLM routing)...</span>}
                {(simState === "answering" || simState === "done") && (
                  <div className="text-emerald-100 whitespace-pre-line font-mono font-bold leading-relaxed text-[11px] p-1">
                    {simAnswer}
                    {simState === "answering" && <span className="w-1.5 h-3.5 bg-emerald-400 inline-block ml-0.5 animate-pulse"></span>}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Bottom Terminal Logs */}
          <div className="flex flex-col gap-2 mt-4">
            <span className="text-xs text-slate-500 uppercase tracking-wider font-bold flex items-center gap-1.5 select-none">
              <Cpu className="w-4 h-4 text-[#0DCAF0]" />
              Real-Time Pipeline Engineering Logs
            </span>
            <div className="bg-[#050711] border border-white/5 rounded-xl p-4 h-[180px] overflow-y-auto font-mono text-[11px] text-slate-400 flex flex-col gap-1.5 leading-relaxed scrollbar-thin select-text">
              {simLogs.length === 0 ? (
                <span className="text-slate-600 italic select-none">Awaiting simulator activation to print logs...</span>
              ) : (
                simLogs.map((log, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="text-sky-400 font-bold">ctl-pipeline:</span>
                    <span>{log}</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </section>

      {/* CTA section */}
      <section className="w-full max-w-4xl mx-auto px-6 pt-24 text-center select-none z-20">
        <div className="bg-gradient-to-r from-[#6610F2]/10 to-[#0DCAF0]/10 border border-white/10 rounded-3xl p-10 flex flex-col items-center gap-6">
          <h4 className="text-2xl font-bold text-white">Unlock full production capabilities</h4>
          <p className="text-slate-400 text-xs max-w-md">
            Deploy the live copilot straight inside your browser web page or grab the native Win32/MacOS client installers.
          </p>
          <div className="flex gap-4">
            <a 
              href="/copilot"
              className="px-6 py-3 bg-gradient-to-r from-[#6610F2] to-[#0D6EFD] hover:brightness-110 rounded-xl font-bold text-xs transition active:scale-95 flex items-center gap-1.5"
            >
              Launch Browser Copilot <Globe className="w-4 h-4" />
            </a>
            <a 
              href="/pricing"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl font-bold text-xs transition active:scale-95"
            >
              Get License Key
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 pt-24 text-center text-xs text-slate-500 relative z-20 border-t border-white/5 mt-16 flex justify-between items-center select-none">
        <span>© 2026 CrackTheLoop. All rights reserved.</span>
        <span className="flex items-center gap-1 text-emerald-500/80 font-semibold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          Win32 Stealth Affinity Shield Enabled
        </span>
      </footer>

    </div>
  );
}
