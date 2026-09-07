"use client";

import React, { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { ResultCard } from "@/components/ResultCard";
import { CopyButton } from "@/components/CopyButton";
import { useUsage } from "@/components/UsageContext";
import { UsageLimitBanner } from "@/components/UsageLimitBanner";

interface ParsedMx {
  priority: number;
  server: string;
  ttl: number;
  provider: string;
}

export function MxLookupTool() {
  const [domain, setDomain] = useState("google.com");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [records, setRecords] = useState<ParsedMx[] | null>(null);
  const [raw, setRaw] = useState<unknown>(null);
  const { limitReached, recordToolUsage } = useUsage();

  const detectProvider = (server: string): string => {
    const s = server.toLowerCase();
    if (s.includes("google") || s.includes("aspmx")) return "Google Workspace / Gmail";
    if (s.includes("outlook") || s.includes("microsoft") || s.includes("protection.outlook"))
      return "Microsoft 365 / Exchange";
    if (s.includes("protonmail") || s.includes("proton")) return "ProtonMail";
    if (s.includes("fastmail")) return "Fastmail";
    if (s.includes("zoho")) return "Zoho Mail";
    if (s.includes("icloud") || s.includes("apple")) return "Apple iCloud";
    if (s.includes("mimecast")) return "Mimecast Secure Gateway";
    if (s.includes("barracuda")) return "Barracuda Networks";
    return "Custom / Self-Hosted SMTP";
  };

  const lookupMx = async (target = domain) => {
    if (!target.trim() || limitReached) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/dns?name=${encodeURIComponent(target.trim())}&type=MX`);
      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || "MX resolution failed.");
      }
      setRaw(json);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parsed: ParsedMx[] = (json.answers || []).map((ans: any) => {
        const parts = ans.data.trim().split(/\s+/);
        let priority = 0;
        let server = ans.data;
        if (parts.length >= 2 && !isNaN(Number(parts[0]))) {
          priority = Number(parts[0]);
          server = parts.slice(1).join(" ").replace(/\.$/, "");
        }
        return {
          priority,
          server,
          ttl: ans.TTL,
          provider: detectProvider(server),
        };
      });

      parsed.sort((a, b) => a.priority - b.priority);
      setRecords(parsed);
      await recordToolUsage();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Lookup failed.");
      setRecords(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    lookupMx();
  };

  return (
    <div className="space-y-6">
      {limitReached && <UsageLimitBanner />}

      <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-[#0d0d0d] border border-slate-200 dark:border-white/10 rounded-xl space-y-4 shadow-sm dark:shadow-none transition-colors">
        <div>
          <label htmlFor="mx-domain" className="block text-xs font-semibold text-slate-700 dark:text-white/70 mb-2 uppercase tracking-wider font-mono">
            Domain for Mail Server Lookup
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="mx-domain"
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g. google.com, github.com, microsoft.com"
              disabled={limitReached}
              className="w-full bg-white dark:bg-black border border-slate-300 dark:border-white/20 rounded-lg px-4 py-2.5 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:border-blue-500 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || limitReached}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-medium transition-colors shadow-sm shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>{loading ? "Resolving..." : "Look up MX"}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-white/50">
          <span>Examples:</span>
          {["google.com", "github.com", "microsoft.com", "proton.me", "fastmail.com"].map((preset) => (
            <button
              key={preset}
              type="button"
              disabled={limitReached}
              onClick={() => {
                setDomain(preset);
                lookupMx(preset);
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

      {records && (
        <ResultCard
          title={`Mail Exchanger (MX) Records: ${domain}`}
          rawJson={raw}
        >
          {records.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500 dark:text-white/40">
              No MX records found for this domain. Email cannot be directly delivered to this host.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm font-sans">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/40 text-xs uppercase font-mono">
                    <th className="py-2.5 pr-4">Priority</th>
                    <th className="py-2.5 px-4">Mail Server Hostname</th>
                    <th className="py-2.5 px-4">Detected Provider</th>
                    <th className="py-2.5 px-4">TTL</th>
                    <th className="py-2.5 pl-4 text-right">Copy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono text-xs sm:text-sm">
                  {records.map((r, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-white/5">
                      <td className="py-3 pr-4 text-blue-600 dark:text-blue-400 font-bold">{r.priority}</td>
                      <td className="py-3 px-4 text-slate-900 dark:text-white font-medium break-all">{r.server}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-white/70 font-sans">{r.provider}</td>
                      <td className="py-3 px-4 text-slate-400 dark:text-white/40">{r.ttl}s</td>
                      <td className="py-3 pl-4 text-right">
                        <CopyButton text={r.server} label="Copy" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ResultCard>
      )}
    </div>
  );
}
