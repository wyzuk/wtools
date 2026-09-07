"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Menu, X, ExternalLink } from "lucide-react";
import { SearchModal } from "./SearchModal";
import { ThemeToggle } from "./ThemeToggle";
import { UsageBadge } from "./UsageBadge";

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
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-neutral-800 bg-white/95 dark:bg-black/95 backdrop-blur-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Distinctive WTOOLS Brand */}
          <Link href="/" className="flex items-center gap-3 group shrink-0 select-none">
            <div className="relative w-9 h-9 rounded-lg bg-neutral-950 border border-neutral-800 overflow-hidden flex items-center justify-center p-1 group-hover:border-blue-500 transition-colors shadow-sm">
              <Image
                src="/assets/logo.png"
                alt="WTOOLS"
                width={32}
                height={32}
                priority
                className="object-contain"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors font-sans">
                WTOOLS
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 font-semibold tracking-wider">
                DEV
              </span>
            </div>
          </Link>

          {/* Quick Command / Search Trigger Button */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="flex-1 max-w-md hidden md:flex items-center justify-between px-3.5 py-2 text-sm text-slate-500 dark:text-neutral-400 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg hover:border-blue-500/60 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-blue-500" />
              <span>Search tools...</span>
            </span>
            <div className="flex items-center gap-1.5">
              <kbd className="font-mono text-xs bg-slate-200/80 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-neutral-300 border border-slate-300 dark:border-neutral-700">
                /
              </kbd>
              <kbd className="font-mono text-xs bg-slate-200/80 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-neutral-300 border border-slate-300 dark:border-neutral-700">
                Ctrl K
              </kbd>
            </div>
          </button>

          {/* Desktop Right Nav Items */}
          <div className="hidden md:flex items-center gap-4 text-sm font-medium">
            <UsageBadge />

            <nav className="flex items-center gap-4 border-l border-slate-200 dark:border-neutral-800 pl-4">
              <Link
                href="/tools"
                className="text-slate-600 dark:text-neutral-300 hover:text-blue-500 dark:hover:text-white transition-colors"
              >
                Tools
              </Link>
              <Link
                href="/developer"
                className="text-slate-600 dark:text-neutral-300 hover:text-blue-500 dark:hover:text-white transition-colors"
              >
                Developer
              </Link>
              <a
                href="https://github.com/wyzuk"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-slate-600 dark:text-neutral-300 hover:text-blue-500 dark:hover:text-white transition-colors"
                title="GitHub @wyzuk"
              >
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3 text-slate-400 dark:text-neutral-500" />
              </a>
            </nav>

            <div className="border-l border-slate-200 dark:border-neutral-800 pl-3">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Right Actions */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-slate-700 dark:text-neutral-200 hover:text-slate-900 dark:hover:text-white rounded-lg border border-slate-200 dark:border-neutral-800"
              aria-label="Search tools"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-700 dark:text-neutral-200 hover:text-slate-900 dark:hover:text-white rounded-lg border border-slate-200 dark:border-neutral-800"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-neutral-800 bg-white dark:bg-black px-4 py-4 space-y-3">
            <div className="pb-2 border-b border-slate-100 dark:border-neutral-800">
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

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
