import { NextRequest, NextResponse } from "next/server";
import { checkServerUsage, incrementServerUsage, attachVisitorCookie } from "@/lib/usage-server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const usage = checkServerUsage(request);
  const response = NextResponse.json({
    date: usage.date,
    used: usage.used,
    max: usage.max,
    remaining: usage.remaining,
    limitReached: usage.limitReached,
  });

  if (usage.isNewCookie) {
    attachVisitorCookie(response, usage.visitorId);
  }

  return response;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    if (body.action === "record") {
      const result = incrementServerUsage(request);
      const response = NextResponse.json({
        success: result.success,
        used: result.used,
        max: result.max,
        remaining: result.remaining,
        limitReached: result.limitReached,
      }, { status: result.success ? 200 : 429 });

      if (result.isNewCookie) {
        attachVisitorCookie(response, result.visitorId);
      }

      return response;
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error processing usage.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
