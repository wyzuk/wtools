import { NextRequest, NextResponse } from "next/server";
import { validatePublicUrl } from "@/lib/ssrf";

export const dynamic = "force-dynamic";

interface SecurityHeaderCheck {
  header: string;
  value: string | null;
  present: boolean;
  status: "secure" | "missing" | "info";
  description: string;
  recommendation?: string;
}

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

    const getH = (name: string) => res.headers.get(name.toLowerCase());

    const checks: SecurityHeaderCheck[] = [
      {
        header: "Strict-Transport-Security",
        value: getH("strict-transport-security"),
        present: Boolean(getH("strict-transport-security")),
        status: getH("strict-transport-security") ? "secure" : "missing",
        description: "Enforces secure HTTPS connections and prevents SSL stripping attacks.",
        recommendation: "max-age=31536000; includeSubDomains; preload",
      },
      {
        header: "Content-Security-Policy",
        value: getH("content-security-policy"),
        present: Boolean(getH("content-security-policy")),
        status: getH("content-security-policy") ? "secure" : "missing",
        description: "Restricts resource origins to prevent Cross-Site Scripting (XSS) and data injection.",
        recommendation: "default-src 'self'; script-src 'self'; object-src 'none'",
      },
      {
        header: "X-Frame-Options",
        value: getH("x-frame-options"),
        present: Boolean(getH("x-frame-options")),
        status: getH("x-frame-options") ? "secure" : "missing",
        description: "Protects against clickjacking by preventing the page from being framed.",
        recommendation: "DENY or SAMEORIGIN",
      },
      {
        header: "X-Content-Type-Options",
        value: getH("x-content-type-options"),
        present: Boolean(getH("x-content-type-options")),
        status: getH("x-content-type-options") === "nosniff" ? "secure" : "missing",
        description: "Prevents MIME-sniffing away from the declared content-type.",
        recommendation: "nosniff",
      },
      {
        header: "Referrer-Policy",
        value: getH("referrer-policy"),
        present: Boolean(getH("referrer-policy")),
        status: getH("referrer-policy") ? "secure" : "missing",
        description: "Controls how much referrer information is sent with outbound requests.",
        recommendation: "strict-origin-when-cross-origin",
      },
      {
        header: "Permissions-Policy",
        value: getH("permissions-policy"),
        present: Boolean(getH("permissions-policy")),
        status: getH("permissions-policy") ? "secure" : "missing",
        description: "Controls browser features like camera, microphone, and geolocation.",
        recommendation: "camera=(), microphone=(), geolocation=()",
      },
      {
        header: "Server Information Leak",
        value: [getH("server"), getH("x-powered-by")].filter(Boolean).join(" | ") || null,
        present: Boolean(getH("server") || getH("x-powered-by")),
        status: "info",
        description: "Exposes server software or backend framework versions.",
        recommendation: "Omit or generalize server and x-powered-by headers",
      },
    ];

    const secureCount = checks.filter((c) => c.status === "secure").length;
    const totalCritical = checks.filter((c) => c.status !== "info").length;

    return NextResponse.json({
      url: destination,
      status: res.status,
      score: `${secureCount}/${totalCritical}`,
      checks,
      rawHeaders: Object.fromEntries(res.headers.entries()),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Analysis failed";
    return NextResponse.json({ error: `Failed to inspect security headers: ${message}` }, { status: 502 });
  }
}
