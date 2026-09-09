"use client";

import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { ResultCard } from "@/components/ResultCard";
import { CopyButton } from "@/components/CopyButton";
import { useUsage } from "@/components/UsageContext";
import { UsageLimitBanner } from "@/components/UsageLimitBanner";

export function UrlAnalyzerTool() {
  const [urlInput, setUrlInput] = useState(
    "https://developer.mozilla.org:443/en-US/docs/Web/API/URL?ref=wtools&utm_source=twitter&utm_medium=social#constructor"
  );
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const { limitReached, recordToolUsage } = useUsage();

  const parsed = useMemo(() => {
    if (!urlInput.trim()) return null;
    try {
      const u = new URL(urlInput.trim());
      const queryParams: { key: string; value: string; isTracker: boolean }[] = [];
      u.searchParams.forEach((val, key) => {
        const isTracker =
          key.startsWith("utm_") ||
          ["gclid", "fbclid", "mc_eid", "msclkid", "yclid", "_hsenc"].includes(key.toLowerCase());
        queryParams.push({ key, value: val, isTracker });
      });

      return {
        valid: true,
        protocol: u.protocol,
        origin: u.origin,
        hostname: u.hostname,
        port: u.port || (u.protocol === "https:" ? "443 (default)" : u.protocol === "http:" ? "80 (default)" : "None"),
        pathname: u.pathname,
        search: u.search || "None",
        hash: u.hash || "None",
        username: u.username || "None",
        password: u.password || "None",
        params: queryParams,
      };
    } catch {
      return { valid: false, error: "Invalid URL string. Please ensure it includes a valid protocol (e.g. https://)." };
    }
  }, [urlInput]);

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!parsed || !parsed.valid || limitReached) return;
    setHasAnalyzed(true);
    await recordToolUsage();
  };

  return (
    <div className="space-y-6">
      {limitReached && <UsageLimitBanner />}

      <form onSubmit={handleAnalyze} className="p-6 bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-white/10 rounded-2xl space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_-4px_rgba(0,0,0,0.05)] transition-colors">
        <div>
          <label htmlFor="url-analyzer-input" className="block text-xs font-semibold text-slate-700 dark:text-white/70 mb-2 uppercase tracking-wider font-mono">
            Target URL to Parse
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="url-analyzer-input"
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/path?key=value#hash"
              disabled={limitReached}
              className="w-full bg-white dark:bg-black border border-slate-300 dark:border-white/20 rounded-lg px-4 py-2.5 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:border-blue-500 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={limitReached}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#0071e3] hover:bg-[#0077ed] active:scale-95 disabled:opacity-50 text-white text-sm font-medium transition-colors shadow-sm shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Analyze URL</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-white/50">
          <span>Samples:</span>
          {[
            "https://github.com/wyzuk/wtools?branch=main&view=tree#readme",
            "https://api.example.org:8443/v1/users?page=2&limit=50",
            "mailto:developer@wasee.dev?subject=Inquiry",
          ].map((sample) => (
            <button
              key={sample}
              type="button"
              disabled={limitReached}
              onClick={() => {
                setUrlInput(sample);
              }}
              className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-white/70 hover:border-blue-500 hover:text-[#0071e3] dark:hover:text-white transition-colors truncate max-w-xs disabled:opacity-50"
            >
              {sample}
            </button>
          ))}
        </div>
      </form>

      {parsed && !parsed.valid && (
        <div className="p-4 bg-white dark:bg-[#1c1c1e] border border-slate-300 dark:border-white/20 rounded-lg text-sm text-slate-800 dark:text-white">
          <span className="font-semibold text-slate-900 dark:text-white mr-2">Notice:</span>
          {parsed.error}
        </div>
      )}

      {parsed && parsed.valid && (hasAnalyzed || !limitReached) && (
        <div className="space-y-6">
          <ResultCard
            title="URL Breakdown"
            items={[
              { label: "Protocol / Scheme", value: parsed.protocol, mono: true },
              { label: "Hostname", value: parsed.hostname, copyValue: parsed.hostname, mono: true },
              { label: "Port", value: parsed.port, mono: true },
              { label: "Pathname", value: parsed.pathname, copyValue: parsed.pathname, mono: true },
              { label: "Origin", value: parsed.origin, copyValue: parsed.origin, mono: true },
              { label: "Hash / Anchor Fragment", value: parsed.hash, mono: true },
              { label: "Query String", value: parsed.search, copyValue: parsed.search, mono: true },
            ]}
          />

          <ResultCard title={`Decoded Query Parameters (${parsed.params?.length || 0})`}>
            {(!parsed.params || parsed.params.length === 0) ? (
              <div className="py-4 text-center text-sm text-slate-400 dark:text-white/40">
                No query parameters attached to this URL.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm font-mono">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/40 uppercase tracking-wider text-xs">
                      <th className="py-2.5 pr-4">Parameter Key</th>
                      <th className="py-2.5 px-4">Value</th>
                      <th className="py-2.5 px-4">Attribute</th>
                      <th className="py-2.5 pl-4 text-right">Copy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {parsed.params.map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-white/5">
                        <td className="py-2.5 pr-4 text-[#0071e3] dark:text-blue-400 font-semibold">{p.key}</td>
                        <td className="py-2.5 px-4 text-slate-800 dark:text-white break-all">{p.value}</td>
                        <td className="py-2.5 px-4">
                          {p.isTracker ? (
                            <span className="text-[11px] font-sans px-2 py-0.5 rounded border border-slate-300 dark:border-white/20 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white/80 font-medium">
                              Ad / Analytics Tracker
                            </span>
                          ) : (
                            <span className="text-slate-400 dark:text-white/40 text-xs font-sans">Application Data</span>
                          )}
                        </td>
                        <td className="py-2.5 pl-4 text-right">
                          <CopyButton text={`${p.key}=${p.value}`} label="Copy" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </ResultCard>
        </div>
      )}
    </div>
  );
}
