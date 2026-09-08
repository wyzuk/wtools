"use client";

import React, { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { ResultCard } from "@/components/ResultCard";
import { useUsage } from "@/components/UsageContext";
import { UsageLimitBanner } from "@/components/UsageLimitBanner";

interface MetadataResult {
  url: string;
  title: string;
  description: string;
  canonical: string | null;
  favicon: string;
  openGraph: {
    title: string | null;
    description: string | null;
    image: string | null;
    type: string | null;
  };
  twitter: {
    card: string | null;
    title: string | null;
    description: string | null;
    image: string | null;
  };
}

export function MetadataInspectorTool() {
  const [url, setUrl] = useState("https://github.com");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<MetadataResult | null>(null);
  const { limitReached, recordToolUsage } = useUsage();

  const inspectMeta = async (target = url) => {
    if (!target.trim() || limitReached) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/metadata?url=${encodeURIComponent(target.trim())}`);
      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || "Failed to extract metadata.");
      }
      setData(json);
      await recordToolUsage();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Scraping failed.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    inspectMeta();
  };

  return (
    <div className="space-y-6">
      {limitReached && <UsageLimitBanner />}

      <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-white/10 rounded-2xl space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_-4px_rgba(0,0,0,0.05)] transition-colors">
        <div>
          <label htmlFor="meta-url" className="block text-xs font-semibold text-slate-700 dark:text-white/70 mb-2 uppercase tracking-wider font-mono">
            Website URL
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="meta-url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              disabled={limitReached}
              className="w-full bg-white dark:bg-black border border-slate-300 dark:border-white/20 rounded-lg px-4 py-2.5 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:border-blue-500 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || limitReached}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#0071e3] hover:bg-[#0077ed] active:scale-95 disabled:opacity-50 text-white text-sm font-medium transition-colors shadow-sm shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>{loading ? "Extracting..." : "Extract metadata"}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-white/50">
          <span>Examples:</span>
          {["https://github.com", "https://news.ycombinator.com", "https://wasee.dev"].map((preset) => (
            <button
              key={preset}
              type="button"
              disabled={limitReached}
              onClick={() => {
                setUrl(preset);
                inspectMeta(preset);
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
          <ResultCard
            title="Core HTML Metadata"
            items={[
              { label: "Page Title (<title>)", value: data.title, copyValue: data.title },
              { label: "Meta Description", value: data.description, copyValue: data.description },
              { label: "Canonical URL", value: data.canonical || "Not specified", copyValue: data.canonical || undefined, mono: true },
              { label: "Favicon URL", value: data.favicon, copyValue: data.favicon, mono: true },
            ]}
          />

          <ResultCard
            title="Open Graph (Social Cards)"
            items={[
              { label: "og:title", value: data.openGraph.title || "None" },
              { label: "og:description", value: data.openGraph.description || "None" },
              { label: "og:type", value: data.openGraph.type || "website", mono: true },
              { label: "og:image", value: data.openGraph.image || "None", copyValue: data.openGraph.image || undefined, mono: true },
            ]}
          />

          <ResultCard
            title="Twitter / X Card Tags"
            items={[
              { label: "twitter:card", value: data.twitter.card || "None", mono: true },
              { label: "twitter:title", value: data.twitter.title || "None" },
              { label: "twitter:description", value: data.twitter.description || "None" },
              { label: "twitter:image", value: data.twitter.image || "None", copyValue: data.twitter.image || undefined, mono: true },
            ]}
          />
        </div>
      )}
    </div>
  );
}
