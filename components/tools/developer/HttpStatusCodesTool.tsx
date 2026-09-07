"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { ResultCard } from "@/components/ResultCard";

interface StatusCodeEntry {
  code: number;
  phrase: string;
  category: "1xx" | "2xx" | "3xx" | "4xx" | "5xx";
  description: string;
  rfc: string;
}

const HTTP_CODES: StatusCodeEntry[] = [
  { code: 100, phrase: "Continue", category: "1xx", description: "Initial part of a request received, client should continue with remainder.", rfc: "RFC 9110" },
  { code: 101, phrase: "Switching Protocols", category: "1xx", description: "Server agrees to switch protocols (e.g. HTTP to WebSocket).", rfc: "RFC 9110" },
  { code: 200, phrase: "OK", category: "2xx", description: "Standard successful HTTP response for GET, POST, or PUT.", rfc: "RFC 9110" },
  { code: 201, phrase: "Created", category: "2xx", description: "Request succeeded and led to the creation of a new resource.", rfc: "RFC 9110" },
  { code: 204, phrase: "No Content", category: "2xx", description: "Request succeeded but returns no response body.", rfc: "RFC 9110" },
  { code: 301, phrase: "Moved Permanently", category: "3xx", description: "Target resource has been assigned a new permanent URI.", rfc: "RFC 9110" },
  { code: 302, phrase: "Found", category: "3xx", description: "Target resource resides temporarily under a different URI.", rfc: "RFC 9110" },
  { code: 304, phrase: "Not Modified", category: "3xx", description: "Cached version is still fresh; no response body transferred.", rfc: "RFC 9110" },
  { code: 307, phrase: "Temporary Redirect", category: "3xx", description: "Temporary redirect without allowing HTTP method mutation.", rfc: "RFC 9110" },
  { code: 308, phrase: "Permanent Redirect", category: "3xx", description: "Permanent redirect preserving the original HTTP request method.", rfc: "RFC 9110" },
  { code: 400, phrase: "Bad Request", category: "4xx", description: "Server cannot process request due to perceived client error.", rfc: "RFC 9110" },
  { code: 401, phrase: "Unauthorized", category: "4xx", description: "Authentication credentials missing or invalid.", rfc: "RFC 9110" },
  { code: 403, phrase: "Forbidden", category: "4xx", description: "Server understands request but refuses authorization.", rfc: "RFC 9110" },
  { code: 404, phrase: "Not Found", category: "4xx", description: "Server cannot find requested resource endpoint.", rfc: "RFC 9110" },
  { code: 405, phrase: "Method Not Allowed", category: "4xx", description: "HTTP method is not supported by target resource.", rfc: "RFC 9110" },
  { code: 408, phrase: "Request Timeout", category: "4xx", description: "Server timed out waiting for client request completion.", rfc: "RFC 9110" },
  { code: 409, phrase: "Conflict", category: "4xx", description: "Request conflicts with current state of target resource.", rfc: "RFC 9110" },
  { code: 422, phrase: "Unprocessable Content", category: "4xx", description: "Semantic or validation errors in request body.", rfc: "RFC 9110" },
  { code: 429, phrase: "Too Many Requests", category: "4xx", description: "Client has exceeded rate limit within given time frame.", rfc: "RFC 6585" },
  { code: 500, phrase: "Internal Server Error", category: "5xx", description: "Generic unexpected condition encountered on server.", rfc: "RFC 9110" },
  { code: 502, phrase: "Bad Gateway", category: "5xx", description: "Invalid response from inbound gateway or upstream server.", rfc: "RFC 9110" },
  { code: 503, phrase: "Service Unavailable", category: "5xx", description: "Server currently overloaded or down for maintenance.", rfc: "RFC 9110" },
  { code: 504, phrase: "Gateway Timeout", category: "5xx", description: "Upstream server failed to respond within timeout window.", rfc: "RFC 9110" },
];

export function HttpStatusCodesTool() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filtered = HTTP_CODES.filter((item) => {
    const matchesCat = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      String(item.code).includes(query) ||
      item.phrase.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="p-6 bg-white dark:bg-[#0d0d0d] border border-slate-200 dark:border-white/10 rounded-xl space-y-4 shadow-sm dark:shadow-none transition-colors">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by status code (e.g. 200, 404, 502) or description..."
            className="w-full bg-white dark:bg-black border border-slate-300 dark:border-white/20 rounded-lg pl-10 pr-4 py-2.5 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
          {["all", "1xx", "2xx", "3xx", "4xx", "5xx"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-md border text-xs font-medium transition-colors uppercase ${
                activeCategory === cat
                  ? "bg-blue-500 text-white border-blue-500 font-bold"
                  : "bg-slate-50 dark:bg-black border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {cat === "all" ? "All Codes" : cat}
            </button>
          ))}
        </div>
      </div>

      <ResultCard title={`RFC 9110 HTTP Status Reference (${filtered.length})`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm font-mono">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/40 uppercase tracking-wider text-xs">
                <th className="py-2.5 pr-4">Code</th>
                <th className="py-2.5 px-4">Standard Phrase</th>
                <th className="py-2.5 px-4">Description &amp; Behavior</th>
                <th className="py-2.5 pl-4 text-right">RFC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filtered.map((item) => (
                <tr key={item.code} className="hover:bg-slate-50 dark:hover:bg-white/5">
                  <td className="py-2.5 pr-4 text-blue-600 dark:text-blue-400 font-bold">{item.code}</td>
                  <td className="py-2.5 px-4 text-slate-900 dark:text-white font-medium">{item.phrase}</td>
                  <td className="py-2.5 px-4 text-slate-600 dark:text-white/70 max-w-md">{item.description}</td>
                  <td className="py-2.5 pl-4 text-right text-slate-400 dark:text-white/40">{item.rfc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ResultCard>
    </div>
  );
}
