"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export function CopyButton({ text, label = "Copy", className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={label}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all active:scale-95 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${
        copied
          ? "bg-[#27c93f] text-white border-[#1aab29]"
          : "bg-white dark:bg-neutral-800 text-[#1d1d1f] dark:text-[#f5f5f7] border-black/[0.1] dark:border-white/[0.12] hover:bg-slate-50 dark:hover:bg-neutral-700/60 hover:border-[#0071e3]/60"
      } ${className}`}
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-white animate-in zoom-in-50 duration-150" />
      ) : (
        <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-neutral-400" />
      )}
      <span>{copied ? "Copied" : label}</span>
    </button>
  );
}
