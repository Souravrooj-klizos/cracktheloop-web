"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Terminal, CheckSquare } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

const steps = [
  {
    icon: <Upload className="w-5 h-5" />,
    title: "Upload Resume",
    subtitle: "Candidate Context Setup",
    desc: "CrackTheLoop deep-parses your professional history, tech stack, and achievements to build a comprehensive local candidate context. This ensures all live recommendations match your actual career milestones.",
    points: [
      "Securely index your projects, language competencies, and achievements.",
      "Categorize key metrics and outcomes to use during behavioral answers.",
      "Establish a localized knowledge base that remains completely private."
    ]
  },
  {
    icon: <FileText className="w-5 h-5" />,
    title: "Add Job Description",
    subtitle: "Target Requirement Mapping",
    desc: "Paste the target role description. The AI instantly extracts expected duties, mandatory technical skills, and target competencies to customize talking points on the fly.",
    points: [
      "Scan expected deliverables and mandatory keywords from the JD.",
      "Identify situational themes (leadership, system design, conflict resolution).",
      "Cross-reference your experience to highlight exact resume-JD overlaps."
    ]
  },
  {
    icon: <Terminal className="w-5 h-5" />,
    title: "Start Stealth Copilot",
    subtitle: "Stealth Assistant Activation",
    desc: "Launch the overlay buddy when your call begins. The interface stays completely invisible beneath screen-sharing software (Zoom, Meet, Teams) to keep your assist private.",
    points: [
      "Launch a clean, borderless overlay invisible to call recording software.",
      "Activate high-fidelity speech recognition to decode interviewer questions.",
      "System stands by, ready to immediately trigger structured prompt feeds."
    ]
  },
  {
    icon: <CheckSquare className="w-5 h-5" />,
    title: "Get Live Guidance",
    subtitle: "Interactive Real-Time Support",
    desc: "As questions are detected, structured talking points (STAR/CAR frameworks) pop up in 1.5 seconds. Speed rate gauges assist you to stay calm and natural.",
    points: [
      "Receive context-aware answer suggestions instantly as questions occur.",
      "Get visual prompts for matching resume details to avoid blanking out.",
      "Track speech pace alerts to maintain a balanced, natural conversation flow."
    ]
  }
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play cycling from step 1 to 4 every 4 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="section-frost relative min-h-screen flex flex-col justify-center py-20 md:py-24 overflow-hidden"
    >
      <div className="orb orb-frost w-[400px] h-[400px] top-0 right-0 animate-float-orb" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              From Resume to Confident Answers in{" "}
              <span className="text-gradient-coral">4 Steps</span>
            </h2>
            <p className="text-[var(--text-muted)] text-base mt-3 max-w-2xl mx-auto">
              Set up your profile, load the target job, and let your AI buddy assist you when it matters.
            </p>
          </div>
        </ScrollReveal>

        {/* Desktop Timeline */}
        <div className="relative mb-12 hidden md:block select-none">
          {/* Badges Row */}
          <div className="grid grid-cols-4 text-center mb-4">
            {steps.map((step, i) => {
              const isActive = i <= activeStep;
              const isCurrent = i === activeStep;
              return (
                <div key={i} className="flex justify-center">
                  <button
                    onClick={() => {
                      setActiveStep(i);
                      setIsPaused(true);
                    }}
                    className={`text-[11px] font-mono font-bold tracking-wider uppercase transition-all duration-350 px-3 py-1 rounded-full cursor-pointer select-none ${
                      isCurrent
                        ? "text-[var(--accent)] bg-[var(--accent-soft)]"
                        : isActive
                          ? "text-[var(--text-secondary)] bg-slate-100"
                          : "text-slate-400 bg-transparent"
                    }`}
                  >
                    Step 0{i + 1}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Timeline Line & Circles Row */}
          <div className="relative h-6 flex items-center">
            {/* Connector Line */}
            <div className="absolute left-[12.5%] right-[12.5%] h-[2px] bg-slate-100 z-0">
              <motion.div
                className="h-full bg-[var(--accent)]"
                animate={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>

            {/* Circles Grid */}
            <div className="grid grid-cols-4 w-full relative z-10">
              {steps.map((step, i) => {
                const isActive = i <= activeStep;
                const isCurrent = i === activeStep;
                return (
                  <div key={i} className="flex justify-center items-center">
                    <button
                      onClick={() => {
                        setActiveStep(i);
                        setIsPaused(true);
                      }}
                      className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-500 bg-white cursor-pointer ${
                        isCurrent
                          ? "border-[var(--accent)] bg-[var(--accent)] scale-125 shadow-xs"
                          : isActive
                            ? "border-[var(--accent)] bg-[var(--accent)]"
                            : "border-slate-200"
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Desktop Cards Grid */}
        <div
          className="hidden md:grid grid-cols-4 gap-6"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {steps.map((step, i) => {
            const isCurrent = i === activeStep;
            return (
              <div
                key={i}
                onClick={() => {
                  setActiveStep(i);
                  setIsPaused(true);
                }}
                className={`border rounded-[6px] p-6 transition-all duration-500 flex flex-col cursor-pointer justify-between ${
                  isCurrent
                    ? "bg-white border-[var(--accent)] shadow-md scale-[1.03] -translate-y-2 z-10"
                    : "bg-white/40 border-[var(--border-light)] opacity-70 hover:opacity-95 hover:bg-white/60 hover:-translate-y-1"
                }`}
              >
                <div className="flex flex-col gap-4">
                  {/* Icon Header */}
                  <div className={`w-10 h-10 rounded-[6px] flex items-center justify-center border transition-all duration-500 ${
                    isCurrent
                      ? "bg-[var(--accent)] text-white border-[var(--accent-bright)] shadow-sm"
                      : "bg-slate-50 text-slate-400 border-slate-100"
                  }`}>
                    {step.icon}
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <span className={`text-[10px] font-mono font-bold tracking-wider uppercase transition-colors duration-500 ${
                      isCurrent ? "text-[var(--accent)]" : "text-slate-400"
                    }`}>
                      {step.subtitle}
                    </span>
                    <h3 className={`text-lg font-extrabold mt-1 transition-colors duration-500 ${
                      isCurrent ? "text-[var(--text-primary)]" : "text-slate-700"
                    }`}>
                      {step.title}
                    </h3>
                  </div>

                  {/* Description Paragraph */}
                  <p className={`text-xs leading-relaxed transition-colors duration-500 ${
                    isCurrent ? "text-[var(--text-secondary)]" : "text-[var(--text-muted)]"
                  }`}>
                    {step.desc}
                  </p>
                </div>

                {/* Bullet Points */}
                <ul className="flex flex-col gap-3 mt-6 pt-5 border-t border-slate-100 text-xs text-[var(--text-secondary)] font-medium">
                  {step.points.map((pt, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <span className={`transition-colors duration-500 shrink-0 ${
                        isCurrent ? "text-[var(--accent)] font-bold" : "text-slate-350"
                      }`}>
                        ✓
                      </span>
                      <span className={`leading-snug transition-colors duration-500 ${
                        isCurrent ? "text-[var(--text-secondary)]" : "text-[var(--text-muted)]"
                      }`}>
                        {pt}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Mobile Vertical Timeline */}
        <div className="md:hidden relative pl-6 flex flex-col gap-8">
          {/* Vertical line */}
          <div className="absolute top-2 bottom-2 left-[7px] w-[2px] bg-slate-100">
            <motion.div
              className="w-full bg-[var(--accent)] origin-top h-full"
              animate={{ height: `${(activeStep / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>

          {steps.map((step, i) => {
            const isActive = i <= activeStep;
            const isCurrent = i === activeStep;
            return (
              <div key={i} className="relative flex flex-col gap-3">
                {/* Node Circle */}
                <button
                  onClick={() => {
                    setActiveStep(i);
                    setIsPaused(true);
                  }}
                  className={`absolute -left-[23px] top-1.5 w-3.5 h-3.5 rounded-full border-2 bg-white transition-all duration-300 cursor-pointer ${
                    isCurrent
                      ? "border-[var(--accent)] bg-[var(--accent)] scale-110 shadow-xs"
                      : isActive
                        ? "border-[var(--accent)] bg-[var(--accent)]"
                        : "border-slate-200"
                  }`}
                />

                {/* Badge & Title */}
                <div className="flex items-center gap-3">
                  <span className={`text-[9px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ${
                    isCurrent
                      ? "text-[var(--accent)] bg-[var(--accent-soft)]"
                      : "text-slate-400 bg-slate-50"
                  }`}>
                    Step 0{i + 1}
                  </span>
                  <h3 className={`text-sm font-bold transition-colors ${
                    isCurrent ? "text-[var(--accent)]" : "text-[var(--text-primary)]"
                  }`}>
                    {step.title}
                  </h3>
                </div>

                {/* Checklist Card */}
                <div
                  onClick={() => {
                    setActiveStep(i);
                    setIsPaused(true);
                  }}
                  className={`border rounded-[8px] p-5 transition-all duration-500 flex flex-col gap-3 cursor-pointer ${
                    isCurrent
                      ? "bg-white border-[var(--accent)] shadow-md"
                      : "bg-white/40 border-[var(--border-light)] opacity-70"
                  }`}
                >
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {step.desc}
                  </p>
                  <ul className="flex flex-col gap-2 mt-2 pt-3 border-t border-slate-100 text-xs text-[var(--text-secondary)] font-medium">
                    {step.points.map((pt, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <span className={`transition-colors duration-500 shrink-0 ${
                          isCurrent ? "text-[var(--accent)]" : "text-slate-400"
                        }`}>
                          ✓
                        </span>
                        <span className="leading-snug">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
