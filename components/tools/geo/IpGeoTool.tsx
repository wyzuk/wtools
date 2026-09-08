"use client";

import React, { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { ResultCard } from "@/components/ResultCard";
import { useUsage } from "@/components/UsageContext";
import { UsageLimitBanner } from "@/components/UsageLimitBanner";

export function IpGeoTool() {
  const [query, setQuery] = useState("8.8.8.8");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const { limitReached, recordToolUsage } = useUsage();

  const fetchGeo = async (target = query) => {
    if (!target.trim() || limitReached) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/ip?ip=${encodeURIComponent(target.trim())}`);
      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || "Geolocation lookup failed.");
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
    fetchGeo();
  };

  const items = data
    ? [
        { label: "IP Address", value: data.ip, copyValue: data.ip, mono: true },
        { label: "Country", value: `${data.country_name || data.country} (${data.country_code})` },
        { label: "Region / State", value: data.region || "N/A" },
        { label: "City", value: data.city || "N/A" },
        { label: "Postal / Zip Code", value: data.postal || "N/A", mono: true },
        {
          label: "Coordinates (Latitude, Longitude)",
          value: `${data.latitude}, ${data.longitude}`,
          copyValue: `${data.latitude}, ${data.longitude}`,
          mono: true,
        },
        { label: "Timezone", value: data.timezone || "N/A", mono: true },
        { label: "Currency", value: data.currency || "N/A", mono: true },
        { label: "ISP / Network", value: data.isp || data.org || "N/A" },
      ]
    : [];

  return (
    <div className="space-y-6">
      {limitReached && <UsageLimitBanner />}

      <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-white/10 rounded-2xl space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_-4px_rgba(0,0,0,0.05)] transition-colors">
        <div>
          <label htmlFor="geo-ip" className="block text-xs font-semibold text-slate-700 dark:text-white/70 mb-2 uppercase tracking-wider font-mono">
            IP Address to Geolocate
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="geo-ip"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter IPv4 or IPv6 address..."
              disabled={limitReached}
              className="w-full bg-white dark:bg-black border border-slate-300 dark:border-white/20 rounded-lg px-4 py-2.5 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:border-blue-500 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || limitReached}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#0071e3] hover:bg-[#0077ed] active:scale-95 disabled:opacity-50 text-white text-sm font-medium transition-colors shadow-sm shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>{loading ? "Locating..." : "Geolocate IP"}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-white/50">
          <span>Examples:</span>
          {["8.8.8.8", "1.1.1.1", "9.9.9.9"].map((preset) => (
            <button
              key={preset}
              type="button"
              disabled={limitReached}
              onClick={() => {
                setQuery(preset);
                fetchGeo(preset);
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
        <ResultCard
          title={`Geolocation Metrics: ${data.ip}`}
          items={items}
          rawJson={data.raw}
        />
      )}
    </div>
  );
}
