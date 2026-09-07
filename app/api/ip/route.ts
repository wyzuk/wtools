import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let ip = searchParams.get("ip")?.trim();

  // If no IP supplied, attempt to detect from request headers
  if (!ip) {
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const cfIp = request.headers.get("cf-connecting-ip");

    if (cfIp) {
      ip = cfIp.split(",")[0].trim();
    } else if (realIp) {
      ip = realIp.split(",")[0].trim();
    } else if (forwarded) {
      ip = forwarded.split(",")[0].trim();
    }
  }

  // If local / private, default to requesting own external IP
  const isLocal = !ip || ip === "127.0.0.1" || ip === "::1" || ip === "localhost";

  try {
    const targetEndpoint = isLocal
      ? "https://ipapi.co/json/"
      : `https://ipapi.co/${encodeURIComponent(ip!)}/json/`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    let res = await fetch(targetEndpoint, {
      signal: controller.signal,
      headers: {
        "User-Agent": "WTOOLS/1.0 (https://wasee.dev)",
        Accept: "application/json",
      },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      // Fallback to ipwhois.app
      const fallbackUrl = isLocal
        ? "https://ipwhois.app/json/"
        : `https://ipwhois.app/json/${encodeURIComponent(ip!)}`;

      const fallbackRes = await fetch(fallbackUrl, {
        headers: { "User-Agent": "WTOOLS/1.0" },
      });

      if (!fallbackRes.ok) {
        return NextResponse.json(
          { error: "Unable to retrieve IP intelligence at this time. External service rate-limited or unavailable." },
          { status: 502 }
        );
      }

      const fbData = await fallbackRes.json();
      return NextResponse.json({
        ip: fbData.ip,
        version: fbData.type,
        city: fbData.city,
        region: fbData.region,
        country: fbData.country,
        country_code: fbData.country_code,
        country_name: fbData.country,
        continent: fbData.continent,
        latitude: fbData.latitude,
        longitude: fbData.longitude,
        asn: fbData.asn,
        org: fbData.org,
        isp: fbData.isp,
        timezone: fbData.timezone,
        currency: fbData.currency,
        source: "ipwhois.app",
        raw: fbData,
      });
    }

    const data = await res.json();
    if (data.error) {
      return NextResponse.json(
        { error: data.reason || "Invalid IP address or not found in registry." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ip: data.ip,
      version: data.version,
      city: data.city,
      region: data.region,
      country: data.country_name,
      country_code: data.country_code,
      country_name: data.country_name,
      continent_code: data.continent_code,
      postal: data.postal,
      latitude: data.latitude,
      longitude: data.longitude,
      asn: data.asn,
      org: data.org,
      isp: data.org,
      timezone: data.timezone,
      utc_offset: data.utc_offset,
      country_calling_code: data.country_calling_code,
      currency: data.currency,
      languages: data.languages,
      source: "ipapi.co",
      raw: data,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Network error";
    return NextResponse.json(
      { error: `Connection failed: ${message}. The public IP service could not be reached.` },
      { status: 500 }
    );
  }
}
