"use client";

import React, { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { ResultCard } from "@/components/ResultCard";
import { useUsage } from "@/components/UsageContext";
import { UsageLimitBanner } from "@/components/UsageLimitBanner";

interface SslData {
  host: string;
  subject: { CN?: string; O?: string; C?: string };
  issuer: { CN?: string; O?: string; C?: string };
  validFrom: string;
  validTo: string;
  daysRemaining: number;
  isExpired: boolean;
  serialNumber: string;
  fingerprint256: string;
  subjectAltName: string[];
  protocol: string | null;
  cipher: { name: string; standardName?: string; version: string } | null;
  authorized: boolean;
}

export function SslInspectorTool() {
  const [host, setHost] = useState("cloudflare.com");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SslData | null>(null);
  const { limitReached, recordToolUsage } = useUsage();

  const inspectSsl = async (target = host) => {
    if (!target.trim() || limitReached) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/ssl?host=${encodeURIComponent(target.trim())}`);
      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || "SSL inspection failed.");
      }
      setData(json);
      await recordToolUsage();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Handshake failed.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    inspectSsl();
  };

  const items = data
    ? [
        { label: "Host / Common Name (CN)", value: data.subject?.CN || data.host, copyValue: data.subject?.CN || data.host, mono: true },
        { label: "Issuer Certificate Authority", value: [data.issuer?.O, data.issuer?.CN].filter(Boolean).join(" - ") || "Unknown" },
        {
          label: "Certificate Status",
          value: data.isExpired ? (
            <span className="font-mono text-slate-800 dark:text-white bg-slate-200 dark:bg-white/10 px-2.5 py-1 rounded border border-slate-300 dark:border-white/20 text-xs font-semibold">
              EXPIRED ({Math.abs(data.daysRemaining)} days ago)
            </span>
          ) : (
            <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold text-xs">
              VALID ({data.daysRemaining} days remaining)
            </span>
          ),
        },
        { label: "Valid From", value: data.validFrom, mono: true },
        { label: "Valid Until", value: data.validTo, mono: true },
        { label: "Negotiated Protocol", value: data.protocol || "TLS 1.3", mono: true },
        { label: "Cipher Suite", value: data.cipher?.name || "N/A", mono: true },
        { label: "Serial Number", value: data.serialNumber, copyValue: data.serialNumber, mono: true },
        { label: "SHA-256 Fingerprint", value: data.fingerprint256, copyValue: data.fingerprint256, mono: true },
        {
          label: "Subject Alternative Names (SANs)",
          value: data.subjectAltName.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-2 bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg">
              {data.subjectAltName.map((san, idx) => (
                <span key={idx} className="text-xs font-mono text-slate-700 dark:text-white/80 px-2 py-0.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded">
                  {san}
                </span>
              ))}
            </div>
          ) : (
            "None"
          ),
          copyValue: data.subjectAltName.join(", "),
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      {limitReached && <UsageLimitBanner />}

      <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-[#0d0d0d] border border-slate-200 dark:border-white/10 rounded-xl space-y-4 shadow-sm dark:shadow-none transition-colors">
        <div>
          <label htmlFor="ssl-host" className="block text-xs font-semibold text-slate-700 dark:text-white/70 mb-2 uppercase tracking-wider font-mono">
            Domain or Hostname
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="ssl-host"
              type="text"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="e.g. google.com, github.com, wasee.dev"
              disabled={limitReached}
              className="w-full bg-white dark:bg-black border border-slate-300 dark:border-white/20 rounded-lg px-4 py-2.5 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:border-blue-500 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || limitReached}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-medium transition-colors shadow-sm shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>{loading ? "Inspecting..." : "Inspect certificate"}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-white/50">
          <span>Examples:</span>
          {["cloudflare.com", "google.com", "github.com", "wasee.dev"].map((preset) => (
            <button
              key={preset}
              type="button"
              disabled={limitReached}
              onClick={() => {
                setHost(preset);
                inspectSsl(preset);
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
          title={`SSL / TLS Certificate: ${data.host}`}
          items={items}
          rawJson={data}
        />
      )}
    </div>
  );
}
