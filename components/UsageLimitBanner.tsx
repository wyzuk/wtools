"use client";

import React from "react";
import { Clock } from "lucide-react";

export function UsageLimitBanner() {
  return (
    <div className="p-5 bg-white dark:bg-neutral-900 border border-amber-500/30 rounded-2xl text-[#1d1d1f] dark:text-white space-y-2 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
          <Clock className="w-4 h-4" />
        </div>
        <span className="text-sm font-bold text-[#1d1d1f] dark:text-white">Daily free execution limit reached</span>
      </div>
      <p className="text-xs sm:text-sm text-[#424245] dark:text-[#a1a1a6] leading-relaxed pl-9">
        You&apos;ve reached the 3 free tool requests allocated for today. Standalone offline utilities continue to work without limits, and your live API quota will reset at midnight.
      </p>
    </div>
  );
}
