"use client";

import React, { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { ResultCard } from "@/components/ResultCard";
import { useUsage } from "@/components/UsageContext";
import { UsageLimitBanner } from "@/components/UsageLimitBanner";

interface AsnData {
  asn: number;
  name: string;
  description: string;
  country_code: string;
  owner: string[];
  rir_name: string;
  iana_assignment_status: string;
  ipv4_prefixes: number;
  ipv6_prefixes: number;
  upstreams_count: number;
  downstreams_count: number;
  raw: unknown;
}

export function AsnLookupTool() {
  const [asnInput, setAsnInput] = useState("15169");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AsnData | null>(null);
  const { limitReached, recordToolUsage } = useUsage();

  const fetchAsn = async (target = asnInput) => {
    if (!target.trim() || limitReached) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/asn?asn=${encodeURIComponent(target.trim())}`);
      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || "ASN lookup failed.");
      }
      setData(json);
      await recordToolUsage();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Lookup failed.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAsn();
  };

  const items = data
    ? [
        { label: "Autonomous System", value: `AS${data.asn}`, copyValue: `AS${data.asn}`, mono: true },
        { label: "Network Name / Holder", value: data.name },
        { label: "Description", value: data.description || "N/A" },
        { label: "Country Code", value: data.country_code || "N/A", mono: true },
        { label: "Regional Registry (RIR)", value: data.rir_name || "N/A", mono: true },
        { label: "Announced IPv4 Prefixes", value: data.ipv4_prefixes != null ? data.ipv4_prefixes.toLocaleString() : "N/A", mono: true },
        { label: "Announced IPv6 Prefixes", value: data.ipv6_prefixes != null ? data.ipv6_prefixes.toLocaleString() : "N/A", mono: true },
        { label: "Upstream Peers", value: data.upstreams_count != null ? data.upstreams_count.toLocaleString() : "N/A", mono: true },
        { label: "Status", value: data.iana_assignment_status || "N/A" },
      ]
    : [];

  return (
    <div className="space-y-6">
      {limitReached && <UsageLimitBanner />}

      <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-white/10 rounded-2xl space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_-4px_rgba(0,0,0,0.05)] transition-colors">
        <div>
          <label htmlFor="asn-input" className="block text-xs font-semibold text-slate-700 dark:text-white/70 mb-2 uppercase tracking-wider font-mono">
            Autonomous System Number (ASN)
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="asn-input"
              type="text"
              value={asnInput}
              onChange={(e) => setAsnInput(e.target.value)}
              placeholder="e.g. 15169 or AS13335"
              disabled={limitReached}
              className="w-full bg-white dark:bg-black border border-slate-300 dark:border-white/20 rounded-lg px-4 py-2.5 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:border-blue-500 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || limitReached}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#0071e3] hover:bg-[#0077ed] active:scale-95 disabled:opacity-50 text-white text-sm font-medium transition-colors shadow-sm shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>{loading ? "Inspecting..." : "Look up ASN"}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-white/50">
          <span>Popular ASNs:</span>
          {[
            { label: "Google (AS15169)", val: "15169" },
            { label: "Cloudflare (AS13335)", val: "13335" },
            { label: "Meta (AS32934)", val: "32934" },
            { label: "Amazon AWS (AS16509)", val: "16509" },
            { label: "Microsoft (AS8075)", val: "8075" },
          ].map((item) => (
            <button
              key={item.val}
              type="button"
              disabled={limitReached}
              onClick={() => {
                setAsnInput(item.val);
                fetchAsn(item.val);
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

      {data && (
        <ResultCard
          title={`ASN Details: AS${data.asn} (${data.name})`}
          items={items}
          rawJson={data.raw}
        />
      )}
    </div>
  );
}
