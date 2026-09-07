import { NextRequest, NextResponse } from "next/server";
import { validatePublicUrl } from "@/lib/ssrf";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url")?.trim();

  if (!targetUrl) {
    return NextResponse.json({ error: "URL is required." }, { status: 400 });
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
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json(
        { error: `Remote server responded with HTTP ${res.status}: ${res.statusText}` },
        { status: res.status }
      );
    }

    const html = await res.text();

    // Regex-based lightweight HTML metadata parsing without heavy dependencies
    const getTagContent = (pattern: RegExp) => {
      const match = html.match(pattern);
      return match ? match[1].trim() : null;
    };

    const title = getTagContent(/<title[^>]*>([^<]+)<\/title>/i);
    const description =
      getTagContent(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
      getTagContent(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i);

    const canonical = getTagContent(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
    const ogTitle = getTagContent(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i);
    const ogDescription = getTagContent(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i);
    const ogImage = getTagContent(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["']/i);
    const ogType = getTagContent(/<meta[^>]*property=["']og:type["'][^>]*content=["']([^"']*)["']/i);
    const twitterCard = getTagContent(/<meta[^>]*name=["']twitter:card["'][^>]*content=["']([^"']*)["']/i);
    const twitterTitle = getTagContent(/<meta[^>]*name=["']twitter:title["'][^>]*content=["']([^"']*)["']/i);
    const twitterDescription = getTagContent(/<meta[^>]*name=["']twitter:description["'][^>]*content=["']([^"']*)["']/i);
    const twitterImage = getTagContent(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']*)["']/i);

    // Favicon
    let favicon = getTagContent(/<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']*)["']/i);
    if (favicon && !/^https?:\/\//i.test(favicon)) {
      try {
        favicon = new URL(favicon, destination).toString();
      } catch {
        // ignore
      }
    }

    return NextResponse.json({
      url: destination,
      title: title || "None found",
      description: description || "None found",
      canonical: canonical || null,
      favicon: favicon || `${validation.url.origin}/favicon.ico`,
      openGraph: {
        title: ogTitle,
        description: ogDescription,
        image: ogImage,
        type: ogType,
      },
      twitter: {
        card: twitterCard,
        title: twitterTitle,
        description: twitterDescription,
        image: twitterImage,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Scraping failed";
    return NextResponse.json({ error: `Failed to fetch metadata: ${message}` }, { status: 502 });
  }
}
