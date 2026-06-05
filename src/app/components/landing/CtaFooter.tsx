"use client";

import { ArrowRight, Shield, Users, Sparkles, Star } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

export default function CtaFooter() {
  const footerLinks = [
    { label: "Home", href: "/" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "/pricing" },
    { label: "FAQ", href: "#faq" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
    { label: "Responsible Use Policy", href: "/responsible-use" },
    { label: "Contact", href: "/contact" },
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
            <div className="max-w-3xl mx-auto px-6 text-center">
              {/* Social proof badge */}
              <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-[var(--border-light)] rounded-full px-5 py-2 mb-8 shadow-xs">
                <div className="flex -space-x-2">
                  {["SP", "AC", "JW", "RM"].map((initials, i) => (
                    <div
                      key={initials}
                      className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-bright)] flex items-center justify-center text-white text-[7px] font-bold border-2 border-white"
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <span className="text-xs font-semibold text-[var(--text-secondary)]">
                  Join <span className="text-[var(--text-primary)]">12,000+</span> candidates preparing smarter
                </span>
              </div>

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
                  href="#product-demo"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-base rounded-[8px] border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:-translate-y-0.5 active:scale-98 cursor-pointer shadow-xs"
                >
                  Try Demo
                </a>
              </div>

              {/* Trust micro-stats row */}
              <div className="flex flex-wrap justify-center gap-8 mt-12 pt-8 border-t border-[var(--border-light)]">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[var(--accent)]" />
                  <span className="text-xs text-[var(--text-muted)] font-medium">Privacy-First</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                  <span className="text-xs text-[var(--text-muted)] font-medium">AI-Powered in 1.5s</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-[var(--accent)]" />
                  <span className="text-xs text-[var(--text-muted)] font-medium">94% Confidence Boost</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Footer — remains light */}
      <footer className="border-t border-[var(--border-light)] py-12 bg-[var(--bg-mist)]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <span className="text-xs text-[var(--text-muted)] font-medium">
              © 2026 CrackTheLoop. All rights reserved.
            </span>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {footerLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition cursor-pointer font-semibold"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <span className="flex items-center gap-1.5 text-[var(--accent)] text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" />
              Support Buddy Active
            </span>
          </div>
          
          <div className="border-t border-[var(--border-light)] pt-6 text-center">
            <p className="text-[10px] text-[var(--text-muted)] max-w-3xl mx-auto leading-relaxed">
              <strong>Disclaimer:</strong> CrackTheLoop is designed to support interview preparation, communication confidence, and permitted interview assistance. Users are responsible for ensuring their use of the product follows the rules of their interview or hiring process.
            </p>
          </div>
        </div>
      </footer>
    </section>
  );
}
