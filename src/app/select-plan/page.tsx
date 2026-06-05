"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Shield, 
  Check, 
  Sparkles, 
  Loader2, 
  Gift,
  ArrowRight,
  Info
} from "lucide-react";

function SelectPlanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const referralFromUrl = searchParams.get("ref") || "";

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Stripe Price IDs mapped to local products
  const priceIds: Record<string, string> = {
    "Starter Pass": "price_1TeCnyEkHwm1l3fZV45CSLvV",
    "Pro Pass": "price_1TeCpEEkHwm1l3fZej0zzJhb",
    "Elite Pass": "price_1TeCpaEkHwm1l3fZj9f7Gh31"
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("ctl_token");
    const savedUser = localStorage.getItem("ctl_user");

    if (!savedToken || !savedUser) {
      router.push(`/login${referralFromUrl ? `?ref=${referralFromUrl}` : ""}`);
      return;
    }

    setToken(savedToken);
    let parsedUser: any = null;
    try {
      parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      
      // Keep cookie updated under path=/
      document.cookie = `ctl_token=${savedToken}; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `ctl_user=${encodeURIComponent(savedUser)}; path=/; max-age=604800; SameSite=Lax`;
    } catch (e) {
      // Ignored
    }
    setLoading(false);

    // Auto-trigger plan checkout or trial selection if passed from pricing page
    const autoPlan = searchParams.get("plan");
    if (autoPlan && parsedUser) {
      if (autoPlan === "Free Trial") {
        setTimeout(() => {
          handleSelectTrialDirect(savedToken);
        }, 400);
      } else if (priceIds[autoPlan]) {
        setTimeout(() => {
          handleSelectPaidDirect(autoPlan, savedToken, parsedUser);
        }, 400);
      }
    }
  }, [router, searchParams]);

  async function handleSelectTrialDirect(activeToken: string) {
    if (!activeToken) return;
    setActionLoading("trial");
    setErrorMsg("");
    try {
      const res = await fetch("/api/billing/trial", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${activeToken}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Failed to activate Free Trial");

      // Update local cache & cookies
      localStorage.setItem("ctl_user", JSON.stringify(data.user));
      document.cookie = `ctl_user=${encodeURIComponent(JSON.stringify(data.user))}; path=/; max-age=604800; SameSite=Lax`;
      router.replace("/dashboard");
    } catch (err: any) {
      setErrorMsg(err.message);
      setActionLoading(null);
    }
  }

  async function handleSelectTrial() {
    if (!token) return;
    setActionLoading("trial");
    setErrorMsg("");
    try {
      const res = await fetch("/api/billing/trial", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Failed to activate Free Trial");

      // Update local cache & cookies
      localStorage.setItem("ctl_user", JSON.stringify(data.user));
      document.cookie = `ctl_user=${encodeURIComponent(JSON.stringify(data.user))}; path=/; max-age=604800; SameSite=Lax`;
      router.replace("/dashboard");
    } catch (err: any) {
      setErrorMsg(err.message);
      setActionLoading(null);
    }
  }

  async function handleSelectPaidDirect(planName: string, activeToken: string, activeUser: any) {
    if (!activeToken || !activeUser) return;
    setActionLoading(planName);
    setErrorMsg("");
    try {
      const priceId = priceIds[planName];
      if (!priceId) throw new Error("Price ID not configured");

      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, email: activeUser.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Failed to create checkout session");

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No Stripe checkout URL returned");
      }
    } catch (err: any) {
      setErrorMsg(err.message);
      setActionLoading(null);
    }
  }

  async function handleSelectPaid(planName: string) {
    if (!token || !user) return;
    setActionLoading(planName);
    setErrorMsg("");
    try {
      const priceId = priceIds[planName];
      if (!priceId) throw new Error("Price ID not configured");

      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, email: user.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Failed to create checkout session");

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No Stripe checkout URL returned");
      }
    } catch (err: any) {
      setErrorMsg(err.message);
      setActionLoading(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-mist)] flex justify-center items-center">
        <Loader2 className="w-10 h-10 text-[var(--accent)] animate-spin" />
      </div>
    );
  }

  const hasReferral = !!user?.referred_by || !!referralFromUrl;

  return (
    <div className="min-h-screen bg-[var(--bg-mist)] text-[var(--text-primary)] flex flex-col justify-center items-center relative overflow-hidden py-12 px-6">
      
      {/* Background Orbs */}
      <div className="orb orb-peach w-[600px] h-[600px] -top-40 left-1/4 animate-float-orb opacity-40 pointer-events-none" />
      <div className="orb orb-slate w-[400px] h-[400px] bottom-0 -right-20 animate-float-orb-slow opacity-40 pointer-events-none" />

      <div className="w-full max-w-6xl flex flex-col gap-8 relative z-10">
        
        {/* Title Block */}
        <div className="text-center flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-2 bg-[var(--accent-soft)] border border-[var(--accent)]/20 px-4 py-1.5 rounded-full text-xs font-semibold text-[var(--accent)]">
            <Sparkles className="w-4 h-4 animate-pulse" />
            Authentication Successful
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-800 mt-1" style={{ fontFamily: "var(--font-display)" }}>
            Choose Your <span className="text-gradient-coral">Access Plan</span>
          </h1>
          <p className="text-[var(--text-muted)] text-xs md:text-sm max-w-md leading-relaxed">
            Select the Free Trial to test-drive CrackTheLoop, or purchase a premium pass to unlock high-capacity interview fuel.
          </p>

          {hasReferral && (
            <div className="mt-2 inline-flex items-center gap-2 bg-emerald-50 border border-emerald-250 px-4 py-1.5 rounded-full text-xs font-bold text-emerald-700 shadow-sm">
              <Gift className="w-4 h-4 text-emerald-600" />
              Referral Applied: You will receive +20% more credits on activation!
            </div>
          )}
        </div>

        {errorMsg && (
          <div className="w-full max-w-md mx-auto p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold text-center">
            {errorMsg}
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mt-4">
          
          {/* Free Trial Card */}
          <div className="bg-white border border-[var(--border-light)] rounded-[12px] p-6 flex flex-col justify-between min-h-[380px] shadow-sm hover:shadow-md transition">
            <div>
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-slate-800">Free Trial</h3>
                <span className="bg-sky-500/15 text-sky-600 px-2 py-0.5 rounded font-black text-[9px] uppercase tracking-wider">Free</span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] mt-1 font-medium">Evaluate the platform first</p>
              
              <div className="flex items-baseline gap-1 mt-6 border-b border-slate-100 pb-4">
                <span className="text-3xl font-black text-slate-800">{hasReferral ? "18" : "15"}</span>
                <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">Credits</span>
              </div>

              <ul className="text-[11px] text-slate-600 flex flex-col gap-3 mt-4 font-semibold">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                  {hasReferral ? "18" : "15"} Fuel Credits
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                  Max 1 Interview Session
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                  Max 1 AI Report Analysis
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <Check className="w-3.5 h-3.5 text-slate-350 shrink-0" />
                  7-Day Trial Expiration
                </li>
              </ul>
            </div>

            <button
              onClick={handleSelectTrial}
              disabled={!!actionLoading}
              className="w-full mt-6 py-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 rounded-xl font-bold text-xs transition active:scale-95 cursor-pointer uppercase tracking-wider flex justify-center items-center gap-1.5"
            >
              {actionLoading === "trial" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Start Trial"}
              {actionLoading !== "trial" && <ArrowRight className="w-3.5 h-3.5 text-slate-600" />}
            </button>
          </div>

          {/* Starter Plan */}
          <div className="bg-white border border-[var(--border-light)] rounded-[12px] p-6 flex flex-col justify-between min-h-[380px] shadow-sm hover:shadow-md transition">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Starter Pass</h3>
              <p className="text-[11px] text-[var(--text-muted)] mt-1 font-medium">Ideal for standard interviews</p>
              
              <div className="flex items-baseline gap-1 mt-6 border-b border-slate-100 pb-4">
                <span className="text-3xl font-black text-slate-800">{hasReferral ? "120" : "100"}</span>
                <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">Credits</span>
              </div>

              <ul className="text-[11px] text-slate-600 flex flex-col gap-3 mt-4 font-semibold">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                  {hasReferral ? "120" : "100"} Fuel Credits
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                  Streaming STT Capturing
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                  Llama-3.1 Model Support
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectPaid("Starter Pass")}
              disabled={!!actionLoading}
              className="w-full mt-6 py-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 rounded-xl font-bold text-xs transition active:scale-95 cursor-pointer uppercase tracking-wider flex justify-center items-center gap-1.5"
            >
              {actionLoading === "Starter Pass" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Purchase $19"}
            </button>
          </div>

          {/* Pro Pass */}
          <div className="bg-white border border-[var(--accent)]/30 rounded-[12px] p-6 flex flex-col justify-between min-h-[380px] shadow-sm hover:shadow-md transition relative">
            <div className="absolute top-4 right-4 bg-[var(--accent-soft)] border border-[var(--accent)]/20 text-[var(--accent)] px-2 py-0.5 rounded text-[8px] font-bold tracking-wide uppercase">
              Popular
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Pro Pass</h3>
              <p className="text-[11px] text-[var(--text-muted)] mt-1 font-medium">For active interview stages</p>
              
              <div className="flex items-baseline gap-1 mt-6 border-b border-slate-100 pb-4">
                <span className="text-3xl font-black text-slate-800">{hasReferral ? "360" : "300"}</span>
                <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">Credits</span>
              </div>

              <ul className="text-[11px] text-slate-600 flex flex-col gap-3 mt-4 font-semibold">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                  {hasReferral ? "360" : "300"} Fuel Credits
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                  Screen Share Evasion (Zoom/Meet)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                  Unlimited Concurrent Runs
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectPaid("Pro Pass")}
              disabled={!!actionLoading}
              className="w-full mt-6 py-3 bg-[#E8503A] hover:bg-[#F06B57] text-white rounded-xl font-bold text-xs transition active:scale-95 cursor-pointer uppercase tracking-wider flex justify-center items-center gap-1.5 shadow-sm shadow-[#E8503A]/10"
            >
              {actionLoading === "Pro Pass" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Purchase $39"}
            </button>
          </div>

          {/* Elite Pass */}
          <div className="bg-white border border-[var(--border-light)] rounded-[12px] p-6 flex flex-col justify-between min-h-[380px] shadow-sm hover:shadow-md transition">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Elite Pass</h3>
              <p className="text-[11px] text-[var(--text-muted)] mt-1 font-medium">Advanced custom contexts</p>
              
              <div className="flex items-baseline gap-1 mt-6 border-b border-slate-100 pb-4">
                <span className="text-3xl font-black text-slate-800">{hasReferral ? "1200" : "1000"}</span>
                <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">Credits</span>
              </div>

              <ul className="text-[11px] text-slate-600 flex flex-col gap-3 mt-4 font-semibold">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  {hasReferral ? "1200" : "1000"} Fuel Credits
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-purple-650 shrink-0" />
                  GPT-4o-mini & Claude Models
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-purple-650 shrink-0" />
                  PDF Resume context parsing
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectPaid("Elite Pass")}
              disabled={!!actionLoading}
              className="w-full mt-6 py-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 rounded-xl font-bold text-xs transition active:scale-95 cursor-pointer uppercase tracking-wider flex justify-center items-center gap-1.5"
            >
              {actionLoading === "Elite Pass" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Purchase $79"}
            </button>
          </div>

        </div>

        {/* Dynamic Credit Info */}
        <div className="w-full bg-white border border-[var(--border-light)] p-4 rounded-[12px] flex items-start gap-3 mt-2 shadow-xs">
          <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
          <div className="text-[11px] text-slate-500 leading-relaxed">
            <strong className="text-slate-800">Credit Consumption Info:</strong> Real-time interview Copilot usage consumes **1 credit per minute** with a **minimum charge of 10 credits** per interview. AI evaluation report generation consumes **5 credits per analysis**.
          </div>
        </div>

      </div>
    </div>
  );
}

export default function SelectPlanPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--bg-mist)] flex justify-center items-center">
        <Loader2 className="w-10 h-10 text-[var(--accent)] animate-spin" />
      </div>
    }>
      <SelectPlanContent />
    </Suspense>
  );
}
