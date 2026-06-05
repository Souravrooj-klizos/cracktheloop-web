"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Sparkles, Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    {
      label: "Features",
      href: "#features",
      dropdown: [
        { label: "Live Audio Transcription", href: "/features/live-transcription", desc: "Understands questions in real-time." },
        { label: "Resume & JD Alignment", href: "/features/resume-jd-alignment", desc: "Tailor answers to target roles." },
        { label: "Stealth Overlay HUD", href: "/features/stealth-overlay", desc: "Zoom-invisible desktop window." },
      ]
    },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Use Cases", href: "#use-cases" },
    { label: "Pricing", href: "/pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  const getHref = (href: string) => {
    if (href.startsWith("#") && pathname !== "/") {
      return `/${href}`;
    }
    return href;
  };

  return (
    <motion.header
      id="navbar"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-nav shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <a
          href="/"
          className="flex items-center gap-2.5 hover:opacity-90 transition cursor-pointer select-none"
        >
          <img
            src="/logo.svg"
            className="h-9 w-9 rounded-lg select-none border border-[var(--border-light)]"
            alt="CrackTheLoop Logo Icon"
          />
          <span className="font-extrabold tracking-tight text-xl text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
            CrackTheLoop
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => {
            if (item.dropdown) {
              return (
                <div
                  key={item.label}
                  className="relative group py-2"
                >
                  <button className="flex items-center gap-1 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition cursor-pointer select-none">
                    {item.label}
                    <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-xl p-3 shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 transform origin-top scale-95 group-hover:scale-100 flex flex-col gap-1.5 z-50">
                    {item.dropdown.map((subItem) => (
                      <a
                        key={subItem.label}
                        href={subItem.href}
                        className="flex flex-col px-3 py-2 rounded-lg hover:bg-slate-50 transition cursor-pointer"
                      >
                        <span className="text-xs font-bold text-slate-800">{subItem.label}</span>
                        <span className="text-[10px] text-slate-400 font-medium leading-normal mt-0.5">{subItem.desc}</span>
                      </a>
                    ))}
                    <div className="border-t border-slate-100 mt-1.5 pt-2">
                      <a
                        href={getHref(item.href)}
                        className="text-[10px] font-bold text-[var(--accent)] hover:underline px-3 flex items-center gap-1 cursor-pointer"
                      >
                        View All Features <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <a
                key={item.label}
                href={getHref(item.href)}
                className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition cursor-pointer"
              >
                {item.label}
              </a>
            );
          })}
          <a
            href="/pricing"
            className="btn-primary !py-2.5 !px-6 !text-sm !rounded-[8px] cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Start Preparing
          </a>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="w-5 h-5 text-[var(--text-primary)]" />
          ) : (
            <Menu className="w-5 h-5 text-[var(--text-primary)]" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass-light mx-4 mb-4 rounded-lg p-6 flex flex-col gap-4"
        >
          {menuItems.map((item) => {
            if (item.dropdown) {
              return (
                <div key={item.label} className="flex flex-col gap-1 py-1">
                  <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400 px-2 mb-1">
                    {item.label}
                  </span>
                  <div className="flex flex-col gap-2 pl-3 border-l border-slate-150">
                    {item.dropdown.map((subItem) => (
                      <a
                        key={subItem.label}
                        href={subItem.href}
                        className="text-sm font-semibold text-slate-700 hover:text-[var(--accent)] py-1.5 cursor-pointer"
                        onClick={() => setMobileOpen(false)}
                      >
                        {subItem.label}
                      </a>
                    ))}
                    <a
                      href={getHref(item.href)}
                      className="text-xs font-bold text-[var(--accent)] py-1.5 cursor-pointer"
                      onClick={() => setMobileOpen(false)}
                    >
                      View All Features →
                    </a>
                  </div>
                </div>
              );
            }

            return (
              <a
                key={item.label}
                href={getHref(item.href)}
                className="text-sm font-medium text-[var(--text-primary)] py-2 cursor-pointer"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </a>
            );
          })}
          <a
            href="/pricing"
            className="btn-primary !text-sm !rounded-[8px] justify-center cursor-pointer"
            onClick={() => setMobileOpen(false)}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Start Preparing
          </a>
        </motion.div>
      )}

      {/* Sticky Scroll Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[3px] bg-[var(--accent)] origin-left z-50"
        style={{ scaleX }}
      />
    </motion.header>
  );
}

