"use client";

import React, { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { ResultCard } from "@/components/ResultCard";
import { CopyButton } from "@/components/CopyButton";
import { useUsage } from "@/components/UsageContext";
import { UsageLimitBanner } from "@/components/UsageLimitBanner";

interface HeaderData {
  url: string;
  finalUrl: string;
  status: number;
  statusText: string;
  redirected: boolean;
  latencyMs: number;
  headers: Record<string, string>;
  contentType?: string;
  server?: string;
}

export function HttpHeadersTool() {
  const [url, setUrl] = useState("https://cloudflare.com");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<HeaderData | null>(null);
  const { limitReached, recordToolUsage } = useUsage();

  const fetchHeaders = async (target = url) => {
    if (!target.trim() || limitReached) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/http-headers?url=${encodeURIComponent(target.trim())}`);
      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || "Failed to inspect HTTP headers.");
      }
      setData(json);
      await recordToolUsage();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Request failed.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHeaders();
  };

  return (
    <div className="space-y-6">
      {limitReached && <UsageLimitBanner />}

      <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-[#0d0d0d] border border-slate-200 dark:border-white/10 rounded-xl space-y-4 shadow-sm dark:shadow-none transition-colors">
        <div>
          <label htmlFor="target-url" className="block text-xs font-semibold text-slate-700 dark:text-white/70 mb-2 uppercase tracking-wider font-mono">
            Target URL
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="target-url"
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
              <span>{loading ? "Inspecting..." : "Inspect headers"}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-white/50">
          <span>Examples:</span>
          {["https://cloudflare.com", "https://github.com", "https://wasee.dev", "https://httpbin.org/get"].map((preset) => (
            <button
              key={preset}
              type="button"
              disabled={limitReached}
              onClick={() => {
                setUrl(preset);
                fetchHeaders(preset);
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
          title={`HTTP Response Headers: ${data.status} ${data.statusText}`}
          rawJson={data.headers}
        >
          <div className="space-y-5">
            {/* Summary Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm font-sans border-b border-slate-200 dark:border-white/10 pb-4">
              <div>
                <span className="text-slate-500 dark:text-white/40 block text-xs">Status Code</span>
                <span className="text-slate-900 dark:text-white font-bold">{data.status} {data.statusText}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-white/40 block text-xs">Server Banner</span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold">{data.server}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-white/40 block text-xs">Latency</span>
                <span className="text-slate-900 dark:text-white">{data.latencyMs} ms</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-white/40 block text-xs">Total Headers</span>
                <span className="text-slate-900 dark:text-white">{Object.keys(data.headers).length}</span>
              </div>
            </div>

            {/* Headers Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm font-sans">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/40 text-xs uppercase font-mono">
                    <th className="py-2.5 pr-4 w-1/3">Header Name</th>
                    <th className="py-2.5 px-4">Value</th>
                    <th className="py-2.5 pl-4 text-right">Copy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono text-xs sm:text-sm">
                  {Object.entries(data.headers).map(([key, val]) => (
                    <tr key={key} className="hover:bg-slate-50 dark:hover:bg-white/5">
                      <td className="py-3 pr-4 text-blue-600 dark:text-blue-400 font-bold break-all">{key}</td>
                      <td className="py-3 px-4 text-slate-900 dark:text-white/90 break-all">{val}</td>
                      <td className="py-3 pl-4 text-right shrink-0">
                        <CopyButton text={`${key}: ${val}`} label="Copy" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ResultCard>
      )}
    </div>
  );
}
