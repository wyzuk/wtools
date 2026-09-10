"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight } from "lucide-react";
import { TOOLS } from "@/lib/tools-data";
import { DynamicIcon } from "./DynamicIcon";
import { MacTrafficLights } from "./MacTrafficLights";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();
  const results = query.trim()
    ? TOOLS.filter(
        (tool) =>
          tool.name.toLowerCase().includes(normalizedQuery) ||
          tool.category.toLowerCase().includes(normalizedQuery) ||
          tool.description.toLowerCase().includes(normalizedQuery) ||
          tool.keywords.some((k) => k.toLowerCase().includes(normalizedQuery))
      )
    : TOOLS.slice(0, 8); // default suggestions

  const handleSelect = (slug: string) => {
    onClose();
    router.push(`/tools/${slug}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white/95 dark:bg-[#1c1c1e]/95 backdrop-blur-2xl border border-black/[0.12] dark:border-white/[0.15] rounded-2xl shadow-[0_24px_70px_-10px_rgba(0,0,0,0.3)] overflow-hidden scale-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-3 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between bg-black/[0.02] dark:bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <MacTrafficLights size="xs" />
            <span className="text-xs font-semibold text-[#86868b] dark:text-[#a1a1a6]">
              Quick Command Palette
            </span>
          </div>
          <kbd className="px-2 py-0.5 text-[11px] font-mono text-[#86868b] dark:text-[#a1a1a6] bg-black/[0.05] dark:bg-white/[0.08] border border-black/[0.06] dark:border-white/[0.08] rounded-md">
            ESC
          </kbd>
        </div>

        <div className="flex items-center px-5 py-4 border-b border-black/[0.06] dark:border-white/[0.08] gap-3.5 bg-white/50 dark:bg-black/20">
          <Search className="w-5 h-5 text-[#0071e3] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all utilities, protocols, or keywords..."
            className="w-full bg-transparent text-[#1d1d1f] dark:text-white placeholder-[#86868b] dark:placeholder-[#a1a1a6] text-base sm:text-lg font-medium focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-full hover:bg-black/[0.05]"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {results.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#86868b] dark:text-[#a1a1a6]">
              No matching tools found for &ldquo;<span className="text-[#1d1d1f] dark:text-white font-semibold">{query}</span>&rdquo;.
            </div>
          ) : (
            results.map((tool) => (
              <div
                key={tool.slug}
                role="button"
                tabIndex={0}
                onClick={() => handleSelect(tool.slug)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSelect(tool.slug);
                  }
                }}
                className="w-full text-left p-3 hover:bg-[#0071e3] hover:text-white dark:hover:bg-[#0071e3] flex items-center justify-between group rounded-xl transition-all duration-150 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-[12px] bg-white dark:bg-neutral-800 border border-black/[0.08] dark:border-white/[0.1] flex items-center justify-center text-[#0071e3] group-hover:text-[#0071e3] group-hover:bg-white shrink-0 shadow-sm">
                    <DynamicIcon name={tool.icon} className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#1d1d1f] dark:text-white group-hover:text-white truncate">
                        {tool.name}
                      </span>
                      <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08] group-hover:bg-white/20 text-[#515154] dark:text-[#a1a1a6] group-hover:text-white border border-black/[0.04] group-hover:border-white/30 shrink-0">
                        {tool.category}
                      </span>
                    </div>
                    <p className="text-xs text-[#86868b] dark:text-[#a1a1a6] group-hover:text-white/80 line-clamp-1 mt-0.5">
                      {tool.description}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 dark:text-neutral-600 group-hover:text-white shrink-0 ml-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            ))
          )}
        </div>

        <div className="px-5 py-3 bg-black/[0.02] dark:bg-white/[0.02] border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-xs text-[#86868b] dark:text-[#a1a1a6]">
          <span className="font-mono text-[11px]">{TOOLS.length} utilities available</span>
          <Link
            href="/tools"
            onClick={onClose}
            className="hover:text-[#0071e3] dark:hover:text-white font-medium transition-colors"
          >
            Open Applications Catalog &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
