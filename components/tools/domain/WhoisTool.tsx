"use client";

import React, { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { ResultCard } from "@/components/ResultCard";
import { useUsage } from "@/components/UsageContext";
import { UsageLimitBanner } from "@/components/UsageLimitBanner";

interface WhoisData {
  target: string;
  handle: string;
  status: string[];
  registrar: string;
  registrarIanaId: string | null;
  creationDate: string | null;
  expirationDate: string | null;
  updatedDate: string | null;
  nameservers: string[];
  port43?: string;
  raw: unknown;
}

export function WhoisTool() {
  const [domain, setDomain] = useState("google.com");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<WhoisData | null>(null);
  const { limitReached, recordToolUsage } = useUsage();

  const fetchWhois = async (target = domain) => {
    if (!target.trim() || limitReached) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/whois?query=${encodeURIComponent(target.trim())}`);
      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || "WHOIS/RDAP query failed.");
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
    fetchWhois();
  };

  const formatDate = (isoStr: string | null) => {
    if (!isoStr) return "N/A";
    try {
      const d = new Date(isoStr);
      return `${d.toUTCString()} (${isoStr})`;
    } catch {
      return isoStr;
    }
  };

  const items = data
    ? [
        { label: "Domain / Host", value: data.target, copyValue: data.target, mono: true },
        { label: "Registrar Name", value: data.registrar },
        { label: "Registrar IANA ID", value: data.registrarIanaId || "N/A", mono: true },
        { label: "Registered On", value: formatDate(data.creationDate), copyValue: data.creationDate || undefined, mono: true },
        { label: "Expires On", value: formatDate(data.expirationDate), copyValue: data.expirationDate || undefined, mono: true },
        { label: "Last Updated", value: formatDate(data.updatedDate), copyValue: data.updatedDate || undefined, mono: true },
        {
          label: "Domain Status",
          value: data.status.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {data.status.map((st, i) => (
                <span key={i} className="font-mono text-xs px-2 py-0.5 rounded border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black text-slate-700 dark:text-white/80">
                  {st}
                </span>
              ))}
            </div>
          ) : (
            "Active / OK"
          ),
        },
        {
          label: "Nameservers",
          value: data.nameservers.length > 0 ? (
            <div className="space-y-1 font-mono text-blue-600 dark:text-blue-400">
              {data.nameservers.map((ns, i) => (
                <div key={i}>{ns}</div>
              ))}
            </div>
          ) : (
            "Not disclosed"
          ),
          copyValue: data.nameservers.join(", "),
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      {limitReached && <UsageLimitBanner />}

      <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-[#0d0d0d] border border-slate-200 dark:border-white/10 rounded-xl space-y-4 shadow-sm dark:shadow-none transition-colors">
        <div>
          <label htmlFor="whois-domain" className="block text-xs font-semibold text-slate-700 dark:text-white/70 mb-2 uppercase tracking-wider font-mono">
            Domain Name or IP Address
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="whois-domain"
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g. google.com, github.com, 1.1.1.1"
              disabled={limitReached}
              className="w-full bg-white dark:bg-black border border-slate-300 dark:border-white/20 rounded-lg px-4 py-2.5 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:border-blue-500 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || limitReached}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-medium transition-colors shadow-sm shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>{loading ? "Querying..." : "Look up WHOIS"}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-white/50">
          <span>Try:</span>
          {["google.com", "github.com", "cloudflare.com", "wasee.dev", "wikipedia.org"].map((preset) => (
            <button
              key={preset}
              type="button"
              disabled={limitReached}
              onClick={() => {
                setDomain(preset);
                fetchWhois(preset);
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
          title={`WHOIS / RDAP Record: ${data.target}`}
          items={items}
          rawJson={data.raw}
        />
      )}
    </div>
  );
}
