import { NextRequest, NextResponse } from "next/server";
import { validatePublicUrl } from "@/lib/ssrf";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url")?.trim();

  if (!targetUrl) {
    return NextResponse.json({ error: "URL parameter is required." }, { status: 400 });
  }

  const validation = await validatePublicUrl(targetUrl);
  if (!validation.valid || !validation.url) {
    return NextResponse.json({ error: validation.error || "Invalid URL" }, { status: 400 });
  }

  const destination = validation.url.toString();
  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(destination, {
      method: "GET",
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        Accept: "*/*",
      },
      redirect: "follow",
    });
    clearTimeout(timeout);
    const latency = Date.now() - startTime;

    const headersObj: Record<string, string> = {};
    res.headers.forEach((value, key) => {
      headersObj[key] = value;
    });

    return NextResponse.json({
      url: destination,
      finalUrl: res.url,
      status: res.status,
      statusText: res.statusText,
      redirected: res.redirected,
      latencyMs: latency,
      headers: headersObj,
      contentType: res.headers.get("content-type"),
      server: res.headers.get("server") || "Hidden / Not Disclosed",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Request failed";
    return NextResponse.json(
      { error: `Failed to fetch target URL: ${message}. Make sure the host is online and accessible.` },
      { status: 502 }
    );
  }
}
