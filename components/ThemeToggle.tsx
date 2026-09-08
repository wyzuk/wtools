"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="p-2 rounded-xl border border-black/[0.08] dark:border-white/[0.12] bg-white dark:bg-neutral-800 text-[#1d1d1f] dark:text-white hover:border-[#0071e3] hover:shadow-sm active:scale-95 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-amber-400 drop-shadow-sm" />
      ) : (
        <Moon className="w-4 h-4 text-[#424245]" />
      )}
    </button>
  );
}
