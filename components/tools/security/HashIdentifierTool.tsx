"use client";

import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { ResultCard } from "@/components/ResultCard";
import { useUsage } from "@/components/UsageContext";
import { UsageLimitBanner } from "@/components/UsageLimitBanner";

interface HashMatch {
  name: string;
  category: string;
  confidence: "High" | "Medium" | "Low";
  description: string;
}

export function HashIdentifierTool() {
  const [hash, setHash] = useState("5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8");
  const [hasIdentified, setHasIdentified] = useState(false);
  const { limitReached, recordToolUsage } = useUsage();

  const analysis = useMemo(() => {
    const raw = hash.trim();
    if (!raw) return null;

    const length = raw.length;
    const isHex = /^[0-9a-fA-F]+$/.test(raw);
    const matches: HashMatch[] = [];

    // Prefix patterns
    if (raw.startsWith("$2a$") || raw.startsWith("$2b$") || raw.startsWith("$2y$")) {
      matches.push({
        name: "bcrypt",
        category: "Password Hash",
        confidence: "High",
        description: "OpenBSD Blowfish password hashing function with adaptive work factor.",
      });
    } else if (raw.startsWith("$argon2id$") || raw.startsWith("$argon2i$")) {
      matches.push({
        name: "Argon2",
        category: "Password Hash (PHC Winner)",
        confidence: "High",
        description: "Memory-hard password hashing algorithm.",
      });
    } else if (raw.startsWith("$6$")) {
      matches.push({
        name: "SHA-512 Crypt",
        category: "UNIX Shadow Password",
        confidence: "High",
        description: "Linux /etc/shadow standard SHA-512 password hash.",
      });
    } else if (raw.startsWith("$1$")) {
      matches.push({
        name: "MD5 Crypt",
        category: "Legacy UNIX Shadow Password",
        confidence: "High",
        description: "FreeBSD / Linux legacy MD5 shadow password hash.",
      });
    }

    // Length-based hex matches
    if (isHex) {
      if (length === 32) {
        matches.push(
          {
            name: "MD5",
            category: "Cryptographic Digest / Checksum",
            confidence: "High",
            description: "128-bit message digest algorithm widely used for checksums.",
          },
          {
            name: "NTLM",
            category: "Windows Authentication",
            confidence: "Medium",
            description: "Microsoft Windows NT LAN Manager password hash (MD4 digest of UTF-16LE password).",
          },
          {
            name: "MD4",
            category: "Legacy Digest",
            confidence: "Low",
            description: "Predecessor to MD5 with known collision vulnerabilities.",
          }
        );
      } else if (length === 40) {
        matches.push(
          {
            name: "SHA-1",
            category: "Cryptographic Digest",
            confidence: "High",
            description: "160-bit hash function commonly found in Git object IDs and legacy TLS.",
          },
          {
            name: "RIPEMD-160",
            category: "Cryptographic Digest",
            confidence: "Low",
            description: "160-bit cryptographic hash function used in Bitcoin address generation.",
          }
        );
      } else if (length === 56) {
        matches.push({
          name: "SHA-224",
          category: "SHA-2 Family",
          confidence: "High",
          description: "224-bit truncated variant of SHA-256.",
        });
      } else if (length === 64) {
        matches.push(
          {
            name: "SHA-256",
            category: "SHA-2 Family (Industry Standard)",
            confidence: "High",
            description: "256-bit secure hash function widely used in TLS, blockchain, and digital signatures.",
          },
          {
            name: "BLAKE2s",
            category: "High-Performance Digest",
            confidence: "Medium",
            description: "256-bit cryptographic hash optimized for 8-to-32-bit platforms.",
          }
        );
      } else if (length === 96) {
        matches.push({
          name: "SHA-384",
          category: "SHA-2 Family",
          confidence: "High",
          description: "384-bit truncated variant of SHA-512.",
        });
      } else if (length === 128) {
        matches.push(
          {
            name: "SHA-512",
            category: "SHA-2 Family",
            confidence: "High",
            description: "512-bit secure hash function providing high collision resistance.",
          },
          {
            name: "Whirlpool",
            category: "Cryptographic Digest",
            confidence: "Low",
            description: "512-bit hash based on a modified Advanced Encryption Standard (AES).",
          }
        );
      } else if (length === 8) {
        matches.push({
          name: "CRC32",
          category: "Cyclic Redundancy Check",
          confidence: "High",
          description: "32-bit error-detecting code used in ZIP, PNG, and Ethernet.",
        });
      }
    }

    return {
      length,
      isHex,
      matches,
    };
  }, [hash]);

  const handleIdentify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!analysis || limitReached) return;
    setHasIdentified(true);
    await recordToolUsage();
  };

  return (
    <div className="space-y-6">
      {limitReached && <UsageLimitBanner />}

      <form onSubmit={handleIdentify} className="p-6 bg-white dark:bg-[#0d0d0d] border border-slate-200 dark:border-white/10 rounded-xl space-y-4 shadow-sm dark:shadow-none transition-colors">
        <label htmlFor="hash-ident-input" className="block text-xs font-semibold text-slate-700 dark:text-white/70 uppercase tracking-wider font-mono">
          Enter Hash String
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            id="hash-ident-input"
            type="text"
            value={hash}
            onChange={(e) => setHash(e.target.value)}
            disabled={limitReached}
            placeholder="Paste an unknown hash string (e.g. 5e884898da28...)"
            className="w-full bg-white dark:bg-black border border-slate-300 dark:border-white/20 rounded-lg px-4 py-2.5 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:border-blue-500 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={limitReached}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-medium transition-colors shadow-sm shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>Identify hash</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-white/50 pt-1">
          <span>Examples:</span>
          {[
            { label: "SHA-256 (64 chars)", h: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8" },
            { label: "MD5 (32 chars)", h: "900150983cd24fb0d6963f7d28e17f72" },
            { label: "SHA-1 (40 chars)", h: "a94a8fe5ccb19ba61c4c0873d391e987982fbbd3" },
            { label: "bcrypt", h: "$2a$12$R9h/cIPz0gi.URNNXRkh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW" },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              disabled={limitReached}
              onClick={() => {
                setHash(item.h);
              }}
              className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-white/70 hover:border-blue-500 hover:text-blue-600 dark:hover:text-white transition-colors disabled:opacity-50"
            >
              {item.label}
            </button>
          ))}
        </div>
      </form>

      {analysis && (hasIdentified || !limitReached) && (
        <ResultCard title={`Hash Signature Analysis (${analysis.length} characters)`}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono border-b border-slate-200 dark:border-white/10 pb-4">
              <div>
                <span className="text-slate-500 dark:text-white/40 block text-[11px] mb-0.5">Length</span>
                <span className="text-slate-900 dark:text-white font-bold text-sm">{analysis.length} chars</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-white/40 block text-[11px] mb-0.5">Format</span>
                <span className={analysis.isHex ? "text-blue-600 dark:text-blue-400 font-semibold text-sm" : "text-slate-700 dark:text-white/70 text-sm"}>
                  {analysis.isHex ? "Hexadecimal (0-9, a-f)" : "ASCII / Structured"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-white/40 block text-[11px] mb-0.5">Candidates</span>
                <span className="text-slate-900 dark:text-white font-bold text-sm">{analysis.matches.length} matched</span>
              </div>
            </div>

            {analysis.matches.length === 0 ? (
              <div className="py-6 text-center text-sm text-slate-500 dark:text-white/50">
                No matching standard hash signature identified for this length and format.
              </div>
            ) : (
              <div className="space-y-2">
                {analysis.matches.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">{m.name}</span>
                        <span className="text-xs font-mono px-2 py-0.5 rounded border border-slate-200 dark:border-white/20 bg-white dark:bg-white/5 text-slate-700 dark:text-white/70">
                          {m.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-white/60 mt-1">{m.description}</p>
                    </div>

                    <div className="shrink-0">
                      <span className="text-xs font-mono uppercase text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1 rounded-md font-semibold">
                        {m.confidence} Confidence
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ResultCard>
      )}
    </div>
  );
}
