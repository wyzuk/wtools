import React from "react";

interface MacTrafficLightsProps {
  className?: string;
  size?: "xs" | "sm" | "md";
}

export function MacTrafficLights({
  className = "",
  size = "sm",
}: MacTrafficLightsProps) {
  const dotSize =
    size === "xs" ? "w-2.5 h-2.5" : size === "md" ? "w-3.5 h-3.5" : "w-3 h-3";

  return (
    <div className={`flex items-center gap-1.5 sm:gap-2 select-none shrink-0 group/lights ${className}`}>
      <span
        aria-hidden="true"
        title="Close"
        className={`${dotSize} rounded-full bg-[#ff5f56] border border-[#e0443e] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] hover:brightness-110 transition-all duration-150 inline-block`}
      />
      <span
        aria-hidden="true"
        title="Minimize"
        className={`${dotSize} rounded-full bg-[#ffbd2e] border border-[#dea123] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] hover:brightness-110 transition-all duration-150 inline-block`}
      />
      <span
        aria-hidden="true"
        title="Maximize / Fullscreen"
        className={`${dotSize} rounded-full bg-[#27c93f] border border-[#1aab29] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] hover:brightness-110 transition-all duration-150 inline-block`}
      />
    </div>
  );
}

// Alias for standard cross-platform naming
export const WindowControls = MacTrafficLights;
