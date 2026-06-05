"use client";

import { useState } from "react";
import { FileText, Briefcase, CheckCircle2, ArrowRight, ShieldAlert, Sparkles, Filter, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/landing/Navbar";
import CtaFooter from "../../components/landing/CtaFooter";
import Faq from "../../components/landing/Faq";

export default function ResumeJdAlignmentContent() {
  const [selectedKeyword, setSelectedKeyword] = useState<string>("api-integration");

  const jdKeywords = [
    { id: "api-integration", label: "API Integration", category: "Core Backend" },
    { id: "react-nextjs", label: "React / Next.js", category: "Frontend Stack" },
    { id: "scalability", label: "System Scalability", category: "Infrastructure" },
    { id: "team-leadership", label: "Stakeholder Alignment", category: "Soft Skills" },
  ];

  const resumeBulletPoints: Record<string, { project: string; points: string[]; match: string }> = {
    "api-integration": {
      project: "E-commerce Payment Gateway Refactor",
      match: "98% Relevance Match",
      points: [
        "Integrated Stripe/Paypal API endpoints using webhooks, securing 100% transactional reliability.",
        "Designed asynchronous task queues via BullMQ to handle payment retry logic for 50k+ daily transactions.",
        "Refactored JSON payload marshalling to shave 200ms off database writes on payment checkout API paths."
      ]
    },
    "react-nextjs": {
      project: "Analytics Dashboard Migration",
      match: "95% Relevance Match",
      points: [
        "Migrated legacy React SPA to Next.js App Router, boosting organic Google PageSpeed scores from 55 to 94.",
        "Leveraged React Server Components (RSC) to reduce bundle sizes by 40% and eliminate layout shift.",
        "Implemented dynamic code splitting and client-side skeleton states for premium micro-animations."
      ]
    },
    "scalability": {
      project: "Distributed Media Ingestion Pipeline",
      match: "92% Relevance Match",
      points: [
        "Redesigned image compression pipeline using AWS Lambda, reducing processing costs by 35%.",
        "Set up Redis cache layers for feed endpoints, scaling traffic limit tolerance from 1k to 10k RPS.",
        "Leveraged horizontal database scaling and read replicas to drop database memory usage spikes by 60%."
      ]
    },
    "team-leadership": {
      project: "Legacy Platform Modernization",
      match: "88% Relevance Match",
      points: [
        "Led cross-functional team of 6 engineers to deliver modernized app ahead of client schedule.",
        "Implemented structured RFC process to align engineering and product management objectives objectively.",
        "Mentored junior engineers on clean-code patterns, improving pull request approval speeds by 25%."
      ]
    }
  };

  const starOutlines: Record<string, { s: string; t: string; a: string; r: string }> = {
    "api-integration": {
      s: "Payment checkout system was failing during flash sales due to high concurrent API request spikes.",
      t: "Implement secure payment retry logic and reduce payment API handler response overhead.",
      a: "Built asynchronous BullMQ queues, structured webhook listeners, and optimized checkout database write query loops.",
      r: "Eliminated checkout timeout exceptions entirely and reduced processing times by 200ms, recovering $45k/mo in abandoned carts."
    },
    "react-nextjs": {
      s: "The customer dashboard bundle size was 4.2MB, resulting in a sluggish 5-second initial load time.",
      t: "Rebuild dashboard structure to load under 1.5 seconds and optimize SEO structure metrics.",
      a: "Migrated dashboard routes to Next.js, isolated static elements in RSCs, and applied aggressive bundle splits.",
      r: "Reduced bundle download size by 40%, boosting Lighthouse mobile speed scores to 94 and initial page load to 1.1s."
    },
    "scalability": {
      s: "Sudden marketing campaign spikes crashed feed servers under 1,200 concurrent user requests.",
      t: "Scale API ingestion paths to withstand 10,000+ Requests Per Second under tight budget caps.",
      a: "Offloaded media tasks to serverless nodes, set up Redis caches, and established read-only DB replicas.",
      r: "Successfully sustained 10k RPS load tests at 0.05% error rate while decreasing operational server costs by 35%."
    },
    "team-leadership": {
      s: "Legacy codebase rewrite was stalled due to conflicting design visions between design and backend teams.",
      t: "Establish development alignment, rebuild project velocity, and deliver within a 6-week release window.",
      a: "Introduced strict RICE metrics to resolve disputes and implemented technical RFCs to document decisions.",
      r: "Shipped the complete refactored platform 3 days early with 94% stakeholder satisfaction rates."
    }
  };

  const customFaqs = [
    {
      q: "What file formats are supported for resume uploads?",
      a: "We support standard text-based formats including PDF and Microsoft Word (.docx). The system automatically parses layout elements, section headers, work history, and bullet points.",
    },
    {
      q: "How does the matching algorithm select which project is relevant?",
      a: "We generate semantic vector embeddings of your resume achievements and the target job description. When a question is detected during your interview, our semantic model indexes your portfolio to surface bullet points matching the target topic.",
    },
    {
      q: "Is my resume data sold or used for model training?",
      a: "No. Security and ethics are central to our brand. Your uploaded resume is stored in encrypted, transient memory containers active only for your current session. We never sell, log, or feed your data to public LLM models.",
    },
    {
      q: "Can I configure multiple target profiles for different tracks?",
      a: "Yes. You can upload different versions of your resume and save multiple job descriptions (e.g., 'Senior Frontend Engineer' vs. 'Full Stack Lead'). Easily toggle profiles inside the dashboard based on the target role.",
    },
    {
      q: "Can I edit or override the AI suggestions in real-time?",
      a: "Absolutely. You can edit the extracted key metrics, modify talking points, or add custom reminders inside the dashboard. The AI will prioritize your adjustments when structuring live answers.",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-mist)] text-[var(--text-primary)] flex flex-col pt-20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-6 pt-16 pb-12 text-center flex flex-col items-center gap-6">
        <div className="inline-flex items-center gap-2 bg-[var(--accent-soft)] border border-[var(--accent)]/20 px-4 py-1.5 rounded-full text-xs font-semibold text-[var(--accent)]">
          <Sparkles className="w-3.5 h-3.5" />
          Semantic Relevance Matcher
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[var(--text-primary)] leading-none max-w-3xl" style={{ fontFamily: "var(--font-display)" }}>
          Personalized Answer Structuring <br />
          <span className="text-gradient-coral">Aligned to the Job Description</span>
        </h1>
        <p className="text-[var(--text-muted)] text-base md:text-lg max-w-2xl leading-relaxed">
          Surfacing the exact metrics and bullet points from your background that match the target role's expectations — instantly.
        </p>
      </section>

      {/* Interactive Keyword Matcher Section */}
      <section className="w-full max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white border border-[var(--border-light)] rounded-[12px] p-6 md:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row justify-between lg:items-center border-b border-slate-100 pb-5 mb-8 gap-4">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                <Filter className="w-5 h-5 text-[var(--accent)]" /> JD Relevance Sandbox
              </h2>
              <p className="text-xs text-slate-500 mt-1">Select a key JD requirement to see the AI dynamically extract matching experience and build STAR responses.</p>
            </div>
            {/* Horizontal tab selectors */}
            <div className="flex flex-wrap gap-2">
              {jdKeywords.map((k) => (
                <button
                  key={k.id}
                  onClick={() => setSelectedKeyword(k.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
                    selectedKeyword === k.id
                      ? "bg-[var(--accent)] text-white shadow-sm"
                      : "bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {k.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Left Card: Extracted Resume Project */}
            <div className="bg-slate-50/50 border border-slate-250/70 rounded-[8px] p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wide text-slate-400">
                    <FileText className="w-4 h-4 text-slate-400" />
                    Matched Resume Section
                  </span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 px-2 py-0.5 rounded-full">
                    {resumeBulletPoints[selectedKeyword].match}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-3">{resumeBulletPoints[selectedKeyword].project}</h3>
                <ul className="space-y-3">
                  {resumeBulletPoints[selectedKeyword].points.map((pt, i) => (
                    <li key={i} className="flex gap-2.5 items-start text-xs text-slate-600 leading-relaxed">
                      <span className="text-[var(--accent)] font-bold mt-0.5 shrink-0">✦</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 border-t border-slate-200/60 pt-4 text-[10px] font-mono text-slate-400">
                ✓ Extracted from: Experience History Section
              </div>
            </div>

            {/* Right Card: Live STAR Suggestions */}
            <div className="bg-white border border-[var(--border-light)] rounded-[8px] p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/3 rounded-full blur-2xl" />
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wide text-[var(--accent)] mb-4">
                  <Briefcase className="w-4 h-4 text-[var(--accent)]" />
                  Live STAR Answer Outline
                </span>
                
                <div className="space-y-3.5">
                  {[
                    { label: "S", name: "Situation", val: starOutlines[selectedKeyword].s },
                    { label: "T", name: "Task", val: starOutlines[selectedKeyword].t },
                    { label: "A", name: "Action", val: starOutlines[selectedKeyword].a },
                    { label: "R", name: "Result", val: starOutlines[selectedKeyword].r },
                  ].map((item) => (
                    <div key={item.label} className="text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-slate-700 mb-1">
                        <span className="w-4 h-4 bg-[var(--accent-soft)] text-[var(--accent)] rounded-full flex items-center justify-center text-[9px] font-black">{item.label}</span>
                        <span>{item.name}</span>
                      </div>
                      <p className="text-slate-600 leading-normal pl-5">{item.val}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="w-full max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="bg-white border border-[var(--border-light)] rounded-[12px] p-6 shadow-sm flex flex-col gap-4">
          <span className="text-[10px] text-[var(--accent)] font-mono font-bold tracking-widest uppercase">Ethics & privacy guarantee</span>
          <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
            <p>
              Many tools store resumes globally to train their public models. At CrackTheLoop, we run a secure, stateless document parser.
            </p>
            <div className="flex gap-2.5 items-start">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] mt-1.5 shrink-0" />
              <span><strong>TLS 1.3 Encryption:</strong> All uploads use secure SSL/TLS protocols to prevent data interception.</span>
            </div>
            <div className="flex gap-2.5 items-start">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] mt-1.5 shrink-0" />
              <span><strong>No Model Training:</strong> Your private work metrics are never shared, logged, or saved to public database systems.</span>
            </div>
            <div className="flex gap-2.5 items-start">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] mt-1.5 shrink-0" />
              <span><strong>Stateless Processing:</strong> All documents are uploaded directly to ephemeral RAM disk layers, which automatically wipe themselves the moment your session concludes.</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-extrabold tracking-tight mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Never Guess What <br />
            <span className="text-gradient-coral">Interviewers Look For</span>
          </h2>
          <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-6">
            Interviewers judge answers based on specific skill keywords and structured framework outlines (like STAR). Our matching engine scans the job description in real-time, extracts these requirements, and highlights them directly within your dashboard suggestions.
          </p>
          <ul className="space-y-3.5 text-xs text-slate-700">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Highlight core framework markers (STAR, CAR, or Case trees).</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Surfaces precise metrics (percentages, numbers) to bolster your credibility.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Matches specific technologies, methodologies, and soft skills listed in the target JD.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Feature Custom FAQ Section */}
      <Faq faqList={customFaqs} />

      {/* CTA Footer */}
      <CtaFooter />
    </div>
  );
}
