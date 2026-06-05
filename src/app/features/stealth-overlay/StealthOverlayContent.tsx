"use client";

import { useState } from "react";
import { Eye, EyeOff, Shield, ShieldAlert, Sparkles, Monitor, AppWindow, Cpu, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/landing/Navbar";
import CtaFooter from "../../components/landing/CtaFooter";
import Faq from "../../components/landing/Faq";

export default function StealthOverlayContent() {
  const [hudOpacity, setHudOpacity] = useState<number>(0.8);

  const customFaqs = [
    {
      q: "Is the overlay 100% invisible on Zoom, Teams, Meet, and Slack?",
      a: "Yes. Our native Windows client leverages the Win32 Display Affinity API, forcing the OS compositor to actively drop the overlay window from all capture frame request pipelines. Any tool capturing your screen (including Zoom, Slack, Meet, Teams, and OBS) will see a completely clean background.",
    },
    {
      q: "Does this work on macOS and Linux?",
      a: "Our Browser-based Copilot works on all platforms inside Chrome or Edge, operating inside an offset absolute HUD window context. The advanced Win32 Display Affinity bypass (native exclusion from screen shares) is currently native to Windows. A macOS client featuring CGWindowListCreateImage exclusion is scheduled for Q3 2026.",
    },
    {
      q: "How does Win32 Display Affinity bypass recording tools?",
      a: "When an application starts a screen share or recording, it requests a bitmap snapshot of the desktop composition tree. By calling SetWindowDisplayAffinity on our window handler, the OS compositor handles the drop at the driver level — rendering our window fully transparent to the capture buffer while remaining visible to the monitor.",
    },
    {
      q: "Can browser-based video portals detect the desktop overlay?",
      a: "No. Because the desktop overlay runs as a native application completely independent of your web browser process, websites and web-based video systems have zero access to system handles or process trees to detect its execution.",
    },
    {
      q: "Can I adjust the overlay transparency and position?",
      a: "Yes! You can customize the HUD opacity (from 10% to 100%), adjust window boundaries, resize font sizes, or enable 'ghost mode' which disables window input events so you don't accidentally click on the overlay during coding rounds.",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-mist)] text-[var(--text-primary)] flex flex-col pt-20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-6 pt-16 pb-12 text-center flex flex-col items-center gap-6">
        <div className="inline-flex items-center gap-2 bg-[var(--accent-soft)] border border-[var(--accent)]/20 px-4 py-1.5 rounded-full text-xs font-semibold text-[var(--accent)]">
          <Monitor className="w-3.5 h-3.5" />
          Win32 Hardware Exclusion HUD
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[var(--text-primary)] leading-none max-w-3xl" style={{ fontFamily: "var(--font-display)" }}>
          Zoom-Invisible <br />
          <span className="text-gradient-coral">Stealth HUD Overlay Window</span>
        </h1>
        <p className="text-[var(--text-muted)] text-base md:text-lg max-w-2xl leading-relaxed">
          The desktop client leverages native OS compositor exclusion instructions to ensure your helper notes never appear on screen shares, recordings, or screenshots.
        </p>
      </section>

      {/* Side-by-Side Screen Simulation */}
      <section className="w-full max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white border border-[var(--border-light)] rounded-[12px] p-6 md:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-5 mb-8 gap-4">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                <AppWindow className="w-5 h-5 text-[var(--accent)]" /> Stealth Comparison Sandbox
              </h2>
              <p className="text-xs text-slate-500 mt-1">See exactly what you see on your physical monitor versus what your interviewer sees during screen sharing.</p>
            </div>
            {/* Opacity slider control */}
            <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 border border-slate-200 rounded-[8px]">
              <span className="text-xs font-bold text-slate-600">Adjust HUD Opacity:</span>
              <input
                type="range"
                min="0.2"
                max="1"
                step="0.1"
                value={hudOpacity}
                onChange={(e) => setHudOpacity(parseFloat(e.target.value))}
                className="w-24 accent-[var(--accent)] cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-slate-500 w-8">{Math.round(hudOpacity * 100)}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Candidate View */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Eye className="w-4 h-4 text-emerald-500" />
                  Your Screen (Candidate View)
                </span>
              </div>
              <div className="border border-slate-250 bg-slate-900 rounded-[8px] p-4 h-80 relative overflow-hidden flex flex-col justify-between font-mono text-xs select-none">
                {/* Fake code editor */}
                <div className="text-slate-500 space-y-1">
                  <div><span className="text-purple-400">const</span> solveQuestion = (nums) =&gt; &#123;</div>
                  <div>  <span className="text-purple-400">let</span> totalSum = <span className="text-amber-400">0</span>;</div>
                  <div>  <span className="text-purple-400">for</span> (<span className="text-purple-400">let</span> i = <span className="text-amber-400">0</span>; i &lt; nums.length; i++) &#123;</div>
                  <div>    totalSum += nums[i];</div>
                  <div>  &#125;</div>
                  <div>  <span className="text-purple-400">return</span> totalSum;</div>
                  <div>&#125;;</div>
                </div>

                {/* Floating HUD Overlay (Absolute position) */}
                <div
                  className="absolute bottom-4 right-4 w-72 bg-slate-950/80 backdrop-blur-md border border-[var(--accent)]/30 rounded-[8px] p-4 shadow-xl z-20 transition-opacity duration-300"
                  style={{ opacity: hudOpacity }}
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                    <span className="text-[10px] text-[var(--accent)] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Overlay Assistance HUD
                    </span>
                    <span className="text-[8px] bg-[var(--accent-soft)] text-[var(--accent)] px-1.5 py-0.5 rounded-full font-bold">Active</span>
                  </div>
                  <div className="space-y-2 text-[10px] text-slate-350 leading-relaxed font-sans">
                    <div className="flex gap-2">
                      <span className="text-[var(--accent)] font-bold">✦</span>
                      <span>Use a HashMap for O(n) space/time lookup efficiency.</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[var(--accent)] font-bold">✦</span>
                      <span>Watch out for array boundaries and null value exceptions.</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[var(--accent)] font-bold">✓</span>
                      <span>Remember: Maintain active camera eye contact.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Shared Screen */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <EyeOff className="w-4 h-4 text-slate-500" />
                  Interviewer View (Zoom/Meet Shared Screen)
                </span>
              </div>
              <div className="border border-slate-250 bg-slate-900 rounded-[8px] p-4 h-80 relative overflow-hidden flex flex-col justify-between font-mono text-xs select-none">
                {/* Fake code editor (Identical clone) */}
                <div className="text-slate-500 space-y-1">
                  <div><span className="text-purple-400">const</span> solveQuestion = (nums) =&gt; &#123;</div>
                  <div>  <span className="text-purple-400">let</span> totalSum = <span className="text-amber-400">0</span>;</div>
                  <div>  <span className="text-purple-400">for</span> (<span className="text-purple-400">let</span> i = <span className="text-amber-400">0</span>; i &lt; nums.length; i++) &#123;</div>
                  <div>    totalSum += nums[i];</div>
                  <div>  &#125;</div>
                  <div>  <span className="text-purple-400">return</span> totalSum;</div>
                  <div>&#125;;</div>
                </div>

                {/* NO HUD OVERLAY VISIBLE AT ALL */}
                <div className="absolute inset-0 bg-transparent flex items-center justify-center pointer-events-none">
                  <div className="bg-slate-950/20 border border-slate-800 text-[10px] text-slate-500 px-3 py-1.5 rounded-[4px]">
                    [OS Composition Excludes HUD Frame]
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="w-full max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Engineered for <span className="text-gradient-coral">Absolute Stealth</span>
          </h2>
          <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-6">
            Proctoring platforms and standard video portals capture screens by reading the system's global composite buffers. By flagging the overlay handler with OS-specific rendering affinity directives, our window is entirely bypassed from screenshots and screen shares.
          </p>
          <div className="space-y-4">
            <div className="flex gap-3 items-start">
              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                <CheckCircle className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">No Virtual Drivers Needed</h4>
                <p className="text-xs text-slate-500 leading-normal">Bypasses easily detected software components or system virtual audio cables.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                <CheckCircle className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">OBS/Discord Exclude Compatibility</h4>
                <p className="text-xs text-slate-500 leading-normal">Guarantees safety against advanced capture hooks used by recording and streaming solutions.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                <CheckCircle className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Ghost Mode click-through</h4>
                <p className="text-xs text-slate-500 leading-normal">Excludes the HUD window from mouse clicks so you can code directly beneath the floating text notes.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[var(--border-light)] rounded-[12px] p-6 shadow-sm flex flex-col gap-4">
          <span className="text-xs font-mono font-bold text-[var(--accent)] tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-[var(--accent)]" /> Win32 API Display Affinity Binding
          </span>
          <p className="text-xs text-slate-600 leading-relaxed">
            On Windows 10 and 11, the native window is handled using kernel composition bindings. This bypasses common screen-capture techniques entirely.
          </p>
          <pre className="text-[10px] font-mono bg-slate-950 p-4 rounded-[6px] text-slate-350 leading-relaxed overflow-x-auto scrollbar-thin">
{`// Rust binding inside Tauri system handler
use windows::Win32::UI::WindowsAndMessaging::{
    SetWindowDisplayAffinity, WDA_EXCLUDEFROMCAPTURE
};

pub fn enforce_stealth_window(hwnd: HWND) {
    unsafe {
        SetWindowDisplayAffinity(
            hwnd, 
            WDA_EXCLUDEFROMCAPTURE // Compositor drops frame
        );
    }
}`}
          </pre>
        </div>
      </section>

      {/* Feature Custom FAQ Section */}
      <Faq faqList={customFaqs} />

      {/* CTA Footer */}
      <CtaFooter />
    </div>
  );
}
