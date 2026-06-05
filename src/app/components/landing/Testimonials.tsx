"use client";

import { Star } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "./ScrollReveal";

const testimonials = [
  {
    quote: "I used to freeze when interviewers asked about my projects. CrackTheLoop helped me organize my answer and speak with confidence.",
    name: "S. Patel",
    role: "Computer Science Student",
    stars: 5,
  },
  {
    quote: "The resume-based suggestions helped me explain my skills in a way that matched the job role.",
    name: "A. Chen",
    role: "Junior Software Engineer",
    stars: 5,
  },
  {
    quote: "It helped me turn my experience into clear talking points instead of long, unstructured answers.",
    name: "J. Williams",
    role: "Senior Data Scientist",
    stars: 5,
  },
  {
    quote: "I finally understood how to connect my old experience with the new role I was applying for.",
    name: "R. Müller",
    role: "Product Manager (Career Switcher)",
    stars: 5,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="section-warm relative py-20 md:py-24 overflow-hidden">
      <div className="orb orb-peach w-[400px] h-[400px] -bottom-20 -left-20 animate-float-orb-slow opacity-40" />
      <div className="orb orb-frost w-[300px] h-[300px] top-0 -right-20 animate-float-orb opacity-30" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <ScrollReveal>
          <div className="text-center mb-14">
            <h2
              className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Candidates Feel More Prepared with{" "}
              <span className="text-gradient-coral">CrackTheLoop</span>
            </h2>
            <p className="text-[var(--text-muted)] text-base mt-3 max-w-xl mx-auto">
              Real stories from candidates who used structured AI guidance to prepare and interview with confidence.
            </p>
          </div>
        </ScrollReveal>

        {/* Multi-card grid instead of carousel */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-5" staggerDelay={0.08}>
          {testimonials.map((t, i) => (
            <StaggerItem key={i}>
              <div className="bg-white/70 backdrop-blur-md border border-[var(--border-light)] rounded-[12px] p-6 md:p-7 flex flex-col justify-between h-full hover:-translate-y-1 transition-all duration-300 shadow-xs hover:shadow-md hover:border-[var(--accent-glow)]">
                <div>
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-[var(--accent)] fill-[var(--accent)]" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                {/* Author */}
                <div className="mt-6 pt-4 border-t border-[var(--border-light)] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-bright)] flex items-center justify-center text-white text-xs font-bold shadow-sm select-none shrink-0">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-[var(--text-primary)] block">
                      {t.name}
                    </span>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
