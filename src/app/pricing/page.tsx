"use client";

import { useState, useEffect } from "react";
import { 
  Shield, 
  Check, 
  ArrowLeft, 
  CreditCard, 
  Lock, 
  Download, 
  Sparkles,
  Key,
  Home,
  Globe,
  Share2,
  Gift,
  DollarSign,
  TrendingUp
} from "lucide-react";

export default function PricingPage() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [accountKey, setAccountKey] = useState("");

  // Referral states
  const [refCode, setRefCode] = useState("");
  const [copiedRef, setCopiedRef] = useState(false);

  useEffect(() => {
    const savedSub = localStorage.getItem("ctl_is_subscribed") === "true";
    const savedKey = localStorage.getItem("ctl_account_key") || "";
    if (savedSub && savedKey) {
      setIsSubscribed(true);
      setAccountKey(savedKey);
    }

    // Generate static ref code
    setRefCode("REF-" + Math.random().toString(36).substring(2, 8).toUpperCase());
  }, []);

  function handleMockSubscribe(planName: string) {
    setSelectedPlan(planName);
    setShowCheckout(true);
  }

  function confirmCheckout() {
    const generatedKey = "ctl_live_key_" + Math.random().toString(36).substring(2, 12).toUpperCase();
    localStorage.setItem("ctl_is_subscribed", "true");
    localStorage.setItem("ctl_account_key", generatedKey);
    setAccountKey(generatedKey);
    setIsSubscribed(true);
    setShowCheckout(false);
  }

  function handleResetLicense() {
    localStorage.removeItem("ctl_is_subscribed");
    localStorage.removeItem("ctl_account_key");
    setIsSubscribed(false);
    setAccountKey("");
  }

  function copyReferralLink() {
    const link = `https://cracktheloop.com/ref?code=${refCode}`;
    navigator.clipboard.writeText(link);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  }

  return (
    <div className="min-h-screen bg-[#0B0D19] text-slate-100 flex flex-col relative overflow-hidden pb-16">
      
      {/* Background Radial Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#6610F2]/10 bg-blur-glow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#0DCAF0]/10 bg-blur-glow"></div>

      {/* Navigation Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-20">
        <a href="/" className="flex items-center gap-2 group">
          <img src="/logo-horizontal-dark.svg" className="h-8 w-auto select-none" alt="Logo" />
        </a>
        <div className="flex items-center gap-6 font-semibold">
          <a href="/" className="text-sm text-slate-400 hover:text-white transition flex items-center gap-1">
            <Home className="w-4 h-4" /> Home
          </a>
          <a href="/features" className="text-sm text-slate-400 hover:text-white transition">Features</a>
          <a href="/demo" className="text-sm text-slate-400 hover:text-white transition">Demo Simulator</a>
          <a href="/copilot" className="text-sm text-slate-400 hover:text-white transition flex items-center gap-1">
            <Globe className="w-4 h-4" /> Web Copilot
          </a>
        </div>
      </header>

      {/* Page Title */}
      <section className="w-full max-w-5xl mx-auto px-6 pt-12 text-center flex flex-col items-center gap-4 relative z-20 select-none">
        <div className="inline-flex items-center gap-2 bg-[#6610F2]/10 border border-[#6610F2]/30 px-4 py-1.5 rounded-full text-xs font-semibold text-purple-300">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#0DCAF0]" />
          Instant Billing Activation & Client Keys
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
          Flexible Plans for <span className="text-gradient">Unlimited Access</span>
        </h1>
        <p className="text-slate-400 text-sm md:text-base max-w-xl leading-relaxed">
          Upgrade your account to generate an active license key for the Stealth Desktop Overlay client and Web Audio Copilot.
        </p>
      </section>

      {/* Pricing Cards Section */}
      <section className="w-full max-w-6xl mx-auto px-6 pt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          
          {/* Starter Plan */}
          <div className="glow-card rounded-3xl p-8 flex flex-col justify-between border-white/10 bg-[#0c1125] min-h-[420px]">
            <div>
              <h3 className="text-xl font-bold text-white">Starter Pass</h3>
              <p className="text-xs text-slate-400 mt-1 font-medium">For beginners practicing code challenges</p>
              <div className="flex items-baseline gap-1 mt-6">
                <span className="text-4xl font-extrabold text-white">$19</span>
                <span className="text-xs text-slate-400">/ month</span>
              </div>
              <ul className="text-xs text-slate-300 flex flex-col gap-3.5 border-t border-white/5 pt-6 mt-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sky-400" />
                  Streaming STT voice capturing
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sky-400" />
                  Standard low-latency audio capture
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sky-400" />
                  LLaMA-3.1 model support
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <button
                onClick={() => handleMockSubscribe("Starter Pass")}
                disabled={isSubscribed}
                className="w-full py-3.5 bg-slate-800 border border-slate-700 rounded-xl font-bold text-xs transition hover:bg-slate-700 active:scale-95 cursor-pointer disabled:opacity-50 tracking-wider uppercase text-white"
              >
                {isSubscribed ? "Active Subscriber" : "Upgrade to Starter"}
              </button>
            </div>
          </div>

          {/* Pro Pass Card */}
          <div className="glow-card rounded-3xl p-8 flex flex-col justify-between border-white/10 bg-[#0c1125] relative min-h-[420px] border-indigo-500/20 shadow-lg shadow-indigo-500/5">
            <div className="absolute top-4 right-4 bg-sky-500/20 text-sky-300 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase">
              Popular
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Pro Pass</h3>
              <p className="text-xs text-slate-400 mt-1 font-medium">Ideal for active interview stages</p>
              <div className="flex items-baseline gap-1 mt-6">
                <span className="text-4xl font-extrabold text-white">$39</span>
                <span className="text-xs text-slate-400">/ month</span>
              </div>
              <ul className="text-xs text-slate-300 flex flex-col gap-3.5 border-t border-white/5 pt-6 mt-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sky-400" />
                  Sub-second latency streaming STT
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sky-400" />
                  Screen sharing evasion (Zoom & Meet)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sky-400" />
                  Unlimited concurrent LLM runs
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sky-400" />
                  Standard Groq & xAI keys support
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <button
                onClick={() => handleMockSubscribe("Pro Pass")}
                disabled={isSubscribed}
                className="w-full py-3.5 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-xl font-bold text-xs transition hover:brightness-110 active:scale-95 cursor-pointer disabled:opacity-50 tracking-wider uppercase text-white shadow-md shadow-indigo-500/10"
              >
                {isSubscribed ? "Active Subscriber" : "Upgrade to Pro"}
              </button>
            </div>
          </div>

          {/* Elite Pass Card */}
          <div className="glow-card rounded-3xl p-8 flex flex-col justify-between border-white/10 bg-[#0d1326] min-h-[420px]">
            <div>
              <h3 className="text-xl font-bold text-white">Elite Pass</h3>
              <p className="text-xs text-slate-400 mt-1 font-medium">Advanced custom context models</p>
              <div className="flex items-baseline gap-1 mt-6">
                <span className="text-4xl font-extrabold text-white">$79</span>
                <span className="text-xs text-slate-400">/ month</span>
              </div>
              <ul className="text-xs text-slate-300 flex flex-col gap-3.5 border-t border-white/5 pt-6 mt-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400" />
                  All Pro features included
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400" />
                  Highest accuracy GPT-4o-mini & Claude
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400" />
                  PDF & DOCX Resume parsing extraction
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400" />
                  Priority routing API proxy pipelines
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <button
                onClick={() => handleMockSubscribe("Elite Pass")}
                disabled={isSubscribed}
                className="w-full py-3.5 bg-slate-800 border border-slate-700 rounded-xl font-bold text-xs transition hover:bg-slate-700 active:scale-95 cursor-pointer disabled:opacity-50 tracking-wider uppercase text-white"
              >
                {isSubscribed ? "Active Subscriber" : "Upgrade to Elite"}
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Stripe checkout dialog */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-6 select-none animate-fade-in">
          <div className="w-[420px] bg-[#0c1125] border border-white/10 rounded-2xl p-6 flex flex-col gap-6 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-400 animate-pulse" />
                Stripe Payment Gateway
              </h3>
              <button 
                onClick={() => setShowCheckout(false)}
                className="text-slate-400 hover:text-white transition cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Selected Plan:</span>
                <span className="text-white font-semibold">{selectedPlan}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400 border-b border-white/5 pb-3">
                <span>Billing Interval:</span>
                <span className="text-white">Monthly</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-1">
                <span>Total Due:</span>
                <span className="text-emerald-400">
                  {selectedPlan === "Starter Pass" ? "$19.00" : selectedPlan === "Pro Pass" ? "$39.00" : "$79.00"}
                </span>
              </div>
            </div>

            <div className="bg-[#060913] border border-white/5 rounded-xl p-4 flex flex-col gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Card Number: 4242 4242 4242 4242"
                  disabled
                  className="w-full bg-[#0d1326] border border-white/10 px-3 py-2.5 rounded-lg text-xs font-mono text-slate-400 placeholder-slate-500 pl-8 focus:outline-none"
                />
                <CreditCard className="w-4 h-4 text-slate-650 absolute left-2.5 top-3" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="MM/YY"
                  disabled
                  className="bg-[#0d1326] border border-white/10 px-3 py-2.5 rounded-lg text-xs font-mono text-slate-400 placeholder-slate-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="CVC"
                  disabled
                  className="bg-[#0d1326] border border-white/10 px-3 py-2.5 rounded-lg text-xs font-mono text-slate-400 placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={confirmCheckout}
              className="w-full py-3.5 bg-indigo-500 hover:bg-indigo-600 rounded-xl font-bold text-xs text-white shadow-lg shadow-indigo-500/25 transition active:scale-98 cursor-pointer flex justify-center items-center gap-1.5 uppercase tracking-wider"
            >
              <Lock className="w-4 h-4" />
              Pay & Activate Key
            </button>
          </div>
        </div>
      )}

      {/* SaaS Dashboard & Release Keys */}
      <section className="w-full max-w-5xl mx-auto px-6 pt-24 relative z-20">
        <div className="glow-card rounded-2xl p-6 md:p-8 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-gradient-emerald flex items-center gap-2">
            <Key className="w-5 h-5 text-emerald-400" />
            Active Account License
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-t border-white/5 pt-6">
            
            {/* Download Link */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-sky-400" />
                CrackTheLoop Client App (Desktop)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Download the lightweight, native Tauri v2 desktop application. Screen share evasion activates automatically to keep the overlay invisible during streams.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <a
                  href="/cracktheloop-desktop_0.1.0_x64-setup.exe"
                  download
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition active:scale-95"
                >
                  <Download className="w-3.5 h-3.5 text-sky-400" />
                  Download setup.exe
                </a>
                <a
                  href="/cracktheloop-desktop_0.1.0_x64_en-US.msi"
                  download
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition active:scale-95"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-400" />
                  Download .msi
                </a>
              </div>
            </div>

            {/* License Key Generator */}
            <div className="flex flex-col gap-3 bg-[#0a0e1c] border border-white/5 p-5 rounded-2xl">
              <h3 className="text-sm font-bold text-white">License Key Administration</h3>
              {isSubscribed ? (
                <div className="flex flex-col gap-2 animate-fade-in">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Your Live Portal Key</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={accountKey}
                      className="bg-[#050811] border border-white/10 px-3.5 py-2.5 rounded-xl text-xs font-mono text-emerald-300 w-full focus:outline-none"
                    />
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(accountKey);
                        alert("Copied to clipboard!");
                      }}
                      className="text-xs bg-white/5 hover:bg-white/10 px-4 rounded-xl border border-white/10 transition cursor-pointer font-bold"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[9px] text-slate-500 font-medium">Input this key inside the desktop client or browser copilot.</span>
                    <button 
                      onClick={handleResetLicense}
                      className="text-[9px] text-rose-400 hover:text-rose-300 font-bold uppercase tracking-wider transition cursor-pointer"
                    >
                      Reset License
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-slate-400 italic">No active license found.</span>
                  <button
                    onClick={() => window.scrollTo({ top: 200, behavior: "smooth" })}
                    className="w-fit text-xs text-sky-400 hover:text-sky-300 underline font-medium text-left bg-transparent border-0 cursor-pointer"
                  >
                    Subscribe to a pass to unlock licensing
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Referral Program Section */}
      <section className="w-full max-w-5xl mx-auto px-6 pt-24 relative z-20 select-none" id="referrals-section">
        <div className="glow-card rounded-3xl p-6 md:p-8 bg-[#0c1125] border-white/5 flex flex-col gap-6">
          <div className="flex flex-col gap-1.5 border-b border-white/5 pb-4">
            <h2 className="text-xl font-bold text-gradient flex items-center gap-2">
              <Gift className="w-5.5 h-5.5 text-purple-400 animate-bounce" />
              Affiliate & Referral Rewards Dashboard
            </h2>
            <p className="text-xs text-slate-400">Share your referral link with colleagues: earn 20% commission on every active purchase or unlock free months!</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Stats */}
            <div className="lg:col-span-1 flex flex-col gap-4 bg-[#0a0e1c] border border-white/5 p-5 rounded-2xl">
              <span className="text-xs text-white/55 font-bold uppercase tracking-wider">Referral Performance Metrics</span>
              
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Clicks</span>
                  <span className="text-xl font-black text-white flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-sky-400" />
                    142
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Signups</span>
                  <span className="text-xl font-black text-white flex items-center gap-1">
                    <Check className="w-4 h-4 text-emerald-400" />
                    4
                  </span>
                </div>
                <div className="flex flex-col gap-1 col-span-2 border-t border-white/5 pt-3 mt-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Accrued Commission</span>
                  <span className="text-2xl font-black text-emerald-400 flex items-center">
                    <DollarSign className="w-5 h-5 shrink-0" />
                    48.00
                  </span>
                </div>
              </div>
            </div>

            {/* Sharing Link Generator */}
            <div className="lg:col-span-2 flex flex-col justify-between bg-[#0a0e1c] border border-white/5 p-5 rounded-2xl">
              <div className="flex flex-col gap-2">
                <span className="text-xs text-white/55 font-bold uppercase tracking-wider">Your Personal Sharing Link</span>
                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">When users purchase any pass using your link, they receive a 10% signup discount and you accrue commission automatically.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <input
                  type="text"
                  readOnly
                  value={`https://cracktheloop.com/ref?code=${refCode}`}
                  className="bg-[#050811] border border-white/10 px-4 py-2.5 rounded-xl text-xs font-mono text-purple-300 flex-1 focus:outline-none"
                />
                <button
                  onClick={copyReferralLink}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#6610F2] to-[#0D6EFD] hover:brightness-110 rounded-xl font-black text-xs transition active:scale-95 cursor-pointer uppercase tracking-wider text-white shadow-sm flex items-center gap-1.5 self-start sm:self-auto shrink-0"
                >
                  <Share2 className="w-4 h-4" />
                  {copiedRef ? "Copied!" : "Copy Link"}
                </button>
              </div>
            </div>

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
