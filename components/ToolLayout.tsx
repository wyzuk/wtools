import React from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { ToolDefinition } from "@/types/tools";
import { DynamicIcon } from "./DynamicIcon";
import { UsageBadge } from "./UsageBadge";

interface ToolLayoutProps {
  tool: ToolDefinition;
  children: React.ReactNode;
}

export function ToolLayout({ tool, children }: ToolLayoutProps) {
  return (
    <div className="min-h-[calc(100vh-16rem)] py-8 px-4 sm:px-6 max-w-5xl mx-auto space-y-6">
      {/* Top Breadcrumb, Category & Usage */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <Link
          href="/tools"
          className="inline-flex items-center gap-1.5 text-slate-500 dark:text-neutral-400 hover:text-blue-500 dark:hover:text-white font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All tools</span>
        </Link>
        <div className="flex items-center gap-3">
          <UsageBadge />
          <div className="flex items-center gap-1 text-xs font-mono">
            <span className="text-slate-400 dark:text-neutral-500">category:</span>
            <Link
              href={`/tools?category=${tool.category}`}
              className="uppercase px-2.5 py-0.5 rounded border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300 hover:text-blue-500 hover:border-blue-500/50 transition-colors bg-white dark:bg-neutral-900"
            >
              {tool.category}
            </Link>
          </div>
        </div>
      </div>

      {/* Tool Header Card */}
      <div className="p-6 sm:p-7 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl shadow-sm dark:shadow-none transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-lg bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 flex items-center justify-center text-blue-500 shrink-0 mt-0.5">
              <DynamicIcon name={tool.icon} className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5 font-sans">
                <span>{tool.name}</span>
                {tool.popular && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800 font-semibold">
                    POPULAR
                  </span>
                )}
              </h1>
              <p className="mt-1.5 text-sm sm:text-base text-slate-600 dark:text-neutral-300 max-w-2xl leading-relaxed font-sans">
                {tool.longDescription}
              </p>
            </div>
          </div>

          {/* API / DataSource attribution */}
          {tool.apiSource && (
            <div className="shrink-0 pt-0.5 sm:text-right">
              <span className="text-[11px] uppercase font-mono text-slate-400 dark:text-neutral-500 block">
                Source
              </span>
              <a
                href={tool.apiSource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-700 dark:text-neutral-300 hover:text-blue-500 dark:hover:text-blue-400 font-medium mt-0.5 transition-colors"
              >
                <span>{tool.apiSource.name}</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-500" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Tool Core Area */}
      <div>{children}</div>
    </div>
  );
}
