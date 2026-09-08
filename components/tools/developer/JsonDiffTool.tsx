"use client";

import React, { useState, useMemo } from "react";
import { ArrowRightLeft } from "lucide-react";
import { ResultCard } from "@/components/ResultCard";
import { useUsage } from "@/components/UsageContext";
import { UsageLimitBanner } from "@/components/UsageLimitBanner";

interface DiffItem {
  path: string;
  type: "added" | "removed" | "modified";
  oldValue?: string;
  newValue?: string;
}

export function JsonDiffTool() {
  const [jsonA, setJsonA] = useState(`{\n  "version": "1.0.0",\n  "status": "online",\n  "port": 8080,\n  "cache": true\n}`);
  const [jsonB, setJsonB] = useState(`{\n  "version": "1.1.0",\n  "status": "online",\n  "port": 9000,\n  "cache": false,\n  "ssl": true\n}`);
  const [hasCompared, setHasCompared] = useState(false);
  const { limitReached, recordToolUsage } = useUsage();

  const diffResult = useMemo(() => {
    let objA: unknown;
    let objB: unknown;
    try {
      objA = JSON.parse(jsonA);
    } catch {
      return { error: "JSON A contains a syntax error." };
    }
    try {
      objB = JSON.parse(jsonB);
    } catch {
      return { error: "JSON B contains a syntax error." };
    }

    const diffs: DiffItem[] = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const compareObjects = (a: any, b: any, currentPath = "") => {
      if (typeof a !== "object" || a === null || typeof b !== "object" || b === null) {
        if (a !== b) {
          diffs.push({
            path: currentPath || "root",
            type: "modified",
            oldValue: JSON.stringify(a),
            newValue: JSON.stringify(b),
          });
        }
        return;
      }

      const keysA = Object.keys(a);
      const keysB = Object.keys(b);
      const allKeys = Array.from(new Set([...keysA, ...keysB]));

      for (const k of allKeys) {
        const p = currentPath ? `${currentPath}.${k}` : k;
        if (!(k in a)) {
          diffs.push({
            path: p,
            type: "added",
            newValue: JSON.stringify(b[k]),
          });
        } else if (!(k in b)) {
          diffs.push({
            path: p,
            type: "removed",
            oldValue: JSON.stringify(a[k]),
          });
        } else {
          compareObjects(a[k], b[k], p);
        }
      }
    };

    compareObjects(objA, objB);

    return {
      diffs,
      error: null,
    };
  }, [jsonA, jsonB]);

  const handleCompare = async () => {
    if (diffResult.error || limitReached) return;
    setHasCompared(true);
    await recordToolUsage();
  };

  return (
    <div className="space-y-6">
      {limitReached && <UsageLimitBanner />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Document A */}
        <div className="space-y-2">
          <label htmlFor="json-a-input" className="block text-xs font-semibold text-slate-700 dark:text-white/70 uppercase tracking-wider font-mono">
            Original JSON (A)
          </label>
          <textarea
            id="json-a-input"
            value={jsonA}
            onChange={(e) => setJsonA(e.target.value)}
            rows={10}
            disabled={limitReached}
            className="w-full bg-white dark:bg-black border border-slate-300 dark:border-white/20 rounded-xl p-3.5 font-mono text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:border-blue-500 resize-y shadow-sm dark:shadow-none disabled:opacity-60"
            spellCheck={false}
          />
        </div>

        {/* Document B */}
        <div className="space-y-2">
          <label htmlFor="json-b-input" className="block text-xs font-semibold text-slate-700 dark:text-white/70 uppercase tracking-wider font-mono">
            Modified JSON (B)
          </label>
          <textarea
            id="json-b-input"
            value={jsonB}
            onChange={(e) => setJsonB(e.target.value)}
            rows={10}
            disabled={limitReached}
            className="w-full bg-white dark:bg-black border border-slate-300 dark:border-white/20 rounded-xl p-3.5 font-mono text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:border-blue-500 resize-y shadow-sm dark:shadow-none disabled:opacity-60"
            spellCheck={false}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          disabled={limitReached}
          onClick={handleCompare}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#0071e3] hover:bg-[#0077ed] active:scale-95 disabled:opacity-50 text-white text-sm font-medium transition-colors shadow-sm"
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>Compare JSON</span>
        </button>
      </div>

      {diffResult.error && (
        <div className="p-4 bg-white dark:bg-[#1c1c1e] border border-slate-300 dark:border-white/20 rounded-lg text-sm text-slate-800 dark:text-white">
          <span className="font-semibold text-slate-900 dark:text-white mr-2">Notice:</span>
          {diffResult.error}
        </div>
      )}

      {diffResult.diffs && (hasCompared || !limitReached) && (
        <ResultCard
          title={`Structural Differences (${diffResult.diffs.length} Changes)`}
        >
          {diffResult.diffs.length === 0 ? (
            <div className="py-6 text-center text-sm text-slate-500 dark:text-white/50">
              Both JSON documents are structurally and value identical.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm font-mono">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/40 uppercase tracking-wider text-xs">
                    <th className="py-2.5 pr-4">Property Path</th>
                    <th className="py-2.5 px-4">Change Type</th>
                    <th className="py-2.5 px-4">Previous Value (A)</th>
                    <th className="py-2.5 pl-4">New Value (B)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {diffResult.diffs.map((d, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-white/5">
                      <td className="py-2.5 pr-4 text-slate-900 dark:text-white font-bold">{d.path}</td>
                      <td className="py-2.5 px-4">
                        <span
                          className={`text-[11px] uppercase font-mono px-2 py-0.5 rounded font-semibold ${
                            d.type === "added"
                              ? "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/40"
                              : d.type === "removed"
                              ? "bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white/70 border border-slate-300 dark:border-white/20"
                              : "bg-slate-100 dark:bg-white/15 text-slate-800 dark:text-white border border-slate-200 dark:border-white/20"
                          }`}
                        >
                          {d.type}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-slate-500 dark:text-white/50 break-all">{d.oldValue || "—"}</td>
                      <td className="py-2.5 pl-4 text-slate-900 dark:text-white break-all">{d.newValue || "—"}</td>
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
