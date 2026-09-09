"use client";

import React, { useState, useMemo } from "react";
import { ArrowRightLeft } from "lucide-react";
import { ResultCard } from "@/components/ResultCard";
import { useUsage } from "@/components/UsageContext";
import { UsageLimitBanner } from "@/components/UsageLimitBanner";

export function Base64CodecTool() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("WTOOLS — Built by Wasee / Wyzuk");
  const [hasProcessed, setHasProcessed] = useState(false);
  const { limitReached, recordToolUsage } = useUsage();

  const result = useMemo(() => {
    if (!input) return { text: "", hex: "", base64Url: "", error: null };

    if (mode === "encode") {
      try {
        const encoder = new TextEncoder();
        const uint8 = encoder.encode(input);
        let binaryStr = "";
        for (let i = 0; i < uint8.length; i++) {
          binaryStr += String.fromCharCode(uint8[i]);
        }
        const base64 = btoa(binaryStr);
        const base64Url = base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
        const hex = Array.from(uint8)
          .map((b) => b.toString(16).padStart(2, "0"))
          .join(" ");

        return {
          base64,
          base64Url,
          hex,
          error: null,
        };
      } catch (err: unknown) {
        return { error: err instanceof Error ? err.message : "Encoding failed." };
      }
    } else {
      // Decode
      try {
        let cleanBase64 = input.trim().replace(/-/g, "+").replace(/_/g, "/");
        while (cleanBase64.length % 4) {
          cleanBase64 += "=";
        }

        const binaryStr = atob(cleanBase64);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }
        const decoder = new TextDecoder("utf-8");
        const text = decoder.decode(bytes);
        const hex = Array.from(bytes)
          .map((b) => b.toString(16).padStart(2, "0"))
          .join(" ");

        return {
          decodedText: text,
          hex,
          error: null,
        };
      } catch (err: unknown) {
        return { error: `Invalid Base64 sequence: ${err instanceof Error ? err.message : "decode error"}` };
      }
    }
  }, [input, mode]);

  const handleProcess = async () => {
    if (!input || limitReached) return;
    setHasProcessed(true);
    await recordToolUsage();
  };

  return (
    <div className="space-y-6">
      {limitReached && <UsageLimitBanner />}

      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg w-fit">
        <button
          type="button"
          disabled={limitReached}
          onClick={() => setMode("encode")}
          className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            mode === "encode"
              ? "bg-white dark:bg-[#1a1a1a] text-[#0071e3] dark:text-blue-400 shadow-sm"
              : "text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          Encode
        </button>
        <button
          type="button"
          disabled={limitReached}
          onClick={() => setMode("decode")}
          className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            mode === "decode"
              ? "bg-white dark:bg-[#1a1a1a] text-[#0071e3] dark:text-blue-400 shadow-sm"
              : "text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          Decode
        </button>
      </div>

      <div className="p-6 bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-white/10 rounded-2xl space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_-4px_rgba(0,0,0,0.05)] transition-colors">
        <label htmlFor="base64-input" className="block text-xs font-semibold text-slate-700 dark:text-white/70 uppercase tracking-wider font-mono">
          {mode === "encode" ? "Plain Text to Encode" : "Base64 String to Decode"}
        </label>
        <textarea
          id="base64-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          disabled={limitReached}
          placeholder={mode === "encode" ? "Enter text to convert to Base64..." : "Paste Base64 string..."}
          className="w-full bg-white dark:bg-black border border-slate-300 dark:border-white/20 rounded-lg p-3.5 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:border-blue-500 disabled:opacity-60"
        />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
          <span className="text-xs text-slate-500 dark:text-white/40 font-mono">
            {input.length} characters
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={limitReached}
              onClick={() => setInput("")}
              className="text-xs text-slate-500 dark:text-white/50 hover:text-slate-800 dark:hover:text-white transition-colors"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleProcess}
              disabled={limitReached}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#0071e3] hover:bg-[#0077ed] active:scale-95 disabled:opacity-50 text-white text-sm font-medium transition-colors shadow-sm"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>{mode === "encode" ? "Encode text" : "Decode Base64"}</span>
            </button>
          </div>
        </div>
      </div>

      {result.error && (
        <div className="p-4 bg-white dark:bg-[#1c1c1e] border border-slate-300 dark:border-white/20 rounded-lg text-sm text-slate-800 dark:text-white">
          <span className="font-semibold text-slate-900 dark:text-white mr-2">Notice:</span>
          {result.error}
        </div>
      )}

      {mode === "encode" && result.base64 && (hasProcessed || !limitReached) && (
        <ResultCard
          title="Encoded Outputs"
          items={[
            { label: "Standard Base64", value: result.base64, copyValue: result.base64, mono: true },
            { label: "URL-Safe Base64", value: result.base64Url, copyValue: result.base64Url, mono: true },
            { label: "Hexadecimal Bytes", value: result.hex, copyValue: result.hex, mono: true },
          ]}
        />
      )}

      {mode === "decode" && result.decodedText && (hasProcessed || !limitReached) && (
        <ResultCard
          title="Decoded Output"
          items={[
            { label: "Decoded UTF-8 Text", value: result.decodedText, copyValue: result.decodedText },
            { label: "Hex Representation", value: result.hex, copyValue: result.hex, mono: true },
          ]}
        />
      )}
    </div>
  );
}
