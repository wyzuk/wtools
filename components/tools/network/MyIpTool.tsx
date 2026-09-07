"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw, Loader2 } from "lucide-react";
import { ResultCard } from "@/components/ResultCard";

export function MyIpTool() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [userAgent, setUserAgent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyIp = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ip");
      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || "Failed to detect IP.");
      }
      setData(json);
      if (typeof window !== "undefined") {
        setUserAgent(window.navigator.userAgent);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to detect IP.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyIp();
  }, []);

  const items = data
    ? [
        { label: "Your Public IP", value: data.ip, copyValue: data.ip, mono: true },
        { label: "IP Version", value: data.version || "IPv4", mono: true },
        { label: "ISP / Network", value: data.isp || data.org || "N/A" },
        { label: "ASN", value: data.asn || "N/A", mono: true },
        {
          label: "Approximate Location",
          value: [data.city, data.region, data.country_name].filter(Boolean).join(", "),
        },
        { label: "Country Code", value: data.country_code || "N/A", mono: true },
        { label: "Timezone", value: data.timezone || "N/A", mono: true },
        {
          label: "User-Agent",
          value: userAgent || "Detecting...",
          copyValue: userAgent,
          mono: true,
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="p-7 bg-white dark:bg-[#0d0d0d] border border-slate-200 dark:border-white/10 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-5 shadow-sm dark:shadow-none transition-colors">
        <div>
          <span className="text-xs font-semibold text-slate-500 dark:text-white/50 uppercase tracking-wider block mb-1 font-mono">
            Detected Public IP
          </span>
          <div className="text-3xl sm:text-4xl font-mono font-bold text-slate-900 dark:text-white tracking-tight">
            {loading ? "Detecting..." : data?.ip || "Unavailable"}
          </div>
        </div>

        <button
          type="button"
          onClick={fetchMyIp}
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-medium transition-colors shadow-sm shrink-0"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          <span>Refresh IP</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-white dark:bg-[#0f0f11] border border-slate-300 dark:border-white/20 rounded-lg text-sm text-slate-800 dark:text-white">
          <span className="font-semibold text-slate-900 dark:text-white mr-2">Notice:</span>
          {error}
        </div>
      )}

      {data && (
        <ResultCard
          title="Connection &amp; Network Metadata"
          items={items}
          rawJson={data.raw}
        />
      )}
    </div>
  );
}
