"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Code2, Layers } from "lucide-react";
import { CopyButton } from "./CopyButton";
import { MacTrafficLights } from "./MacTrafficLights";

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
    <div className="bg-white dark:bg-[#1c1c1e] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04),0_12px_28px_-6px_rgba(0,0,0,0.06)] transition-all">
      <div className="px-5 py-3.5 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between bg-black/[0.015] dark:bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <MacTrafficLights size="xs" />
          <h3 className="text-xs sm:text-sm font-bold text-[#1d1d1f] dark:text-white tracking-tight flex items-center gap-2">
            <span>{title}</span>
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {Boolean(rawJson) && (
            <button
              type="button"
              onClick={() => setShowRaw(!showRaw)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-neutral-800 text-[#1d1d1f] dark:text-white hover:border-[#0071e3] shadow-[0_1px_2px_rgba(0,0,0,0.03)] active:scale-95 transition-all"
            >
              {showRaw ? <Layers className="w-3.5 h-3.5 text-[#0071e3]" /> : <Code2 className="w-3.5 h-3.5 text-[#0071e3]" />}
              <span>{showRaw ? "Structured View" : "View Raw JSON"}</span>
              {showRaw ? <ChevronUp className="w-3 h-3 text-slate-400" /> : <ChevronDown className="w-3 h-3 text-slate-400" />}
            </button>
          )}
          {fullCopy && <CopyButton text={fullCopy} label="Copy All" />}
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {showRaw && rawString ? (
          <div className="rounded-xl overflow-hidden border border-black/[0.1] dark:border-white/[0.1] shadow-inner">
            <div className="px-4 py-2 bg-[#1e1e1e] border-b border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-white/50">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                json-output
              </span>
              <span>UTF-8</span>
            </div>
            <pre className="p-4 bg-[#181818] text-[#e4e4e7] text-xs font-mono overflow-x-auto max-h-[520px] leading-relaxed select-text">
              {rawString}
            </pre>
          </div>
        ) : children ? (
          children
        ) : items && items.length > 0 ? (
          <div className="divide-y divide-black/[0.05] dark:divide-white/[0.06]">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="py-3 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm hover:bg-black/[0.015] dark:hover:bg-white/[0.02] -mx-2 px-2 rounded-lg transition-colors"
              >
                <span className="text-[#515154] dark:text-[#a1a1a6] font-semibold sm:w-1/3 shrink-0">
                  {item.label}
                </span>
                <div className="flex items-center justify-between sm:justify-end gap-3 flex-1">
                  <div
                    className={`text-[#1d1d1f] dark:text-[#f5f5f7] font-medium break-all ${
                      item.mono ? "font-mono text-[13px]" : ""
                    }`}
                  >
                    {item.value ?? <span className="text-[#86868b] dark:text-white/40 italic font-normal">None</span>}
                  </div>
                  {item.copyValue && (
                    <CopyButton text={item.copyValue} label="Copy" className="shrink-0" />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-xs sm:text-sm text-[#86868b] dark:text-white/40 italic">
            {emptyMessage}
          </div>
        )}
      </div>
    </div>
  );
}
