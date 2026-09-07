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
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono border transition-colors ${
        limitReached
          ? "bg-slate-100 text-slate-800 border-slate-300 dark:bg-white/10 dark:text-white dark:border-white/20"
          : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30"
      } ${className}`}
      title={`${remaining} of ${max} free tool executions remaining today`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          limitReached ? "bg-slate-500 dark:bg-white/60" : "bg-blue-500"
        }`}
      />
      <span>
        {limitReached ? "Limit reached (3/3 used)" : `${remaining} of ${max} daily uses left`}
      </span>
    </div>
  );
}
