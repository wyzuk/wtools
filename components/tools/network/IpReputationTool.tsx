"use client";

import React, { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { ResultCard } from "@/components/ResultCard";
import { useUsage } from "@/components/UsageContext";
import { UsageLimitBanner } from "@/components/UsageLimitBanner";

interface ReputationData {
  ip: string;
  isBogon: boolean;
  bogonReason: string | null;
  reverseDns: string[];
  isp: string | null;
  org: string | null;
  asn: string | null;
  country: string | null;
  threatLevel: string;
}

export function IpReputationTool() {
  const [ip, setIp] = useState("1.1.1.1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ReputationData | null>(null);
  const { limitReached, recordToolUsage } = useUsage();

  const checkReputation = async (target = ip) => {
    if (!target.trim() || limitReached) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/ip-reputation?ip=${encodeURIComponent(target.trim())}`);
      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || "Check failed.");
      }
      setData(json);
      await recordToolUsage();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Reputation check failed.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkReputation();
  };

  const items = data
    ? [
        { label: "IP Address", value: data.ip, copyValue: data.ip, mono: true },
        {
          label: "Bogon Status",
          value: data.isBogon ? (
            <span className="font-mono text-slate-900 dark:text-white bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded border border-slate-200 dark:border-white/20">
              Bogon / Reserved ({data.bogonReason})
            </span>
          ) : (
            <span className="text-[#0071e3] dark:text-blue-400 font-medium">Standard Public Routable IP</span>
          ),
        },
        { label: "Classification", value: data.threatLevel },
        {
          label: "Reverse DNS Hostnames",
          value: Array.isArray(data.reverseDns) && data.reverseDns.length > 0 ? data.reverseDns.join(", ") : "None",
          mono: true,
        },
        { label: "ISP / Network", value: data.isp || "N/A" },
        { label: "Organization", value: data.org || "N/A" },
        { label: "ASN", value: data.asn || "N/A", mono: true },
        { label: "Country", value: data.country || "N/A" },
      ]
    : [];

  return (
    <div className="space-y-6">
      {limitReached && <UsageLimitBanner />}

      <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-white/10 rounded-2xl space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_-4px_rgba(0,0,0,0.05)] transition-colors">
        <div>
          <label htmlFor="rep-ip" className="block text-xs font-semibold text-slate-700 dark:text-white/70 mb-2 uppercase tracking-wider font-mono">
            IP Address
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="rep-ip"
              type="text"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              placeholder="e.g. 1.1.1.1, 10.0.0.1, 127.0.0.1"
              disabled={limitReached}
              className="w-full bg-white dark:bg-black border border-slate-300 dark:border-white/20 rounded-lg px-4 py-2.5 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:border-blue-500 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || limitReached}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#0071e3] hover:bg-[#0077ed] active:scale-95 disabled:opacity-50 text-white text-sm font-medium transition-colors shadow-sm shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>{loading ? "Checking..." : "Check reputation"}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-white/50">
          <span>Test cases:</span>
          {["1.1.1.1 (Public)", "10.0.0.1 (Private)", "127.0.0.1 (Loopback)", "100.64.0.1 (CGNAT)", "8.8.8.8 (Google)"].map(
            (preset) => (
              <button
                key={preset}
                type="button"
                disabled={limitReached}
                onClick={() => {
                  const targetIp = preset.split(" ")[0];
                  setIp(targetIp);
                  checkReputation(targetIp);
                }}
                className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-white/70 hover:border-blue-500 hover:text-[#0071e3] dark:hover:text-white transition-colors disabled:opacity-50"
              >
                {preset}
              </button>
            )
          )}
        </div>
      </form>

      {error && (
        <div className="p-4 bg-white dark:bg-[#1c1c1e] border border-slate-300 dark:border-white/20 rounded-lg text-sm text-slate-800 dark:text-white">
          <span className="font-semibold text-slate-900 dark:text-white mr-2">Notice:</span>
          {error}
        </div>
      )}

      {data && (
        <ResultCard
          title={`IP Reputation Report: ${data.ip}`}
          items={items}
          rawJson={data}
        />
      )}
    </div>
  );
}
