"use client";

import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { ResultCard } from "@/components/ResultCard";
import { useUsage } from "@/components/UsageContext";
import { UsageLimitBanner } from "@/components/UsageLimitBanner";

interface MatchItem {
  index: number;
  match: string;
  groups: string[];
}

export function RegexTesterTool() {
  const [pattern, setPattern] = useState(
    "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b"
  );
  const [flags, setFlags] = useState("g");
  const [testText, setTestText] = useState(
    "Contact developer at wasee@wasee.dev or security alerts to admin@wtools.internal for bug bounties."
  );
  const [hasTested, setHasTested] = useState(false);
  const { limitReached, recordToolUsage } = useUsage();

  const evaluation = useMemo(() => {
    if (!pattern) return { valid: true, matches: [], error: null };

    try {
      const regex = new RegExp(pattern, flags);
      const matches: MatchItem[] = [];

      if (flags.includes("g")) {
        let m: RegExpExecArray | null;
        let iteration = 0;
        while ((m = regex.exec(testText)) !== null) {
          matches.push({
            index: m.index,
            match: m[0],
            groups: m.slice(1),
          });
          if (m.index === regex.lastIndex) {
            regex.lastIndex++;
          }
          iteration++;
          if (iteration > 500) break; // safety limit
        }
      } else {
        const m = regex.exec(testText);
        if (m) {
          matches.push({
            index: m.index,
            match: m[0],
            groups: m.slice(1),
          });
        }
      }

      return { valid: true, matches, error: null };
    } catch (err: unknown) {
      return { valid: false, matches: [], error: err instanceof Error ? err.message : "Regex syntax error" };
    }
  }, [pattern, flags, testText]);

  const toggleFlag = (flagChar: string) => {
    if (limitReached) return;
    if (flags.includes(flagChar)) {
      setFlags(flags.replace(flagChar, ""));
    } else {
      setFlags(flags + flagChar);
    }
  };

  const handleTest = async () => {
    if (evaluation.error || limitReached) return;
    setHasTested(true);
    await recordToolUsage();
  };

  return (
    <div className="space-y-6">
      {limitReached && <UsageLimitBanner />}

      {/* Pattern Input & Flag Controls */}
      <div className="p-6 bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-white/10 rounded-2xl space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_-4px_rgba(0,0,0,0.05)] transition-colors">
        <div>
          <label htmlFor="reg-pattern" className="block text-xs font-semibold text-slate-700 dark:text-white/70 mb-2 uppercase tracking-wider font-mono">
            Regular Expression Pattern
          </label>
          <div className="flex items-center gap-2">
            <span className="font-mono text-slate-400 dark:text-white/40 text-lg">/</span>
            <input
              id="reg-pattern"
              type="text"
              value={pattern}
              disabled={limitReached}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="e.g. ([a-z]+)\d+"
              className="w-full bg-white dark:bg-black border border-slate-300 dark:border-white/20 rounded-lg px-4 py-2.5 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:border-blue-500 disabled:opacity-60"
            />
            <span className="font-mono text-slate-400 dark:text-white/40 text-base">/{flags}</span>
          </div>
        </div>

        {/* Flag toggles */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-700 dark:text-white">
          <span className="text-slate-500 dark:text-white/40 font-sans">Active Flags:</span>
          {[
            { flag: "g", name: "global (g)" },
            { flag: "i", name: "case-insensitive (i)" },
            { flag: "m", name: "multiline (m)" },
            { flag: "s", name: "dotAll (s)" },
          ].map((f) => (
            <button
              key={f.flag}
              type="button"
              disabled={limitReached}
              onClick={() => toggleFlag(f.flag)}
              className={`px-2.5 py-1 rounded-md border text-xs transition-colors disabled:opacity-50 ${
                flags.includes(f.flag)
                  ? "bg-blue-500 text-white border-blue-500 font-bold"
                  : "bg-slate-50 dark:bg-black border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>

        {/* Preset Patterns */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-white/50 pt-1">
          <span>Common Patterns:</span>
          {[
            { label: "Email", p: "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b" },
            { label: "IPv4", p: "\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b" },
            { label: "UUID", p: "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}" },
            { label: "Hex Color", p: "#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})" },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              disabled={limitReached}
              onClick={() => setPattern(item.p)}
              className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-white/70 hover:border-blue-500 hover:text-[#0071e3] dark:hover:text-white transition-colors disabled:opacity-50"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Test String */}
      <div className="p-6 bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-white/10 rounded-2xl space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_-4px_rgba(0,0,0,0.05)] transition-colors">
        <label htmlFor="test-string-input" className="block text-xs font-semibold text-slate-700 dark:text-white/70 uppercase tracking-wider font-mono">
          Test String Content
        </label>
        <textarea
          id="test-string-input"
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          rows={5}
          disabled={limitReached}
          placeholder="Enter text to match against the regex pattern..."
          className="w-full bg-white dark:bg-black border border-slate-300 dark:border-white/20 rounded-lg p-3.5 font-mono text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:border-blue-500 resize-y disabled:opacity-60"
        />
        <div className="flex justify-end">
          <button
            type="button"
            disabled={limitReached}
            onClick={handleTest}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#0071e3] hover:bg-[#0077ed] active:scale-95 disabled:opacity-50 text-white text-sm font-medium transition-colors shadow-sm"
          >
            <Search className="w-4 h-4" />
            <span>Test regex</span>
          </button>
        </div>
      </div>

      {evaluation.error && (
        <div className="p-4 bg-white dark:bg-[#1c1c1e] border border-slate-300 dark:border-white/20 rounded-lg text-sm text-slate-800 dark:text-white">
          <span className="font-semibold text-slate-900 dark:text-white mr-2">Notice:</span>
          {evaluation.error}
        </div>
      )}

      {evaluation.valid && (hasTested || !limitReached) && (
        <ResultCard
          title={`Pattern Matches (${evaluation.matches.length} found)`}
        >
          {evaluation.matches.length === 0 ? (
            <div className="py-6 text-center text-sm text-slate-500 dark:text-white/50">
              No matching occurrences found in the test string.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm font-mono">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/40 uppercase tracking-wider text-xs">
                    <th className="py-2.5 pr-3">#</th>
                    <th className="py-2.5 px-3">Index Offset</th>
                    <th className="py-2.5 px-3">Matched Substring</th>
                    <th className="py-2.5 pl-3">Capture Groups</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {evaluation.matches.map((m, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-white/5">
                      <td className="py-2.5 pr-3 text-slate-400 dark:text-white/40">{idx + 1}</td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-white/60">Position {m.index}</td>
                      <td className="py-2.5 px-3 text-[#0071e3] dark:text-blue-400 font-bold break-all">{m.match}</td>
                      <td className="py-2.5 pl-3 text-slate-800 dark:text-white">
                        {m.groups.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {m.groups.map((g, gi) => (
                              <span
                                key={gi}
                                className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white/90 text-xs"
                              >
                                ${gi + 1}: {g}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 dark:text-white/30 italic">None</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ResultCard>
      )}
    </div>
  );
}
