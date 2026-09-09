"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

interface UsageState {
  used: number;
  max: number;
  remaining: number;
  limitReached: boolean;
  loading: boolean;
  recordToolUsage: () => Promise<boolean>;
  refreshUsage: () => Promise<void>;
}

const MAX_DAILY = 3;

function getTodayString(): string {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

const UsageContext = createContext<UsageState>({
  used: 0,
  max: MAX_DAILY,
  remaining: MAX_DAILY,
  limitReached: false,
  loading: true,
  recordToolUsage: async () => true,
  refreshUsage: async () => {},
});

export function UsageProvider({ children }: { children: React.ReactNode }) {
  const [used, setUsed] = useState(0);
  const [loading, setLoading] = useState(true);

  const syncWithServer = useCallback(async () => {
    try {
      const res = await fetch("/api/usage");
      if (res.ok) {
        const data = await res.json();
        setUsed(data.used);
        const today = getTodayString();
        localStorage.setItem("wtools_usage", JSON.stringify({ date: today, used: data.used }));
      }
    } catch {
      // Fallback to local storage if network offline
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const today = getTodayString();
    try {
      const raw = localStorage.getItem("wtools_usage");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.date === today && typeof parsed.used === "number") {
          setUsed(parsed.used);
        } else {
          // New day reset
          localStorage.setItem("wtools_usage", JSON.stringify({ date: today, used: 0 }));
          setUsed(0);
        }
      }
    } catch {
      // ignore
    }

    syncWithServer();
  }, [syncWithServer]);

  const recordToolUsage = async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/usage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "record" }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUsed(data.used);
        const today = getTodayString();
        localStorage.setItem("wtools_usage", JSON.stringify({ date: today, used: data.used }));
        return true;
      } else {
        if (data.limitReached) {
          setUsed(MAX_DAILY);
        }
        return false;
      }
    } catch {
      // Offline fallback: increment local
      const newUsed = used + 1;
      setUsed(newUsed);
      const today = getTodayString();
      localStorage.setItem("wtools_usage", JSON.stringify({ date: today, used: newUsed }));
      return newUsed <= MAX_DAILY;
    }
  };

  const remaining = Math.max(0, MAX_DAILY - used);
  const limitReached = used >= MAX_DAILY;

  return (
    <UsageContext.Provider
      value={{
        used,
        max: MAX_DAILY,
        remaining,
        limitReached,
        loading,
        recordToolUsage,
        refreshUsage: syncWithServer,
      }}
    >
      {children}
    </UsageContext.Provider>
  );
}

export function useUsage() {
  return useContext(UsageContext);
}
