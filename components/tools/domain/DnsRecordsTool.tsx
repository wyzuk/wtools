"use client";

import React, { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { ResultCard } from "@/components/ResultCard";
import { CopyButton } from "@/components/CopyButton";
import { useUsage } from "@/components/UsageContext";
import { UsageLimitBanner } from "@/components/UsageLimitBanner";

const SCAN_TYPES = ["A", "AAAA", "MX", "TXT", "NS", "CNAME", "SOA"];

interface RecordResult {
  type: string;
  answers: { TTL: number; data: string }[];
  status: string;
}

export function DnsRecordsTool() {
  const [domain, setDomain] = useState("cloudflare.com");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<RecordResult[] | null>(null);
  const { limitReached, recordToolUsage } = useUsage();

  const scanAllRecords = async (target = domain) => {
    if (!target.trim() || limitReached) return;
    setLoading(true);
    setError(null);

    try {
      const promises = SCAN_TYPES.map(async (t) => {
        try {
          const res = await fetch(
            `/api/dns?name=${encodeURIComponent(target.trim())}&type=${encodeURIComponent(t)}`
          );
          const json = await res.json();
          return {
            type: t,
            answers: (json.answers || []).map((a: { TTL: number; data: string }) => ({
              TTL: a.TTL,
              data: a.data,
            })),
            status: json.statusMessage || "OK",
          };
        } catch {
          return { type: t, answers: [], status: "ERROR" };
        }
      });

      const resList = await Promise.all(promises);
      setResults(resList);
      await recordToolUsage();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Scan failed.");
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    scanAllRecords();
  };

  return (
    <div className="space-y-6">
      {limitReached && <UsageLimitBanner />}

      <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-[#0d0d0d] border border-slate-200 dark:border-white/10 rounded-xl space-y-4 shadow-sm dark:shadow-none transition-colors">
        <div>
          <label htmlFor="scan-domain" className="block text-xs font-semibold text-slate-700 dark:text-white/70 mb-2 uppercase tracking-wider font-mono">
            Domain to Scan
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="scan-domain"
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g. example.com, github.com"
              disabled={limitReached}
              className="w-full bg-white dark:bg-black border border-slate-300 dark:border-white/20 rounded-lg px-4 py-2.5 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:border-blue-500 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || limitReached}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-medium transition-colors shadow-sm shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>{loading ? "Scanning..." : "Scan all records"}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-white/50">
          <span>Examples:</span>
          {["cloudflare.com", "github.com", "google.com", "wasee.dev"].map((preset) => (
            <button
              key={preset}
              type="button"
              disabled={limitReached}
              onClick={() => {
                setDomain(preset);
                scanAllRecords(preset);
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

      {results && (
        <ResultCard
          title={`Complete DNS Snapshot: ${domain}`}
          rawJson={results}
        >
          <div className="space-y-6">
            {results.map((group) => (
              <div key={group.type} className="border border-slate-200 dark:border-white/10 rounded-lg overflow-hidden">
                <div className="px-4 py-2.5 bg-slate-50 dark:bg-black/60 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-blue-600 dark:text-blue-400 font-sans">
                      {group.type} Records
                    </span>
                    <span className="text-xs text-slate-500 dark:text-white/40 font-mono">
                      ({group.answers.length} found)
                    </span>
                  </div>
                </div>
                {group.answers.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-slate-400 dark:text-white/30 italic">
                    No {group.type} records configured.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-white/5 font-mono text-xs sm:text-sm">
                    {group.answers.map((ans, idx) => (
                      <div
                        key={idx}
                        className="px-4 py-2.5 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-white/5"
                      >
                        <div className="text-slate-800 dark:text-white/90 break-all">{ans.data}</div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-slate-400 dark:text-white/40 text-xs">{ans.TTL}s</span>
                          <CopyButton text={ans.data} label="Copy" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ResultCard>
      )}
    </div>
  );
}
