import { NextRequest, NextResponse } from "next/server";
import dns from "dns/promises";

export const dynamic = "force-dynamic";

function checkBogon(ip: string): { isBogon: boolean; reason?: string } {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
    if (ip.includes(":")) {
      if (ip === "::1") return { isBogon: true, reason: "IPv6 Loopback" };
      if (ip.startsWith("fe80:")) return { isBogon: true, reason: "IPv6 Link-Local" };
      if (ip.startsWith("fc00:") || ip.startsWith("fd00:")) return { isBogon: true, reason: "IPv6 Unique Local" };
      return { isBogon: false };
    }
    return { isBogon: true, reason: "Invalid IP address" };
  }

  const [a, b] = parts;
  if (a === 0) return { isBogon: true, reason: "0.0.0.0/8 (Current network)" };
  if (a === 10) return { isBogon: true, reason: "10.0.0.0/8 (RFC 1918 Private)" };
  if (a === 100 && b >= 64 && b <= 127) return { isBogon: true, reason: "100.64.0.0/10 (Carrier-Grade NAT)" };
  if (a === 127) return { isBogon: true, reason: "127.0.0.0/8 (Loopback)" };
  if (a === 169 && b === 254) return { isBogon: true, reason: "169.254.0.0/16 (Link-Local / APIPA)" };
  if (a === 172 && b >= 16 && b <= 31) return { isBogon: true, reason: "172.16.0.0/12 (RFC 1918 Private)" };
  if (a === 192 && b === 0 && parts[2] === 2) return { isBogon: true, reason: "192.0.2.0/24 (TEST-NET-1)" };
  if (a === 192 && b === 168) return { isBogon: true, reason: "192.168.0.0/16 (RFC 1918 Private)" };
  if (a === 198 && (b === 18 || b === 19)) return { isBogon: true, reason: "198.18.0.0/15 (Benchmark Testing)" };
  if (a === 198 && b === 51 && parts[2] === 100) return { isBogon: true, reason: "198.51.100.0/24 (TEST-NET-2)" };
  if (a === 203 && b === 0 && parts[2] === 113) return { isBogon: true, reason: "203.0.113.0/24 (TEST-NET-3)" };
  if (a >= 224 && a <= 239) return { isBogon: true, reason: "224.0.0.0/4 (Multicast)" };
  if (a >= 240) return { isBogon: true, reason: "240.0.0.0/4 (Reserved / Future Use)" };

  return { isBogon: false };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ip = searchParams.get("ip")?.trim();

  if (!ip) {
    return NextResponse.json({ error: "IP address is required." }, { status: 400 });
  }

  const bogonResult = checkBogon(ip);

  // Attempt reverse DNS
  let hostnames: string[] = [];
  try {
    hostnames = await dns.reverse(ip);
  } catch {
    // Reverse DNS may not exist
  }

  // Query IP details
  let ipData: Record<string, unknown> | null = null;
  if (!bogonResult.isBogon) {
    try {
      const res = await fetch(`https://ipwhois.app/json/${encodeURIComponent(ip)}`, {
        headers: { "User-Agent": "WTOOLS/1.0" },
      });
      if (res.ok) {
        ipData = await res.json();
      }
    } catch {
      // ignore
    }
  }

  return NextResponse.json({
    ip,
    isBogon: bogonResult.isBogon,
    bogonReason: bogonResult.reason || null,
    reverseDns: hostnames.length > 0 ? hostnames : ["None found"],
    isp: ipData?.isp || null,
    org: ipData?.org || null,
    asn: ipData?.asn || null,
    country: ipData?.country || null,
    threatLevel: bogonResult.isBogon ? "Restricted / Unroutable" : "Standard Public IP",
  });
}
