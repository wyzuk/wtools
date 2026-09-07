"use client";

import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { parsePhoneNumberFromString, CountryCode } from "libphonenumber-js";
import { ResultCard } from "@/components/ResultCard";
import { useUsage } from "@/components/UsageContext";
import { UsageLimitBanner } from "@/components/UsageLimitBanner";

export function PhoneFormatterTool() {
  const [phone, setPhone] = useState("+1 800 555 0199");
  const [country, setCountry] = useState<CountryCode>("US");
  const [hasFormatted, setHasFormatted] = useState(false);
  const { limitReached, recordToolUsage } = useUsage();

  const formatted = useMemo(() => {
    if (!phone.trim()) return null;

    try {
      const parsed = parsePhoneNumberFromString(phone.trim(), country);
      if (!parsed) {
        return { valid: false, error: "Unable to parse number with current country context." };
      }

      return {
        valid: true,
        e164: parsed.format("E.164"),
        international: parsed.format("INTERNATIONAL"),
        national: parsed.format("NATIONAL"),
        rfc3966: parsed.format("RFC3966"),
        country: parsed.country,
        countryCallingCode: `+${parsed.countryCallingCode}`,
        nationalNumber: parsed.nationalNumber,
      };
    } catch {
      return { valid: false, error: "Parsing exception encountered." };
    }
  }, [phone, country]);

  const handleFormat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formatted || !formatted.valid || limitReached) return;
    setHasFormatted(true);
    await recordToolUsage();
  };

  return (
    <div className="space-y-6">
      {limitReached && <UsageLimitBanner />}

      <form onSubmit={handleFormat} className="p-6 bg-white dark:bg-[#0d0d0d] border border-slate-200 dark:border-white/10 rounded-xl space-y-4 shadow-sm dark:shadow-none transition-colors">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label htmlFor="formatter-input" className="block text-xs font-semibold text-slate-700 dark:text-white/70 mb-2 uppercase tracking-wider font-mono">
              Raw Phone Number
            </label>
            <input
              id="formatter-input"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 4155552671 or +447911123456"
              disabled={limitReached}
              className="w-full bg-white dark:bg-black border border-slate-300 dark:border-white/20 rounded-lg px-4 py-2.5 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:border-blue-500 disabled:opacity-60"
            />
          </div>

          <div>
            <label htmlFor="country-fallback" className="block text-xs font-semibold text-slate-700 dark:text-white/70 mb-2 uppercase tracking-wider font-mono">
              Country Region
            </label>
            <select
              id="country-fallback"
              value={country}
              disabled={limitReached}
              onChange={(e) => setCountry(e.target.value as CountryCode)}
              className="w-full bg-white dark:bg-black border border-slate-300 dark:border-white/20 rounded-lg px-3 py-2.5 text-sm font-mono text-slate-900 dark:text-white focus:border-blue-500 disabled:opacity-60"
            >
              <option value="US">US / Canada (+1)</option>
              <option value="GB">United Kingdom (+44)</option>
              <option value="DE">Germany (+49)</option>
              <option value="FR">France (+33)</option>
              <option value="IN">India (+91)</option>
              <option value="BD">Bangladesh (+880)</option>
              <option value="AU">Australia (+61)</option>
              <option value="JP">Japan (+81)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={limitReached}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-medium transition-colors shadow-sm"
          >
            <Search className="w-4 h-4" />
            <span>Format number</span>
          </button>
        </div>
      </form>

      {formatted && !formatted.valid && (
        <div className="p-4 bg-white dark:bg-[#0f0f11] border border-slate-300 dark:border-white/20 rounded-lg text-sm text-slate-800 dark:text-white">
          <span className="font-semibold text-slate-900 dark:text-white mr-2">Notice:</span>
          {formatted.error}
        </div>
      )}

      {formatted && formatted.valid && (hasFormatted || !limitReached) && (
        <ResultCard
          title="Telecommunication Format Specifications"
          items={[
            { label: "E.164 (ITU Standard)", value: formatted.e164, copyValue: formatted.e164, mono: true },
            { label: "International (Human Readable)", value: formatted.international, copyValue: formatted.international, mono: true },
            { label: "National (Local Dialing)", value: formatted.national, copyValue: formatted.national, mono: true },
            { label: "RFC 3966 URI (HTML tel: link)", value: formatted.rfc3966, copyValue: formatted.rfc3966, mono: true },
            { label: "Country Code", value: formatted.country, mono: true },
            { label: "Calling Prefix", value: formatted.countryCallingCode, mono: true },
            { label: "National Significant Number", value: formatted.nationalNumber, copyValue: formatted.nationalNumber, mono: true },
          ]}
        />
      )}
    </div>
  );
}
