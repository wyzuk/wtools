"use client";

import React from "react";
import { useUsage } from "./UsageContext";

export function UsageBadge({ className = "" }: { className?: string }) {
  const { used, max, remaining, limitReached, loading } = useUsage();

  if (loading) {
    return (
      <div className={`text-xs font-mono text-slate-400 dark:text-white/40 ${className}`}>
        Checking quota...
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all ${
        limitReached
          ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900"
          : "bg-white dark:bg-white/[0.08] text-[#1d1d1f] dark:text-[#f5f5f7] border-black/[0.08] dark:border-white/[0.12]"
      } ${className}`}
      title={`${remaining} of ${max} free tool executions remaining today`}
    >
      <span
        className={`w-2 h-2 rounded-full shrink-0 shadow-sm ${
          limitReached ? "bg-[#ff5f56]" : "bg-[#27c93f]"
        }`}
      />
      <span className="font-mono text-[11px] sm:text-xs">
        {limitReached ? "Quota reached (3/3)" : `${remaining} of ${max} daily uses`}
      </span>
    </div>
  );
}
