"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { ResultCard } from "@/components/ResultCard";
import { CopyButton } from "@/components/CopyButton";

interface MimeEntry {
  ext: string;
  type: string;
  category: string;
  rfc?: string;
}

const MIME_DATABASE: MimeEntry[] = [
  { ext: ".json", type: "application/json", category: "Application", rfc: "RFC 8259" },
  { ext: ".html, .htm", type: "text/html; charset=utf-8", category: "Text", rfc: "W3C HTML" },
  { ext: ".js, .mjs", type: "text/javascript", category: "Script", rfc: "RFC 9239" },
  { ext: ".css", type: "text/css", category: "Style", rfc: "RFC 2318" },
  { ext: ".csv", type: "text/csv", category: "Text", rfc: "RFC 4180" },
  { ext: ".xml", type: "application/xml", category: "Application", rfc: "RFC 7303" },
  { ext: ".pdf", type: "application/pdf", category: "Document", rfc: "RFC 3778" },
  { ext: ".zip", type: "application/zip", category: "Archive", rfc: "IANA" },
  { ext: ".tar", type: "application/x-tar", category: "Archive", rfc: "IANA" },
  { ext: ".gz", type: "application/gzip", category: "Archive", rfc: "RFC 6713" },
  { ext: ".png", type: "image/png", category: "Image", rfc: "RFC 2083" },
  { ext: ".jpg, .jpeg", type: "image/jpeg", category: "Image", rfc: "RFC 2046" },
  { ext: ".webp", type: "image/webp", category: "Image", rfc: "IANA" },
  { ext: ".svg", type: "image/svg+xml", category: "Image", rfc: "W3C" },
  { ext: ".ico", type: "image/x-icon", category: "Image", rfc: "IANA" },
  { ext: ".gif", type: "image/gif", category: "Image", rfc: "RFC 2046" },
  { ext: ".mp4", type: "video/mp4", category: "Video", rfc: "RFC 4337" },
  { ext: ".webm", type: "video/webm", category: "Video", rfc: "IANA" },
  { ext: ".mp3", type: "audio/mpeg", category: "Audio", rfc: "RFC 3003" },
  { ext: ".wav", type: "audio/wav", category: "Audio", rfc: "RFC 2361" },
  { ext: ".woff2", type: "font/woff2", category: "Font", rfc: "W3C" },
  { ext: ".ttf", type: "font/ttf", category: "Font", rfc: "RFC 8081" },
  { ext: ".bin", type: "application/octet-stream", category: "Binary", rfc: "RFC 2046" },
];

export function MimeTypesTool() {
  const [query, setQuery] = useState("");

  const filtered = MIME_DATABASE.filter(
    (m) =>
      m.ext.toLowerCase().includes(query.toLowerCase()) ||
      m.type.toLowerCase().includes(query.toLowerCase()) ||
      m.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-white/10 rounded-xl space-y-3 shadow-sm dark:shadow-none transition-colors">
        <label htmlFor="mime-search" className="block text-xs font-semibold text-slate-700 dark:text-white/70 uppercase tracking-wider font-mono">
          Search MIME Types or Extensions
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="mime-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by extension (e.g. .json, .png, .pdf) or MIME type..."
            className="w-full bg-white dark:bg-black border border-slate-300 dark:border-white/20 rounded-lg pl-10 pr-4 py-2.5 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:border-blue-500"
          />
        </div>
      </div>

      <ResultCard title={`IANA Media Types Reference (${filtered.length})`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm font-mono">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/40 uppercase tracking-wider text-xs">
                <th className="py-2.5 pr-4">Extension</th>
                <th className="py-2.5 px-4">Content-Type / MIME</th>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4">Standard / RFC</th>
                <th className="py-2.5 pl-4 text-right">Copy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filtered.map((item) => (
                <tr key={item.ext} className="hover:bg-slate-50 dark:hover:bg-white/5">
                  <td className="py-2.5 pr-4 text-[#0071e3] dark:text-blue-400 font-bold">{item.ext}</td>
                  <td className="py-2.5 px-4 text-slate-900 dark:text-white">{item.type}</td>
                  <td className="py-2.5 px-4 text-slate-500 dark:text-white/60">{item.category}</td>
                  <td className="py-2.5 px-4 text-slate-400 dark:text-white/40">{item.rfc || "IANA"}</td>
                  <td className="py-2.5 pl-4 text-right">
                    <CopyButton text={item.type} label="Copy" />
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
