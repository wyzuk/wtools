"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, ArrowRight, X, Sparkles, Command, ShieldCheck, Terminal, Cpu } from "lucide-react";
import { TOOLS, CATEGORIES } from "@/lib/tools-data";
import { ToolCard } from "@/components/ToolCard";
import { DynamicIcon } from "@/components/DynamicIcon";
import { MacTrafficLights } from "@/components/MacTrafficLights";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const normalizedQuery = searchQuery.toLowerCase().trim();

  // Filter tools based on search and category
  const filteredTools = TOOLS.filter((tool) => {
    const matchesCategory =
      activeCategory === "all" || tool.category === activeCategory;
    const matchesSearch =
      !normalizedQuery ||
      tool.name.toLowerCase().includes(normalizedQuery) ||
      tool.description.toLowerCase().includes(normalizedQuery) ||
      tool.slug.toLowerCase().includes(normalizedQuery) ||
      tool.keywords.some((k) => k.toLowerCase().includes(normalizedQuery));

    return matchesCategory && matchesSearch;
  });

  const popularTools = TOOLS.filter((t) => t.popular);

  return (
    <div className="py-6 sm:py-10 px-4 sm:px-6 max-w-7xl mx-auto space-y-10 sm:space-y-12">
      <section className="bg-white dark:bg-[#1c1c1e] border border-black/[0.08] dark:border-white/[0.1] rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_16px_40px_-8px_rgba(0,0,0,0.06)] overflow-hidden transition-all">
        <div className="px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.08] bg-black/[0.015] dark:bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MacTrafficLights size="sm" />
            <span className="text-xs font-semibold text-[#86868b] dark:text-[#a1a1a6] hidden sm:inline-block">
              wtools.app &mdash; Developer Utilities Workspace
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#86868b] dark:text-[#a1a1a6]">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              High-Performance Suite Active
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.08] border border-black/[0.06] dark:border-white/[0.08] text-[#515154] dark:text-[#a1a1a6]">
                  Release 2.0 &bull; {TOOLS.length} utilities
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-xs text-[#0071e3] dark:text-[#2997ff] font-medium">
                  <Sparkles className="w-3.5 h-3.5" /> High Performance &bull; Zero Trackers
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1d1d1f] dark:text-white tracking-tight leading-[1.08]">
                Precision Developer <br className="hidden sm:inline" />
                <span className="text-[#0071e3] dark:text-[#2997ff]">Tools &amp; Diagnostics</span>
              </h1>
              <p className="text-base sm:text-lg text-[#515154] dark:text-[#a1a1a6] leading-relaxed">
                Fast, focused diagnostic utilities for network engineers, security auditors, and software developers. Direct execution, crystal-clear readability, zero ads.
              </p>
            </div>

            <div className="text-xs sm:text-sm text-[#86868b] dark:text-[#a1a1a6] md:text-right shrink-0 space-y-1">
              <div className="font-medium text-[#1d1d1f] dark:text-white">
                Engineered by{" "}
                <Link
                  href="/developer"
                  className="text-[#0071e3] hover:underline font-semibold transition-colors"
                >
                  Wasee / Wyzuk
                </Link>
              </div>
              <p className="font-mono text-[11px]">Free community edition &bull; Daily quota refresh</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative group">
              <Search className="w-5 h-5 text-[#0071e3] absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 pointer-events-none transition-transform group-focus-within:scale-110" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Instant search (e.g. IP, DNS, WHOIS, SSL, Hash, Port, Subnet, JWT, Base64)..."
                className="w-full bg-[#f5f5f7] dark:bg-neutral-800/80 border border-black/[0.08] dark:border-white/[0.1] rounded-2xl pl-12 sm:pl-14 pr-12 py-4 text-base sm:text-lg text-[#1d1d1f] dark:text-white placeholder-[#86868b] dark:placeholder-[#a1a1a6] focus:bg-white dark:focus:bg-neutral-800 focus:border-[#0071e3] shadow-inner transition-all"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-block absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-mono font-semibold text-[#86868b] dark:text-[#a1a1a6] bg-white dark:bg-neutral-700 border border-black/[0.08] dark:border-white/[0.1] rounded-lg shadow-sm">
                  /
                </kbd>
              )}
            </div>

            <div className="p-1.5 bg-[#f5f5f7] dark:bg-black/40 rounded-2xl border border-black/[0.05] dark:border-white/[0.06] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                  activeCategory === "all"
                    ? "bg-white dark:bg-neutral-800 text-[#1d1d1f] dark:text-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-black/[0.06] dark:border-white/[0.1]"
                    : "text-[#515154] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
                }`}
              >
                All Applications ({TOOLS.length})
              </button>
              {CATEGORIES.map((cat) => {
                const count = TOOLS.filter((t) => t.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                      activeCategory === cat.id
                        ? "bg-white dark:bg-neutral-800 text-[#0071e3] dark:text-[#2997ff] shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-black/[0.06] dark:border-white/[0.1]"
                        : "text-[#515154] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
                    }`}
                  >
                    <DynamicIcon name={cat.icon} className="w-4 h-4" />
                    <span>{cat.name}</span>
                    <span className="text-[11px] opacity-60 font-mono">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {(searchQuery.trim() || activeCategory !== "all") && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-[#1d1d1f] dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0071e3]" />
              <span>Matching Utilities ({filteredTools.length})</span>
            </h2>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="text-xs font-semibold text-[#0071e3] hover:underline transition-colors font-mono"
            >
              Reset filters
            </button>
          </div>
          {filteredTools.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-[#1c1c1e] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl space-y-2 shadow-macos">
              <p className="text-base text-[#1d1d1f] dark:text-white font-semibold">
                No tools matched &ldquo;{searchQuery}&rdquo;
              </p>
              <p className="text-xs sm:text-sm text-[#86868b] dark:text-[#a1a1a6]">
                Try typing a broader term such as &ldquo;IP&rdquo;, &ldquo;DNS&rdquo;, &ldquo;Hash&rdquo;, or &ldquo;JSON&rdquo;.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          )}
        </section>
      )}

      {!searchQuery.trim() && activeCategory === "all" && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#1d1d1f] dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0071e3]" />
                <span>Frequently Used Utilities</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#515154] dark:text-[#a1a1a6] mt-0.5">
                Essential diagnostic, networking, and payload inspection tools
              </p>
            </div>
            <Link
              href="/tools"
              className="text-xs sm:text-sm font-semibold text-[#0071e3] hover:underline flex items-center gap-1 transition-colors"
            >
              <span>View all {TOOLS.length} utilities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularTools.slice(0, 8).map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {!searchQuery.trim() && activeCategory === "all" && (
        <section className="space-y-6 pt-4 border-t border-black/[0.06] dark:border-white/[0.08]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#1d1d1f] dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0071e3]" />
              <span>Browse by Technical Suite</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#515154] dark:text-[#a1a1a6] mt-0.5">
              Organized suites for network infrastructure, domain resolution, security, and developer formatting
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map((category) => {
              const catTools = TOOLS.filter((t) => t.category === category.id);
              return (
                <div
                  key={category.id}
                  className="p-6 bg-white dark:bg-[#1c1c1e] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.04),0_6px_16px_-4px_rgba(0,0,0,0.04)] hover:shadow-macos-hover hover:border-[#0071e3]/40 transition-all duration-200"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-[14px] bg-gradient-to-b from-white to-[#f5f5f7] dark:from-neutral-800 dark:to-neutral-900 border border-black/[0.08] dark:border-white/[0.1] flex items-center justify-center text-[#0071e3] shadow-sm">
                        <DynamicIcon name={category.icon} className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-mono text-[#86868b] dark:text-[#a1a1a6] bg-black/[0.03] dark:bg-white/[0.06] px-2.5 py-0.5 rounded-full border border-black/[0.04] dark:border-white/[0.06]">
                        {catTools.length} tools
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#1d1d1f] dark:text-white mb-1.5">
                      {category.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#515154] dark:text-[#a1a1a6] leading-relaxed mb-4">
                      {category.description}
                    </p>

                    <div className="space-y-1.5 border-t border-black/[0.05] dark:border-white/[0.06] pt-3">
                      {catTools.slice(0, 3).map((t) => (
                        <Link
                          key={t.slug}
                          href={`/tools/${t.slug}`}
                          className="block text-xs sm:text-sm font-medium text-[#1d1d1f] dark:text-[#f5f5f7] hover:text-[#0071e3] dark:hover:text-[#2997ff] transition-colors truncate"
                        >
                          &rarr; {t.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-black/[0.05] dark:border-white/[0.06]">
                    <Link
                      href={`/tools?category=${category.id}`}
                      className="text-xs font-semibold text-[#0071e3] hover:underline flex items-center justify-between transition-colors"
                    >
                      <span>Explore all {category.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="bg-white dark:bg-[#1c1c1e] border border-black/[0.08] dark:border-white/[0.1] rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_10px_30px_-6px_rgba(0,0,0,0.06)] overflow-hidden transition-all">
        <div className="px-6 py-3.5 border-b border-black/[0.06] dark:border-white/[0.08] bg-black/[0.015] dark:bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MacTrafficLights size="xs" />
            <span className="text-xs font-semibold text-[#86868b] dark:text-[#a1a1a6]">
              About This Suite
            </span>
          </div>
          <span className="text-xs font-mono text-[#0071e3] dark:text-[#2997ff]">v1.0.0</span>
        </div>

        <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="text-xs font-semibold text-[#0071e3] uppercase tracking-wider font-mono">
              Designed &amp; Maintained by Wyzuk
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#1d1d1f] dark:text-white">
              Wasee / Wyzuk &mdash; Independent Engineer
            </h3>
            <p className="text-xs sm:text-sm text-[#515154] dark:text-[#a1a1a6] leading-relaxed">
              WTOOLS was crafted to deliver a native desktop feel in the browser. Pure lightweight execution, no bloated JavaScript runtime trackers, no paywalls.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/developer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-[#0071e3] hover:bg-[#0077ed] active:scale-95 text-white transition-all shadow-[0_2px_8px_rgba(0,113,227,0.3)]"
            >
              <span>Developer Profile</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
