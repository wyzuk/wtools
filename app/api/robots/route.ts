import { NextRequest, NextResponse } from "next/server";
import { validatePublicUrl } from "@/lib/ssrf";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetHost = searchParams.get("host")?.trim();

  if (!targetHost) {
    return NextResponse.json({ error: "Host/Domain is required." }, { status: 400 });
  }

  const cleanHost = targetHost.replace(/^https?:\/\//i, "").replace(/\/.*$/, "");
  const robotsUrl = `https://${cleanHost}/robots.txt`;

  const validation = await validatePublicUrl(robotsUrl);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error || "Invalid host" }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    const res = await fetch(robotsUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "WTOOLS-Bot/1.0 (+https://wasee.dev)",
        Accept: "text/plain,*/*",
      },
    });
    clearTimeout(timeout);

    if (res.status === 404) {
      return NextResponse.json({
        host: cleanHost,
        robotsFound: false,
        content: null,
        message: "No robots.txt found (HTTP 404). Crawlers are permitted unrestricted access by default.",
      });
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: `Target server returned HTTP ${res.status}` },
        { status: res.status }
      );
    }

    const text = await res.text();

    // Parse directives
    const lines = text.split(/\r?\n/);
    const sitemaps: string[] = [];
    const disallowRules: string[] = [];
    const allowRules: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (/^sitemap:\s*/i.test(trimmed)) {
        sitemaps.push(trimmed.replace(/^sitemap:\s*/i, ""));
      } else if (/^disallow:\s*/i.test(trimmed)) {
        const val = trimmed.replace(/^disallow:\s*/i, "");
        if (val) disallowRules.push(val);
      } else if (/^allow:\s*/i.test(trimmed)) {
        const val = trimmed.replace(/^allow:\s*/i, "");
        if (val) allowRules.push(val);
      }
    }

    return NextResponse.json({
      host: cleanHost,
      robotsFound: true,
      statusCode: res.status,
      content: text,
      stats: {
        totalLines: lines.length,
        sitemaps,
        disallowRulesCount: disallowRules.length,
        allowRulesCount: allowRules.length,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Fetch failed";
    return NextResponse.json({ error: `Could not fetch robots.txt: ${message}` }, { status: 502 });
  }
}
