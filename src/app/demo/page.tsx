"use client";

import { useState, useEffect, useRef } from "react";
import {
  Shield,
  Sparkles,
  Volume2,
  Terminal,
  RefreshCw,
  Home,
  Zap,
  Cpu,
  Globe,
  MonitorSpeaker,
  BrainCircuit,
  EyeOff,
  Wifi,
  ArrowRight,
  Check,
  Mic,
  Activity,
} from "lucide-react";

/* ─────────────────────────────────────────────
   PIPELINE DIAGRAM
───────────────────────────────────────────── */
const PIPELINE_NODES = [
  {
    id: "wasapi",
    label: "WASAPI Loopback",
    sublabel: "48kHz stereo PCM",
    icon: MonitorSpeaker,
    color: "#38bdf8",
    glow: "rgba(56,189,248,0.35)",
    detail:
      "The Windows WASAPI driver captures all speaker output and mic input simultaneously at 48kHz stereo — no virtual audio cables or admin rights required.",
  },
  {
    id: "merger",
    label: "ChannelMerger",
    sublabel: "Stereo → Mono blend",
    icon: Activity,
    color: "#818cf8",
    glow: "rgba(129,140,248,0.35)",
    detail:
      "A Web Audio API ChannelMergerNode combines the left (speaker) and right (mic) channels into a single mono stream, preserving relative amplitude balance for accurate STT.",
  },
  {
    id: "downsampler",
    label: "ScriptProcessor",
    sublabel: "Downsample → 16kHz PCM",
    icon: Cpu,
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.35)",
    detail:
      "A ScriptProcessorNode decimates the 48kHz stream to 16kHz mono PCM with a 300ms VAD silence debounce — the exact format Deepgram nova-3 expects over WebSocket.",
  },
  {
    id: "deepgram",
    label: "Deepgram nova-3",
    sublabel: "Real-time WebSocket STT",
    icon: BrainCircuit,
    color: "#34d399",
    glow: "rgba(52,211,153,0.35)",
    detail:
      "PCM chunks stream to Deepgram nova-3 over a persistent WebSocket connection. Finalized transcript objects with punctuation and speaker diarization are returned in ~80ms RTT.",
  },
  {
    id: "proxy",
    label: "Next.js Proxy",
    sublabel: "/api/completion SSE",
    icon: Wifi,
    color: "#fb923c",
    glow: "rgba(251,146,60,0.35)",
    detail:
      "The transcript routes to a Next.js edge API route that forwards to Groq / Claude / GPT-4o, streaming Server-Sent Events back to the client without exposing your API key.",
  },
  {
    id: "hud",
    label: "Win32 HUD Overlay",
    sublabel: "WDA_EXCLUDEFROMCAPTURE",
    icon: EyeOff,
    color: "#f472b6",
    glow: "rgba(244,114,182,0.35)",
    detail:
      "The Tauri overlay window uses SetWindowDisplayAffinity(WDA_EXCLUDEFROMCAPTURE) making it completely absent from Zoom, Meet, Teams, and OBS screen recordings. Only you see it.",
  },
];

