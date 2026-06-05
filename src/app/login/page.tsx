"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, Sparkles, Home, ArrowRight, Loader2, Key, UserPlus, LogIn, Gift } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Auth / Form mode: "signin" or "signup"
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  // Form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [referralCode, setReferralCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Check URL ref query or local storage
  useEffect(() => {
    if (localStorage.getItem("ctl_token")) {
      const planParam = searchParams.get("plan");
      if (planParam) {
        router.push(`/select-plan?plan=${encodeURIComponent(planParam)}`);
      } else {
        router.push("/dashboard");
      }
      return;
    }

    const urlRef = searchParams.get("ref");
    if (urlRef) {
      localStorage.setItem("ctl_ref", urlRef);
      setReferralCode(urlRef);
      setMode("signup"); // Auto-toggle to signup if referred
    } else {
      const savedRef = localStorage.getItem("ctl_ref");
      if (savedRef) {
        setReferralCode(savedRef);
      }
    }
  }, [searchParams, router]);

  async function handlePasswordAuth(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name: mode === "signup" ? name : undefined,
          referralCode: mode === "signup" ? referralCode : undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Authentication failed");
      }

      localStorage.setItem("ctl_token", data.token);
      localStorage.setItem("ctl_user", JSON.stringify(data.user));
      
      // Mirror in cookies for path=/
      document.cookie = `ctl_token=${data.token}; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `ctl_user=${encodeURIComponent(JSON.stringify(data.user))}; path=/; max-age=604800; SameSite=Lax`;

      const tier = data.user.subscription_tier;
      const planParam = searchParams.get("plan");
      if (tier === "free" || !tier || planParam) {
        setMessage(mode === "signup" ? "Account created successfully! Loading plans..." : "Sign in successful! Loading plans...");
        setTimeout(() => {
          const queryParams = [];
          if (planParam) queryParams.push(`plan=${encodeURIComponent(planParam)}`);
          if (referralCode) queryParams.push(`ref=${referralCode}`);
          const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
          router.push(`/select-plan${queryString}`);
        }, 1000);
      } else {
        setMessage("Authentication successful! Redirecting to dashboard...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      }
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-(--bg-mist) text-(--text-primary) flex flex-col justify-center items-center relative overflow-hidden px-6">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-15%] w-[60%] h-[60%] rounded-full bg-(--accent)/5 blur-[120px] pointer-events-none select-none"></div>
      <div className="absolute bottom-[-20%] right-[-15%] w-[60%] h-[60%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none select-none"></div>

      {/* Navigation link back home */}
      <a 
        href="/" 
        className="absolute top-6 left-6 flex items-center gap-2 hover:opacity-85 font-bold transition text-xs text-slate-400 select-none"
      >
        <Home className="w-4 h-4" /> Home
      </a>

      {/* Main glass panel wrapper */}
      <div className="w-full max-w-[420px] bg-white border border-(--border-light) p-8 rounded-[12px] flex flex-col gap-6 shadow-sm relative z-10 animate-fade-in">
        <div className="flex flex-col items-center gap-2 text-center select-none">
          <div className="inline-flex items-center gap-2 bg-(--accent-soft) border border-(--accent)/20 px-3.5 py-1 rounded-full text-[10px] font-black text-(--accent) uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-(--accent) animate-pulse" />
            Secure SaaS Portal Access
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-800 mt-2" style={{ fontFamily: "var(--font-display)" }}>
            Welcome to CrackTheLoop
          </h2>
          <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">
            Verify credentials to access your stealth copilot and interviews.
          </p>
        </div>

        {/* Tab Toggle buttons */}
        <div className="flex bg-slate-100 border border-slate-200 p-1 rounded-xl select-none">
          <button
            onClick={() => {
              setMode("signin");
              setMessage("");
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === "signin" 
                ? "bg-white border border-slate-200 text-slate-800 shadow-xs" 
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            Sign In
          </button>
          <button
            onClick={() => {
              setMode("signup");
              setMessage("");
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === "signup" 
                ? "bg-white border border-slate-200 text-slate-800 shadow-xs" 
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Sign Up
          </button>
        </div>

        {message && (
          <div className={`p-3.5 rounded-xl border text-center text-xs font-semibold ${
            message.toLowerCase().includes("sent") || message.toLowerCase().includes("successful") || message.toLowerCase().includes("choose") || message.toLowerCase().includes("loading")
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 animate-pulse"
              : "bg-rose-50 text-rose-600 border-rose-200"
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handlePasswordAuth} className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            
            {/* Full Name (Sign Up only) */}
            {mode === "signup" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pl-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-(--accent) transition"
                />
              </div>
            )}

            {/* Email Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pl-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@example.com"
                className="w-full bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-(--accent) transition"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pl-1">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-(--accent) transition"
              />
            </div>

            {/* Referral Code (Sign Up only, optional) */}
            {mode === "signup" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pl-1 flex items-center gap-1">
                  Referral Code <span className="text-[8.5px] text-slate-400 font-medium">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    placeholder="REF-XXXXXX"
                    className="w-full bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-xs text-(--accent) placeholder-slate-400 focus:outline-none focus:border-(--accent) transition pl-9 font-mono font-semibold"
                  />
                  <Gift className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email.includes("@") || password.length < 6 || (mode === "signup" && !name.trim())}
              className="w-full mt-3 py-3.5 bg-[#E8503A] hover:bg-[#F06B57] rounded-xl font-bold text-xs text-white uppercase tracking-wider shadow-md shadow-[#E8503A]/10 hover:brightness-110 active:scale-98 transition flex justify-center items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === "signup" ? "Register & Enter" : "Access Portal"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </form>
      </div>

      <footer className="absolute bottom-6 text-[10px] text-slate-400 select-none">
        <Shield className="w-3.5 h-3.5 inline mr-1 text-slate-400" /> Secure Multi-channel Web Affinity Shield Enabled
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0B0D19] flex justify-center items-center">
        <Loader2 className="w-10 h-10 text-sky-400 animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
