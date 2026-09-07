"use client";

import React, { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { ResultCard } from "@/components/ResultCard";
import { useUsage } from "@/components/UsageContext";
import { UsageLimitBanner } from "@/components/UsageLimitBanner";

interface CountryDetails {
  name: { common: string; official: string };
  cca2: string;
  cca3: string;
  capital?: string[];
  region: string;
  subregion?: string;
  population: number;
  currencies?: Record<string, { name: string; symbol: string }>;
  languages?: Record<string, string>;
  timezones?: string[];
  tld?: string[];
  idd?: { root: string; suffixes?: string[] };
}

export function CountryInfoTool() {
  const [query, setQuery] = useState("Canada");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CountryDetails | null>(null);
  const { limitReached, recordToolUsage } = useUsage();

  const lookupCountry = async (name = query) => {
    if (!name.trim() || limitReached) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(name.trim())}`);
      if (!res.ok) {
        throw new Error(`Country "${name}" not found in REST Countries registry.`);
      }
      const json = await res.json();
      if (!Array.isArray(json) || json.length === 0) {
        throw new Error("No matching country found.");
      }
      setData(json[0]);
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
    lookupCountry();
  };

  const items = data
    ? [
        { label: "Common Name", value: data.name.common, copyValue: data.name.common },
        { label: "Official Name", value: data.name.official },
        { label: "ISO 3166-1 (Alpha-2 / Alpha-3)", value: `${data.cca2} / ${data.cca3}`, mono: true },
        { label: "Capital City", value: data.capital?.join(", ") || "N/A" },
        { label: "Region & Subregion", value: [data.region, data.subregion].filter(Boolean).join(" • ") },
        { label: "Total Population", value: data.population.toLocaleString(), mono: true },
        {
          label: "Currency",
          value: data.currencies
            ? Object.values(data.currencies)
                .map((c) => `${c.name} (${c.symbol || ""})`)
                .join(", ")
            : "N/A",
        },
        {
          label: "Official Languages",
          value: data.languages ? Object.values(data.languages).join(", ") : "N/A",
        },
        {
          label: "Top-Level Domain (TLD)",
          value: data.tld?.join(", ") || "N/A",
          mono: true,
        },
        {
          label: "Timezones",
          value: data.timezones?.join(", ") || "N/A",
          mono: true,
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      {limitReached && <UsageLimitBanner />}

      <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-[#0d0d0d] border border-slate-200 dark:border-white/10 rounded-xl space-y-4 shadow-sm dark:shadow-none transition-colors">
        <div>
          <label htmlFor="country-input" className="block text-xs font-semibold text-slate-700 dark:text-white/70 mb-2 uppercase tracking-wider font-mono">
            Country Name or Code
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="country-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Canada, Germany, Japan, Bangladesh, US"
              disabled={limitReached}
              className="w-full bg-white dark:bg-black border border-slate-300 dark:border-white/20 rounded-lg px-4 py-2.5 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:border-blue-500 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || limitReached}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-medium transition-colors shadow-sm shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>{loading ? "Searching..." : "Explore country"}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-white/50">
          <span>Examples:</span>
          {["Canada", "Germany", "Japan", "Bangladesh", "Brazil"].map((preset) => (
            <button
              key={preset}
              type="button"
              disabled={limitReached}
              onClick={() => {
                setQuery(preset);
                lookupCountry(preset);
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
          title={`Country Intelligence: ${data.name.common}`}
          items={items}
          rawJson={data}
        />
      )}
    </div>
  );
}