function PipelineDiagram() {
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [animStep, setAnimStep] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function startAnimation() {
    if (running) return;
    setRunning(true);
    setAnimStep(0);
    setActiveNode(0);
    let step = 0;
    intervalRef.current = setInterval(() => {
      step++;
      if (step >= PIPELINE_NODES.length) {
        setActiveNode(null);
        setRunning(false);
        clearInterval(intervalRef.current!);
      } else {
        setAnimStep(step);
        setActiveNode(step);
      }
    }, 800);
  }

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const node = activeNode !== null ? PIPELINE_NODES[activeNode] : null;

  return (
    <div className="flex flex-col gap-8">
      {/* Node Row */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0 relative">
        {PIPELINE_NODES.map((n, i) => {
          const Icon = n.icon;
          const isActive = activeNode === i;
          const isPast = activeNode !== null && i < activeNode;
          const isIdle = !running && activeNode === null;

          return (
            <div key={n.id} className="flex flex-col md:flex-row items-center gap-0 flex-1">
              {/* Node */}
              <button
                onClick={() => setActiveNode(activeNode === i ? null : i)}
                className="flex flex-col items-center gap-2 group cursor-pointer relative"
                style={{ minWidth: 90 }}
              >
                <div
                  className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center relative transition-all duration-500"
                  style={{
                    background: isActive
                      ? `radial-gradient(circle at 50% 50%, ${n.glow}, transparent 70%)`
                      : isPast
                      ? `${n.color}15`
                      : "#0d1020",
                    border: `1.5px solid ${isActive ? n.color : isPast ? n.color + "60" : "#ffffff15"}`,
                    boxShadow: isActive ? `0 0 28px 4px ${n.glow}` : "none",
                    transform: isActive ? "scale(1.12)" : "scale(1)",
                  }}
                >
                  <Icon
                    className="w-7 h-7 transition-all duration-300"
                    style={{ color: isActive || isPast ? n.color : "#475569" }}
                  />
                  {isActive && (
                    <span
                      className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-ping"
                      style={{ background: n.color }}
                    />
                  )}
                  {isPast && (
                    <span
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ background: n.color }}
                    >
                      <Check className="w-2.5 h-2.5 text-black" />
                    </span>
                  )}
                </div>
                <span
                  className="text-[10px] font-bold text-center leading-tight transition-colors duration-300"
                  style={{ color: isActive ? n.color : isPast ? n.color + "aa" : "#64748b", maxWidth: 82 }}
                >
                  {n.label}
                </span>
                <span className="text-[8.5px] text-slate-600 font-medium text-center leading-tight" style={{ maxWidth: 82 }}>
                  {n.sublabel}
                </span>
              </button>

              {/* Connector Arrow */}
              {i < PIPELINE_NODES.length - 1 && (
                <div className="hidden md:flex items-center flex-1 mx-1">
                  <div
                    className="h-px flex-1 transition-all duration-500 relative overflow-hidden"
                    style={{
                      background:
                        (activeNode !== null && i < activeNode)
                          ? `linear-gradient(90deg, ${PIPELINE_NODES[i].color}80, ${PIPELINE_NODES[i + 1].color}80)`
                          : "#1e293b",
                    }}
                  >
                    {activeNode === i && (
                      <span
                        className="absolute top-0 left-0 h-px w-8 animate-[slide_0.6s_linear_infinite]"
                        style={{ background: `linear-gradient(90deg, transparent, ${n.color}, transparent)` }}
                      />
                    )}
                  </div>
                  <svg width="8" height="8" viewBox="0 0 8 8" className="shrink-0">
                    <path
                      d="M0 4 L8 4 M5 1 L8 4 L5 7"
                      stroke={activeNode !== null && i < activeNode ? PIPELINE_NODES[i + 1].color + "90" : "#1e293b"}
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Detail Panel */}
      <div
        className="rounded-2xl border p-5 min-h-[80px] transition-all duration-500 flex items-start gap-4"
        style={{
          borderColor: node ? node.color + "40" : "#ffffff0a",
          background: node ? `linear-gradient(135deg, ${node.glow.replace("0.35", "0.06")}, #0b0e1b)` : "#0b0e1b",
        }}
      >
        {node ? (
          <>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: node.color + "20", border: `1px solid ${node.color}40` }}
            >
              <node.icon className="w-5 h-5" style={{ color: node.color }} />
            </div>
            <div>
              <p className="text-sm font-bold text-white mb-1">{node.label}</p>
              <p className="text-slate-400 text-xs leading-relaxed">{node.detail}</p>
            </div>
          </>
        ) : (
          <p className="text-slate-600 text-xs italic">Click any pipeline node to inspect its role, or press &ldquo;Run Pipeline&rdquo; to animate the full flow.</p>
        )}
      </div>

      {/* Run Button */}
      <div className="flex justify-center">
        <button
          onClick={startAnimation}
          disabled={running}
          id="run-pipeline-btn"
          className="flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm transition active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            background: running
              ? "#1e293b"
              : "linear-gradient(135deg, #6610F2, #0D6EFD)",
            boxShadow: running ? "none" : "0 0 24px rgba(13,110,253,0.4)",
          }}
        >
          {running ? (
            <><RefreshCw className="w-4 h-4 animate-spin" /> Streaming pipeline...</>
          ) : (
            <><Zap className="w-4 h-4" /> Run Pipeline Animation</>
          )}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   LATENCY BREAKDOWN BAR
───────────────────────────────────────────── */
const LATENCY_SEGMENTS = [
  { label: "WASAPI buffer", ms: 150, color: "#38bdf8" },
  { label: "Downsample + VAD", ms: 200, color: "#a78bfa" },
  { label: "Deepgram RTT", ms: 80, color: "#34d399" },
  { label: "LLM TTFT (Groq)", ms: 300, color: "#fb923c" },
  { label: "HUD render", ms: 20, color: "#f472b6" },
];
const TOTAL_MS = LATENCY_SEGMENTS.reduce((s, x) => s + x.ms, 0);

function LatencyBar() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-6 rounded-xl overflow-hidden w-full border border-white/5">
        {LATENCY_SEGMENTS.map((seg, i) => (
          <div
            key={i}
            className="h-full flex items-center justify-center text-[8px] font-bold text-black/70 transition-all"
            style={{ width: `${(seg.ms / TOTAL_MS) * 100}%`, background: seg.color }}
            title={`${seg.label}: ${seg.ms}ms`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-1.5">
        {LATENCY_SEGMENTS.map((seg, i) => (
          <div key={i} className="flex items-center gap-1.5 text-[10px]">
            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: seg.color }} />
            <span className="text-slate-400">{seg.label}</span>
            <span className="font-bold" style={{ color: seg.color }}>{seg.ms}ms</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 text-[10px] ml-auto">
          <span className="text-slate-500">Total:</span>
          <span className="font-black text-white text-xs">{TOTAL_MS}ms</span>
          <span className="text-emerald-400 font-bold">✓ sub-second</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SIMULATOR (original, preserved)
───────────────────────────────────────────── */
const sampleQuestions = [
  "How does virtual DOM reconciliation work in React?",
  "Explain the difference between TCP and UDP.",
  "What are index types and performance implications in PostgreSQL?",
];

const sampleAnswers: Record<string, string> = {
  "How does virtual DOM reconciliation work in React?":
    "• React creates a lightweight in-memory representation of the DOM.\n• On state change, it computes a diff between the new virtual representation and the previous snapshot.\n• Uses a heuristic O(n) algorithm to bundle changes and batch updates the real DOM efficiently.",
  "Explain the difference between TCP and UDP.":
    "• TCP is a connection-oriented protocol ensuring reliability via 3-way handshakes and retransmissions.\n• UDP is connectionless, prioritizing speed by sending packets directly without delivery verification.\n• Use TCP for databases/web traffic, and UDP for real-time video streaming/gaming.",
  "What are index types and performance implications in PostgreSQL?":
    "• B-Tree: Default index type, ideal for comparison operators (<, <=, =, >=, >) and sorting.\n• Hash Indexes: Excellent for quick exact equality comparisons but do not support range scans.\n• Indexes speed up reads significantly but introduce write overhead as index files must be updated.",
};

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
export default function DemoPage() {
  const [simState, setSimState] = useState<"idle" | "listening" | "answering" | "done">("idle");
  const [simQuestion, setSimQuestion] = useState("");
  const [simAnswer, setSimAnswer] = useState("");
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const logsRef = useRef<HTMLDivElement>(null);

  function addLog(message: string) {
    setSimLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  }

  useEffect(() => {
    if (logsRef.current) logsRef.current.scrollTop = logsRef.current.scrollHeight;
  }, [simLogs]);

  function startSimulation(question: string) {
    setSimState("listening");
    setSimQuestion(question);
    setSimAnswer("");
    setSimLogs([]);

    addLog("Initializing Audio Pipeline...");
    addLog("WASAPI loopback hook established.");
    addLog("ChannelMergerNode: stereo → mono blend active.");
    addLog("ScriptProcessor: downsampling 48kHz → 16kHz PCM.");
    addLog("Opening WebSocket: wss://api.deepgram.com/v1/listen?model=nova-3");

    setTimeout(() => {
      setSimState("answering");
      addLog("WebSocket state: OPEN");
      addLog("Deepgram VAD active — endpointing threshold: 300ms");
      addLog(`Utterance finalized: "${question}"`);
      addLog("Forwarding transcript → POST /api/completion");
      addLog("LLM: Groq/llama-3.1-8b-instant | streaming SSE...");

      const fullAnswer = sampleAnswers[question];
      let currentLength = 0;
      const interval = setInterval(() => {
        currentLength += 8;
        if (currentLength >= fullAnswer.length) {
          setSimAnswer(fullAnswer);
          setSimState("done");
          addLog("SSE stream closed. Status: [DONE]");
          addLog("Total pipeline latency: 0.75s ✓ sub-second criteria MET");
          clearInterval(interval);
        } else {
          setSimAnswer(fullAnswer.substring(0, currentLength));
          if (currentLength % 24 === 0) {
            addLog("SSE token chunk: " + JSON.stringify(fullAnswer.substring(currentLength - 24, currentLength)));
          }
        }
      }, 50);
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-[#0B0D19] text-slate-100 flex flex-col relative overflow-hidden pb-16">

      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#6610F2]/10 bg-blur-glow pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#0DCAF0]/10 bg-blur-glow pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-20 select-none">
        <a href="/copilot" className="flex items-center gap-2 hover:opacity-90 transition">
          <img src="/logo-horizontal-dark.svg" className="h-14 w-auto select-none" alt="CrackTheLoop Logo" />
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

      {/* Hero */}
      <section className="w-full max-w-4xl mx-auto px-6 pt-12 text-center flex flex-col items-center gap-4 relative z-20 select-none">
        <div className="inline-flex items-center gap-2 bg-[#6610F2]/10 border border-[#6610F2]/30 px-4 py-1.5 rounded-full text-xs font-semibold text-purple-300">
          <Sparkles className="w-3.5 h-3.5 text-[#0DCAF0] animate-pulse" />
          Interactive Live Pipeline Demo
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight" id="demo-main-heading">
          Watch the <span className="text-gradient">Real-Time Overlay</span> Pipeline
        </h1>
        <p className="text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed">
          Explore the full WASAPI → Deepgram → LLM → HUD pipeline architecture, then run an interactive simulation below.
        </p>
      </section>

      {/* ── Pipeline Diagram Card ── */}
      <section className="w-full max-w-5xl mx-auto px-6 pt-16 relative z-20">
        <div className="glow-card rounded-2xl p-6 md:p-8 flex flex-col gap-8 border-white/10" id="pipeline-diagram-card">

          <div className="flex justify-between items-center border-b border-white/5 pb-4 select-none">
            <div>
              <h2 className="text-lg font-bold text-white">Desktop Client Architecture</h2>
              <p className="text-xs text-slate-400">Click a node to inspect • Press &ldquo;Run Pipeline&rdquo; to animate the full data flow</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-white/10 px-3.5 py-1.5 rounded-full text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              <Shield className="w-3 h-3" /> Win32 Stealth Active
            </div>
          </div>

          <PipelineDiagram />

          {/* Latency Breakdown */}
          <div className="border-t border-white/5 pt-6 flex flex-col gap-3">
            <div className="flex items-center gap-2 select-none mb-1">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">End-to-End Latency Breakdown</span>
            </div>
            <LatencyBar />
          </div>

        </div>
      </section>

      {/* ── Live Simulator ── */}
      <section className="w-full max-w-5xl mx-auto px-6 pt-14 relative z-20">
        <div className="glow-card rounded-2xl p-6 md:p-8 flex flex-col gap-6 border-white/10" id="demo-simulator-container">

          <div className="flex justify-between items-center border-b border-white/5 pb-4 select-none">
            <div>
              <h2 className="text-lg font-bold text-white">Live Simulator Dashboard</h2>
              <p className="text-xs text-slate-400">Click a question below to run the full streaming pipeline simulation</p>
            </div>
            <div className="flex items-center gap-2 bg-slate-900 border border-white/10 px-3.5 py-1.5 rounded-full text-xs">
              <span className={`w-2 h-2 rounded-full ${simState === "listening" || simState === "answering" ? "bg-emerald-400 animate-ping" : "bg-slate-600"}`} />
              <span className="capitalize text-slate-350 font-bold uppercase tracking-wider">Status: {simState}</span>
            </div>
          </div>

          {/* Questions */}
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

          {/* I/O Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            {/* Left: STT Input */}
            <div className="flex flex-col gap-2">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-bold flex items-center gap-1.5 select-none">
                <Volume2 className="w-4 h-4 text-sky-400" /> WASAPI Loopback (STT Input)
              </span>
              <div className="bg-[#0b0e1b]/80 border border-white/5 rounded-xl p-4 min-h-[150px] text-sm leading-relaxed text-slate-300 select-text">
                {simState === "idle" && <span className="text-slate-600 italic select-none">Select a question to trigger transcription...</span>}
                {simState === "listening" && (
                  <span className="text-sky-300 font-bold animate-pulse select-none flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-sky-400" /> Capturing: {simQuestion}
                  </span>
                )}
                {(simState === "answering" || simState === "done") && (
                  <span className="text-emerald-400 font-semibold">{simQuestion}</span>
                )}
              </div>
            </div>

            {/* Right: HUD */}
            <div className="flex flex-col gap-2">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-bold flex items-center gap-1.5 select-none">
                <Terminal className="w-4 h-4 text-emerald-400" /> Zoom-Invisible HUD Overlay
              </span>
              <div className="bg-[#0b0e1b]/80 border border-emerald-500/10 rounded-xl p-4 min-h-[150px] text-xs leading-relaxed relative overflow-hidden shadow-inner select-text">
                <div className="absolute top-0 right-0 px-2 py-0.5 bg-emerald-500/10 text-[9px] text-emerald-400 font-bold uppercase rounded-bl-lg select-none">
                  Overlay Mock
                </div>
                {simState === "idle" && <span className="text-slate-600 italic select-none">Awaiting audio capture stream...</span>}
                {simState === "listening" && <span className="text-slate-500 italic animate-pulse select-none">Routing to LLM...</span>}
                {(simState === "answering" || simState === "done") && (
                  <div className="text-emerald-100 whitespace-pre-line font-mono font-bold leading-relaxed text-[11px] p-1">
                    {simAnswer}
                    {simState === "answering" && <span className="w-1.5 h-3.5 bg-emerald-400 inline-block ml-0.5 animate-pulse" />}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Terminal Logs */}
          <div className="flex flex-col gap-2 mt-4">
            <span className="text-xs text-slate-500 uppercase tracking-wider font-bold flex items-center gap-1.5 select-none">
              <Cpu className="w-4 h-4 text-[#0DCAF0]" /> Real-Time Pipeline Logs
            </span>
            <div
              ref={logsRef}
              className="bg-[#050711] border border-white/5 rounded-xl p-4 h-[180px] overflow-y-auto font-mono text-[11px] text-slate-400 flex flex-col gap-1.5 leading-relaxed select-text"
            >
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

      {/* CTA */}
      <section className="w-full max-w-4xl mx-auto px-6 pt-24 text-center select-none z-20">
        <div className="bg-gradient-to-r from-[#6610F2]/10 to-[#0DCAF0]/10 border border-white/10 rounded-3xl p-10 flex flex-col items-center gap-6">
          <h4 className="text-2xl font-bold text-white">Unlock full production capabilities</h4>
          <p className="text-slate-400 text-xs max-w-md">
            Deploy the live copilot straight inside your browser or grab the native Win32 desktop client installer.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/copilot"
              className="px-6 py-3 bg-gradient-to-r from-[#6610F2] to-[#0D6EFD] hover:brightness-110 rounded-xl font-bold text-xs transition active:scale-95 flex items-center gap-1.5"
            >
              Launch Browser Copilot <Globe className="w-4 h-4" />
            </a>
            <a
              href="https://github.com/Souravrooj-klizos/cracktheloop-desktop/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-750 rounded-xl font-bold text-xs transition active:scale-95 flex items-center gap-1.5"
            >
              Download Desktop App
            </a>
            <a
              href="/pricing"
              className="px-6 py-3 bg-[#0B0D19] hover:bg-slate-900 border border-slate-700 rounded-xl font-bold text-xs transition active:scale-95"
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
          <Shield className="w-3.5 h-3.5 text-emerald-400" /> Win32 Stealth Affinity Shield Enabled
        </span>
      </footer>

    </div>
  );
}
