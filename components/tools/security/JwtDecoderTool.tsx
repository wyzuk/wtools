"use client";

import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { ResultCard } from "@/components/ResultCard";
import { useUsage } from "@/components/UsageContext";
import { UsageLimitBanner } from "@/components/UsageLimitBanner";

export function JwtDecoderTool() {
  const [jwt, setJwt] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ3YXNlZS13eXp1ayIsIm5hbWUiOiJXYXNlZSAvIFd5enVrIiwicm9sZSI6ImRldmVsb3BlciIsImlhdCI6MTczMDAwMDAwMCwiZXhwIjoyMDgwMDAwMDAwfQ.signature_verification_demo"
  );
  const [hasDecoded, setHasDecoded] = useState(false);
  const { limitReached, recordToolUsage } = useUsage();

  const decoded = useMemo(() => {
    const token = jwt.trim();
    if (!token) return null;

    const parts = token.split(".");
    if (parts.length !== 3) {
      return { valid: false, error: "Invalid JWT format. A valid token must have exactly three dot-separated segments (header.payload.signature)." };
    }

    const base64UrlDecode = (str: string) => {
      let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
      while (base64.length % 4) {
        base64 += "=";
      }
      try {
        const decodedStr = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        return JSON.parse(decodedStr);
      } catch {
        return null;
      }
    };

    const header = base64UrlDecode(parts[0]);
    const payload = base64UrlDecode(parts[1]);

    if (!header || !payload) {
      return { valid: false, error: "Failed to decode Base64URL segment. The token contains malformed JSON or encoding." };
    }

    // Inspect standard claims
    let expDate = "None";
    let isExpired = false;
    if (payload.exp && typeof payload.exp === "number") {
      const d = new Date(payload.exp * 1000);
      expDate = `${d.toUTCString()} (Epoch: ${payload.exp})`;
      isExpired = d.getTime() < Date.now();
    }

    let iatDate = "None";
    if (payload.iat && typeof payload.iat === "number") {
      iatDate = `${new Date(payload.iat * 1000).toUTCString()} (Epoch: ${payload.iat})`;
    }

    return {
      valid: true,
      header,
      payload,
      signature: parts[2],
      expDate,
      isExpired,
      iatDate,
    };
  }, [jwt]);

  const handleDecode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!decoded || !decoded.valid || limitReached) return;
    setHasDecoded(true);
    await recordToolUsage();
  };

  return (
    <div className="space-y-6">
      {limitReached && <UsageLimitBanner />}

      <form onSubmit={handleDecode} className="p-6 bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-white/10 rounded-2xl space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_-4px_rgba(0,0,0,0.05)] transition-colors">
        <label htmlFor="jwt-input" className="block text-xs font-semibold text-slate-700 dark:text-white/70 uppercase tracking-wider font-mono">
          Encoded JWT Token (Header.Payload.Signature)
        </label>
        <textarea
          id="jwt-input"
          value={jwt}
          onChange={(e) => setJwt(e.target.value)}
          rows={4}
          disabled={limitReached}
          placeholder="Paste your Bearer / ID / Access JWT token here..."
          className="w-full bg-white dark:bg-black border border-slate-300 dark:border-white/20 rounded-lg p-3.5 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:border-blue-500 disabled:opacity-60 break-all"
        />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
          <span className="text-xs text-slate-500 dark:text-white/40 font-mono">
            Decoded locally in memory &bull; Zero server transmission
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={limitReached}
              onClick={() => setJwt("")}
              className="text-xs text-slate-500 dark:text-white/50 hover:text-slate-800 dark:hover:text-white transition-colors"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={limitReached}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#0071e3] hover:bg-[#0077ed] active:scale-95 disabled:opacity-50 text-white text-sm font-medium transition-colors shadow-sm"
            >
              <Search className="w-4 h-4" />
              <span>Decode token</span>
            </button>
          </div>
        </div>
      </form>

      {decoded && !decoded.valid && (
        <div className="p-4 bg-white dark:bg-[#1c1c1e] border border-slate-300 dark:border-white/20 rounded-lg text-sm text-slate-800 dark:text-white">
          <span className="font-semibold text-slate-900 dark:text-white mr-2">Notice:</span>
          {decoded.error}
        </div>
      )}

      {decoded && decoded.valid && (hasDecoded || !limitReached) && (
        <div className="space-y-6">
          {/* Status Bar */}
          <div className="p-5 bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-white/10 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono shadow-sm dark:shadow-none">
            <div>
              <span className="text-slate-500 dark:text-white/40 block text-[11px] mb-0.5">Algorithm (alg)</span>
              <span className="text-[#0071e3] dark:text-blue-400 font-bold text-sm">{decoded.header.alg || "None"}</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-white/40 block text-[11px] mb-0.5">Expiration Status</span>
              <span className={decoded.isExpired ? "text-slate-800 dark:text-white bg-slate-200 dark:bg-white/10 px-2.5 py-0.5 rounded border border-slate-300 dark:border-white/20 font-semibold" : "text-[#0071e3] dark:text-blue-400 font-semibold"}>
                {decoded.expDate === "None" ? "No expiration set" : decoded.isExpired ? "EXPIRED" : "ACTIVE / VALID"}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-white/40 block text-[11px] mb-0.5">Subject (sub)</span>
              <span className="text-slate-900 dark:text-white font-medium text-sm">{decoded.payload.sub || "Unspecified"}</span>
            </div>
          </div>

          {/* Header Card */}
          <ResultCard
            title="JWT Header (Algorithm & Token Type)"
            rawJson={decoded.header}
          />

          {/* Payload Card */}
          <ResultCard
            title="JWT Payload (Claims)"
            rawJson={decoded.payload}
          />

          {/* Timestamps Card */}
          <ResultCard
            title="Timestamps & Claim Analysis"
            items={[
              { label: "Issued At (iat)", value: decoded.iatDate, mono: true },
              { label: "Expires At (exp)", value: decoded.expDate, mono: true },
              { label: "Signature Segment", value: decoded.signature, copyValue: decoded.signature, mono: true },
            ]}
          />
        </div>
      )}
    </div>
  );
}
