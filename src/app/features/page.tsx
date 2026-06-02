"use client";

import { useState, useEffect } from "react";
import { 
  Shield, 
  Zap, 
  Mic, 
  Volume2, 
  Maximize2, 
  Layers, 
  Cpu, 
  Lock, 
  EyeOff, 
  Gauge, 
  ArrowRight,
  Check,
  Home,
  Globe
} from "lucide-react";

export default function FeaturesPage() {

  return (
    <div className="min-h-screen bg-[#0B0D19] text-slate-100 flex flex-col relative overflow-hidden pb-16">
      
      {/* Background Radial Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#6610F2]/10 bg-blur-glow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#0D6EFD]/10 bg-blur-glow"></div>

      {/* Navigation Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-20">
        <a href="/" className="flex items-center gap-2">
          <img src="/logo-horizontal-dark.svg" className="h-8 w-auto select-none" alt="Logo" />
        </a>
        <div className="flex items-center gap-6 font-semibold">
          <a href="/" className="text-sm text-slate-400 hover:text-white transition flex items-center gap-1">
            <Home className="w-4 h-4" /> Home
          </a>
          <a href="/demo" className="text-sm text-slate-400 hover:text-white transition">Demo Simulator</a>
          <a href="/pricing" className="text-sm text-slate-400 hover:text-white transition">Pricing</a>
          <a 
            href="/copilot" 
            className="text-xs px-5 py-2.5 bg-gradient-to-r from-[#6610F2] via-[#0D6EFD] to-[#0DCAF0] rounded-full font-bold hover:brightness-110 transition active:scale-95 shadow-md shadow-[#0D6EFD]/25 flex items-center gap-1.5"
          >
            <Globe className="w-3.5 h-3.5" /> Launch Copilot
          </a>
        </div>
      </header>

      {/* SEO Title & Subtitle */}
      <section className="w-full max-w-4xl mx-auto px-6 pt-12 text-center flex flex-col items-center gap-4 relative z-20 select-none">
        <div className="inline-flex items-center gap-2 bg-[#0DCAF0]/10 border border-[#0DCAF0]/30 px-4 py-1.5 rounded-full text-xs font-semibold text-cyan-300">
          <Shield className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          Stealth Capabilities & Audio Engine Core
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight" id="features-main-heading">
          Engineered for <span className="text-gradient">Ultimate Stealth & Speed</span>
        </h1>
        <p className="text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed">
          CrackTheLoop combines hardware-level system loopback capture with modern LLM streaming and screen share display filters to deliver technical interview guidance without a trace.
        </p>
      </section>

      {/* Features Grid & Deep Dives */}
      <section className="w-full max-w-6xl mx-auto px-6 pt-16 relative z-20 flex flex-col gap-16">
        
        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="glow-card rounded-2xl p-6 flex flex-col gap-4 border-white/10" id="feature-latency-card">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex justify-center items-center text-sky-400">
              <Zap className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">Sub-1.0s Feed Latency</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              We leverage custom real-time audio downsamplers, 300ms websocket endpointing debouncers, and server-sent-event (SSE) streaming connections to supply instantaneous technical insights.
            </p>
          </div>

          <div className="glow-card rounded-2xl p-6 flex flex-col gap-4 border-white/10" id="feature-affinity-card">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex justify-center items-center text-indigo-400">
              <EyeOff className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">Screen Share Evasion</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our native client utilizes Win32 Display Affinity APIs to exclude the overlay window from desktop screen captures. Zoom, Teams, Meet, and Slack see only a clean background.
            </p>
          </div>

          <div className="glow-card rounded-2xl p-6 flex flex-col gap-4 border-white/10" id="feature-mixing-card">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex justify-center items-center text-emerald-400">
              <Volume2 className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">Dual-Channel Mixing</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Capture speaker playback (interviewers speaking) and local microphone playback simultaneously. Merges both channels into a unified mono PCM buffer on the fly.
            </p>
          </div>

        </div>

        {/* Deep Dive Section 1: Screen Share Bypass */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-white/2 border border-white/5 p-8 rounded-3xl" id="evasion-deep-dive">
          <div className="flex flex-col gap-5">
            <div className="inline-flex w-fit items-center gap-1.5 bg-indigo-500/15 border border-indigo-500/25 px-3 py-1 rounded-full text-[10px] font-bold text-indigo-300 uppercase tracking-widest">
              Windows Display Affinity API
            </div>
            <h3 className="text-2xl font-black text-white">How the Screen Share Bypass Works</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              In standard screen recordings or screen sharing, operating systems copy the pixel buffer of the desktop composition tree. By calling native Win32 APIs such as `SetWindowDisplayAffinity(hwnd, WDA_EXCLUDEFROMCAPTURE)` on the desktop client overlay window, the OS compositor actively drops the overlay's frame from any capture requests.
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              On the browser-based client, the overlay dashboard is rendered inside a floating HUD layout that can be custom offset and operates with adjustable opacity values. Because the dashboard is run in its own web sandbox, it operates transparently to your target audio sharing channels.
            </p>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> Completely invisible to Zoom, Discord, Google Meet, and Teams.
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> Runs natively on Win10/Win11 with zero drivers.
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> Safe against screenshots and software screen-capture hooks.
              </li>
            </ul>
          </div>
          <div className="bg-[#080a15] border border-white/5 rounded-2xl p-6 flex flex-col gap-4 shadow-inner">
            <span className="text-[10px] text-indigo-400 font-mono uppercase tracking-widest">Win32 API Bindings (Rust)</span>
            <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto bg-slate-950/60 p-4 rounded-xl leading-relaxed scrollbar-thin">
{`// Tauri Window Setup Configuration
use windows::Win32::UI::WindowsAndMessaging::{
    SetWindowDisplayAffinity, WDA_EXCLUDEFROMCAPTURE
};

pub fn apply_stealth_affinity(hwnd: HWND) {
    unsafe {
        SetWindowDisplayAffinity(
            hwnd, 
            WDA_EXCLUDEFROMCAPTURE
        );
    }
}`}
            </pre>
          </div>
        </div>

        {/* Deep Dive Section 2: Audio Engineering & Downsampling */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-white/2 border border-white/5 p-8 rounded-3xl" id="audio-deep-dive">
          <div className="bg-[#080a15] border border-white/5 rounded-2xl p-6 flex flex-col gap-4 shadow-inner order-last md:order-first">
            <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-widest">Web Audio API Graph</span>
            <div className="flex flex-col gap-3 font-mono text-[11px] bg-slate-950/60 p-4 rounded-xl leading-relaxed text-slate-350 scrollbar-thin">
              <div>{"1. [Local Mic Stream] ───┐"}</div>
              <div>{"                         ├─── [ChannelMergerNode]"}</div>
              <div>{"2. [Speaker Loopback] ──┘"}</div>
              <div className="text-emerald-400">{"       │"}</div>
              <div className="text-emerald-400">{"       ├─── [ScriptProcessor] (Downsamples 48kHz -> 16kHz)"}</div>
              <div className="text-emerald-400">{"       │"}</div>
              <div className="text-emerald-400">{"       ├─── [PCM Converter] (f32 samples -> i16 PCM Buffer)"}</div>
              <div className="text-emerald-400">{"       │"}</div>
              <div>{"3. [Deepgram WebSocket] ───► Transcripts Streamed to LLM"}</div>
            </div>
          </div>
          
          <div className="flex flex-col gap-5">
            <div className="inline-flex w-fit items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/25 px-3 py-1 rounded-full text-[10px] font-bold text-emerald-300 uppercase tracking-widest">
              Audio Loopback Mixer
            </div>
            <h3 className="text-2xl font-black text-white">Real-Time Audio Extraction Graph</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Standard audio devices record at 44.1kHz or 48kHz in stereo, which requires massive network bandwidth and CPU cycles to transmit. CrackTheLoop converts these high-fidelity inputs in real-time.
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              On the desktop, we hook into WASAPI Loopback to tap the speaker buffer. On the browser, we use `getDisplayMedia` to capture system/tab audio. We feed these into a Web Audio merger node, downsample the mixed stream to **16kHz mono**, convert the floating-point samples to **16-bit signed PCM** chunks, and send them to the transcription backend via WebSockets.
            </p>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> Custom linear resamplers to limit bandwidth.
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> Bypasses complex virtual audio driver installations.
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> Supports dual inputs: interviewer speakers and candidate mic.
              </li>
            </ul>
          </div>
        </div>

      </section>

      {/* CTA section */}
      <section className="w-full max-w-4xl mx-auto px-6 pt-24 text-center select-none z-20">
        <div className="bg-gradient-to-r from-[#6610F2]/10 to-[#0D6EFD]/10 border border-white/10 rounded-3xl p-10 flex flex-col items-center gap-6">
          <h4 className="text-2xl font-bold text-white">Ready to experience the stealth copilot?</h4>
          <p className="text-slate-400 text-xs max-w-md">
            Test the live audio transcription engine and streaming overlay directly in your browser with our mock demo.
          </p>
          <div className="flex gap-4">
            <a 
              href="/demo"
              className="px-6 py-3 bg-gradient-to-r from-[#6610F2] to-[#0D6EFD] hover:brightness-110 rounded-xl font-bold text-xs transition active:scale-95 flex items-center gap-1.5"
            >
              Launch Demo Simulator <ArrowRight className="w-4 h-4" />
            </a>
            <a 
              href="/pricing"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl font-bold text-xs transition active:scale-95"
            >
              View Pricing Tiers
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
