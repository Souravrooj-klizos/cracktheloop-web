"use client";

import { ArrowRight, Shield, Users, Sparkles, Star } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import { usePathname } from "next/navigation";

export default function CtaFooter() {
  const pathname = usePathname();

  const getHref = (href: string) => {
    if (href.startsWith("#") && pathname !== "/") {
      return `/${href}`;
    }
    return href;
  };

  const productLinks = [
    { label: "Pricing & Plans", href: "/pricing" },
    { label: "Demo Simulator", href: "/demo" },
    { label: "Live Audio Capture", href: "/features/live-transcription" },
    { label: "Resume & JD Alignment", href: "/features/resume-jd-alignment" },
    { label: "Stealth HUD Overlay", href: "/features/stealth-overlay" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
    { label: "Responsible Use Policy", href: "/responsible-use" },
  ];

  const companyLinks = [
    { label: "Contact Support", href: "/contact" },
    { label: "Ethics Charter", href: "/#ethics" },
    { label: "Security Whitepaper", href: "/#security" },
  ];

  return (
    <section id="cta-footer" className="relative flex flex-col justify-between overflow-hidden">
      {/* CTA Block — Light Theme */}
      <div className="section-mist relative overflow-hidden">
        {/* Background orbs */}
        <div className="orb orb-peach w-[600px] h-[600px] -top-40 left-1/4 animate-float-orb" />
        <div className="orb orb-slate w-[400px] h-[400px] bottom-0 -right-20 animate-float-orb-slow" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(15,23,42,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.4) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 py-24 md:py-32">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2
                className="text-3xl md:text-5xl lg:text-[56px] font-extrabold tracking-tight text-[var(--text-primary)] mb-6 leading-[1.12]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Walk Into Your Next Interview <br className="hidden sm:inline" />
                With More{" "}
                <span className="text-gradient-coral">Confidence.</span>
              </h2>
              <p className="text-[var(--text-muted)] text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                Upload your resume, add the job description, and let your AI buddy help you prepare stronger, clearer, and more relevant answers.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="/pricing"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#E8503A] hover:bg-[#F06B57] text-white font-bold text-base rounded-[8px] transition-all duration-300 shadow-[0_0_20px_rgba(232,80,58,0.3)] hover:shadow-[0_0_30px_rgba(232,80,58,0.5)] hover:-translate-y-0.5 active:scale-98 cursor-pointer"
                >
                  Start Preparing Now
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="/demo"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-base rounded-[8px] border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:-translate-y-0.5 active:scale-98 cursor-pointer shadow-xs"
                >
                  Try Demo
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Footer — remains light */}
      <footer className="border-t border-[var(--border-light)] py-16 bg-[var(--bg-mist)]/90 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          {/* Main Footer Content Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12">
            {/* Logo and Tagline Column */}
            <div className="flex flex-col gap-4">
              <a
                href="/"
                className="flex items-center gap-2.5 hover:opacity-90 transition cursor-pointer select-none"
              >
                <img
                  src="/logo.svg"
                  className="h-8 w-8 rounded-lg select-none border border-[var(--border-light)]"
                  alt="CrackTheLoop Logo Icon"
                />
                <span className="font-extrabold tracking-tight text-lg text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                  CrackTheLoop
                </span>
              </a>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-xs">
                Sleek, undetectable confidence companion for engineering candidates. Live audio downsampling and Win32 capture exclusion built directly into a transparent HUD overlay.
              </p>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] uppercase tracking-wider">Stealth Shield Active</span>
              </div>
            </div>

            {/* Column 2: Product */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-widest">Product</span>
              <div className="flex flex-col gap-2">
                {productLinks.map((link) => (
                  <a
                    key={link.label}
                    href={getHref(link.href)}
                    className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition cursor-pointer font-medium"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Column 3: Trust & Security */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-widest">Trust & Security</span>
              <div className="flex flex-col gap-2">
                {companyLinks.map((link) => (
                  <a
                    key={link.label}
                    href={getHref(link.href)}
                    className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition cursor-pointer font-medium"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Column 4: Legal */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-widest">Legal</span>
              <div className="flex flex-col gap-2">
                {legalLinks.map((link) => (
                  <a
                    key={link.label}
                    href={getHref(link.href)}
                    className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition cursor-pointer font-medium"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-[var(--border-light)] pt-8 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className="text-xs text-[var(--text-muted)] font-medium">
                © 2026 CrackTheLoop. All rights reserved.
              </span>
              <span className="flex items-center gap-1 text-[var(--text-muted)] text-[10px] font-mono">
                System: Win32 API / Core loopback active
              </span>
            </div>
            
            <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-5 text-center">
              <p className="text-[10px] text-[var(--text-muted)] max-w-4xl mx-auto leading-relaxed">
                <strong>Disclaimer & Responsible Use:</strong> CrackTheLoop is designed exclusively for interview prep, mock simulations, coding confidence, and communication practice. All users are expected to verify rules, policies, and honor codes of their target recruiting environments before utilization during live examinations.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
}
