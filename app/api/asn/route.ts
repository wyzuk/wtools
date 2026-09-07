import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawAsn = searchParams.get("asn")?.trim();

  if (!rawAsn) {
    return NextResponse.json({ error: "Autonomous System Number (ASN) is required." }, { status: 400 });
  }

  const asnNumber = rawAsn.replace(/^as/i, "").trim();

  if (!/^\d+$/.test(asnNumber)) {
    return NextResponse.json(
      { error: "Invalid ASN format. Please enter an ASN number (e.g. 15169 or AS15169)." },
      { status: 400 }
    );
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    // Query official RIPE Stat ASN Overview API (Public APIs)
    const [overviewRes, routingRes] = await Promise.all([
      fetch(`https://stat.ripe.net/data/as-overview/data.json?resource=AS${asnNumber}`, {
        signal: controller.signal,
        headers: { "User-Agent": "WTOOLS/1.0" },
      }),
      fetch(`https://stat.ripe.net/data/routing-status/data.json?resource=AS${asnNumber}`, {
        signal: controller.signal,
        headers: { "User-Agent": "WTOOLS/1.0" },
      }).catch(() => null),
    ]);
    clearTimeout(timeout);

    if (!overviewRes.ok) {
      // Fallback to RDAP
      const rdapRes = await fetch(`https://rdap.org/autnum/${asnNumber}`, {
        headers: { Accept: "application/json" },
      });
      if (!rdapRes.ok) {
        return NextResponse.json(
          { error: `ASN AS${asnNumber} not found in Regional Internet Registries.` },
          { status: 404 }
        );
      }
      const rdapData = await rdapRes.json();
      return NextResponse.json({
        asn: Number(asnNumber),
        name: rdapData.name || `AS${asnNumber}`,
        description: rdapData.handle || "Registered Autonomous System",
        country_code: rdapData.country || "Global",
        owner: [rdapData.name || "Registry Allocated"],
        rir_name: "IANA / RIR Allocated",
        iana_assignment_status: "Active",
        ipv4_prefixes: 0,
        ipv6_prefixes: 0,
        upstreams_count: 0,
        downstreams_count: 0,
        raw: rdapData,
      });
    }

    const overviewJson = await overviewRes.json();
    const routingJson = routingRes && routingRes.ok ? await routingRes.json() : null;

    const data = overviewJson.data;
    const routing = routingJson?.data;

    return NextResponse.json({
      asn: Number(asnNumber),
      name: data.holder || `AS${asnNumber}`,
      description: data.block?.desc || data.block?.name || "Autonomous System",
      country_code: data.block?.resource ? "Global / RIR" : "N/A",
      owner: [data.holder || "Unknown"],
      rir_name: data.block?.desc || "RIR Registry",
      iana_assignment_status: data.announced ? "Announced in Global BGP" : "Allocated / Unannounced",
      ipv4_prefixes: routing?.announced_space?.v4?.prefixes ?? 0,
      ipv6_prefixes: routing?.announced_space?.v6?.prefixes ?? 0,
      upstreams_count: routing?.observed_neighbours ?? 0,
      downstreams_count: routing?.visibility?.v4?.ris_peers_seeing ?? 0,
      raw: { overview: data, routing },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lookup failed";
    return NextResponse.json(
      { error: `ASN query failed: ${message}. Registry servers temporarily unreachable.` },
      { status: 500 }
    );
  }
}
