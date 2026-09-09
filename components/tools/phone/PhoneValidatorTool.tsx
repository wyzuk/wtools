"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { parsePhoneNumberFromString, CountryCode } from "libphonenumber-js";
import { ResultCard } from "@/components/ResultCard";
import { useUsage } from "@/components/UsageContext";
import { UsageLimitBanner } from "@/components/UsageLimitBanner";

const COMMON_COUNTRIES: { code: CountryCode; name: string }[] = [
  { code: "US", name: "United States (+1)" },
  { code: "GB", name: "United Kingdom (+44)" },
  { code: "CA", name: "Canada (+1)" },
  { code: "DE", name: "Germany (+49)" },
  { code: "FR", name: "France (+33)" },
  { code: "IN", name: "India (+91)" },
  { code: "BD", name: "Bangladesh (+880)" },
  { code: "AU", name: "Australia (+61)" },
  { code: "JP", name: "Japan (+81)" },
  { code: "BR", name: "Brazil (+55)" },
];

export function PhoneValidatorTool() {
  const [phone, setPhone] = useState("+1 415 555 2671");
  const [defaultCountry, setDefaultCountry] = useState<CountryCode>("US");
  const [analyzed, setAnalyzed] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null);
  const { limitReached, recordToolUsage } = useUsage();

  const handleValidate = async (inputNumber = phone, country = defaultCountry) => {
    if (!inputNumber.trim() || limitReached) return;

    try {
      const parsed = parsePhoneNumberFromString(inputNumber.trim(), country);
      if (!parsed) {
        setResult({
          valid: false,
          possible: false,
          error: "Could not parse phone number. Ensure it has a valid international dialing code or select a default country.",
        });
      } else {
        const lineType = parsed.getType() || "UNKNOWN";
        const humanLineType =
          lineType === "MOBILE"
            ? "Mobile / Cellular"
            : lineType === "FIXED_LINE"
            ? "Fixed Line / Landline"
            : lineType === "FIXED_LINE_OR_MOBILE"
            ? "Fixed Line or Mobile"
            : lineType === "TOLL_FREE"
            ? "Toll-Free"
            : lineType === "VOIP"
            ? "VoIP / Virtual"
            : lineType === "PREMIUM_RATE"
            ? "Premium Rate"
            : lineType;

        setResult({
          valid: parsed.isValid(),
          possible: parsed.isPossible(),
          country: parsed.country || "Unknown",
          countryCallingCode: `+${parsed.countryCallingCode}`,
          nationalNumber: parsed.nationalNumber,
          e164: parsed.format("E.164"),
          international: parsed.format("INTERNATIONAL"),
          national: parsed.format("NATIONAL"),
          rfc3966: parsed.format("RFC3966"),
          lineType: humanLineType,
        });
        await recordToolUsage();
      }
    } catch {
      setResult({
        valid: false,
        possible: false,
        error: "Malformed number input.",
      });
    }
    setAnalyzed(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleValidate();
  };

  return (
    <div className="space-y-6">
      {limitReached && <UsageLimitBanner />}

      <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-white/10 rounded-2xl space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_-4px_rgba(0,0,0,0.05)] transition-colors">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label htmlFor="phone-input" className="block text-xs font-semibold text-slate-700 dark:text-white/70 mb-2 uppercase tracking-wider font-mono">
              Phone Number (with Country Code or National)
            </label>
            <input
              id="phone-input"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +1 415 555 2671 or 0712345678"
              disabled={limitReached}
              className="w-full bg-white dark:bg-black border border-slate-300 dark:border-white/20 rounded-lg px-4 py-2.5 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:border-blue-500 disabled:opacity-60"
            />
          </div>

          <div>
            <label htmlFor="country-select" className="block text-xs font-semibold text-slate-700 dark:text-white/70 mb-2 uppercase tracking-wider font-mono">
              Default Country Fallback
            </label>
            <select
              id="country-select"
              value={defaultCountry}
              disabled={limitReached}
              onChange={(e) => setDefaultCountry(e.target.value as CountryCode)}
              className="w-full bg-white dark:bg-black border border-slate-300 dark:border-white/20 rounded-lg px-3 py-2.5 text-sm font-mono text-slate-900 dark:text-white focus:border-blue-500 disabled:opacity-60"
            >
              {COMMON_COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-white/50">
            <span>Examples:</span>
            {["+1 415 555 2671", "+44 20 7946 0991", "+49 30 123456", "+880 1711 000000"].map((preset) => (
              <button
                key={preset}
                type="button"
                disabled={limitReached}
                onClick={() => {
                  setPhone(preset);
                  handleValidate(preset, defaultCountry);
                }}
                className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-white/70 hover:border-blue-500 hover:text-[#0071e3] dark:hover:text-white transition-colors disabled:opacity-50"
              >
                {preset}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={limitReached}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#0071e3] hover:bg-[#0077ed] active:scale-95 disabled:opacity-50 text-white text-sm font-medium transition-colors shadow-sm"
          >
            <Search className="w-4 h-4" />
            <span>Validate number</span>
          </button>
        </div>
      </form>

      <div className="p-4 bg-slate-50 dark:bg-[#0d0d0d] border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-600 dark:text-white/50 leading-relaxed">
        <span className="font-semibold text-slate-900 dark:text-white mr-1.5">Privacy Notice:</span>
        Phone validation adheres to ITU-T E.164 telecommunication standards and carrier routing ranges. WTOOLS never collects, stores, or transmits phone numbers to third-party databases.
      </div>

      {analyzed && result && (
        <div className="space-y-6">
          {result.error ? (
            <div className="p-4 bg-white dark:bg-[#1c1c1e] border border-slate-300 dark:border-white/20 rounded-lg text-sm text-slate-800 dark:text-white">
              <span className="font-semibold text-slate-900 dark:text-white mr-2">Notice:</span>
              {result.error}
            </div>
          ) : (
            <>
              <div className="p-5 bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-white/10 rounded-xl flex flex-wrap items-center justify-between gap-4 text-xs font-mono shadow-sm dark:shadow-none">
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 dark:text-white/40 text-xs">Status:</span>
                  <span
                    className={`font-semibold px-2.5 py-1 rounded text-xs ${
                      result.valid
                        ? "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/40"
                        : "bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white/70 border border-slate-300 dark:border-white/20"
                    }`}
                  >
                    {result.valid ? "Valid Telephone Number" : "Invalid / Unassigned Number"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 dark:text-white/40 text-xs">Feasible Length:</span>
                  <span className="text-slate-900 dark:text-white font-medium">{result.possible ? "Yes (Matches numbering plan)" : "No"}</span>
                </div>
              </div>

              <ResultCard
                title={`Telecom Details: ${result.e164}`}
                items={[
                  { label: "Standard E.164 Format", value: result.e164, copyValue: result.e164, mono: true },
                  { label: "International Format", value: result.international, copyValue: result.international, mono: true },
                  { label: "National Format", value: result.national, copyValue: result.national, mono: true },
                  { label: "RFC 3966 URI", value: result.rfc3966, copyValue: result.rfc3966, mono: true },
                  { label: "Country Code (ISO 3166)", value: result.country, copyValue: result.country, mono: true },
                  { label: "Country Calling Code", value: result.countryCallingCode, copyValue: result.countryCallingCode, mono: true },
                  { label: "National Number Portion", value: result.nationalNumber, copyValue: result.nationalNumber, mono: true },
                  { label: "Detected Line Type", value: result.lineType, mono: true },
                ]}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
