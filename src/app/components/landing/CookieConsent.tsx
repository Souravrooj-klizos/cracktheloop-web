"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, Lock, Check, X } from "lucide-react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Consent categories
  const [consents, setConsents] = useState({
    essential: true, // Always required
    analytics: false,
    marketing: false,
  });

  function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : null;
  }

  function setCookie(name: string, value: string, days = 365) {
    if (typeof document === "undefined") return;
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
  }

  useEffect(() => {
    // Check if user already set consent
    const consentSet = getCookie("ctl_cookie_consent");
    if (!consentSet) {
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      try {
        const saved = JSON.parse(consentSet);
        setConsents({
          essential: true,
          analytics: !!saved.analytics,
          marketing: !!saved.marketing,
        });
        if (saved.analytics) {
          loadAnalyticsScripts();
        }
      } catch (e) {
        if (consentSet === "accepted") {
          setConsents({ essential: true, analytics: true, marketing: true });
          loadAnalyticsScripts();
        }
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allConsents = { essential: true, analytics: true, marketing: true };
    setConsents(allConsents);
    setCookie("ctl_cookie_consent", JSON.stringify(allConsents));
    loadAnalyticsScripts();
    setVisible(false);
  };

  const handleDeclineOptional = () => {
    const essentialOnly = { essential: true, analytics: false, marketing: false };
    setConsents(essentialOnly);
    setCookie("ctl_cookie_consent", JSON.stringify(essentialOnly));
    setVisible(false);
  };

  const handleSavePreferences = () => {
    setCookie("ctl_cookie_consent", JSON.stringify(consents));
    if (consents.analytics) {
      loadAnalyticsScripts();
    }
    setVisible(false);
  };

  const loadAnalyticsScripts = () => {
    if (typeof window === "undefined" || (window as any)._ctl_analytics_loaded) return;
    (window as any)._ctl_analytics_loaded = true;
    console.log("[TRACKING] Initializing Google Analytics and optional telemetry scripts...");
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 z-55 shadow-lg select-none"
        >
          <div className="max-w-7xl mx-auto px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Left Column: Info & Settings Toggle */}
            <div className="flex flex-wrap items-center gap-3 text-center md:text-left justify-center md:justify-start">
              <span className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <Cookie className="w-4.5 h-4.5 text-(--accent) shrink-0 animate-bounce" />
                <span>
                  We use cookies to enhance your experience, personalize content, and analyze site performance.
                </span>
              </span>
              
              {!showSettings && (
                <button
                  onClick={() => setShowSettings(true)}
                  className="text-[10px] font-black uppercase tracking-wider text-slate-500 hover:text-(--accent) transition cursor-pointer underline underline-offset-2"
                >
                  Manage Settings
                </button>
              )}
            </div>

            {/* Middle: Expanded Inline Settings */}
            {showSettings && (
              <div className="flex flex-wrap gap-4 items-center justify-center bg-slate-50 border border-slate-200/60 px-3 py-1.5 rounded-lg text-[10px] font-bold text-slate-700 my-1 md:my-0">
                <label className="flex items-center gap-1.5 opacity-70">
                  <Lock className="w-3.5 h-3.5 text-slate-400" /> Essential
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consents.analytics}
                    onChange={() => setConsents(c => ({ ...c, analytics: !c.analytics }))}
                    className="accent-(--accent) cursor-pointer"
                  />
                  Analytics
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consents.marketing}
                    onChange={() => setConsents(c => ({ ...c, marketing: !c.marketing }))}
                    className="accent-(--accent) cursor-pointer"
                  />
                  Marketing
                </label>
                <button
                  onClick={handleSavePreferences}
                  className="text-[9px] font-black uppercase tracking-wider bg-slate-900 text-white px-2.5 py-1 rounded cursor-pointer border border-slate-900 hover:bg-slate-800 transition active:scale-95"
                >
                  Save Choice
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-slate-400 hover:text-slate-650 p-0.5 cursor-pointer transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Right Column: Quick Action buttons */}
            {!showSettings && (
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={handleDeclineOptional}
                  className="text-[10px] font-black uppercase tracking-wider text-slate-500 hover:text-slate-800 px-3 py-1.5 cursor-pointer transition"
                >
                  Essential Only
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="btn-primary !py-2 !px-4 !text-[10px] !font-bold uppercase tracking-wider cursor-pointer shadow-xs shadow-[#E8503A]/20"
                >
                  Accept All
                </button>
              </div>
            )}
            
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
