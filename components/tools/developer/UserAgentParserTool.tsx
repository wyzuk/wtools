"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import { ResultCard } from "@/components/ResultCard";
import { useUsage } from "@/components/UsageContext";
import { UsageLimitBanner } from "@/components/UsageLimitBanner";

export function UserAgentParserTool() {
  const [ua, setUa] = useState("");
  const [hasParsed, setHasParsed] = useState(false);
  const { limitReached, recordToolUsage } = useUsage();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUa(window.navigator.userAgent);
    }
  }, []);

  const parsed = useMemo(() => {
    const raw = ua.trim();
    if (!raw) return null;

    // Browser Detection
    let browser = "Unknown Browser";
    let browserVersion = "";
    if (/edg\/([0-9.]+)/i.test(raw)) {
      browser = "Microsoft Edge";
      browserVersion = raw.match(/edg\/([0-9.]+)/i)?.[1] || "";
    } else if (/chrome\/([0-9.]+)/i.test(raw) && !/edg/i.test(raw)) {
      browser = "Google Chrome";
      browserVersion = raw.match(/chrome\/([0-9.]+)/i)?.[1] || "";
    } else if (/firefox\/([0-9.]+)/i.test(raw)) {
      browser = "Mozilla Firefox";
      browserVersion = raw.match(/firefox\/([0-9.]+)/i)?.[1] || "";
    } else if (/safari\/([0-9.]+)/i.test(raw) && !/chrome/i.test(raw)) {
      browser = "Apple Safari";
      browserVersion = raw.match(/version\/([0-9.]+)/i)?.[1] || "";
    } else if (/opr\/([0-9.]+)/i.test(raw)) {
      browser = "Opera";
      browserVersion = raw.match(/opr\/([0-9.]+)/i)?.[1] || "";
    }

    // Operating System Detection
    let os = "Unknown OS";
    if (/windows nt 10.0/i.test(raw)) os = "Windows 10 / 11";
    else if (/windows nt 6.3/i.test(raw)) os = "Windows 8.1";
    else if (/windows nt 6.1/i.test(raw)) os = "Windows 7";
    else if (/mac os x ([0-9_]+)/i.test(raw)) {
      const v = raw.match(/mac os x ([0-9_]+)/i)?.[1]?.replace(/_/g, ".");
      os = `macOS ${v || ""}`;
    } else if (/android ([0-9.]+)/i.test(raw)) {
      os = `Android ${raw.match(/android ([0-9.]+)/i)?.[1] || ""}`;
    } else if (/iphone os ([0-9_]+)/i.test(raw)) {
      os = `iOS ${raw.match(/iphone os ([0-9_]+)/i)?.[1]?.replace(/_/g, ".") || ""}`;
    } else if (/linux/i.test(raw)) os = "Linux";

    // Rendering Engine
    let engine = "Unknown Engine";
    if (/applewebkit/i.test(raw)) engine = "WebKit / Blink";
    else if (/gecko/i.test(raw) && !/webkit/i.test(raw)) engine = "Gecko";
    else if (/trident/i.test(raw)) engine = "Trident";

    // Bot detection
    const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(raw);

    // Device Category
    let device = "Desktop / Laptop";
    if (/mobile/i.test(raw)) device = "Mobile Phone";
    else if (/tablet|ipad/i.test(raw)) device = "Tablet";

    return {
      browser: `${browser} ${browserVersion}`.trim(),
      os,
      engine,
      device,
      isBot: isBot ? "Detected Automated Crawler / Bot" : "Standard User Browser",
    };
  }, [ua]);

  const handleParse = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!parsed || limitReached) return;
    setHasParsed(true);
    await recordToolUsage();
  };

  return (
    <div className="space-y-6">
      {limitReached && <UsageLimitBanner />}

      <form onSubmit={handleParse} className="p-6 bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-white/10 rounded-2xl space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_-4px_rgba(0,0,0,0.05)] transition-colors">
        <div>
          <label htmlFor="ua-input" className="block text-xs font-semibold text-slate-700 dark:text-white/70 mb-2 uppercase tracking-wider font-mono">
            User-Agent String
          </label>
          <textarea
            id="ua-input"
            value={ua}
            onChange={(e) => setUa(e.target.value)}
            rows={3}
            disabled={limitReached}
            placeholder="Paste a User-Agent string to parse..."
            className="w-full bg-white dark:bg-black border border-slate-300 dark:border-white/20 rounded-lg p-3.5 font-mono text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:border-blue-500 resize-y disabled:opacity-60"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-white/50">
            <span>Samples:</span>
            {[
              {
                label: "Googlebot",
                val: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
              },
              {
                label: "iPhone Safari",
                val: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
              },
              {
                label: "Linux Firefox",
                val: "Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0",
              },
            ].map((sample) => (
              <button
                key={sample.label}
                type="button"
                disabled={limitReached}
                onClick={() => setUa(sample.val)}
                className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-white/70 hover:border-blue-500 hover:text-[#0071e3] dark:hover:text-white transition-colors disabled:opacity-50"
              >
                {sample.label}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={limitReached}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#0071e3] hover:bg-[#0077ed] active:scale-95 disabled:opacity-50 text-white text-sm font-medium transition-colors shadow-sm shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>Parse agent</span>
          </button>
        </div>
      </form>

      {parsed && (hasParsed || !limitReached) && (
        <ResultCard
          title="Parsed User-Agent Attributes"
          items={[
            { label: "Browser Family & Version", value: parsed.browser, copyValue: parsed.browser },
            { label: "Operating System", value: parsed.os, copyValue: parsed.os },
            { label: "Rendering Engine", value: parsed.engine, copyValue: parsed.engine, mono: true },
            { label: "Device Category", value: parsed.device },
            { label: "Bot / Crawler Detection", value: parsed.isBot },
          ]}
        />
      )}
    </div>
  );
}
