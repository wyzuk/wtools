import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const RECORD_TYPES: Record<number, string> = {
  1: "A",
  2: "NS",
  5: "CNAME",
  6: "SOA",
  12: "PTR",
  15: "MX",
  16: "TXT",
  28: "AAAA",
  33: "SRV",
  257: "CAA",
};

interface DnsAnswer {
  name: string;
  type: number;
  typeName?: string;
  TTL: number;
  data: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name")?.trim();
  const type = (searchParams.get("type") || "A").toUpperCase();

  if (!name) {
    return NextResponse.json({ error: "Domain or hostname is required." }, { status: 400 });
  }

  // Clean domain input
  const cleanName = name.replace(/^https?:\/\//i, "").replace(/\/.*$/, "").trim();

  try {
    // Query Cloudflare DNS-over-HTTPS
    const cfUrl = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(
      cleanName
    )}&type=${encodeURIComponent(type)}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    let res = await fetch(cfUrl, {
      signal: controller.signal,
      headers: {
        Accept: "application/dns-json",
      },
    });
    clearTimeout(timeout);

    let data;
    if (res.ok) {
      data = await res.json();
    } else {
      // Fallback to Google Public DNS
      const googleUrl = `https://dns.google/resolve?name=${encodeURIComponent(
        cleanName
      )}&type=${encodeURIComponent(type)}`;
      const gRes = await fetch(googleUrl, { headers: { Accept: "application/json" } });
      if (!gRes.ok) {
        return NextResponse.json(
          { error: "Both Cloudflare and Google DoH servers were unreachable." },
          { status: 502 }
        );
      }
      data = await gRes.json();
    }

    const answers: DnsAnswer[] = (data.Answer || []).map((ans: DnsAnswer) => ({
      name: ans.name,
      type: ans.type,
      typeName: RECORD_TYPES[ans.type] || `TYPE${ans.type}`,
      TTL: ans.TTL,
      data: ans.data,
    }));

    const authorities = (data.Authority || []).map((ans: DnsAnswer) => ({
      name: ans.name,
      type: ans.type,
      typeName: RECORD_TYPES[ans.type] || `TYPE${ans.type}`,
      TTL: ans.TTL,
      data: ans.data,
    }));

    return NextResponse.json({
      query: {
        name: cleanName,
        type,
      },
      status: data.Status,
      statusMessage:
        data.Status === 0
          ? "NOERROR"
          : data.Status === 3
          ? "NXDOMAIN (Non-Existent Domain)"
          : data.Status === 2
          ? "SERVFAIL (Server Failure)"
          : `RCODE ${data.Status}`,
      dnssec: Boolean(data.AD),
      truncated: Boolean(data.TC),
      answers,
      authorities,
      raw: data,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lookup failed";
    return NextResponse.json({ error: `DNS query failed: ${message}` }, { status: 500 });
  }
}
