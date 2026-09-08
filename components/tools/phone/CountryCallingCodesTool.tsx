"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { ResultCard } from "@/components/ResultCard";
import { CopyButton } from "@/components/CopyButton";

interface CountryCodeEntry {
  country: string;
  iso: string;
  code: string;
  pattern: string;
}

const CALLING_CODES: CountryCodeEntry[] = [
  { country: "Afghanistan", iso: "AF", code: "+93", pattern: "70 123 4567" },
  { country: "Albania", iso: "AL", code: "+355", pattern: "67 123 4567" },
  { country: "Algeria", iso: "DZ", code: "+213", pattern: "551 23 45 67" },
  { country: "Argentina", iso: "AR", code: "+54", pattern: "9 11 1234-5678" },
  { country: "Australia", iso: "AU", code: "+61", pattern: "412 345 678" },
  { country: "Austria", iso: "AT", code: "+43", pattern: "664 1234567" },
  { country: "Bangladesh", iso: "BD", code: "+880", pattern: "1711-000000" },
  { country: "Belgium", iso: "BE", code: "+32", pattern: "470 12 34 56" },
  { country: "Brazil", iso: "BR", code: "+55", pattern: "11 91234-5678" },
  { country: "Canada", iso: "CA", code: "+1", pattern: "416-555-0199" },
  { country: "China", iso: "CN", code: "+86", pattern: "138 0000 0000" },
  { country: "Denmark", iso: "DK", code: "+45", pattern: "20 12 34 56" },
  { country: "Egypt", iso: "EG", code: "+20", pattern: "100 123 4567" },
  { country: "Finland", iso: "FI", code: "+358", pattern: "40 1234567" },
  { country: "France", iso: "FR", code: "+33", pattern: "6 12 34 56 78" },
  { country: "Germany", iso: "DE", code: "+49", pattern: "151 12345678" },
  { country: "Greece", iso: "GR", code: "+30", pattern: "691 234 5678" },
  { country: "Hong Kong", iso: "HK", code: "+852", pattern: "5123 4567" },
  { country: "India", iso: "IN", code: "+91", pattern: "98765 43210" },
  { country: "Indonesia", iso: "ID", code: "+62", pattern: "812-3456-7890" },
  { country: "Ireland", iso: "IE", code: "+353", pattern: "85 123 4567" },
  { country: "Italy", iso: "IT", code: "+39", pattern: "320 123 4567" },
  { country: "Japan", iso: "JP", code: "+81", pattern: "90-1234-5678" },
  { country: "Malaysia", iso: "MY", code: "+60", pattern: "12-345 6789" },
  { country: "Mexico", iso: "MX", code: "+52", pattern: "55 1234 5678" },
  { country: "Netherlands", iso: "NL", code: "+31", pattern: "6 12345678" },
  { country: "New Zealand", iso: "NZ", code: "+64", pattern: "21 123 4567" },
  { country: "Norway", iso: "NO", code: "+47", pattern: "412 34 567" },
  { country: "Pakistan", iso: "PK", code: "+92", pattern: "300 1234567" },
  { country: "Philippines", iso: "PH", code: "+63", pattern: "917 123 4567" },
  { country: "Poland", iso: "PL", code: "+48", pattern: "512 345 678" },
  { country: "Portugal", iso: "PT", code: "+351", pattern: "912 345 678" },
  { country: "Saudi Arabia", iso: "SA", code: "+966", pattern: "50 123 4567" },
  { country: "Singapore", iso: "SG", code: "+65", pattern: "8123 4567" },
  { country: "South Africa", iso: "ZA", code: "+27", pattern: "71 123 4567" },
  { country: "South Korea", iso: "KR", code: "+82", pattern: "10-1234-5678" },
  { country: "Spain", iso: "ES", code: "+34", pattern: "612 34 56 78" },
  { country: "Sweden", iso: "SE", code: "+46", pattern: "70 123 45 67" },
  { country: "Switzerland", iso: "CH", code: "+41", pattern: "78 123 45 67" },
  { country: "Turkey", iso: "TR", code: "+90", pattern: "532 123 45 67" },
  { country: "United Arab Emirates", iso: "AE", code: "+971", pattern: "50 123 4567" },
  { country: "United Kingdom", iso: "GB", code: "+44", pattern: "7911 123456" },
  { country: "United States", iso: "US", code: "+1", pattern: "415-555-0199" },
  { country: "Vietnam", iso: "VN", code: "+84", pattern: "91 234 56 78" },
];

export function CountryCallingCodesTool() {
  const [query, setQuery] = useState("");

  const filtered = CALLING_CODES.filter(
    (c) =>
      c.country.toLowerCase().includes(query.toLowerCase()) ||
      c.iso.toLowerCase().includes(query.toLowerCase()) ||
      c.code.includes(query)
  );

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-white/10 rounded-xl space-y-3 shadow-sm dark:shadow-none transition-colors">
        <label htmlFor="country-query" className="block text-xs font-semibold text-slate-700 dark:text-white/70 uppercase tracking-wider font-mono">
          Search Calling Codes
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="country-query"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by country name, ISO code (e.g. US, GB, BD), or dial code (+1, +44)..."
            className="w-full bg-white dark:bg-black border border-slate-300 dark:border-white/20 rounded-lg pl-10 pr-4 py-2.5 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:border-blue-500"
          />
        </div>
      </div>

      <ResultCard title={`International Calling Codes Directory (${filtered.length})`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm font-mono">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/40 uppercase tracking-wider text-xs">
                <th className="py-2.5 pr-4">Country</th>
                <th className="py-2.5 px-4">ISO Code</th>
                <th className="py-2.5 px-4">Dial Prefix</th>
                <th className="py-2.5 px-4">Sample Pattern</th>
                <th className="py-2.5 pl-4 text-right">Copy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filtered.map((item) => (
                <tr key={item.iso} className="hover:bg-slate-50 dark:hover:bg-white/5">
                  <td className="py-2.5 pr-4 text-slate-900 dark:text-white font-medium">{item.country}</td>
                  <td className="py-2.5 px-4 text-slate-500 dark:text-white/60">{item.iso}</td>
                  <td className="py-2.5 px-4 text-[#0071e3] dark:text-blue-400 font-semibold">{item.code}</td>
                  <td className="py-2.5 px-4 text-slate-500 dark:text-white/50">{item.pattern}</td>
                  <td className="py-2.5 pl-4 text-right">
                    <CopyButton text={item.code} label="Copy" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ResultCard>
    </div>
  );
}
