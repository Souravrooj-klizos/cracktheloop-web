"use client";

import { useState } from "react";
import { 
  Shield, 
  Zap, 
  Mic, 
  Volume2, 
  Check, 
  ArrowRight, 
  Sparkles,
  Terminal,
  Globe,
  Gauge,
  EyeOff,
  Star,
  Target,
  Trophy,
  Users
} from "lucide-react";

export default function Home() {

  const companies = [
    {
      name: "Google",
      logo: (
        <svg className="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C18.155 2.102 15.465 1 12.24 1 5.922 1 1 5.922 1 12s4.922 11 11.24 11c6.598 0 11.002-4.636 11.002-11.196 0-.756-.08-1.334-.178-1.815H12.24z"/>
        </svg>
      )
    },
    {
      name: "Meta",
      logo: (
        <svg className="w-8 h-8 text-sky-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.48 5.76c-1.32 0-2.58.54-3.54 1.48L12 8.16l-.94-.92c-.96-.94-2.22-1.48-3.54-1.48-2.76 0-5 2.24-5 5s2.24 5 5 5c1.32 0 2.58-.54 3.54-1.48l.94-.92.94.92c.96.94 2.22 1.48 3.54 1.48 2.76 0 5-2.24 5-5s-2.24-5-5-5zm0 8c-.8 0-1.56-.32-2.12-.88l-2.36-2.32 2.36-2.32c.56-.56 1.32-.88 2.12-.88 1.66 0 3 1.34 3 3s-1.34 3-3 3zM7.52 13.76c-.8 0-1.56-.32-2.12-.88-1.66 0-3-1.34-3-3s1.34-3 3-3c.8 0 1.56.32 2.12.88l2.36 2.32-2.36 2.32c-.56.56-1.32.88-2.12.88z"/>
        </svg>
      )
    },
    {
      name: "Microsoft",
      logo: (
        <svg className="w-8 h-8 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M1 1h10v10H1V1zm12 0h10v10H13V1zM1 13h10v10H1V13zm12 0h10v10H13V13z"/>
        </svg>
      )
    },
    {
      name: "Amazon",
      logo: (
        <svg className="w-8 h-8 text-orange-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11c-.5 1-1.5 1.5-2.5 1.5s-2-.5-2.5-1.5l-1 1c.8 1.2 2.2 2 3.5 2s2.7-.8 3.5-2l-1-1z"/>
        </svg>
      )
    },
    {
      name: "Apple",
      logo: (
        <svg className="w-8 h-8 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.69-1.12 1.83-.98 2.94.12.01 2.15-.52 2.81-1.33z"/>
        </svg>
      )
    },
    {
      name: "NVIDIA",
      logo: (
        <svg className="w-8 h-8 text-emerald-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5c-2.48 0-4.5-2.02-4.5-4.5s2.02-4.5 4.5-4.5c1.46 0 2.76.7 3.57 1.78l-1.46 1.46c-.51-.62-1.27-1.02-2.11-1.02-1.54 0-2.8 1.26-2.8 2.8s1.26 2.8 2.8 2.8c.84 0 1.6-.4 2.11-1.02l1.46 1.46c-.81 1.08-2.11 1.78-3.57 1.78z"/>
        </svg>
      )
    },
    {
      name: "Netflix",
      logo: (
        <svg className="w-8 h-8 text-rose-600" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5.6 2h3.4l4.7 13.4L18.4 2h3.4v20h-3.4V8.6l-4.7 13.4H10.3L5.6 8.6V22H2.2V2z"/>
        </svg>
      )
    },
    {
      name: "Uber",
      logo: (
        <svg className="w-8 h-8 text-teal-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.3 12.2h-6.6V9.8h6.6v4.4z"/>
        </svg>
      )
    }
  ];

  return (
    <main className="min-h-screen bg-[#0B0D19] text-slate-100 flex flex-col relative overflow-hidden pb-16">
      
      {/* Background Radial Glows in official accent colors */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#6610F2]/10 bg-blur-glow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#0D6EFD]/10 bg-blur-glow"></div>

      {/* Header / Navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-20 select-none">
        <div className="flex items-center gap-2">
          <img src="/logo-horizontal-dark.svg" className="h-9 w-auto select-none" alt="CrackTheLoop Logo" />
        </div>
        <div className="flex items-center gap-6 font-semibold">
          <a href="/features" className="text-sm text-slate-400 hover:text-white transition">Features</a>
          <a href="/demo" className="text-sm text-slate-400 hover:text-white transition">Interactive Demo</a>
          <a href="/pricing" className="text-sm text-slate-400 hover:text-white transition">Pricing & Key</a>
          <a 
            href="/copilot" 
            className="text-xs px-5 py-2.5 bg-gradient-to-r from-[#6610F2] via-[#0D6EFD] to-[#0DCAF0] rounded-full font-bold hover:brightness-110 transition active:scale-95 shadow-md shadow-[#0D6EFD]/25 flex items-center gap-1.5"
          >
            <Globe className="w-3.5 h-3.5" />
            Launch Web Copilot
          </a>
          
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full max-w-5xl mx-auto px-6 pt-16 text-center flex flex-col items-center gap-6 relative z-20 select-none">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs font-medium text-sky-300">
          <Shield className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          Anti-Share Stealth Affinity Shield Active
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight max-w-3xl leading-tight">
          Stealth AI Copilot for <span className="text-gradient">Tech Interviews</span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-2xl leading-relaxed">
          Capture system audio and microphone inputs in real-time, stream answers through a high-speed LLM, and render guidance on a transparent, Zoom-invisible desktop overlay or directly in your browser.
        </p>

        <div className="flex gap-4 mt-4">
          <a
            href="/copilot"
            className="px-8 py-3.5 bg-gradient-to-r from-[#6610F2] to-[#0D6EFD] hover:brightness-110 rounded-xl font-bold shadow-lg shadow-[#0D6EFD]/20 transition active:scale-98 flex items-center gap-2"
          >
            Launch Browser Copilot
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="/pricing"
            className="px-8 py-3.5 bg-slate-800/80 border border-slate-700 rounded-xl font-bold hover:bg-slate-800 transition active:scale-98"
          >
            Get Subscription Key
          </a>
        </div>
      </section>

      {/* Target Companies Section (Showcase List) */}
      <section className="w-full max-w-5xl mx-auto px-6 pt-24 relative z-20 select-none" id="companies-showcase">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black tracking-tight text-white flex justify-center items-center gap-2" id="company-showcase-heading">
            <Trophy className="w-5.5 h-5.5 text-amber-400 animate-pulse" />
            Land Offers at World-Class Tech Giants
          </h2>
          <p className="text-xs text-slate-400 mt-2 font-medium">Our users have successfully bypassed the technical bar at leading global corporations</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {companies.map((c, i) => (
            <div key={i} className="glow-card rounded-2xl p-5 flex flex-col items-center justify-center gap-3 bg-[#0c1125] border-white/5 text-center min-h-[110px] select-none hover:border-sky-500/25">
              <div className="p-2 bg-white/5 rounded-xl border border-white/5 shadow-inner">
                {c.logo}
              </div>
              <span className="text-[10px] font-extrabold tracking-wider uppercase text-slate-400">{c.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Showcase Success Stats Grid */}
      <section className="w-full max-w-5xl mx-auto px-6 pt-24 relative z-20 select-none" id="success-stats">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="glow-card rounded-3xl p-6 bg-[#0c1125] border-white/5 flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex justify-center items-center text-sky-400 shrink-0 border border-sky-500/15 shadow-sm">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-3xl font-black text-white">94.2%</span>
              <p className="text-xs text-slate-455 font-bold uppercase tracking-wider mt-0.5">Offer Land Rate</p>
            </div>
          </div>

          <div className="glow-card rounded-3xl p-6 bg-[#0c1125] border-white/5 flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex justify-center items-center text-indigo-400 shrink-0 border border-indigo-500/15 shadow-sm">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <span className="text-3xl font-black text-white">4,800+</span>
              <p className="text-xs text-slate-455 font-bold uppercase tracking-wider mt-0.5">Interviews Cleared</p>
            </div>
          </div>

          <div className="glow-card rounded-3xl p-6 bg-[#0c1125] border-white/5 flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex justify-center items-center text-emerald-400 shrink-0 border border-emerald-500/15 shadow-sm">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <span className="text-3xl font-black text-white">&lt; 0.9s</span>
              <p className="text-xs text-slate-455 font-bold uppercase tracking-wider mt-0.5">Average Pipeline Latency</p>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Simulator Teaser Card */}
      <section id="demo-teaser" className="w-full max-w-4xl mx-auto px-6 pt-24 relative z-20">
        <div className="glow-card rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 border-white/10 bg-[#0c1125]">
          <div className="flex flex-col gap-4 max-w-md">
            <div className="inline-flex w-fit items-center gap-1.5 bg-[#0DCAF0]/15 border border-[#0DCAF0]/25 px-3 py-1 rounded-full text-[10px] font-bold text-cyan-300 uppercase tracking-widest">
              Live Pipeline Simulation
            </div>
            <h2 className="text-2xl font-black text-white">Test the Real-Time Streaming Pipeline</h2>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Explore how audio is mixed, downsampled to 16kHz mono PCM, transcribed, and fed to LLMs to return live HUD answers in under 1 second. Inspect the detailed engineering log output step-by-step.
            </p>
            <a 
              href="/demo" 
              className="text-xs text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1 transition"
            >
              Try Simulator Demo <ArrowRight className="w-3.5 h-3.5 animate-bounce-horizontal" />
            </a>
          </div>
          
          <div className="bg-[#050711] border border-white/5 p-5 rounded-2xl w-full md:w-[320px] flex flex-col gap-3 shrink-0 shadow-inner font-mono text-[10px]">
            <span className="text-white/40 uppercase font-black tracking-widest text-[9px]">Simulator Preview</span>
            <div className="flex gap-2 text-sky-400">
              <span>ctl-pipeline:</span>
              <span className="text-slate-300">Downsampling stream...</span>
            </div>
            <div className="flex gap-2 text-sky-400">
              <span>ctl-pipeline:</span>
              <span className="text-emerald-400">Deepgram VAD active (300ms)</span>
            </div>
            <div className="flex gap-2 text-sky-400">
              <span>ctl-pipeline:</span>
              <span className="text-cyan-400">Streaming SSE tokens...</span>
            </div>
            <div className="border border-dashed border-emerald-500/20 p-2 rounded text-emerald-400/90 text-[9px] bg-emerald-500/5 mt-1 font-bold">
              "• Reconciliation works via B-Tree diffs..."
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Teaser */}
      <section id="features-teaser" className="w-full max-w-5xl mx-auto px-6 pt-24 relative z-20">
        <div className="text-center mb-12 select-none">
          <h2 className="text-3xl font-extrabold tracking-tight">Engineered for Stealth and Speed</h2>
          <p className="text-slate-400 text-xs mt-2 font-medium">Discover the key components of our loopback capture architecture</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="glow-card rounded-2xl p-6 flex flex-col gap-4 border-white/10 bg-[#0c1125]">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex justify-center items-center text-sky-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Sub-Second Latency</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Real-time resamplers and 300ms silence debouncers work together to return solutions inside the transparent HUD in under 1s.
            </p>
          </div>

          <div className="glow-card rounded-2xl p-6 flex flex-col gap-4 border-white/10 bg-[#0c1125]">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex justify-center items-center text-indigo-400">
              <EyeOff className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Screen Share Evasion</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Our native client uses Win32 display affinity to bypass screensharing tools (Zoom, Meet, Slack), keeping the overlay completely invisible.
            </p>
          </div>

          <div className="glow-card rounded-2xl p-6 flex flex-col gap-4 border-white/10 bg-[#0c1125]">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex justify-center items-center text-emerald-400">
              <Volume2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Dual-Channel Mixing</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Mixes and processes microphone audio and loopback speaker output simultaneously to capture the full conversation on the fly.
            </p>
          </div>

        </div>

        <div className="text-center mt-10">
          <a 
            href="/features" 
            className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-xs font-bold transition active:scale-95 text-slate-200"
          >
            Read Technical Deep Dives <ArrowRight className="w-4 h-4 text-sky-400" />
          </a>
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

    </main>
  );
}
