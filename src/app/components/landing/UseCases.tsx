"use client";

import { GraduationCap, UserPlus, Briefcase, Shuffle, AlertCircle } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "./ScrollReveal";

const useCases = [
  {
    icon: GraduationCap,
    title: "College Students",
    tag: "Early Career",
    desc: "Turn academic projects, hackathons, and internship experience into compelling, structured answers — even without full-time experience.",
    points: [
      "Translates class projects to STAR context",
      "Highlights internship achievements",
      "Assists with foundational technical questions",
    ],
    stat: { value: "3×", label: "more callbacks" },
  },
  {
    icon: UserPlus,
    title: "Freshers",
    tag: "0–1 Year Exp",
    desc: "Prepare structured, role-relevant responses for core technical concepts and HR rounds — with JD keyword alignment built in.",
    points: [
      "Structures behavioral STAR responses",
      "Maps technical keywords from the JD",
      "Highlights relevant coursework",
    ],
    stat: { value: "91%", label: "feel more confident" },
  },
  {
    icon: Briefcase,
    title: "Working Professionals",
    tag: "Senior & Mid-Level",
    desc: "You have the experience — CrackTheLoop helps you communicate it with precision. Distill complex career history, leadership decisions, and key metrics into clear, high-impact stories the interviewer remembers.",
    points: [
      "Surfaces quantifiable metrics & scale impact",
      "Formulates leadership & system design narratives",
      "Crafts C-suite-ready architectural reasoning",
    ],
    stat: { value: "2.4×", label: "offer rate increase" },
    featured: true,
  },
  {
    icon: Shuffle,
    title: "Career Switchers",
    tag: "Domain Change",
    desc: "Bridge the gap between your previous industry and your target role. Map transferable skills to new expectations seamlessly.",
    points: [
      "Translates transferable skills to new domain",
      "Highlights relevant cross-functional projects",
      "Aligns vocabulary with new industry standards",
    ],
    stat: { value: "68%", label: "land first interview" },
  },
  {
    icon: AlertCircle,
    title: "Rejected Job Seekers",
    tag: "Bounce Back",
    desc: "Debug exactly why answers fall flat. Eliminate filler, fix missing keywords, and rebuild answer delivery that actually lands offers.",
    points: [
      "Replaces generic answers with STAR frameworks",
      "Ensures required JD skills are highlighted",
      "Reduces verbal filler and rambling under stress",
    ],
    stat: { value: "5×", label: "faster improvement" },
  },
];

