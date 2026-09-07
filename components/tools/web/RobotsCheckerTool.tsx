"use client";

import React, { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { ResultCard } from "@/components/ResultCard";
import { useUsage } from "@/components/UsageContext";
import { UsageLimitBanner } from "@/components/UsageLimitBanner";

interface RobotsData {
  host: string;
  robotsFound: boolean;
  statusCode?: number;
  content: string | null;
  message?: string;
  stats?: {
    totalLines: number;
    sitemaps: string[];
    disallowRulesCount: number;
    allowRulesCount: number;
  };
}

export function RobotsCheckerTool() {
  const [host, setHost] = useState("github.com");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RobotsData | null>(null);
  const { limitReached, recordToolUsage } = useUsage();

  const checkRobots = async (target = host) => {
    if (!target.trim() || limitReached) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/robots?host=${encodeURIComponent(target.trim())}`);
      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || "Failed to fetch robots.txt.");
      }
      setData(json);
      await recordToolUsage();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Fetch failed.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkRobots();
  };

  return (
    <div className="space-y-6">
      {limitReached && <UsageLimitBanner />}

      <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-[#0d0d0d] border border-slate-200 dark:border-white/10 rounded-xl space-y-4 shadow-sm dark:shadow-none transition-colors">
        <div>
          <label htmlFor="robots-host" className="block text-xs font-semibold text-slate-700 dark:text-white/70 mb-2 uppercase tracking-wider font-mono">
            Domain or Hostname
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="robots-host"
              type="text"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="e.g. github.com, wikipedia.org"
              disabled={limitReached}
              className="w-full bg-white dark:bg-black border border-slate-300 dark:border-white/20 rounded-lg px-4 py-2.5 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:border-blue-500 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || limitReached}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-medium transition-colors shadow-sm shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>{loading ? "Fetching..." : "Fetch robots.txt"}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-white/50">
          <span>Examples:</span>
          {["github.com", "wikipedia.org", "google.com"].map((preset) => (
            <button
              key={preset}
              type="button"
              disabled={limitReached}
              onClick={() => {
                setHost(preset);
                checkRobots(preset);
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
        <div className="space-y-6">
          <ResultCard title={`Robots.txt Analysis: https://${data.host}/robots.txt`}>
            {data.robotsFound && data.stats ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono border-b border-slate-200 dark:border-white/10 pb-4">
                  <div>
                    <span className="text-slate-500 dark:text-white/40 block text-[11px] mb-0.5">HTTP Status</span>
                    <span className="text-slate-900 dark:text-white font-bold text-sm">{data.statusCode} OK</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-white/40 block text-[11px] mb-0.5">Total Lines</span>
                    <span className="text-slate-900 dark:text-white text-sm">{data.stats.totalLines}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-white/40 block text-[11px] mb-0.5">Disallow Rules</span>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">{data.stats.disallowRulesCount}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-white/40 block text-[11px] mb-0.5">Sitemaps</span>
                    <span className="text-slate-900 dark:text-white text-sm">{data.stats.sitemaps.length}</span>
                  </div>
                </div>

                {data.stats.sitemaps.length > 0 && (
                  <div className="p-3 bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg space-y-1">
                    <span className="text-xs font-mono text-slate-500 dark:text-white/50 uppercase block font-semibold">
                      Discovered Sitemaps:
                    </span>
                    {data.stats.sitemaps.map((s, idx) => (
                      <div key={idx} className="text-xs font-mono text-blue-600 dark:text-blue-400 break-all">
                        {s}
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <span className="text-xs font-mono text-slate-500 dark:text-white/50 uppercase block mb-2 font-semibold">
                    Raw File Content:
                  </span>
                  <pre className="p-4 bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg text-xs font-mono text-slate-800 dark:text-white/90 overflow-x-auto max-h-[400px]">
                    {data.content}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="p-4 text-sm text-slate-600 dark:text-white/60 bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg">
                {data.message || "No robots.txt file exists on this host."}
              </div>
            )}
          </ResultCard>
        </div>
      )}
    </div>
  );
}
