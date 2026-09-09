"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Menu, X, ExternalLink } from "lucide-react";
import { SearchModal } from "./SearchModal";
import { ThemeToggle } from "./ThemeToggle";
import { UsageBadge } from "./UsageBadge";
import { MacTrafficLights } from "./MacTrafficLights";

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K opens/toggles search modal
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      // "/" key when not typing in an input
      if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement)?.tagName)
      ) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-black/[0.08] dark:border-white/[0.08] macos-glass transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 shrink-0">
            <MacTrafficLights className="hidden sm:flex" size="sm" />
            
            <Link href="/" className="flex items-center gap-3 group select-none">
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-[10px] bg-gradient-to-b from-white to-slate-100 dark:from-neutral-800 dark:to-neutral-900 border border-black/[0.1] dark:border-white/[0.15] overflow-hidden flex items-center justify-center p-1.5 group-hover:border-[#0071e3] transition-all shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
                <Image
                  src="/assets/logo.png"
                  alt="WTOOLS"
                  width={32}
                  height={32}
                  priority
                  className="object-contain drop-shadow-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg sm:text-xl tracking-tight text-[#1d1d1f] dark:text-white group-hover:text-[#0071e3] transition-colors">
                  WTOOLS
                </span>
                <span className="hidden sm:inline-block text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-[#0071e3] dark:text-[#2997ff] border border-[#0071e3]/20 tracking-wider">
                  macOS
                </span>
              </div>
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="flex-1 max-w-md hidden md:flex items-center justify-between px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-500 dark:text-neutral-400 bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.1] rounded-xl hover:border-[#0071e3] hover:bg-white dark:hover:bg-neutral-800 hover:text-[#1d1d1f] dark:hover:text-white transition-all shadow-inner"
          >
            <span className="flex items-center gap-2.5">
              <Search className="w-3.5 h-3.5 text-[#0071e3]" />
              <span className="font-medium text-slate-600 dark:text-neutral-300">Spotlight search utilities...</span>
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="font-mono text-[11px] font-semibold bg-white dark:bg-neutral-700 px-1.5 py-0.5 rounded-md text-slate-600 dark:text-neutral-200 border border-black/[0.1] dark:border-white/[0.15] shadow-sm">
                ⌘K
              </kbd>
            </span>
          </button>

          <div className="hidden md:flex items-center gap-3 text-sm font-medium">
            <UsageBadge />

            <nav className="flex items-center gap-1 border-l border-black/[0.08] dark:border-white/[0.1] pl-3">
              <Link
                href="/tools"
                className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-[#424245] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-all"
              >
                Tools
              </Link>
              <Link
                href="/developer"
                className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-[#424245] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-all"
              >
                Developer
              </Link>
              <a
                href="https://github.com/wyzuk"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-[#424245] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-all flex items-center gap-1"
                title="GitHub @wyzuk"
              >
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3 text-slate-400 dark:text-neutral-500" />
              </a>
            </nav>

            <div className="border-l border-black/[0.08] dark:border-white/[0.1] pl-3">
              <ThemeToggle />
            </div>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-[#1d1d1f] dark:text-neutral-200 hover:bg-black/[0.05] dark:hover:bg-white/10 rounded-xl border border-black/[0.08] dark:border-white/[0.1] transition-colors"
              aria-label="Search tools"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#1d1d1f] dark:text-neutral-200 hover:bg-black/[0.05] dark:hover:bg-white/10 rounded-xl border border-black/[0.08] dark:border-white/[0.1] transition-colors"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-black/[0.08] dark:border-white/[0.1] bg-white/95 dark:bg-[#161618]/95 backdrop-blur-xl px-4 py-4 space-y-3">
            <div className="pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
              <UsageBadge />
            </div>
            <Link
              href="/tools"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-700 dark:text-neutral-200 hover:text-blue-500 dark:hover:text-white"
            >
              All Tools Directory
            </Link>
            <Link
              href="/developer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-700 dark:text-neutral-200 hover:text-blue-500 dark:hover:text-white"
            >
              About Developer (Wasee / Wyzuk)
            </Link>
            <a
              href="https://github.com/wyzuk"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-neutral-200 hover:text-blue-500 dark:hover:text-white"
            >
              <span>GitHub Profile</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-500" />
            </a>
            <a
              href="https://www.wasee.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-neutral-200 hover:text-blue-500 dark:hover:text-white"
            >
              <span>Developer Website (wasee.dev)</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-500" />
            </a>
          </div>
        )}
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
