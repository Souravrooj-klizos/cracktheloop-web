"use client";

import { useRouter } from "next/navigation";
import {
  Shield,
  Check,
  Sparkles,
  Share2,
  Gift,
  ArrowRight,
  UserPlus,
} from "lucide-react";
import Navbar from "../components/landing/Navbar";
import CtaFooter from "../components/landing/CtaFooter";

export default function PricingPage() {
  const router = useRouter();

  // Handle plan purchase selection by routing to secure auth-protected /select-plan
  function handlePlanSelect(planName: string) {
    router.push(`/select-plan?plan=${encodeURIComponent(planName)}`);
  }

  return (
    <div className="min-h-screen bg-[var(--bg-mist)] text-[var(--text-primary)] flex flex-col pt-20">
      
      {/* Background orbs */}
      <div className="orb orb-peach w-[600px] h-[600px] -top-40 left-1/4 animate-float-orb opacity-40 pointer-events-none" />
      <div className="orb orb-slate w-[400px] h-[400px] bottom-0 -right-20 animate-float-orb-slow opacity-40 pointer-events-none" />

      {/* Global Navigation Header */}
      <Navbar />

      {/* Page Title */}
      <section className="w-full max-w-5xl mx-auto px-6 pt-12 text-center flex flex-col items-center gap-4 relative z-20 select-none">
        <div className="inline-flex items-center gap-2 bg-[var(--accent-soft)] border border-[var(--accent)]/20 px-4 py-1.5 rounded-full text-xs font-semibold text-[var(--accent)]">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          Instant Billing Activation & Client Keys
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-slate-800" style={{ fontFamily: "var(--font-display)" }}>
          Flexible Plans for <span className="text-gradient-coral">Unlimited Access</span>
        </h1>
        <p className="text-[var(--text-muted)] text-sm md:text-base max-w-xl leading-relaxed">
          Start with our Free Trial to evaluate, or upgrade to a premium plan to obtain full access.
        </p>
      </section>

      {/* Pricing Cards Section */}
      <section className="w-full max-w-6xl mx-auto px-6 pt-16 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto items-stretch">
          
          {/* Free Trial */}
          <div className="bg-white border border-[var(--border-light)] rounded-[12px] p-8 flex flex-col justify-between shadow-sm min-h-[420px] transition hover:shadow-md">
            <div>
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-slate-800">Free Trial</h3>
                <span className="bg-sky-500/15 text-sky-600 px-2 py-0.5 rounded font-black text-[9px] uppercase tracking-wider">Free</span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">Evaluate the platform first</p>
              <div className="flex items-baseline gap-1 mt-6">
                <span className="text-4xl font-extrabold text-slate-800">$0</span>
                <span className="text-xs text-[var(--text-muted)]">/ one-time</span>
              </div>
              <ul className="text-xs text-slate-600 flex flex-col gap-3.5 border-t border-slate-100 pt-6 mt-6">
                <li className="flex items-center gap-2 font-bold text-[var(--accent)]">
                  <Check className="w-4 h-4 text-[var(--accent)]" />
                  15 AI Fuel Credits included
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-slate-400" />
                  Limit: 1 Interview session
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-slate-400" />
                  Limit: 1 AI Report analysis
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-slate-400" />
                  7-Day Trial validity
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <button
                onClick={() => handlePlanSelect("Free Trial")}
                className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl font-bold text-xs transition active:scale-95 cursor-pointer tracking-wider uppercase text-slate-800"
              >
                Start Trial
              </button>
            </div>
          </div>

          {/* Starter Plan */}
          <div className="bg-white border border-[var(--border-light)] rounded-[12px] p-8 flex flex-col justify-between shadow-sm min-h-[420px] transition hover:shadow-md">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Starter Pass</h3>
              <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">For beginners practicing code challenges</p>
              <div className="flex items-baseline gap-1 mt-6">
                <span className="text-4xl font-extrabold text-slate-800">$19</span>
                <span className="text-xs text-[var(--text-muted)]">/ month</span>
              </div>
              <ul className="text-xs text-slate-600 flex flex-col gap-3.5 border-t border-slate-100 pt-6 mt-6">
                <li className="flex items-center gap-2 font-bold text-[var(--accent)]">
                  <Check className="w-4 h-4 text-[var(--accent)]" />
                  100 Fuel Credits included
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-slate-400" />
                  Streaming STT voice capturing
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-slate-400" />
                  Standard low-latency audio capture
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-slate-400" />
                  LLaMA-3.1 model support
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <button
                onClick={() => handlePlanSelect("Starter Pass")}
                className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl font-bold text-xs transition active:scale-95 cursor-pointer tracking-wider uppercase text-slate-800"
              >
                Upgrade to Starter
              </button>
            </div>
          </div>

          {/* Pro Pass Card */}
          <div className="bg-white border border-[var(--accent)]/30 rounded-[12px] p-8 flex flex-col justify-between shadow-md relative min-h-[420px] z-10 transition hover:shadow-lg">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-white px-4 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-sm">
              Popular
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Pro Pass</h3>
              <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">Ideal for active interview stages</p>
              <div className="flex items-baseline gap-1 mt-6">
                <span className="text-4xl font-extrabold text-slate-800">$39</span>
                <span className="text-xs text-[var(--text-muted)]">/ month</span>
              </div>
              <ul className="text-xs text-slate-600 flex flex-col gap-3.5 border-t border-slate-100 pt-6 mt-6">
                <li className="flex items-center gap-2 font-bold text-[var(--accent)]">
                  <Check className="w-4 h-4 text-[var(--accent)]" />
                  300 Fuel Credits included
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[var(--accent)]" />
                  Sub-second latency streaming STT
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[var(--accent)]" />
                  Screen sharing evasion (Zoom & Meet)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[var(--accent)]" />
                  Unlimited concurrent LLM runs
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-slate-400" />
                  Standard Groq & xAI keys support
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <button
                onClick={() => handlePlanSelect("Pro Pass")}
                className="w-full py-3.5 bg-[#E8503A] hover:bg-[#F06B57] rounded-xl font-bold text-xs transition active:scale-95 cursor-pointer tracking-wider uppercase text-white shadow-md shadow-[#E8503A]/20"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>

          {/* Elite Pass Card */}
          <div className="bg-white border border-[var(--border-light)] rounded-[12px] p-8 flex flex-col justify-between shadow-sm min-h-[420px] transition hover:shadow-md">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Elite Pass</h3>
              <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">Advanced custom context models</p>
              <div className="flex items-baseline gap-1 mt-6">
                <span className="text-4xl font-extrabold text-slate-800">$79</span>
                <span className="text-xs text-[var(--text-muted)]">/ month</span>
              </div>
              <ul className="text-xs text-slate-600 flex flex-col gap-3.5 border-t border-slate-100 pt-6 mt-6">
                <li className="flex items-center gap-2 font-bold text-purple-600">
                  <Check className="w-4 h-4 text-purple-500" />
                  1000 Fuel Credits included
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-slate-400" />
                  All Pro features included
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-slate-400" />
                  Highest accuracy GPT-4o-mini & Claude
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-slate-400" />
                  PDF & DOCX Resume parsing extraction
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-slate-400" />
                  Priority routing API proxy pipelines
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <button
                onClick={() => handlePlanSelect("Elite Pass")}
                className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl font-bold text-xs transition active:scale-95 cursor-pointer tracking-wider uppercase text-slate-800"
              >
                Upgrade to Elite
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Referral Program Section */}
      <section className="w-full max-w-5xl mx-auto px-6 pt-24 pb-8 relative z-20 select-none" id="referrals-section">
        <div className="bg-white border border-[var(--border-light)] rounded-[12px] p-6 md:p-8 flex flex-col gap-6 shadow-sm">
          <div className="flex flex-col gap-1.5 border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
              <Gift className="w-5 h-5 text-purple-500 animate-bounce" />
              Referral Rewards Program
            </h2>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-xl">
              Share CrackTheLoop with friends and colleagues — both of you earn bonus credits when they subscribe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Referred user benefits */}
            <div className="bg-slate-50 border border-slate-200 rounded-[12px] p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
                  <UserPlus className="w-4 h-4 text-sky-600" />
                </div>
                <span className="text-xs font-black text-slate-800 uppercase tracking-widest">You're Invited</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                When you sign up using a friend's referral link, you get <span className="text-sky-600 font-bold">+20% bonus credits</span> on any plan you choose.
              </p>
              <div className="flex flex-col gap-2 text-[10px] font-bold">
                <div className="flex justify-between text-slate-600 border-b border-slate-200/65 pb-1.5">
                  <span>Starter Pass (referred)</span><span className="text-sky-600">120 credits</span>
                </div>
                <div className="flex justify-between text-slate-600 border-b border-slate-200/65 pb-1.5">
                  <span>Pro Pass (referred)</span><span className="text-sky-600">360 credits</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Elite Pass (referred)</span><span className="text-sky-600">1,200 credits</span>
                </div>
              </div>
            </div>

            {/* Referrer benefits */}
            <div className="bg-slate-50 border border-slate-200 rounded-[12px] p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Share2 className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-xs font-black text-slate-800 uppercase tracking-widest">You Referred Someone</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Every time a friend you referred subscribes to a paid plan, you earn <span className="text-purple-600 font-bold">+50% of their plan's base credits</span>.
              </p>
              <div className="flex flex-col gap-2 text-[10px] font-bold">
                <div className="flex justify-between text-slate-600 border-b border-slate-200/65 pb-1.5">
                  <span>Friend buys Starter</span><span className="text-purple-600">+50 credits to you</span>
                </div>
                <div className="flex justify-between text-slate-600 border-b border-slate-200/65 pb-1.5">
                  <span>Friend buys Pro</span><span className="text-purple-600">+150 credits to you</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Friend buys Elite</span><span className="text-purple-600">+500 credits to you</span>
                </div>
              </div>
            </div>

          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-purple-500/5 to-sky-500/5 border border-slate-200 rounded-[12px] p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-black text-slate-800">Get your personal referral link</p>
              <p className="text-[11px] text-[var(--text-muted)]">Sign in to your dashboard to access and share your unique invite code.</p>
            </div>
            <a
              href="/login"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition active:scale-95 cursor-pointer flex items-center gap-2 shrink-0 shadow-md shadow-indigo-600/15"
            >
              <ArrowRight className="w-4 h-4" /> Get My Link
            </a>
          </div>
        </div>
      </section>

      {/* Global CTA Footer */}
      <CtaFooter />

    </div>
  );
}
