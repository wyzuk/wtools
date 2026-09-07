"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, ArrowRight, X } from "lucide-react";
import { TOOLS, CATEGORIES } from "@/lib/tools-data";
import { ToolCard } from "@/components/ToolCard";
import { DynamicIcon } from "@/components/DynamicIcon";

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
    <div className="py-8 sm:py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-10 sm:space-y-12">
      {/* Header Section — Technical, Clean & Confident */}
      <section className="border-b border-slate-200 dark:border-neutral-800 pb-8 sm:pb-10 transition-colors">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold uppercase px-2.5 py-1 rounded bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300">
                toolbox v1.0
              </span>
              <span className="text-xs font-mono text-slate-400 dark:text-neutral-500">
                &bull; {TOOLS.length} standalone utilities
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight font-sans">
              WTOOLS
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-neutral-400 max-w-2xl leading-relaxed font-sans">
              Fast, focused utilities for network, domain, security, and developer workflows.
              Direct lookups, no trackers, zero bloat.
            </p>
          </div>

          <div className="text-sm text-slate-500 dark:text-neutral-400 md:text-right shrink-0">
            <div>
              Built by{" "}
              <Link
                href="/developer"
                className="text-slate-900 dark:text-white hover:text-blue-500 font-semibold underline underline-offset-4 decoration-slate-300 dark:decoration-neutral-700 hover:decoration-blue-500 transition-colors"
              >
                Wasee / Wyzuk
              </Link>
            </div>
            <div className="mt-1 text-xs font-mono text-slate-400 dark:text-neutral-500">
              Free public tools &bull; Daily reset
            </div>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="mt-8 space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-blue-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by tool name, protocol, or keyword (e.g. IP, DNS, WHOIS, SSL, Hash, Port)..."
              className="w-full bg-white dark:bg-neutral-900 border border-slate-300 dark:border-neutral-700 rounded-xl pl-12 pr-12 py-3.5 text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-500 focus:border-blue-500 focus:outline-none shadow-sm dark:shadow-none transition-colors font-sans"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-block absolute right-4 top-1/2 -translate-y-1/2 px-2 py-0.5 text-xs font-mono text-slate-400 dark:text-neutral-500 bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded">
                /
              </kbd>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs sm:text-sm font-medium">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-3.5 py-1.5 rounded-lg border transition-colors shrink-0 ${
                activeCategory === "all"
                  ? "bg-blue-500 text-white border-blue-500 font-semibold"
                  : "bg-white dark:bg-neutral-900 text-slate-600 dark:text-neutral-300 border-slate-200 dark:border-neutral-800 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-neutral-700"
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors shrink-0 ${
                    activeCategory === cat.id
                      ? "bg-blue-500 text-white border-blue-500 font-semibold"
                      : "bg-white dark:bg-neutral-900 text-slate-600 dark:text-neutral-300 border-slate-200 dark:border-neutral-800 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-neutral-700"
                  }`}
                >
                  <DynamicIcon name={cat.icon} className="w-3.5 h-3.5" />
                  <span>{cat.name} ({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Filtered Search / Category Results */}
      {(searchQuery.trim() || activeCategory !== "all") && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 font-sans">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Matching Utilities ({filteredTools.length})</span>
            </h2>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="text-xs text-slate-500 dark:text-neutral-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-mono"
            >
              Reset filters
            </button>
          </div>
          {filteredTools.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl space-y-2">
              <p className="text-base text-slate-700 dark:text-neutral-300 font-medium">
                No tools matched &ldquo;{searchQuery}&rdquo;
              </p>
              <p className="text-xs text-slate-400 dark:text-neutral-500">
                Try searching for a general term like &ldquo;IP&rdquo;, &ldquo;DNS&rdquo;, &ldquo;Hash&rdquo;, or &ldquo;JSON&rdquo;.
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

      {/* Popular Tools Section */}
      {!searchQuery.trim() && activeCategory === "all" && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Frequently Used Utilities</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 mt-0.5">
                Core daily network, domain, security, and parsing tools
              </p>
            </div>
            <Link
              href="/tools"
              className="text-xs sm:text-sm font-medium text-slate-600 dark:text-neutral-300 hover:text-blue-500 dark:hover:text-blue-400 flex items-center gap-1 transition-colors"
            >
              <span>View all {TOOLS.length} tools</span>
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

      {/* Categorized Catalog */}
      {!searchQuery.trim() && activeCategory === "all" && (
        <section className="space-y-6 pt-4 border-t border-slate-200 dark:border-neutral-800">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Browse by Technical Category</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 mt-0.5">
              Structured utilities for engineering, networking, and system diagnostics
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map((category) => {
              const catTools = TOOLS.filter((t) => t.category === category.id);
              return (
                <div
                  key={category.id}
                  className="p-5 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl flex flex-col justify-between shadow-sm dark:shadow-none transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 flex items-center justify-center text-blue-500">
                        <DynamicIcon name={category.icon} className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-mono text-slate-400 dark:text-neutral-500">
                        {catTools.length} tools
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 font-sans">
                      {category.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-400 leading-relaxed mb-4">
                      {category.description}
                    </p>

                    <div className="space-y-1.5 border-t border-slate-100 dark:border-neutral-800 pt-3">
                      {catTools.slice(0, 3).map((t) => (
                        <Link
                          key={t.slug}
                          href={`/tools/${t.slug}`}
                          className="block text-xs sm:text-sm text-slate-700 dark:text-neutral-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors truncate"
                        >
                          &rarr; {t.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-neutral-800">
                    <Link
                      href={`/tools?category=${category.id}`}
                      className="text-xs sm:text-sm font-medium text-slate-500 dark:text-neutral-400 hover:text-blue-500 dark:hover:text-blue-400 flex items-center justify-between transition-colors"
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

      {/* Developer Callout */}
      <section className="p-6 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm dark:shadow-none transition-colors">
        <div>
          <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1 font-mono">
            Developer Notice
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-sans">
            Crafted by Wasee / Wyzuk
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-400 max-w-xl mt-1 leading-relaxed">
            Personal utility platform for daily engineering workflows. Built using Next.js and public protocol APIs. Zero ads, zero paywalls.
          </p>
        </div>
        <div className="shrink-0">
          <Link
            href="/developer"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-sm"
          >
            <span>About developer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
