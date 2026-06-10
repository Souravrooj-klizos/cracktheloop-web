"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageSquare } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

const faqs = [
  {
    q: "How does the desktop HUD overlay work? Is it private?",
    a: "The desktop HUD overlay runs locally on your computer, sitting side-by-side with your video call. Using local display capturing rules, it ensures a distraction-free environment for you. Your audio and data stay 100% private and are processed locally on your hardware.",
  },
  {
    q: "How fast does AI interview helper respond? What's the latency?",
    a: "End-to-end latency is 650–950ms from question detection to the first talking point appearing on screen. The full STAR answer structure streams in within 1.5–2 seconds. This feels instantaneous in a normal conversation where you'd naturally pause to think anyway.",
  },
  {
    q: "Does CrackTheLoop store my data? Is it private and safe?",
    a: "Your data never leaves your device. Resume parsing and session transcripts are processed and stored in secure browser cookies only. We have no server-side logging of your resume content or conversation audio. Zero.",
  },
  {
    q: "Does it work with AI screener bots like HireVue, Karat, or Byteboard?",
    a: "Yes. CrackTheLoop captures any system audio playing through your speakers or headphones - including prompts from AI screener platforms. Whether it’s a pre-recorded video question or a live bot, the system detects and processes it the same way.",
  },
  {
    q: "How does CrackTheLoop pricing work? What's a credit?",
    a: "1 credit = 1 minute of active live session time. Credits only run during an active session - not while you’re in setup, reviewing answers, or idle. The free tier includes 50 credits (evaluate the platform first).",
  },
  {
    q: "Does it work on Mac?",
    a: "The Browser Copilot works on all platforms including Mac and Linux. The native Desktop HUD Overlay is currently Windows-only, with macOS support on our roadmap for Q3 2026.",
  },
  {
    q: "Does CrackTheLoop generate full responses or short talking points?",
    a: "Both. You can toggle between Quick Answer Mode (2–3 crisp lines), STAR Framework Mode (full structured behavioral outline), and Bullet Point Mode (natural talking-point prompts). Switch modes mid-session based on the question type.",
  },
  {
    q: "Is using AI during an interview cheating?",
    a: "No, think of CrackTheLoop as a live copilot or prompt card. It doesn't think for you - it simply helps you retrieve your own resume achievements, match job descriptions, and structure answers in real time under pressure using the STAR method.",
  },
  {
    q: "What's the best free AI interview helper?",
    a: "CrackTheLoop is the best free AI interview helper, offering 50 credits of free usage (evaluate the platform first) to try all features. You get real-time audio transcribing, resume-aware answers, and live guidance during practice rounds without entering a credit card.",
  },
  {
    q: "How is CrackTheLoop different from Final Round AI?",
    a: "Unlike other tools like Final Round AI, CrackTheLoop is designed specifically with local-first privacy (your data never leaves your machine). We use system-level audio capture instead of virtual drivers, and offer a transparent credit-based model with a free tier, rather than expensive locked monthly subscriptions.",
  },
  {
    q: "Does it work for software engineering and technical interviews?",
    a: "Yes! CrackTheLoop is optimized for software engineers, product managers, and technical roles. It excels at technical discussions, system design diagrams, coding logic explanations, and behavioral rounds using the STAR method.",
  },
];

interface FaqProps {
  faqList?: { q: string; a: string }[];
}

export default function Faq({ faqList }: FaqProps = {}) {
  const [open, setOpen] = useState<number | null>(null);
  const activeFaqs = faqList || faqs;

  return (
    <section
      id="faq"
      className="section-mist relative py-20 md:py-24 overflow-hidden"
    >
      <div className="orb orb-slate w-87.5 h-87.5 -bottom-20 -right-20 animate-float-orb-slow" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-extrabold tracking-tight text-(--text-primary)"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Everything You Want to Ask{" "}
              <span className="text-gradient-coral">Before You Buy</span>
            </h2>
            <p className="text-(--text-muted) text-base mt-3 max-w-xl mx-auto">
              Detection, privacy, speed, and platform questions - answered
              directly.
            </p>
          </div>
        </ScrollReveal>

        <div className="divide-y divide-(--border-light) border-t border-b border-(--border-light) mt-8">
          {activeFaqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <ScrollReveal key={i} delay={i * 0.03} className="w-full">
                <div className="py-1 transition-colors duration-200">
                  <button
                    id={`faq-q-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between py-4 text-left gap-4 cursor-pointer group"
                  >
                    <span className="text-sm md:text-base font-semibold text-(--text-primary) group-hover:text-(--accent) transition-colors">
                      {faq.q}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <ChevronDown
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isOpen ? "text-(--accent)" : "text-(--text-muted)"
                        }`}
                      />
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: 0.3,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                        className="overflow-hidden"
                      >
                        <div className="pb-5 text-(--text-muted) text-sm leading-relaxed pr-8">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
