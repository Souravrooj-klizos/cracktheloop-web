"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, FileText, CheckCircle2, MessageSquare, Users, Star, Zap } from "lucide-react";
import { Parallax } from "./ScrollReveal";

export default function Hero() {
  return (
    <section id="hero" className="hero-gradient-mesh relative min-h-screen flex flex-col justify-center pt-24 pb-16 overflow-hidden">
      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(15,23,42,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.4) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating Orbs with parallax */}
      <Parallax speed={0.2} className="absolute -top-20 -right-40">
        <div className="orb orb-peach w-[600px] h-[600px] animate-float-orb" />
      </Parallax>
      <Parallax speed={0.4} className="absolute top-1/2 -left-40">
        <div className="orb orb-slate w-[400px] h-[400px] animate-float-orb-slow" />
      </Parallax>
      <Parallax speed={0.15} className="absolute -bottom-20 right-1/4">
        <div className="orb orb-frost w-[350px] h-[350px] animate-float-orb" style={{ animationDelay: "5s" }} />
      </Parallax>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — Copy */}
          <motion.div
            className="flex flex-col gap-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="inline-flex w-fit items-center gap-2 glass-light rounded-full px-4 py-1.5 border border-(--border-light) text-xs font-semibold text-(--text-secondary)">
              <Sparkles className="w-3.5 h-3.5 text-(--accent)" />
              <span>AI-Powered Interview Support</span>
            </div>

            <h1
              className="text-4xl md:text-5xl lg:text-[56px] font-extrabold leading-[1.12] tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Your AI Buddy for{" "}
              <span className="text-gradient-hero">Confident Answers</span>
            </h1>

            <p className="text-base md:text-lg text-(--text-muted) leading-relaxed max-w-xl">
              Upload your resume and job description. During your interview or practice session,
              CrackTheLoop helps you respond with clear, structured, and role-specific answer guidance.
            </p>

            <div className="flex flex-wrap gap-4 mt-2">
              <a href="/pricing" className="btn-primary cursor-pointer">
                Start Preparing Free
                <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#product-demo" className="btn-ghost-light cursor-pointer">
                See How It Works
              </a>
            </div>

            {/* Social Proof Micro-Stats */}
            <motion.div
              className="flex flex-wrap items-center gap-6 mt-4 pt-6 border-t border-(--border-light)"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-(--accent-soft) flex items-center justify-center">
                  <Users className="w-4 h-4 text-(--accent)" />
                </div>
                <div>
                  <span className="text-sm font-bold text-(--text-primary)">12,000+</span>
                  <span className="text-[11px] text-(--text-muted) block leading-tight">interviews supported</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-(--accent-soft) flex items-center justify-center">
                  <Star className="w-4 h-4 text-(--accent)" />
                </div>
                <div>
                  <span className="text-sm font-bold text-(--text-primary)">94%</span>
                  <span className="text-[11px] text-(--text-muted) block leading-tight">feel more confident</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-(--accent-soft) flex items-center justify-center">
                  <Zap className="w-4 h-4 text-(--accent)" />
                </div>
                <div>
                  <span className="text-sm font-bold text-(--text-primary)">1.5s</span>
                  <span className="text-[11px] text-(--text-muted) block leading-tight">avg. answer speed</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right — Mock Interview Dashboard Visual with perspective */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="perspective-[1200px]"
          >
            <div
              className="glass-light rounded-[20px] p-4 md:p-5 border border-(--border-light) relative bg-white/80 backdrop-blur-md transition-transform duration-700 hover:rotate-y-0"
              style={{
                transform: 'perspective(1200px) rotateY(-3deg) rotateX(2deg)',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.03)',
              }}
            >
              {/* Accent glow behind card */}
              <div className="absolute -inset-1 bg-gradient-to-br from-(--accent)/5 via-transparent to-slate-200/20 rounded-[22px] -z-10 blur-sm" />

              {/* Header */}
              <div className="flex items-center justify-between mb-4 border-b border-(--border-light) pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-(--accent) animate-pulse" />
                  <span className="text-xs font-bold text-(--text-primary) uppercase tracking-wider">
                    Interview Assistant Active
                  </span>
                </div>
                <div className="text-[10px] font-mono text-(--text-muted) bg-(--bg-cloud) px-2.5 py-1 rounded-[4px] border border-(--border-light)">
                  Practice Mode
                </div>
              </div>

              {/* Main Panel Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Left Panel: Question Detected */}
                <div className="bg-(--bg-mist) rounded-[6px] p-4 border border-(--border-light) flex flex-col gap-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-(--text-secondary)">
                    <MessageSquare className="w-3.5 h-3.5 text-(--accent)" />
                    Question Detected
                  </div>
                  <div className="bg-white p-3 rounded-[4px] border border-(--border-light) shadow-xs">
                    <p className="text-xs font-medium text-(--text-primary) italic leading-relaxed">
                      &quot;Tell me about a time you handled a difficult stakeholder conflict.&quot;
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-(--text-muted) mt-auto pt-1">
                    <span>Listening...</span>
                    <span>Confidence: 98%</span>
                  </div>
                </div>

                {/* Right Panel: AI Suggested Answer Points */}
                <div className="bg-(--bg-mist) rounded-[6px] p-4 border border-(--border-light) flex flex-col gap-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-(--text-secondary)">
                    <Sparkles className="w-3.5 h-3.5 text-(--accent)" />
                    Suggested Answer Flow (STAR)
                  </div>
                  <div className="flex flex-col gap-2.5 font-mono text-[10px] leading-relaxed">
                    <div>
                      <span className="text-(--accent) font-bold">Situation:</span>{" "}
                      <span className="text-(--text-secondary) font-medium">Acme Corp redesign, conflicting roadmap.</span>
                    </div>
                    <div>
                      <span className="text-(--accent) font-bold">Task:</span>{" "}
                      <span className="text-(--text-secondary) font-medium">Align roadmap to avoid 2-week launch delay.</span>
                    </div>
                    <div>
                      <span className="text-(--accent) font-bold">Action:</span>{" "}
                      <span className="text-(--text-secondary) font-medium">Led prioritisation workshop to align metrics.</span>
                    </div>
                    <div>
                      <span className="text-(--accent) font-bold">Result:</span>{" "}
                      <span className="text-(--text-secondary) font-bold">Approved roadmap; launched on time (+20% conv).</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Context Mapping Area */}
              <div className="bg-(--bg-cloud)/60 rounded-[6px] p-4 border border-(--border-light) flex flex-col gap-3">
                <span className="text-[9px] font-bold text-(--text-muted) uppercase tracking-wider block">
                  Resume & JD Context Connection
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="flex items-start gap-2.5">
                    <FileText className="w-4 h-4 text-(--accent) shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-(--text-primary) block text-[11px] mb-0.5">
                        Resume Context Used
                      </span>
                      <span className="text-[10px] text-(--text-muted) leading-relaxed">
                        Acme Corp e-commerce redesign project & prioritisation
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-(--accent) shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-(--text-primary) block text-[11px] mb-1">
                        JD Keywords Matched
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-0.5">
                        {["Stakeholders", "Roadmap", "Prioritisation"].map((kw) => (
                          <span
                            key={kw}
                            className="bg-white border border-(--border-light) text-[8px] font-bold px-2 py-0.5 rounded-[4px] text-(--text-secondary) shadow-xs"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
