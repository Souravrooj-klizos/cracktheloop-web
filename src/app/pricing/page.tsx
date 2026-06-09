"use client";
 
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  Check,
  Sparkles,
  Share2,
  Gift,
  ArrowRight,
  UserPlus,
  Loader2,
} from "lucide-react";
import Navbar from "../components/landing/Navbar";
import CtaFooter from "../components/landing/CtaFooter";
import Link from "next/link";
 
export default function PricingPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<any[]>([]);
  const [trialCredits, setTrialCredits] = useState(15);
  const [trialExpiryDays, setTrialExpiryDays] = useState(-1);

  useEffect(() => {
    fetch("/api/plans")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (data.plans) setPlans(data.plans);
          if (data.settings) {
            setTrialCredits(data.settings.trial_base_credits ?? 15);
            setTrialExpiryDays(data.settings.trial_expiry_days ?? data.settings.trial_expiration_days ?? -1);
          }
        }
      })
      .catch((err) => console.error("Error loading plans:", err));
  }, []);

  // Helper to extract plan data dynamically with fallback support
  const getPlanData = (tier: string, defaultPrice: number, defaultCredits: number, defaultFeatures: string[], defaultDesc: string) => {
    const matched = plans.find(
      (p) =>
        p.name.toLowerCase().includes(tier) ||
        (p.description && p.description.toLowerCase().includes(tier))
    );
    return {
      price: matched ? matched.price : defaultPrice,
      credits: matched ? matched.credits : defaultCredits,
      features: matched && matched.features?.length > 0 ? matched.features : defaultFeatures,
      description: matched ? matched.description : defaultDesc,
    };
  };

  
  // Handle plan purchase selection by routing to secure auth-protected /select-plan
  function handlePlanSelect(planName: string) {
    router.push(`/select-plan?plan=${encodeURIComponent(planName)}`);
  }

  return (
    <div className="min-h-screen bg-(--bg-mist) text-(--text-primary) flex flex-col pt-20">

      {/* Background orbs */}
      <div className="orb orb-peach w-[600px] h-[600px] -top-40 left-1/4 animate-float-orb opacity-40 pointer-events-none" />
      <div className="orb orb-slate w-[400px] h-[400px] bottom-0 -right-20 animate-float-orb-slow opacity-40 pointer-events-none" />

      {/* Global Navigation Header */}
      <Navbar />

      {/* Page Title */}
      <section className="w-full max-w-7xl mx-auto px-6 pt-12 text-center flex flex-col items-center gap-4 relative z-20 select-none">
        <div className="inline-flex items-center gap-2 bg-(--accent-soft) border border-(--accent)/20 px-4 py-1.5 rounded-full text-xs font-semibold text-(--accent)">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          Instant Billing Activation & Client Keys
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-slate-800" style={{ fontFamily: "var(--font-display)" }}>
          Flexible Plans for <span className="text-gradient-coral">Unlimited Access</span>
        </h1>
        <p className="text-(--text-muted) text-sm md:text-base max-w-xl leading-relaxed">
          Start with our Free Trial to evaluate, or upgrade to a premium plan to obtain full access.
        </p>
      </section>

      {/* Pricing Cards Section */}
      <section className="w-full max-w-7xl mx-auto px-6 pt-16 relative z-20">
        {plans.length === 0 ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="w-8 h-8 text-(--accent) animate-spin" />
          </div>
        ) : (
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${plans.length} gap-8 items-stretch max-w-5xl mx-auto`}>
            {plans.map((plan) => {
              const isPro = plan.name.toLowerCase().includes("pro");
              const isFree = plan.price === 0 || plan.name.toLowerCase().includes("free");
              
              return (
                <div 
                  key={plan._id || plan.name}
                  className={`backdrop-blur-md rounded-[12px] p-6 md:p-8 flex flex-col justify-between transition-all duration-300 min-h-[420px] relative ${
                    isPro 
                      ? "bg-white/95 border-2 border-(--accent) shadow-md z-10 hover:-translate-y-1 hover:shadow-lg" 
                      : "bg-white/85 border border-(--border-light) shadow-xs hover:border-(--accent)/40 hover:-translate-y-1 hover:shadow-sm"
                  }`}
                >
                  {isPro && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-(--accent) text-white px-4 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-sm">
                      Popular
                    </div>
                  )}
                  
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-slate-800" style={{ fontFamily: "var(--font-display)" }}>
                        {plan.name}
                      </h3>
                      {isFree && (
                        <span className="bg-(--accent-soft) text-(--accent) border border-(--accent)/15 px-2.5 py-0.5 rounded-full font-black text-[9px] uppercase tracking-wider">
                          Free
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs text-(--text-muted) mt-1 font-medium">
                      {plan.description}
                    </p>
                    
                    <div className="flex items-baseline gap-1 mt-6">
                      <span className="text-4xl font-extrabold text-slate-800">${plan.price}</span>
                      <span className="text-xs text-(--text-muted)">
                        {isFree 
                          ? (trialExpiryDays > 0 ? `/ ${trialExpiryDays} days` : '/ one-time') 
                          : `/ ${plan.interval || 'one-time'}`
                        }
                      </span>
                    </div>
                    
                    <ul className="text-xs text-slate-600 flex flex-col gap-3.5 border-t border-slate-100 pt-6 mt-6">
                      {plan.features?.map((feat: string, idx: number) => {
                        const isFirst = idx === 0;
                        return (
                          <li key={idx} className={`flex items-center gap-2 ${isFirst ? "font-bold text-(--accent)" : ""}`}>
                            <Check className={`w-4 h-4 ${isFirst || isPro ? "text-(--accent)" : "text-slate-400"}`} />
                            {feat}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  
                  <div className="mt-8">
                    <button
                      onClick={() => handlePlanSelect(plan.name)}
                      className={`w-full text-center justify-center cursor-pointer !py-3.5 !px-6 !text-xs uppercase tracking-wider ${
                        isPro 
                          ? "btn-primary shadow-md shadow-[#E8503A]/20" 
                          : "btn-ghost-dark !font-bold"
                      }`}
                    >
                      {isFree ? "Start Trial" : `Upgrade to ${plan.name.replace(" Pass", "").replace(" Plan", "")}`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Referral Program Section */}
      <section className="w-full max-w-7xl mx-auto px-6 pt-20 pb-8 relative z-20 select-none" id="referrals-section">
        <div className="bg-white/85 backdrop-blur-md border border-(--border-light) rounded-[12px] p-6 md:p-8 flex flex-col gap-6 shadow-xs">
          <div className="flex flex-col gap-1.5 border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
              <Gift className="w-5 h-5 text-(--accent) animate-bounce" />
              Referral Rewards Program
            </h2>
             <p className="text-xs text-(--text-muted) leading-relaxed max-w-xl font-medium">
              Share CrackTheLoop with friends and colleagues - both of you get 50 free credits upon signup.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Invited Guest benefits */}
            <div className="bg-slate-50/65 border border-slate-200/80 rounded-[12px] p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-(--accent-soft) flex items-center justify-center border border-(--accent)/15">
                  <UserPlus className="w-4 h-4 text-(--accent)" />
                </div>
                <span className="text-xs font-black text-slate-800 uppercase tracking-widest">You're Invited</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                When you sign up using a friend's referral link, you get <span className="text-(--accent) font-bold">50 free credits</span> instantly on sign-up to start practicing mock interviews.
              </p>
            </div>

            {/* Referrer benefits */}
            <div className="bg-slate-50/65 border border-slate-200/80 rounded-[12px] p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-(--accent-soft) flex items-center justify-center border border-(--accent)/15">
                  <Gift className="w-4 h-4 text-(--accent)" />
                </div>
                <span className="text-xs font-black text-slate-800 uppercase tracking-widest">You Referred Someone</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                When a referred friend signs up and activates their trial, <span className="text-(--accent) font-bold">both of you get 50 free credits</span> instantly.
              </p>
            </div>

          </div>

          {/* CTA */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-[12px] p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-black text-slate-800">Get your personal referral link</p>
              <p className="text-[11px] text-(--text-muted) font-medium">Sign in to your dashboard to access and share your unique invite code.</p>
            </div>
            <Link
              href="/login"
              className="btn-primary px-6 py-3 !text-xs uppercase tracking-wider cursor-pointer flex items-center gap-2 shrink-0"
            >
              Get My Link <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Global CTA Footer */}
      <CtaFooter />

    </div>
  );
}
