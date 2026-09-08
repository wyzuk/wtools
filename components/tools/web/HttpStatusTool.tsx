"use client";

import React, { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { ResultCard } from "@/components/ResultCard";
import { useUsage } from "@/components/UsageContext";
import { UsageLimitBanner } from "@/components/UsageLimitBanner";

interface StatusCheckResult {
  url: string;
  finalUrl: string;
  status: number;
  statusText: string;
  redirected: boolean;
  latencyMs: number;
  server: string;
  contentType: string | null;
}

export function HttpStatusTool() {
  const [url, setUrl] = useState("https://httpbin.org/status/200");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<StatusCheckResult | null>(null);
  const { limitReached, recordToolUsage } = useUsage();

  const checkStatus = async (target = url) => {
    if (!target.trim() || limitReached) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/http-headers?url=${encodeURIComponent(target.trim())}`);
      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || "Failed to reach endpoint.");
      }
      setResult(json);
      await recordToolUsage();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Request failed.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkStatus();
  };

  const items = result
    ? [
        {
          label: "HTTP Status Code",
          value: (
            <span className="font-mono text-xs sm:text-sm font-bold text-[#0071e3] dark:text-blue-400 bg-slate-100 dark:bg-white/10 px-2.5 py-1 rounded border border-slate-200 dark:border-white/10">
              {result.status} {result.statusText}
            </span>
          ),
          copyValue: `${result.status} ${result.statusText}`,
          mono: true,
        },
        { label: "Target URL", value: result.url, copyValue: result.url, mono: true },
        { label: "Final Resolved URL", value: result.finalUrl, copyValue: result.finalUrl, mono: true },
        {
          label: "Redirect Detected?",
          value: result.redirected ? "Yes (Redirect chain followed)" : "No (Direct response)",
        },
        { label: "Round-Trip Latency", value: `${result.latencyMs} ms`, mono: true },
        { label: "Server Technology", value: result.server },
        { label: "Declared Content-Type", value: result.contentType || "Unspecified", mono: true },
      ]
    : [];

  return (
    <div className="space-y-6">
      {limitReached && <UsageLimitBanner />}

      <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-white/10 rounded-2xl space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_-4px_rgba(0,0,0,0.05)] transition-colors">
        <div>
          <label htmlFor="status-url" className="block text-xs font-semibold text-slate-700 dark:text-white/70 mb-2 uppercase tracking-wider font-mono">
            Target URL to Probe
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="status-url"
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
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#0071e3] hover:bg-[#0077ed] active:scale-95 disabled:opacity-50 text-white text-sm font-medium transition-colors shadow-sm shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>{loading ? "Probing..." : "Probe status"}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-white/50">
          <span>Test status codes:</span>
          {[
            { label: "200 OK", u: "https://httpbin.org/status/200" },
            { label: "301 Moved", u: "https://httpbin.org/status/301" },
            { label: "403 Forbidden", u: "https://httpbin.org/status/403" },
            { label: "404 Not Found", u: "https://httpbin.org/status/404" },
            { label: "500 Server Error", u: "https://httpbin.org/status/500" },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              disabled={limitReached}
              onClick={() => {
                setUrl(item.u);
                checkStatus(item.u);
              }}
              className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-white/70 hover:border-blue-500 hover:text-[#0071e3] dark:hover:text-white transition-colors disabled:opacity-50"
            >
              {item.label}
            </button>
          ))}
        </div>
      </form>

      {error && (
        <div className="p-4 bg-white dark:bg-[#1c1c1e] border border-slate-300 dark:border-white/20 rounded-lg text-sm text-slate-800 dark:text-white">
          <span className="font-semibold text-slate-900 dark:text-white mr-2">Notice:</span>
          {error}
        </div>
      )}

      {result && (
        <ResultCard
          title={`HTTP Status Diagnostic: ${result.status} ${result.statusText}`}
          items={items}
          rawJson={result}
        />
      )}
    </div>
  );
}
