"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Loader2 } from "lucide-react";
import { ResultCard } from "@/components/ResultCard";
import { useUsage } from "@/components/UsageContext";
import { UsageLimitBanner } from "@/components/UsageLimitBanner";

interface IpLookupData {
  ip: string;
  version?: string;
  city?: string;
  region?: string;
  country_name?: string;
  country_code?: string;
  continent_code?: string;
  postal?: string;
  latitude?: number;
  longitude?: number;
  asn?: string;
  org?: string;
  isp?: string;
  timezone?: string;
  utc_offset?: string;
  currency?: string;
  languages?: string;
  source?: string;
  raw?: unknown;
}

export function IpLookupTool({ initialIp = "" }: { initialIp?: string }) {
  const [ipInput, setIpInput] = useState(initialIp);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<IpLookupData | null>(null);
  const { limitReached, recordToolUsage } = useUsage();
  const hasInitialized = useRef(false);

  const fetchIp = async (queryIp: string, isInitialLoad = false) => {
    if (!isInitialLoad && limitReached) return;

    setLoading(true);
    setError(null);
    try {
      const endpoint = queryIp.trim()
        ? `/api/ip?ip=${encodeURIComponent(queryIp.trim())}`
        : "/api/ip";
      const res = await fetch(endpoint);
      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || "Lookup failed.");
      }
      setData(json);
      if (!queryIp.trim() && json.ip) {
        setIpInput(json.ip);
      }

      // Record 1 use ONLY on user action (not on initial view)
      if (!isInitialLoad) {
        await recordToolUsage();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Lookup failed.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      fetchIp(initialIp, true);
    }
  }, [initialIp]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchIp(ipInput, false);
  };

  const items = data
    ? [
        { label: "IP Address", value: data.ip, copyValue: data.ip, mono: true },
        { label: "IP Version", value: data.version || "IPv4", mono: true },
        {
          label: "Location",
          value: [data.city, data.region, data.country_name].filter(Boolean).join(", "),
        },
        { label: "Country Code", value: data.country_code, mono: true },
        {
          label: "Coordinates (Lat, Long)",
          value: data.latitude && data.longitude ? `${data.latitude}, ${data.longitude}` : "N/A",
          copyValue: data.latitude && data.longitude ? `${data.latitude}, ${data.longitude}` : undefined,
          mono: true,
        },
        { label: "ISP / Network", value: data.isp || data.org || "N/A" },
        { label: "Organization", value: data.org || "N/A" },
        { label: "Autonomous System (ASN)", value: data.asn || "N/A", copyValue: data.asn, mono: true },
        { label: "Postal Code", value: data.postal || "N/A", mono: true },
        {
          label: "Timezone",
          value: data.timezone ? `${data.timezone} (${data.utc_offset || "UTC"})` : "N/A",
          mono: true,
        },
        { label: "Local Currency", value: data.currency || "N/A", mono: true },
      ]
    : [];

  return (
    <div className="space-y-6">
      {limitReached && <UsageLimitBanner />}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-white/10 rounded-2xl space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_-4px_rgba(0,0,0,0.05)] transition-colors">
        <div>
          <label htmlFor="ip-input" className="block text-xs font-semibold text-slate-700 dark:text-white/70 mb-2 uppercase tracking-wider font-mono">
            IP Address or Hostname
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="ip-input"
              type="text"
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              placeholder="Enter IPv4 or IPv6 (leave empty for your own IP)..."
              disabled={limitReached}
              className="w-full bg-white dark:bg-black border border-slate-300 dark:border-white/20 rounded-lg px-4 py-2.5 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:border-blue-500 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || limitReached}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#0071e3] hover:bg-[#0077ed] active:scale-95 disabled:opacity-50 text-white text-sm font-medium transition-colors shadow-sm shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>{loading ? "Looking up..." : "Look up IP"}</span>
            </button>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500 dark:text-white/50">
          <span>Presets:</span>
          {["My Current IP", "8.8.8.8", "1.1.1.1", "9.9.9.9", "208.67.222.222"].map((preset) => (
            <button
              key={preset}
              type="button"
              disabled={limitReached}
              onClick={() => {
                if (preset === "My Current IP") {
                  setIpInput("");
                  fetchIp("", false);
                } else {
                  setIpInput(preset);
                  fetchIp(preset, false);
                }
              }}
              className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-white/70 hover:border-blue-500 hover:text-[#0071e3] dark:hover:text-white transition-colors disabled:opacity-50"
            >
              {preset}
            </button>
          ))}
        </div>
      </form>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-white dark:bg-[#1c1c1e] border border-slate-300 dark:border-white/20 rounded-lg text-sm text-slate-800 dark:text-white">
          <span className="font-semibold text-slate-900 dark:text-white mr-2">Notice:</span>
          {error}
        </div>
      )}

      {/* Results */}
      {data && (
        <ResultCard
          title={`IP Intelligence: ${data.ip}`}
          items={items}
          rawJson={data.raw}
        />
      )}
    </div>
  );
}
