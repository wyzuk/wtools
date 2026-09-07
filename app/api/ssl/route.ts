import { NextRequest, NextResponse } from "next/server";
import tls from "tls";
import { validatePublicUrl } from "@/lib/ssrf";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get("host")?.trim();

  if (!target) {
    return NextResponse.json({ error: "Host or domain is required." }, { status: 400 });
  }

  const cleanHost = target
    .replace(/^https?:\/\//i, "")
    .replace(/\/.*$/, "")
    .split(":")[0]
    .trim();

  const validation = await validatePublicUrl(`https://${cleanHost}`);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error || "Invalid host" }, { status: 400 });
  }

  try {
    const certData = await new Promise<{
      subject: unknown;
      issuer: unknown;
      validFrom: string;
      validTo: string;
      daysRemaining: number;
      isExpired: boolean;
      serialNumber: string;
      fingerprint256: string;
      subjectAltName: string[];
      protocol: string | null;
      cipher: tls.CipherNameAndProtocol | null;
      authorized: boolean;
      authorizationError: Error | null;
    }>((resolve, reject) => {
      const socket = tls.connect(
        {
          host: cleanHost,
          port: 443,
          servername: cleanHost,
          rejectUnauthorized: false,
          timeout: 6000,
        },
        () => {
          const cert = socket.getPeerCertificate(true);
          const protocol = socket.getProtocol();
          const cipher = socket.getCipher();
          const authorized = socket.authorized;
          const authorizationError = socket.authorizationError;

          socket.end();

          if (!cert || !cert.valid_to) {
            reject(new Error("No SSL certificate returned by host."));
            return;
          }

          const validFrom = cert.valid_from;
          const validTo = cert.valid_to;
          const expiryDate = new Date(validTo);
          const now = new Date();
          const msRemaining = expiryDate.getTime() - now.getTime();
          const daysRemaining = Math.floor(msRemaining / (1000 * 60 * 60 * 24));
          const isExpired = daysRemaining < 0;

          const sans: string[] = cert.subjectaltname
            ? cert.subjectaltname.split(",").map((s) => s.trim().replace(/^DNS:/i, ""))
            : [];

          resolve({
            subject: cert.subject,
            issuer: cert.issuer,
            validFrom,
            validTo,
            daysRemaining,
            isExpired,
            serialNumber: cert.serialNumber,
            fingerprint256: cert.fingerprint256,
            subjectAltName: sans,
            protocol,
            cipher,
            authorized,
            authorizationError,
          });
        }
      );

      socket.on("timeout", () => {
        socket.destroy();
        reject(new Error("TLS connection timed out (port 443)."));
      });

      socket.on("error", (err) => {
        socket.destroy();
        reject(err);
      });
    });

    return NextResponse.json({
      host: cleanHost,
      ...certData,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Handshake failed";
    return NextResponse.json(
      { error: `SSL/TLS inspection failed for ${cleanHost}: ${message}` },
      { status: 502 }
    );
  }
}
