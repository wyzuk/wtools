"use client";

import React from "react";
import { Clock } from "lucide-react";

export function UsageLimitBanner() {
  return (
    <div className="p-5 bg-white dark:bg-[#0f0f11] border border-slate-300 dark:border-white/20 rounded-lg text-slate-800 dark:text-white space-y-2">
      <div className="flex items-center gap-2 font-mono text-sm font-bold text-slate-900 dark:text-white">
        <Clock className="w-4 h-4 text-blue-500" />
        <span>Daily limit reached</span>
      </div>
      <p className="text-xs sm:text-sm text-slate-600 dark:text-white/70 leading-relaxed font-sans">
        You&apos;ve used all 3 free tool executions for today. Your daily quota will reset tomorrow at midnight.
      </p>
    </div>
  );
}
