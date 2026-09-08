"use client";

import React, { useState, useEffect, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import { ResultCard } from "@/components/ResultCard";
import { CopyButton } from "@/components/CopyButton";
import { useUsage } from "@/components/UsageContext";
import { UsageLimitBanner } from "@/components/UsageLimitBanner";

// RFC 9562 UUID v7 generator
function generateUuidV7(): string {
  const timestamp = BigInt(Date.now());
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  // 48-bit timestamp
  const mask8 = BigInt(0xff);
  bytes[0] = Number((timestamp >> BigInt(40)) & mask8);
  bytes[1] = Number((timestamp >> BigInt(32)) & mask8);
  bytes[2] = Number((timestamp >> BigInt(24)) & mask8);
  bytes[3] = Number((timestamp >> BigInt(16)) & mask8);
  bytes[4] = Number((timestamp >> BigInt(8)) & mask8);
  bytes[5] = Number(timestamp & mask8);

  // Version 7 (0b0111) in highest 4 bits of byte 6
  bytes[6] = (bytes[6] & 0x0f) | 0x70;
  // Variant 1 (0b10) in highest 2 bits of byte 8
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

// ULID Crockford Base32
function generateUlid(): string {
  const ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  let now = Date.now();
  let timeStr = "";
  for (let i = 9; i >= 0; i--) {
    const mod = now % 32;
    timeStr = ENCODING.charAt(mod) + timeStr;
    now = (now - mod) / 32;
  }
  const randomBytes = new Uint8Array(10);
  crypto.getRandomValues(randomBytes);
  let randStr = "";
  for (let i = 0; i < 16; i++) {
    const rand = Math.floor(Math.random() * 32);
    randStr += ENCODING.charAt(rand);
  }
  return timeStr + randStr;
}

export function UuidGeneratorTool() {
  const [version, setVersion] = useState<"v4" | "v7" | "ulid">("v4");
  const [count, setCount] = useState<number>(5);
  const [uppercase, setUppercase] = useState(false);
  const [noHyphens, setNoHyphens] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const { limitReached, recordToolUsage } = useUsage();

  const generate = useCallback(() => {
    const arr: string[] = [];
    for (let i = 0; i < count; i++) {
      let id = "";
      if (version === "v4") {
        id = crypto.randomUUID();
      } else if (version === "v7") {
        id = generateUuidV7();
      } else {
        id = generateUlid();
      }

      if (noHyphens && version !== "ulid") {
        id = id.replace(/-/g, "");
      }
      if (uppercase) {
        id = id.toUpperCase();
      } else if (version !== "ulid") {
        id = id.toLowerCase();
      }
      arr.push(id);
    }
    setResults(arr);
  }, [version, count, uppercase, noHyphens]);

  useEffect(() => {
    generate();
  }, [generate]);

  const handleRegenerate = async () => {
    if (limitReached) return;
    generate();
    await recordToolUsage();
  };

  const allText = results.join("\n");

  return (
    <div className="space-y-6">
      {limitReached && <UsageLimitBanner />}

      {/* Configuration Controls */}
      <div className="p-6 bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-white/10 rounded-2xl space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_-4px_rgba(0,0,0,0.05)] transition-colors">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="uuid-type" className="block text-xs font-semibold text-slate-700 dark:text-white/70 mb-2 uppercase tracking-wider font-mono">
              Identifier Type
            </label>
            <select
              id="uuid-type"
              value={version}
              disabled={limitReached}
              onChange={(e) => setVersion(e.target.value as "v4" | "v7" | "ulid")}
              className="w-full bg-white dark:bg-black border border-slate-300 dark:border-white/20 rounded-lg px-3 py-2.5 text-sm font-mono text-slate-900 dark:text-white focus:border-blue-500 disabled:opacity-60"
            >
              <option value="v4">UUID v4 (Random Cryptographic)</option>
              <option value="v7">UUID v7 (Time-Ordered RFC 9562)</option>
              <option value="ulid">ULID (Sortable Crockford Base32)</option>
            </select>
          </div>

          <div>
            <label htmlFor="uuid-qty" className="block text-xs font-semibold text-slate-700 dark:text-white/70 mb-2 uppercase tracking-wider font-mono">
              Quantity to Generate
            </label>
            <select
              id="uuid-qty"
              value={count}
              disabled={limitReached}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full bg-white dark:bg-black border border-slate-300 dark:border-white/20 rounded-lg px-3 py-2.5 text-sm font-mono text-slate-900 dark:text-white focus:border-blue-500 disabled:opacity-60"
            >
              {[1, 5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "identifier" : "identifiers"}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              disabled={limitReached}
              onClick={handleRegenerate}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#0071e3] hover:bg-[#0077ed] active:scale-95 disabled:opacity-50 text-white text-sm font-medium transition-colors shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Generate new</span>
            </button>
          </div>
        </div>

        {/* Checkbox Options */}
        <div className="flex flex-wrap items-center gap-4 pt-1 text-xs font-mono text-slate-700 dark:text-white">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={uppercase}
              disabled={limitReached}
              onChange={(e) => setUppercase(e.target.checked)}
              className="accent-blue-500 rounded"
            />
            <span>Uppercase Letters</span>
          </label>

          {version !== "ulid" && (
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={noHyphens}
                disabled={limitReached}
                onChange={(e) => setNoHyphens(e.target.checked)}
                className="accent-blue-500 rounded"
              />
              <span>Remove Hyphens</span>
            </label>
          )}
        </div>
      </div>

      {/* Results Output */}
      <ResultCard
        title={`Generated Identifiers (${results.length})`}
        copyAllText={allText}
      >
        <div className="divide-y divide-slate-100 dark:divide-white/5 font-mono text-xs sm:text-sm">
          {results.map((id, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between gap-4">
              <span className="text-slate-900 dark:text-white font-medium break-all">{id}</span>
              <CopyButton text={id} label="Copy" />
            </div>
          ))}
        </div>
      </ResultCard>
    </div>
  );
}