export default function UseCases() {
  const topRow = useCases.slice(0, 2);
  const featured = useCases[2];
  const bottomRow = useCases.slice(3);

  return (
    <section
      id="use-cases"
      className="section-mist relative py-20 md:py-24 overflow-hidden"
    >
      <div className="orb orb-peach w-[500px] h-[500px] top-1/4 -right-40 animate-float-orb opacity-40" />
      <div className="orb orb-frost w-[400px] h-[400px] bottom-0 -left-20 animate-float-orb opacity-30" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-14">
            <h2
              className="text-3xl md:text-4xl font-extrabold tracking-tight text-(--text-primary)"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Made for Every Candidate Who Wants to{" "}
              <span className="text-gradient-coral">Answer Better</span>
            </h2>
            <p className="text-(--text-muted) text-base mt-3 max-w-xl mx-auto leading-relaxed">
              CrackTheLoop adapts its assistance to your unique career stage — no generic advice, only context-aware guidance.
            </p>
          </div>
        </ScrollReveal>

        {/* Bento Grid */}
        <StaggerContainer className="flex flex-col gap-4" staggerDelay={0.07}>

          {/* Row 1: 2 smaller cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topRow.map((uc, i) => {
              const Icon = uc.icon;
              return (
                <StaggerItem key={i}>
                  <div className="group relative bg-white/60 border border-(--border-light) rounded-[6px] p-6 flex flex-col gap-4 overflow-hidden hover:-translate-y-1 transition-all duration-300 cursor-default h-full">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border bg-(--accent-soft) text-(--accent) border-(--accent)/20">
                        {uc.tag}
                      </span>
                      <span className="text-right">
                        <span className="text-2xl font-black text-(--accent)">{uc.stat.value}</span>
                        <span className="text-[10px] text-(--text-muted) block">{uc.stat.label}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-[6px] bg-(--accent-soft) text-(--accent) flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-extrabold text-(--text-primary) leading-snug">{uc.title}</h3>
                    </div>

                    <p className="text-sm text-(--text-muted) leading-relaxed">{uc.desc}</p>

                    <ul className="flex flex-col gap-2 pt-4 border-t border-(--border-light)">
                      {uc.points.map((pt, j) => (
                        <li key={j} className="flex items-start gap-2 text-xs text-(--text-secondary) font-medium">
                          <span className="mt-0.5 shrink-0 w-3.5 h-3.5 rounded-full bg-(--accent-soft) flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-(--accent)" />
                          </span>
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                </StaggerItem>
              );
            })}
          </div>

          {/* Row 2: Featured wide card */}
          <StaggerItem>
            <div className="group relative bg-(--accent-soft) border border-(--accent)/20 rounded-[6px] p-7 md:p-8 overflow-hidden hover:-translate-y-1 transition-all duration-300 cursor-default">
              <div className="absolute -right-20 -top-20 w-60 h-60 rounded-full bg-(--accent)/10 blur-3xl pointer-events-none" />

              <div className="relative flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1 flex flex-col gap-5">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border bg-white/80 text-(--accent) border-(--accent)/20">
                      {featured.tag}
                    </span>
                    <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-(--accent) text-white">
                      ★ Most Popular
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-[6px] bg-white/80 text-(--accent) flex items-center justify-center shrink-0">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-black text-(--text-primary) leading-tight">{featured.title}</h3>
                  </div>

                  <p className="text-sm text-(--text-muted) leading-relaxed max-w-lg">{featured.desc}</p>

                  <ul className="flex flex-col gap-2.5">
                    {featured.points.map((pt, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-(--text-secondary) font-medium">
                        <span className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-white/70 flex items-center justify-center">
                          <span className="w-2 h-2 rounded-full bg-(--accent)" />
                        </span>
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right: Stats block */}
                <div className="shrink-0 flex flex-row md:flex-col gap-4 w-full md:w-44">
                  <div className="flex-1 bg-white/70 backdrop-blur-sm rounded-[8px] p-4 border border-white/80 flex flex-col gap-1 shadow-sm">
                    <span className="text-3xl font-black text-(--accent)">{featured.stat.value}</span>
                    <span className="text-[11px] text-(--text-muted) font-medium leading-snug">{featured.stat.label}</span>
                  </div>
                  <div className="flex-1 bg-white/70 backdrop-blur-sm rounded-[8px] p-4 border border-white/80 flex flex-col gap-1 shadow-sm">
                    <span className="text-3xl font-black text-(--accent)">1.5s</span>
                    <span className="text-[11px] text-(--text-muted) font-medium leading-snug">avg. answer suggestion speed</span>
                  </div>
                  <div className="flex-1 bg-white/70 backdrop-blur-sm rounded-[8px] p-4 border border-white/80 flex flex-col gap-1 shadow-sm">
                    <span className="text-3xl font-black text-(--accent)">100%</span>
                    <span className="text-[11px] text-(--text-muted) font-medium leading-snug">JD keyword alignment</span>
                  </div>
                </div>
              </div>
            </div>
          </StaggerItem>

          {/* Row 3: 2 smaller cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bottomRow.map((uc, i) => {
              const Icon = uc.icon;
              return (
                <StaggerItem key={i}>
                  <div className="group relative bg-white/60 border border-(--border-light) rounded-[6px] p-6 flex flex-col gap-4 overflow-hidden hover:-translate-y-1 transition-all duration-300 cursor-default h-full">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border bg-(--accent-soft) text-(--accent) border-(--accent)/20">
                        {uc.tag}
                      </span>
                      <span className="text-right">
                        <span className="text-2xl font-black text-(--accent)">{uc.stat.value}</span>
                        <span className="text-[10px] text-(--text-muted) block">{uc.stat.label}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-[6px] bg-(--accent-soft) text-(--accent) flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-extrabold text-(--text-primary) leading-snug">{uc.title}</h3>
                    </div>

                    <p className="text-sm text-(--text-muted) leading-relaxed">{uc.desc}</p>

                    <ul className="flex flex-col gap-2 pt-4 border-t border-(--border-light)">
                      {uc.points.map((pt, j) => (
                        <li key={j} className="flex items-start gap-2 text-xs text-(--text-secondary) font-medium">
                          <span className="mt-0.5 shrink-0 w-3.5 h-3.5 rounded-full bg-(--accent-soft) flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-(--accent)" />
                          </span>
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                </StaggerItem>
              );
            })}
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
}
