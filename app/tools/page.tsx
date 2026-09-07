"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { TOOLS, CATEGORIES } from "@/lib/tools-data";
import { ToolCard } from "@/components/ToolCard";
import { DynamicIcon } from "@/components/DynamicIcon";

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
    <div className="py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1 font-mono">
            Directory
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight font-sans">
            All Technical Tools
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-white/65 max-w-2xl mt-1.5 leading-relaxed font-sans">
            Browse our complete catalog of {TOOLS.length} standalone technical utilities. Every tool runs directly without accounts or tracking.
          </p>
        </div>

        <div className="text-sm text-slate-500 dark:text-white/40">
          Showing {filteredTools.length} of {TOOLS.length} tools
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-blue-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter tools by name or functionality..."
            className="w-full bg-white dark:bg-[#0d0d0d] border border-slate-300 dark:border-white/15 rounded-lg pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:border-blue-500 shadow-sm dark:shadow-none transition-colors font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 hover:text-slate-700 dark:hover:text-white px-2 py-1"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar text-sm font-medium">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-3.5 py-1.5 rounded-lg border transition-colors shrink-0 ${
              activeCategory === "all"
                ? "bg-blue-500 text-white border-blue-500 font-semibold"
                : "bg-white dark:bg-[#0d0d0d] text-slate-600 dark:text-white/70 border-slate-200 dark:border-white/10 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20 shadow-sm dark:shadow-none"
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
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border transition-colors shrink-0 ${
                  activeCategory === cat.id
                    ? "bg-blue-500 text-white border-blue-500 font-semibold"
                    : "bg-white dark:bg-[#0d0d0d] text-slate-600 dark:text-white/70 border-slate-200 dark:border-white/10 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20 shadow-sm dark:shadow-none"
                }`}
              >
                <DynamicIcon name={cat.icon} className="w-4 h-4" />
                <span>{cat.name} ({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tool Grid */}
      {filteredTools.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-[#0d0d0d] border border-slate-200 dark:border-white/10 rounded-xl">
          <SlidersHorizontal className="w-8 h-8 text-slate-300 dark:text-white/20 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">No tools matched your criteria</h3>
          <p className="text-sm text-slate-500 dark:text-white/40 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or selecting a different category.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
            }}
            className="mt-4 px-4 py-2 text-xs font-medium rounded-md bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
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
