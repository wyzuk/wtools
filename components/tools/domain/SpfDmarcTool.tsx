"use client";

import React, { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { ResultCard } from "@/components/ResultCard";
import { CopyButton } from "@/components/CopyButton";
import { useUsage } from "@/components/UsageContext";
import { UsageLimitBanner } from "@/components/UsageLimitBanner";

interface SpfDmarcResult {
  domain: string;
  spfRecord: string | null;
  spfPolicy: string | null;
  dmarcRecord: string | null;
  dmarcPolicy: string | null;
  dmarcRua: string | null;
  raw: unknown;
}

export function SpfDmarcTool() {
  const [domain, setDomain] = useState("google.com");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SpfDmarcResult | null>(null);
  const { limitReached, recordToolUsage } = useUsage();

  const analyzeEmailAuth = async (target = domain) => {
    if (!target.trim() || limitReached) return;
    setLoading(true);
    setError(null);

    const clean = target.replace(/^https?:\/\//i, "").replace(/\/.*$/, "").trim();

    try {
      const spfRes = await fetch(`/api/dns?name=${encodeURIComponent(clean)}&type=TXT`);
      const spfJson = await spfRes.json();

      const dmarcRes = await fetch(`/api/dns?name=${encodeURIComponent(`_dmarc.${clean}`)}&type=TXT`);
      const dmarcJson = await dmarcRes.json();

      let spfRecord: string | null = null;
      let spfPolicy: string | null = null;

      if (Array.isArray(spfJson.answers)) {
        for (const ans of spfJson.answers) {
          const text = String(ans?.data || "").replace(/^"|"$/g, "");
          if (text.startsWith("v=spf1")) {
            spfRecord = text;
            if (text.includes("-all")) spfPolicy = "Hard Fail (-all) - Strict Enforcement";
            else if (text.includes("~all")) spfPolicy = "Soft Fail (~all) - Moderate";
            else if (text.includes("?all")) spfPolicy = "Neutral (?all) - Permissive";
            else if (text.includes("+all")) spfPolicy = "Pass (+all) - Insecure";
            break;
          }
        }
      }

      let dmarcRecord: string | null = null;
      let dmarcPolicy: string | null = null;
      let dmarcRua: string | null = null;

      if (Array.isArray(dmarcJson.answers)) {
        for (const ans of dmarcJson.answers) {
          const text = String(ans?.data || "").replace(/^"|"$/g, "");
          if (text.startsWith("v=DMARC1")) {
            dmarcRecord = text;
            const pMatch = text.match(/p=([^;\s]+)/i);
            if (pMatch) {
              const pVal = pMatch[1].toLowerCase();
              dmarcPolicy =
                pVal === "reject"
                  ? "p=reject (Full Enforcement / High Security)"
                  : pVal === "quarantine"
                  ? "p=quarantine (Spam Quarantine)"
                  : "p=none (Monitoring Only / No Enforcement)";
            }
            const ruaMatch = text.match(/rua=([^;\s]+)/i);
            if (ruaMatch) dmarcRua = ruaMatch[1];
            break;
          }
        }
      }

      setData({
        domain: clean,
        spfRecord,
        spfPolicy,
        dmarcRecord,
        dmarcPolicy,
        dmarcRua,
        raw: { spf: spfJson, dmarc: dmarcJson },
      });

      await recordToolUsage();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Analysis failed.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    analyzeEmailAuth();
  };

  return (
    <div className="space-y-6">
      {limitReached && <UsageLimitBanner />}

      <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-white/10 rounded-2xl space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_-4px_rgba(0,0,0,0.05)] transition-colors">
        <div>
          <label htmlFor="email-domain" className="block text-xs font-semibold text-slate-700 dark:text-white/70 mb-2 uppercase tracking-wider font-mono">
            Domain Name to Inspect
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="email-domain"
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g. google.com, github.com"
              disabled={limitReached}
              className="w-full bg-white dark:bg-black border border-slate-300 dark:border-white/20 rounded-lg px-4 py-2.5 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:border-blue-500 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || limitReached}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#0071e3] hover:bg-[#0077ed] active:scale-95 disabled:opacity-50 text-white text-sm font-medium transition-colors shadow-sm shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>{loading ? "Inspecting..." : "Check SPF & DMARC"}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-white/50">
          <span>Examples:</span>
          {["google.com", "github.com", "cloudflare.com", "microsoft.com"].map((preset) => (
            <button
              key={preset}
              type="button"
              disabled={limitReached}
              onClick={() => {
                setDomain(preset);
                analyzeEmailAuth(preset);
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

      {data && (
        <div className="space-y-6">
          <ResultCard title={`Sender Policy Framework (SPF): ${data.domain}`}>
            {data.spfRecord ? (
              <div className="space-y-3.5">
                <div className="p-4 bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg font-mono text-xs sm:text-sm text-slate-900 dark:text-white/90 break-all flex items-start justify-between gap-3">
                  <span>{data.spfRecord}</span>
                  <CopyButton text={data.spfRecord} label="Copy" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-slate-500 dark:text-white/40">SPF Enforcement: </span>
                    <span className="text-[#0071e3] dark:text-blue-400 font-semibold">{data.spfPolicy || "Detected"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-white/40">Status: </span>
                    <span className="text-slate-900 dark:text-white font-medium">Active record configured</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-5 text-sm text-slate-600 dark:text-white/60 bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg">
                No SPF record found for this domain. Email sent from this domain cannot be authenticated by receiving servers.
              </div>
            )}
          </ResultCard>

          <ResultCard title={`DMARC Policy: _dmarc.${data.domain}`}>
            {data.dmarcRecord ? (
              <div className="space-y-3.5">
                <div className="p-4 bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg font-mono text-xs sm:text-sm text-slate-900 dark:text-white/90 break-all flex items-start justify-between gap-3">
                  <span>{data.dmarcRecord}</span>
                  <CopyButton text={data.dmarcRecord} label="Copy" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-slate-500 dark:text-white/40">Policy Mode: </span>
                    <span className="text-[#0071e3] dark:text-blue-400 font-semibold">{data.dmarcPolicy || "Configured"}</span>
                  </div>
                  {data.dmarcRua && (
                    <div>
                      <span className="text-slate-500 dark:text-white/40">Reports: </span>
                      <span className="text-slate-900 dark:text-white break-all font-mono text-xs">{data.dmarcRua}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-5 text-sm text-slate-600 dark:text-white/60 bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg">
                No DMARC policy record found for this domain. Spammers could potentially spoof emails from this domain.
              </div>
            )}
          </ResultCard>
        </div>
      )}
    </div>
  );
}
