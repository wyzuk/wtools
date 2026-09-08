import React from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, ChevronRight } from "lucide-react";
import { ToolDefinition } from "@/types/tools";
import { DynamicIcon } from "./DynamicIcon";
import { UsageBadge } from "./UsageBadge";
import { MacTrafficLights } from "./MacTrafficLights";

interface ToolLayoutProps {
  tool: ToolDefinition;
  children: React.ReactNode;
}

export function ToolLayout({ tool, children }: ToolLayoutProps) {
  return (
    <div className="min-h-[calc(100vh-16rem)] py-6 sm:py-10 px-4 sm:px-6 max-w-5xl mx-auto space-y-6">
      {/* Top macOS Path Bar & Usage */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[#515154] dark:text-[#a1a1a6]">
          <Link
            href="/tools"
            className="inline-flex items-center gap-1 hover:text-[#0071e3] dark:hover:text-white font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Tools</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-black/30 dark:text-white/30" />
          <Link
            href={`/tools?category=${tool.category}`}
            className="capitalize hover:text-[#0071e3] dark:hover:text-white font-medium transition-colors"
          >
            {tool.category}
          </Link>
          <ChevronRight className="w-3 h-3 text-black/30 dark:text-white/30" />
          <span className="font-semibold text-[#1d1d1f] dark:text-white truncate max-w-[200px]">
            {tool.name}
          </span>
        </nav>

        <div className="flex items-center gap-3">
          <UsageBadge />
        </div>
      </div>

      {/* macOS Window Header Card */}
      <div className="bg-white dark:bg-[#1c1c1e] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_10px_30px_-6px_rgba(0,0,0,0.06)] overflow-hidden transition-all">
        {/* macOS Window Titlebar */}
        <div className="px-5 py-3 border-b border-black/[0.06] dark:border-white/[0.08] bg-black/[0.015] dark:bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MacTrafficLights size="xs" />
            <span className="text-xs font-mono text-[#86868b] dark:text-[#a1a1a6] hidden sm:inline-block">
              {tool.slug}.tool
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/tools?category=${tool.category}`}
              className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08] text-[#515154] dark:text-[#a1a1a6] border border-black/[0.05] dark:border-white/[0.08] hover:border-[#0071e3] transition-colors"
            >
              {tool.category}
            </Link>
            {tool.popular && (
              <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-[#0071e3] dark:text-[#2997ff] border border-[#0071e3]/20">
                Popular
              </span>
            )}
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6 sm:p-7 flex flex-col sm:flex-row sm:items-start justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-[16px] bg-gradient-to-b from-white to-[#f5f5f7] dark:from-neutral-800 dark:to-neutral-900 border border-black/[0.08] dark:border-white/[0.1] flex items-center justify-center text-[#0071e3] dark:text-[#2997ff] shrink-0 mt-0.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_2px_4px_rgba(0,0,0,0.06)]">
              <DynamicIcon name={tool.icon} className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] dark:text-white tracking-tight">
                {tool.name}
              </h1>
              <p className="mt-1.5 text-sm sm:text-base text-[#424245] dark:text-[#a1a1a6] max-w-2xl leading-relaxed">
                {tool.longDescription}
              </p>
            </div>
          </div>

          {/* API / DataSource attribution */}
          {tool.apiSource && (
            <div className="shrink-0 pt-0.5 sm:text-right">
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#86868b] dark:text-[#a1a1a6] block">
                Source
              </span>
              <a
                href={tool.apiSource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#1d1d1f] dark:text-white hover:text-[#0071e3] dark:hover:text-[#2997ff] font-semibold mt-0.5 transition-colors"
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
