"use client";

import React, { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { ResultCard } from "@/components/ResultCard";
import { useUsage } from "@/components/UsageContext";
import { UsageLimitBanner } from "@/components/UsageLimitBanner";

export function ReverseDnsTool() {
  const [ip, setIp] = useState("8.8.8.8");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ ip: string; ptrDomain: string; hostnames: string[]; raw: unknown } | null>(null);
  const { limitReached, recordToolUsage } = useUsage();

  const formatReverseDns = (inputIp: string): string | null => {
    const clean = inputIp.trim();
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(clean)) {
      const parts = clean.split(".");
      return `${parts[3]}.${parts[2]}.${parts[1]}.${parts[0]}.in-addr.arpa`;
    }
    return null;
  };

  const lookupPtr = async () => {
    if (!ip.trim() || limitReached) return;
    setLoading(true);
    setError(null);

    const ptrDomain = formatReverseDns(ip);
    if (!ptrDomain) {
      setError("Please enter a valid IPv4 address (e.g. 8.8.8.8).");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/dns?name=${encodeURIComponent(ptrDomain)}&type=PTR`);
      const json = await res.json();

      if (!res.ok || json.error) {
        throw new Error(json.error || "Reverse DNS lookup failed.");
      }

      const hostnames = (json.answers || []).map((a: { data: string }) => a.data);

      setResult({
        ip,
        ptrDomain,
        hostnames,
        raw: json,
      });

      await recordToolUsage();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Lookup failed.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    lookupPtr();
  };

  const items = result
    ? [
        { label: "Target IP", value: result.ip, copyValue: result.ip, mono: true },
        { label: "PTR Lookup Query", value: result.ptrDomain, copyValue: result.ptrDomain, mono: true },
        {
          label: "Resolved Hostnames",
          value: Array.isArray(result.hostnames) && result.hostnames.length > 0 ? (
            <div className="space-y-1">
              {result.hostnames.map((h, i) => (
                <div key={i} className="font-mono text-slate-900 dark:text-white font-medium">
                  {h}
                </div>
              ))}
            </div>
          ) : (
            <span className="text-slate-400 dark:text-white/40 italic">No PTR record found</span>
          ),
          copyValue: Array.isArray(result.hostnames) ? result.hostnames.join(", ") : undefined,
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      {limitReached && <UsageLimitBanner />}

      <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-white/10 rounded-2xl space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_-4px_rgba(0,0,0,0.05)] transition-colors">
        <div>
          <label htmlFor="rev-ip" className="block text-xs font-semibold text-slate-700 dark:text-white/70 mb-2 uppercase tracking-wider font-mono">
            IP Address for Reverse DNS
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="rev-ip"
              type="text"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              placeholder="e.g. 8.8.8.8, 1.1.1.1, 9.9.9.9"
              disabled={limitReached}
              className="w-full bg-white dark:bg-black border border-slate-300 dark:border-white/20 rounded-lg px-4 py-2.5 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:border-blue-500 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || limitReached}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#0071e3] hover:bg-[#0077ed] active:scale-95 disabled:opacity-50 text-white text-sm font-medium transition-colors shadow-sm shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>{loading ? "Resolving..." : "Resolve PTR"}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-white/50">
          <span>Presets:</span>
          {["8.8.8.8", "1.1.1.1", "9.9.9.9", "142.250.190.46"].map((preset) => (
            <button
              key={preset}
              type="button"
              disabled={limitReached}
              onClick={() => {
                setIp(preset);
              }}
              className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-white/70 hover:border-blue-500 hover:text-[#0071e3] dark:hover:text-white transition-colors disabled:opacity-50"
            >
              {preset}
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
          title={`Reverse DNS (PTR): ${result.ip}`}
          items={items}
          rawJson={result.raw}
        />
      )}
    </div>
  );
}
