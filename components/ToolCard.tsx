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
      className="group flex flex-col justify-between p-5 bg-white dark:bg-[#0d0d0d] border border-slate-200 dark:border-white/10 rounded-lg hover:border-blue-500/60 dark:hover:border-blue-500/60 transition-colors shadow-sm dark:shadow-none"
    >
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div className="w-10 h-10 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-blue-500 group-hover:border-blue-500/50 transition-colors">
            <DynamicIcon name={tool.icon} className="w-5 h-5" />
          </div>
          <span className="text-xs uppercase font-mono px-2.5 py-0.5 rounded border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/50 bg-slate-50 dark:bg-black">
            {tool.category}
          </span>
        </div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors mb-2 flex items-center gap-2">
          <span>{tool.name}</span>
          {tool.popular && (
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" title="Popular tool" />
          )}
        </h3>
        <p className="text-sm text-slate-600 dark:text-white/65 line-clamp-2 leading-relaxed font-sans">
          {tool.description}
        </p>
      </div>

      <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-sm font-medium text-slate-500 dark:text-white/40 group-hover:text-blue-500 transition-colors">
        <span>Open tool</span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
