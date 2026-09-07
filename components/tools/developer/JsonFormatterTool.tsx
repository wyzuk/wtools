"use client";

import React, { useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { Check, AlertCircle } from "lucide-react";
import { useUsage } from "@/components/UsageContext";
import { UsageLimitBanner } from "@/components/UsageLimitBanner";

export function JsonFormatterTool() {
  const [input, setInput] = useState(`{\n  "platform": "WTOOLS",\n  "author": "Wasee / Wyzuk",\n  "tools_count": 35,\n  "features": ["DNS", "IP", "Phone", "Security"],\n  "open_source": true\n}`);
  const [indent, setIndent] = useState<number | string>(2);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean>(true);
  const { limitReached, recordToolUsage } = useUsage();

  const formatJson = async (spacing: number | string = indent) => {
    if (limitReached) return;
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      const spaceVal = spacing === "tab" ? "\t" : Number(spacing);
      setInput(JSON.stringify(parsed, null, spaceVal));
      setError(null);
      setIsValid(true);
      await recordToolUsage();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid JSON syntax");
      setIsValid(false);
    }
  };

  const minifyJson = async () => {
    if (limitReached) return;
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed));
      setError(null);
      setIsValid(true);
      await recordToolUsage();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid JSON syntax");
      setIsValid(false);
    }
  };

  const validateJson = (val: string) => {
    setInput(val);
    if (!val.trim()) {
      setError(null);
      setIsValid(true);
      return;
    }
    try {
      JSON.parse(val);
      setError(null);
      setIsValid(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "JSON syntax error");
      setIsValid(false);
    }
  };

  return (
    <div className="space-y-6">
      {limitReached && <UsageLimitBanner />}

      {/* Controls Bar */}
      <div className="p-4 bg-white dark:bg-[#0d0d0d] border border-slate-200 dark:border-white/10 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-sm dark:shadow-none transition-colors">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={limitReached}
            onClick={() => formatJson(indent)}
            className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-xs font-semibold transition-colors shadow-sm"
          >
            Prettify
          </button>
          <button
            type="button"
            disabled={limitReached}
            onClick={minifyJson}
            className="px-4 py-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-blue-500 disabled:opacity-50 text-slate-800 dark:text-white text-xs font-semibold transition-colors"
          >
            Minify
          </button>

          <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-white/70">
            <span>Indent:</span>
            {[2, 4, "tab"].map((sp) => (
              <button
                key={sp}
                type="button"
                disabled={limitReached}
                onClick={() => {
                  setIndent(sp);
                  formatJson(sp);
                }}
                className={`px-2.5 py-1 rounded-md border text-xs font-mono transition-colors disabled:opacity-50 ${
                  indent === sp
                    ? "bg-blue-500 text-white border-blue-500 font-bold"
                    : "bg-slate-50 dark:bg-black border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {sp === "tab" ? "Tabs" : `${sp} spaces`}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CopyButton text={input} label="Copy JSON" />
          <button
            type="button"
            disabled={limitReached}
            onClick={() => {
              setInput("");
              setError(null);
              setIsValid(true);
            }}
            className="px-3 py-1.5 text-xs font-medium rounded-md border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Editor & Validation Status */}
      <div className="space-y-2">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => validateJson(e.target.value)}
            rows={18}
            disabled={limitReached}
            placeholder="Paste your JSON payload here..."
            className="w-full bg-white dark:bg-black border border-slate-300 dark:border-white/20 rounded-xl p-4 font-mono text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:border-blue-500 leading-relaxed resize-y disabled:opacity-60 transition-colors shadow-sm dark:shadow-none"
            spellCheck={false}
          />
        </div>

        {/* Status Bar */}
        <div className="flex flex-wrap items-center justify-between text-xs font-mono px-1 gap-2">
          <div className="flex items-center gap-2">
            {isValid ? (
              <span className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium">
                <Check className="w-4 h-4" /> Valid JSON
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-slate-800 dark:text-white bg-slate-100 dark:bg-white/10 px-2.5 py-1 rounded border border-slate-300 dark:border-white/20">
                <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Syntax Error: {error}
              </span>
            )}
          </div>

          <div className="text-slate-400 dark:text-white/40">
            {input.length} characters &bull; {new TextEncoder().encode(input).length} bytes
          </div>
        </div>
      </div>
    </div>
  );
}
