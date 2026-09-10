"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { TOOLS, CATEGORIES } from "@/lib/tools-data";
import { ToolCard } from "@/components/ToolCard";
import { DynamicIcon } from "@/components/DynamicIcon";
import { MacTrafficLights } from "@/components/MacTrafficLights";

function ToolsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setActiveCategory(cat);
    }
  }, [searchParams]);

  const normalizedQuery = searchQuery.toLowerCase().trim();

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

  return (
    <div className="py-6 sm:py-10 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      <div className="bg-white dark:bg-[#1c1c1e] border border-black/[0.08] dark:border-white/[0.1] rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_12px_32px_-8px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="px-6 py-3.5 border-b border-black/[0.06] dark:border-white/[0.08] bg-black/[0.015] dark:bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MacTrafficLights size="xs" />
            <span className="text-xs font-semibold text-[#86868b] dark:text-[#a1a1a6]">
              Applications Catalog &bull; {TOOLS.length} utilities
            </span>
          </div>
          <span className="text-xs font-mono text-[#515154] dark:text-[#a1a1a6]">
            Showing {filteredTools.length} of {TOOLS.length}
          </span>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <div className="text-xs font-semibold text-[#0071e3] dark:text-[#2997ff] uppercase tracking-wider mb-1 font-mono">
              Suite Directory
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1d1d1f] dark:text-white tracking-tight">
              All Technical Utilities
            </h1>
            <p className="text-sm sm:text-base text-[#515154] dark:text-[#a1a1a6] max-w-2xl mt-1 leading-relaxed">
              Explore the complete offline and network utility catalog. Everything is designed to work immediately with clear outputs and zero tracking.
            </p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-[#0071e3] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter utilities by name, protocol, or tag..."
                className="w-full bg-[#f5f5f7] dark:bg-neutral-800/80 border border-black/[0.08] dark:border-white/[0.1] rounded-2xl pl-11 pr-10 py-3 text-sm text-[#1d1d1f] dark:text-white placeholder-[#86868b] dark:placeholder-[#a1a1a6] focus:bg-white dark:focus:bg-neutral-800 focus:border-[#0071e3] shadow-inner transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-white px-2 py-1"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="p-1.5 bg-[#f5f5f7] dark:bg-black/40 rounded-2xl border border-black/[0.05] dark:border-white/[0.06] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                  activeCategory === "all"
                    ? "bg-white dark:bg-neutral-800 text-[#1d1d1f] dark:text-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-black/[0.06] dark:border-white/[0.1]"
                    : "text-[#515154] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
                }`}
              >
                All Tools ({TOOLS.length})
              </button>
              {CATEGORIES.map((cat) => {
                const count = TOOLS.filter((t) => t.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                      activeCategory === cat.id
                        ? "bg-white dark:bg-neutral-800 text-[#0071e3] dark:text-[#2997ff] shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-black/[0.06] dark:border-white/[0.1]"
                        : "text-[#515154] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
                    }`}
                  >
                    <DynamicIcon name={cat.icon} className="w-3.5 h-3.5" />
                    <span>{cat.name}</span>
                    <span className="text-[11px] opacity-60 font-mono">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {filteredTools.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-[#1c1c1e] border border-black/[0.08] dark:border-white/[0.1] rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <SlidersHorizontal className="w-8 h-8 text-[#0071e3] mx-auto mb-3 opacity-80" />
          <h3 className="text-base font-bold text-[#1d1d1f] dark:text-white">No utilities matched your criteria</h3>
          <p className="text-sm text-[#86868b] dark:text-[#a1a1a6] mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or selecting a different category.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
            }}
            className="mt-4 px-5 py-2 text-xs font-semibold rounded-xl bg-[#0071e3] text-white hover:bg-[#0077ed] active:scale-95 transition-all shadow-[0_2px_8px_rgba(0,113,227,0.3)]"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ToolsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm font-mono text-slate-400 dark:text-white/40">Loading directory...</div>}>
      <ToolsContent />
    </Suspense>
  );
}
