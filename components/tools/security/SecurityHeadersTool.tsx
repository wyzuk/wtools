"use client";

import React, { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { ResultCard } from "@/components/ResultCard";
import { useUsage } from "@/components/UsageContext";
import { UsageLimitBanner } from "@/components/UsageLimitBanner";

interface SecurityHeaderCheck {
  header: string;
  value: string | null;
  present: boolean;
  status: "secure" | "missing" | "info";
  description: string;
  recommendation?: string;
}

interface SecurityHeadersData {
  url: string;
  status: number;
  score: string;
  checks: SecurityHeaderCheck[];
  rawHeaders: Record<string, string>;
}

export function SecurityHeadersTool() {
  const [url, setUrl] = useState("https://cloudflare.com");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SecurityHeadersData | null>(null);
  const { limitReached, recordToolUsage } = useUsage();

  const analyzeHeaders = async (target = url) => {
    if (!target.trim() || limitReached) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/security-headers?url=${encodeURIComponent(target.trim())}`);
      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || "Failed to analyze security headers.");
      }
      setData(json);
      await recordToolUsage();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Analysis failed.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    analyzeHeaders();
  };

  return (
    <div className="space-y-6">
      {limitReached && <UsageLimitBanner />}

      <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-[#0d0d0d] border border-slate-200 dark:border-white/10 rounded-xl space-y-4 shadow-sm dark:shadow-none transition-colors">
        <div>
          <label htmlFor="sec-url" className="block text-xs font-semibold text-slate-700 dark:text-white/70 mb-2 uppercase tracking-wider font-mono">
            Website URL to Analyze
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="sec-url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              disabled={limitReached}
              className="w-full bg-white dark:bg-black border border-slate-300 dark:border-white/20 rounded-lg px-4 py-2.5 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:border-blue-500 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || limitReached}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-medium transition-colors shadow-sm shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>{loading ? "Analyzing..." : "Analyze headers"}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-white/50">
          <span>Examples:</span>
          {["https://cloudflare.com", "https://github.com", "https://google.com"].map((preset) => (
            <button
              key={preset}
              type="button"
              disabled={limitReached}
              onClick={() => {
                setUrl(preset);
                analyzeHeaders(preset);
              }}
              className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-white/70 hover:border-blue-500 hover:text-blue-600 dark:hover:text-white transition-colors disabled:opacity-50"
            >
              {preset}
            </button>
          ))}
        </div>
      </form>

      {error && (
        <div className="p-4 bg-white dark:bg-[#0f0f11] border border-slate-300 dark:border-white/20 rounded-lg text-sm text-slate-800 dark:text-white">
          <span className="font-semibold text-slate-900 dark:text-white mr-2">Notice:</span>
          {error}
        </div>
      )}

      {data && (
        <ResultCard
          title={`OWASP Security Headers Assessment: ${data.score} Pass`}
          rawJson={data.rawHeaders}
        >
          <div className="space-y-4">
            <div className="space-y-3">
              {data.checks.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg flex flex-col md:flex-row md:items-start justify-between gap-3"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                        {item.header}
                      </span>
                      <span
                        className={`text-[11px] font-mono uppercase px-2.5 py-0.5 rounded font-semibold ${
                          item.status === "secure"
                            ? "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/40"
                            : item.status === "missing"
                            ? "bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white/70 border border-slate-300 dark:border-white/20"
                            : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/50 border border-slate-200 dark:border-white/10"
                        }`}
                      >
                        {item.status === "secure" ? "Enforced" : item.status === "missing" ? "Missing" : "Notice"}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-white/60">{item.description}</p>

                    {item.value ? (
                      <div className="p-2.5 bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded font-mono text-xs text-slate-800 dark:text-white break-all">
                        {item.value}
                      </div>
                    ) : (
                      <div className="text-xs font-mono text-slate-400 dark:text-white/40 italic">
                        Header not present in HTTP response.
                      </div>
                    )}
                  </div>

                  {item.recommendation && (
                    <div className="md:w-1/3 text-xs font-mono text-slate-600 dark:text-white/50 bg-white dark:bg-white/5 p-3 rounded-lg border border-slate-200 dark:border-white/10 shrink-0">
                      <span className="text-slate-800 dark:text-white/70 block uppercase text-[10px] mb-1 font-semibold">
                        Recommended:
                      </span>
                      <span className="text-blue-600 dark:text-blue-400 font-medium">{item.recommendation}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </ResultCard>
      )}
    </div>
  );
}
