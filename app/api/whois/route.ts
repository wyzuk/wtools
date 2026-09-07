import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.trim();

  if (!query) {
    return NextResponse.json({ error: "Domain or IP is required." }, { status: 400 });
  }

  // Clean domain name
  const cleanTarget = query.replace(/^https?:\/\//i, "").replace(/\/.*$/, "").trim();

  try {
    const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(cleanTarget) || cleanTarget.includes(":");
    const rdapEndpoint = isIp
      ? `https://rdap.org/ip/${encodeURIComponent(cleanTarget)}`
      : `https://rdap.org/domain/${encodeURIComponent(cleanTarget)}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(rdapEndpoint, {
      signal: controller.signal,
      headers: {
        Accept: "application/rdap+json, application/json",
        "User-Agent": "WTOOLS/1.0 (https://wasee.dev)",
      },
      redirect: "follow",
    });
    clearTimeout(timeout);

    if (res.status === 404) {
      return NextResponse.json(
        { error: `No RDAP/WHOIS records found for ${cleanTarget}. The domain may be unregistered or the TLD does not support public RDAP.` },
        { status: 404 }
      );
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: `RDAP service returned status ${res.status}. Domain lookup could not be completed.` },
        { status: res.status }
      );
    }

    const data = await res.json();

    // Parse events (dates)
    let creationDate: string | null = null;
    let expirationDate: string | null = null;
    let updatedDate: string | null = null;

    if (Array.isArray(data.events)) {
      for (const event of data.events) {
        if (event.eventAction === "registration") creationDate = event.eventDate;
        if (event.eventAction === "expiration") expirationDate = event.eventDate;
        if (event.eventAction === "last changed") updatedDate = event.eventDate;
      }
    }

    // Parse registrar
    let registrarName: string | null = null;
    let registrarIanaId: string | null = null;

    if (Array.isArray(data.entities)) {
      for (const entity of data.entities) {
        if (Array.isArray(entity.roles) && entity.roles.includes("registrar")) {
          if (entity.vcardArray?.[1]) {
            const fnItem = entity.vcardArray[1].find((item: unknown[]) => item[0] === "fn");
            if (fnItem) registrarName = fnItem[3];
          }
          if (entity.publicIds?.[0]) {
            registrarIanaId = entity.publicIds[0].identifier;
          }
        }
      }
    }

    // Parse nameservers
    const nameservers: string[] = [];
    if (Array.isArray(data.nameservers)) {
      for (const ns of data.nameservers) {
        if (ns.ldhName) nameservers.push(ns.ldhName);
      }
    }

    return NextResponse.json({
      target: cleanTarget,
      handle: data.handle,
      status: Array.isArray(data.status) ? data.status : [],
      registrar: registrarName || "Unknown / Not provided",
      registrarIanaId,
      creationDate,
      expirationDate,
      updatedDate,
      nameservers,
      port43: data.port43,
      raw: data,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lookup failed";
    return NextResponse.json(
      { error: `WHOIS/RDAP query failed: ${message}. The registry server may be temporarily unreachable.` },
      { status: 500 }
    );
  }
}
