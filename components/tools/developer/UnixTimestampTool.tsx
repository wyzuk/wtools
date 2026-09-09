"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { ResultCard } from "@/components/ResultCard";
import { CopyButton } from "@/components/CopyButton";
import { useUsage } from "@/components/UsageContext";
import { UsageLimitBanner } from "@/components/UsageLimitBanner";

export function UnixTimestampTool() {
  const [currentEpoch, setCurrentEpoch] = useState(Math.floor(Date.now() / 1000));
  const [inputEpoch, setInputEpoch] = useState(String(Math.floor(Date.now() / 1000)));
  const [hasConverted, setHasConverted] = useState(false);
  const { limitReached, recordToolUsage } = useUsage();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const parsedDate = (() => {
    const num = Number(inputEpoch.trim());
    if (isNaN(num)) return null;

    // Detect seconds vs milliseconds
    const dateObj = inputEpoch.trim().length >= 13 ? new Date(num) : new Date(num * 1000);
    if (isNaN(dateObj.getTime())) return null;

    return {
      iso: dateObj.toISOString(),
      utc: dateObj.toUTCString(),
      local: dateObj.toString(),
      seconds: Math.floor(dateObj.getTime() / 1000),
      milliseconds: dateObj.getTime(),
    };
  })();

  const handleConvert = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!parsedDate || limitReached) return;
    setHasConverted(true);
    await recordToolUsage();
  };

  return (
    <div className="space-y-6">
      {limitReached && <UsageLimitBanner />}

      <div className="p-6 bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-white/10 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm dark:shadow-none transition-colors">
        <div>
          <span className="text-xs font-semibold text-slate-700 dark:text-white/50 uppercase tracking-wider font-mono block mb-1">
            Current Unix Epoch Timestamp
          </span>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <span className="text-[#0071e3] dark:text-blue-400">{currentEpoch}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CopyButton text={String(currentEpoch)} label="Copy Epoch" />
          <button
            type="button"
            disabled={limitReached}
            onClick={() => setInputEpoch(String(currentEpoch))}
            className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
          >
            Use Current
          </button>
        </div>
      </div>

      <form onSubmit={handleConvert} className="p-6 bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-white/10 rounded-2xl space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_-4px_rgba(0,0,0,0.05)] transition-colors">
        <div>
          <label htmlFor="epoch-input" className="block text-xs font-semibold text-slate-700 dark:text-white/70 mb-2 uppercase tracking-wider font-mono">
            Timestamp to Convert (Seconds or Milliseconds)
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="epoch-input"
              type="text"
              value={inputEpoch}
              onChange={(e) => setInputEpoch(e.target.value)}
              placeholder="e.g. 1730000000"
              disabled={limitReached}
              className="w-full bg-white dark:bg-black border border-slate-300 dark:border-white/20 rounded-lg px-4 py-2.5 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:border-blue-500 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={limitReached}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#0071e3] hover:bg-[#0077ed] active:scale-95 disabled:opacity-50 text-white text-sm font-medium transition-colors shadow-sm shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Convert timestamp</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-white/50">
          <span>Presets:</span>
          {[
            { label: "Start of 2026", e: "1767225600" },
            { label: "Year 2038 Limit (32-bit)", e: "2147483647" },
            { label: "Start of Unix Epoch (0)", e: "0" },
            { label: "1 Billion Epoch", e: "1000000000" },
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              disabled={limitReached}
              onClick={() => setInputEpoch(preset.e)}
              className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-white/70 hover:border-blue-500 hover:text-[#0071e3] dark:hover:text-white transition-colors disabled:opacity-50"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </form>

      {parsedDate ? (
        (hasConverted || !limitReached) && (
          <ResultCard
            title="Human-Readable Date Conversions"
            items={[
              { label: "ISO 8601 Format", value: parsedDate.iso, copyValue: parsedDate.iso, mono: true },
              { label: "UTC / GMT String", value: parsedDate.utc, copyValue: parsedDate.utc, mono: true },
              { label: "Browser Local Time", value: parsedDate.local, copyValue: parsedDate.local, mono: true },
              { label: "Seconds Epoch", value: String(parsedDate.seconds), copyValue: String(parsedDate.seconds), mono: true },
              { label: "Milliseconds Epoch", value: String(parsedDate.milliseconds), copyValue: String(parsedDate.milliseconds), mono: true },
            ]}
          />
        )
      ) : (
        <div className="p-4 bg-white dark:bg-[#1c1c1e] border border-slate-300 dark:border-white/20 rounded-lg text-sm text-slate-800 dark:text-white">
          <span className="font-semibold text-slate-900 dark:text-white mr-2">Notice:</span>
          Invalid numeric timestamp provided.
        </div>
      )}
    </div>
  );
}
