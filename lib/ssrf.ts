import dns from "dns/promises";

// List of reserved / private IPv4 and IPv6 patterns
const PRIVATE_IP_PATTERNS = [
  /^127\./, // Loopback
  /^10\./, // Private 10.0.0.0/8
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // Private 172.16.0.0/12
  /^192\.168\./, // Private 192.168.0.0/16
  /^169\.254\./, // Link-local
  /^0\./, // Current network
  /^::1$/, // IPv6 loopback
  /^fe80:/i, // IPv6 link-local
  /^fc00:/i, // IPv6 unique local
  /^fd00:/i, // IPv6 unique local
  /^::ffff:127\./i, // IPv4-mapped loopback
];

export async function validatePublicUrl(inputUrl: string): Promise<{ valid: boolean; error?: string; url?: URL }> {
  try {
    let parsed: URL;
    if (!/^https?:\/\//i.test(inputUrl)) {
      parsed = new URL(`https://${inputUrl}`);
    } else {
      parsed = new URL(inputUrl);
    }

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { valid: false, error: "Only HTTP and HTTPS protocols are allowed." };
    }

    const hostname = parsed.hostname.toLowerCase();

    if (
      hostname === "localhost" ||
      hostname.endsWith(".localhost") ||
      hostname.endsWith(".local") ||
      hostname.endsWith(".internal")
    ) {
      return { valid: false, error: "Internal and localhost hostnames are prohibited." };
    }

    // Resolve hostname to IP to prevent DNS rebinding / private IP access
    try {
      const lookupResult = await dns.lookup(hostname, { all: true });
      for (const record of lookupResult) {
        for (const pattern of PRIVATE_IP_PATTERNS) {
          if (pattern.test(record.address)) {
            return {
              valid: false,
              error: "Resolved address points to a private or restricted network range.",
            };
          }
        }
      }
    } catch {
      return { valid: false, error: "Could not resolve hostname in DNS." };
    }

    return { valid: true, url: parsed };
  } catch {
    return { valid: false, error: "Invalid URL provided." };
  }
}
