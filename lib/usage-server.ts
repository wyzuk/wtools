import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const MAX_DAILY_USES = 3;

// In-memory store: Key is "YYYY-MM-DD:visitorHash" -> count
// Also tracks cleanup of expired dates
const usageStore = new Map<string, number>();

function getTodayString(): string {
  const now = new Date();
  return now.toISOString().split("T")[0]; // YYYY-MM-DD
}

function getVisitorHash(request: NextRequest): { hash: string; visitorId: string; isNewCookie: boolean } {
  let vid = request.cookies.get("wtools_vid")?.value;
  let isNewCookie = false;

  if (!vid || vid.length < 10) {
    vid = crypto.randomUUID();
    isNewCookie = true;
  }

  // Combine with client IP for server-side integrity
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
  const userAgent = request.headers.get("user-agent") || "";

  const hash = crypto
    .createHash("sha256")
    .update(`${vid}:${ip}:${userAgent.slice(0, 30)}`)
    .digest("hex")
    .slice(0, 16);

  return { hash, visitorId: vid, isNewCookie };
}

export function checkServerUsage(request: NextRequest): {
  date: string;
  used: number;
  max: number;
  remaining: number;
  limitReached: boolean;
  visitorId: string;
  isNewCookie: boolean;
} {
  const date = getTodayString();
  const { hash, visitorId, isNewCookie } = getVisitorHash(request);
  const key = `${date}:${hash}`;

  const used = usageStore.get(key) || 0;
  const remaining = Math.max(0, MAX_DAILY_USES - used);
  const limitReached = used >= MAX_DAILY_USES;

  return {
    date,
    used,
    max: MAX_DAILY_USES,
    remaining,
    limitReached,
    visitorId,
    isNewCookie,
  };
}

export function incrementServerUsage(request: NextRequest): {
  success: boolean;
  used: number;
  max: number;
  remaining: number;
  limitReached: boolean;
  visitorId: string;
  isNewCookie: boolean;
} {
  const date = getTodayString();
  const { hash, visitorId, isNewCookie } = getVisitorHash(request);
  const key = `${date}:${hash}`;

  const currentUsed = usageStore.get(key) || 0;
  if (currentUsed >= MAX_DAILY_USES) {
    return {
      success: false,
      used: currentUsed,
      max: MAX_DAILY_USES,
      remaining: 0,
      limitReached: true,
      visitorId,
      isNewCookie,
    };
  }

  const newUsed = currentUsed + 1;
  usageStore.set(key, newUsed);

  // Periodic cleanup of old entries
  if (usageStore.size > 20000) {
    for (const k of usageStore.keys()) {
      if (!k.startsWith(date)) {
        usageStore.delete(k);
      }
    }
  }

  return {
    success: true,
    used: newUsed,
    max: MAX_DAILY_USES,
    remaining: Math.max(0, MAX_DAILY_USES - newUsed),
    limitReached: newUsed >= MAX_DAILY_USES,
    visitorId,
    isNewCookie,
  };
}

export function attachVisitorCookie(response: NextResponse, visitorId: string) {
  response.cookies.set("wtools_vid", visitorId, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
    httpOnly: true,
  });
}
