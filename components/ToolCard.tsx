import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ToolDefinition } from "@/types/tools";
import { DynamicIcon } from "./DynamicIcon";

interface ToolCardProps {
  tool: ToolDefinition;
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex flex-col justify-between p-5 bg-white dark:bg-[#1c1c1e] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_6px_16px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)] hover:border-[#0071e3]/50 hover:-translate-y-0.5 transition-all duration-200"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-11 h-11 rounded-[14px] bg-gradient-to-b from-white to-[#f5f5f7] dark:from-neutral-800 dark:to-neutral-900 border border-black/[0.08] dark:border-white/[0.1] flex items-center justify-center text-[#0071e3] dark:text-[#2997ff] shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_1px_2px_rgba(0,0,0,0.05)] group-hover:scale-105 transition-transform duration-200">
            <DynamicIcon name={tool.icon} className="w-5 h-5" />
          </div>
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08] text-[#515154] dark:text-[#a1a1a6] border border-black/[0.04] dark:border-white/[0.06]">
            {tool.category}
          </span>
        </div>
        <h3 className="text-[15px] sm:text-base font-bold text-[#1d1d1f] dark:text-white group-hover:text-[#0071e3] transition-colors mb-1.5 flex items-center gap-2">
          <span>{tool.name}</span>
          {tool.popular && (
            <span className="w-2 h-2 rounded-full bg-[#0071e3] ring-4 ring-[#0071e3]/15 inline-block shrink-0" title="Frequently used utility" />
          )}
        </h3>
        <p className="text-xs sm:text-sm text-[#515154] dark:text-[#a1a1a6] line-clamp-2 leading-relaxed">
          {tool.description}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between text-xs font-semibold text-[#86868b] dark:text-[#a1a1a6] group-hover:text-[#0071e3] transition-colors">
        <span>Launch tool</span>
        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
