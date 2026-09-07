"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Code2 } from "lucide-react";
import { CopyButton } from "./CopyButton";

interface ResultItem {
  label: string;
  value: React.ReactNode;
  copyValue?: string;
  mono?: boolean;
}

interface ResultCardProps {
  title?: string;
  items?: ResultItem[];
  rawJson?: unknown;
  copyAllText?: string;
  emptyMessage?: string;
  children?: React.ReactNode;
}

export function ResultCard({
  title = "Results",
  items,
  rawJson,
  copyAllText,
  emptyMessage = "No results to display.",
  children,
}: ResultCardProps) {
  const [showRaw, setShowRaw] = useState(false);

  const rawString = rawJson ? JSON.stringify(rawJson, null, 2) : null;
  const fullCopy = copyAllText || rawString;

  return (
    <div className="bg-white dark:bg-[#0d0d0d] border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm dark:shadow-none transition-colors">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50/80 dark:bg-black/40">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-normal font-sans flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
          <span>{title}</span>
        </h3>
        <div className="flex items-center gap-2">
          {Boolean(rawJson) && (
            <button
              type="button"
              onClick={() => setShowRaw(!showRaw)}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:border-blue-500/50 bg-white dark:bg-black transition-colors"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{showRaw ? "Structured View" : "View Raw JSON"}</span>
              {showRaw ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
          {fullCopy && <CopyButton text={fullCopy} label="Copy Results" />}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 sm:p-6">
        {showRaw && rawString ? (
          <pre className="p-4 bg-slate-900 text-slate-50 dark:bg-black dark:text-white/90 border border-slate-700 dark:border-white/10 rounded-lg text-xs font-mono overflow-x-auto max-h-[500px] leading-relaxed">
            {rawString}
          </pre>
        ) : children ? (
          children
        ) : items && items.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm"
              >
                <span className="text-slate-500 dark:text-white/50 font-medium sm:w-1/3 shrink-0 font-sans">
                  {item.label}
                </span>
                <div className="flex items-center justify-between sm:justify-end gap-3 flex-1">
                  <span
                    className={`text-slate-900 dark:text-white break-all ${
                      item.mono ? "font-mono" : "font-sans"
                    }`}
                  >
                    {item.value ?? <span className="text-slate-400 dark:text-white/30 italic">None</span>}
                  </span>
                  {item.copyValue && (
                    <CopyButton text={item.copyValue} label="Copy" className="shrink-0" />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 dark:text-white/50 italic py-6 text-center">
            {emptyMessage}
          </p>
        )}
      </div>
    </div>
  );
}
