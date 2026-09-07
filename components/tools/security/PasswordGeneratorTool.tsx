"use client";

import React, { useState, useEffect, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import { ResultCard } from "@/components/ResultCard";
import { CopyButton } from "@/components/CopyButton";
import { useUsage } from "@/components/UsageContext";
import { UsageLimitBanner } from "@/components/UsageLimitBanner";

export function PasswordGeneratorTool() {
  const [length, setLength] = useState(24);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [batch, setBatch] = useState<string[]>([]);
  const { limitReached, recordToolUsage } = useUsage();

  const generatePassword = useCallback(() => {
    let charset = "";
    if (useUpper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (useLower) charset += "abcdefghijklmnopqrstuvwxyz";
    if (useNumbers) charset += "0123456789";
    if (useSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (!charset) charset = "abcdefghijklmnopqrstuvwxyz";

    const generateOne = () => {
      const array = new Uint32Array(length);
      crypto.getRandomValues(array);
      let res = "";
      for (let i = 0; i < length; i++) {
        res += charset[array[i] % charset.length];
      }
      return res;
    };

    setPassword(generateOne());
    setBatch(Array.from({ length: 5 }, () => generateOne()));
  }, [length, useUpper, useLower, useNumbers, useSymbols]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const handleRegenerate = async () => {
    if (limitReached) return;
    generatePassword();
    await recordToolUsage();
  };

  // Calculate entropy
  let poolSize = 0;
  if (useUpper) poolSize += 26;
  if (useLower) poolSize += 26;
  if (useNumbers) poolSize += 10;
  if (useSymbols) poolSize += 28;
  const entropy = poolSize > 0 ? Math.round(length * Math.log2(poolSize)) : 0;

  return (
    <div className="space-y-6">
      {limitReached && <UsageLimitBanner />}

      {/* Generated Display */}
      <div className="p-6 bg-white dark:bg-[#0d0d0d] border border-slate-200 dark:border-white/10 rounded-xl space-y-4 shadow-sm dark:shadow-none transition-colors">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full">
            <span className="text-xs font-semibold text-slate-700 dark:text-white/70 uppercase tracking-wider font-mono block mb-2">
              Cryptographically Secure Password
            </span>
            <div className="p-4 bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/15 rounded-lg font-mono text-base sm:text-lg text-slate-900 dark:text-white font-bold break-all flex items-center justify-between gap-3">
              <span className="text-blue-600 dark:text-blue-400">{password}</span>
              <CopyButton text={password} label="Copy" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="text-slate-500 dark:text-white/40">Entropy:</span>
            <span className="text-slate-900 dark:text-white font-bold">{entropy} bits</span>
            <span className="text-xs uppercase px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 font-semibold font-sans">
              {entropy > 100 ? "Very strong" : entropy > 60 ? "Strong" : "Moderate"}
            </span>
          </div>

          <button
            type="button"
            disabled={limitReached}
            onClick={handleRegenerate}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-medium transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Generate new</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 bg-white dark:bg-[#0d0d0d] border border-slate-200 dark:border-white/10 rounded-xl space-y-5 shadow-sm dark:shadow-none transition-colors">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="length-range" className="text-xs font-semibold text-slate-700 dark:text-white/70 uppercase tracking-wider font-mono">
              Password Length: <span className="text-blue-600 dark:text-blue-400 font-bold">{length} characters</span>
            </label>
          </div>
          <input
            id="length-range"
            type="range"
            min={8}
            max={64}
            value={length}
            disabled={limitReached}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-blue-500 cursor-pointer"
          />
          <div className="flex justify-between text-xs font-mono text-slate-400 dark:text-white/40 mt-1">
            <span>8 min</span>
            <span>24 standard</span>
            <span>64 max</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {[
            { label: "Uppercase (A-Z)", state: useUpper, set: setUseUpper },
            { label: "Lowercase (a-z)", state: useLower, set: setUseLower },
            { label: "Numbers (0-9)", state: useNumbers, set: setUseNumbers },
            { label: "Symbols (!@#$)", state: useSymbols, set: setUseSymbols },
          ].map((item, idx) => (
            <label
              key={idx}
              className="flex items-center gap-2.5 p-3 bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg cursor-pointer hover:border-slate-300 dark:hover:border-white/20 text-xs font-medium text-slate-800 dark:text-white select-none transition-colors"
            >
              <input
                type="checkbox"
                checked={item.state}
                disabled={limitReached}
                onChange={(e) => item.set(e.target.checked)}
                className="accent-blue-500 rounded w-4 h-4"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Batch Generator */}
      <ResultCard title="Alternative Variations">
        <div className="divide-y divide-slate-100 dark:divide-white/5 font-mono text-xs sm:text-sm">
          {batch.map((pass, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between gap-4">
              <span className="text-slate-800 dark:text-white/80 break-all">{pass}</span>
              <CopyButton text={pass} label="Copy" />
            </div>
          ))}
        </div>
      </ResultCard>
    </div>
  );
}
