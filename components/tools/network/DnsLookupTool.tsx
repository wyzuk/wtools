"use client";

import React, { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { ResultCard } from "@/components/ResultCard";
import { CopyButton } from "@/components/CopyButton";
import { useUsage } from "@/components/UsageContext";
import { UsageLimitBanner } from "@/components/UsageLimitBanner";

const RECORD_TYPES = ["A", "AAAA", "CNAME", "MX", "TXT", "NS", "SOA", "CAA", "PTR", "SRV"];

interface DnsAnswer {
  name: string;
  type: number;
  typeName: string;
  TTL: number;
  data: string;
}

interface DnsData {
  query: { name: string; type: string };
  status: number;
  statusMessage: string;
  dnssec: boolean;
  truncated: boolean;
  answers: DnsAnswer[];
  authorities: DnsAnswer[];
  raw: unknown;
}

export function DnsLookupTool() {
  const [domain, setDomain] = useState("google.com");
  const [recordType, setRecordType] = useState("A");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DnsData | null>(null);
  const { limitReached, recordToolUsage } = useUsage();

  const resolveDns = async (targetDomain = domain, targetType = recordType) => {
    if (!targetDomain.trim() || limitReached) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/dns?name=${encodeURIComponent(targetDomain.trim())}&type=${encodeURIComponent(
          targetType
        )}`
      );
      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || "DNS resolution failed.");
      }
      setData(json);
      await recordToolUsage();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "DNS resolution error.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resolveDns();
  };

  return (
    <div className="space-y-6">
      {limitReached && <UsageLimitBanner />}

      <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-white/10 rounded-2xl space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_-4px_rgba(0,0,0,0.05)] transition-colors">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-3">
            <label htmlFor="dns-domain" className="block text-xs font-semibold text-slate-700 dark:text-white/70 mb-2 uppercase tracking-wider font-mono">
              Domain or Hostname
            </label>
            <input
              id="dns-domain"
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g. example.com, cloudflare.com"
              disabled={limitReached}
              className="w-full bg-white dark:bg-black border border-slate-300 dark:border-white/20 rounded-lg px-4 py-2.5 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:border-blue-500 disabled:opacity-60"
            />
          </div>

          <div>
            <label htmlFor="dns-type" className="block text-xs font-semibold text-slate-700 dark:text-white/70 mb-2 uppercase tracking-wider font-mono">
              Record Type
            </label>
            <select
              id="dns-type"
              value={recordType}
              disabled={limitReached}
              onChange={(e) => {
                setRecordType(e.target.value);
                if (domain.trim()) resolveDns(domain, e.target.value);
              }}
              className="w-full bg-white dark:bg-black border border-slate-300 dark:border-white/20 rounded-lg px-3 py-2.5 text-sm font-mono text-slate-900 dark:text-white focus:border-blue-500 disabled:opacity-60"
            >
              {RECORD_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-white/50">
            <span>Examples:</span>
            {["google.com", "cloudflare.com", "github.com", "wikipedia.org"].map((preset) => (
              <button
                key={preset}
                type="button"
                disabled={limitReached}
                onClick={() => {
                  setDomain(preset);
                  resolveDns(preset, recordType);
                }}
                className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-white/70 hover:border-blue-500 hover:text-[#0071e3] dark:hover:text-white transition-colors disabled:opacity-50"
              >
                {preset}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || limitReached}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#0071e3] hover:bg-[#0077ed] active:scale-95 disabled:opacity-50 text-white text-sm font-medium transition-colors shadow-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>{loading ? "Resolving..." : "Resolve DNS"}</span>
          </button>
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
          title={`DNS Resolution: ${data.query.name} (${data.query.type})`}
          rawJson={data.raw}
        >
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4 text-sm font-sans border-b border-slate-200 dark:border-white/10 pb-3">
              <div>
                <span className="text-slate-500 dark:text-white/40">Status: </span>
                <span className="text-slate-900 dark:text-white font-semibold">{data.statusMessage}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-white/40">DNSSEC: </span>
                <span className={data.dnssec ? "text-[#0071e3] dark:text-blue-400 font-medium" : "text-slate-700 dark:text-white/60"}>
                  {data.dnssec ? "Validated (AD)" : "Not Signed"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-white/40">Answers: </span>
                <span className="text-slate-900 dark:text-white">
                  {Array.isArray(data.answers) ? data.answers.length : 0}
                </span>
              </div>
            </div>

            {(!Array.isArray(data.answers) || data.answers.length === 0) ? (
              <p className="text-sm text-slate-500 dark:text-white/50 py-6 text-center font-sans">
                No {data.query.type} records found for this host.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm font-sans">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/40 text-xs uppercase font-mono">
                      <th className="py-2.5 pr-4">Name</th>
                      <th className="py-2.5 px-4">Type</th>
                      <th className="py-2.5 px-4">TTL</th>
                      <th className="py-2.5 px-4">Data / Target</th>
                      <th className="py-2.5 pl-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono text-xs sm:text-sm">
                    {data.answers.map((record, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-white/5">
                        <td className="py-3 pr-4 text-slate-700 dark:text-white/70 max-w-xs truncate">{record.name}</td>
                        <td className="py-3 px-4 text-[#0071e3] dark:text-blue-400 font-bold">{record.typeName}</td>
                        <td className="py-3 px-4 text-slate-500 dark:text-white/50">{record.TTL}s</td>
                        <td className="py-3 px-4 text-slate-900 dark:text-white font-medium break-all">{record.data}</td>
                        <td className="py-3 pl-4 text-right">
                          <CopyButton text={record.data} label="Copy" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </ResultCard>
      )}
    </div>
  );
}
