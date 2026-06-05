"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageSquare } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

const faqs = [
  {
    q: "What does CrackTheLoop do?",
    a: "CrackTheLoop is an AI-powered interview assistance buddy that helps candidates during interview conversations by listening to the interviewer’s questions and generating relevant answer guidance in real time.",
  },
  {
    q: "Does the AI ask interview questions?",
    a: "No. The AI does not act as an interviewer and does not ask questions to the candidate. Instead, the AI listens to the interviewer’s question during an interview or practice session and provides the candidate with helpful answer suggestions, key talking points, and structured response guidance.",
  },
  {
    q: "How does it generate answer guidance?",
    a: "The system captures the interviewer's question audio, transcribes it, and cross-references the question text with your uploaded resume and the job description to generate highly relevant, structured talking points.",
  },
  {
    q: "Can I upload my resume?",
    a: "Yes. You can upload your resume (PDF/DOCX format) before starting your session. The system extracts your skills, projects, tools, and experience to personalize the suggested answers.",
  },
  {
    q: "Can I add a job description?",
    a: "Yes. You can upload or paste the target role's job description. The AI analyzes it to extract required technical keywords, core responsibilities, and team expectations, then highlights them in your suggestions.",
  },
  {
    q: "Is it useful for freshers?",
    a: "Yes. Freshers can use CrackTheLoop to structure academic project explanations, handle basic technical questions, and practice HR rounds with structured confidence.",
  },
  {
    q: "Can it help with technical interviews?",
    a: "Absolutely. The system supports technical, behavioral, consulting, and product management interviews. It automatically maps core question structures to corresponding frameworks (like STAR, CAR, or Case trees).",
  },
  {
    q: "Is my resume data safe?",
    a: "Yes. Your privacy is our highest priority. All resume details and conversation transcripts are processed securely and privately, and are never shared, logged, or used to train public models.",
  },
  {
    q: "Can I use it during a live interview?",
    a: "Yes, CrackTheLoop is designed to be used during permitted live interviews or practice prep sessions as a confidence-support and structure-guidance companion.",
  },
  {
    q: "Does it give full answers or short talking points?",
    a: "You have complete control. You can toggle between Short Answer Mode (quick 2-3 lines), Structured Answer Mode (complete framework outline), or Bullet Point Mode for natural talking points.",
  },
];

interface FaqProps {
  faqList?: { q: string; a: string }[];
}

export default function Faq({ faqList }: FaqProps = {}) {
  const [open, setOpen] = useState<number | null>(null);
  const activeFaqs = faqList || faqs;

  return (
    <section id="faq" className="section-mist relative py-20 md:py-24 overflow-hidden">
      <div className="orb orb-slate w-[350px] h-[350px] -bottom-20 -right-20 animate-float-orb-slow" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-extrabold tracking-tight text-(--text-primary)"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Common Questions
            </h2>
            <p className="text-(--text-muted) text-base mt-3 max-w-xl mx-auto">
              Everything you need to know about safety, setup, and features.
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
                        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
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
