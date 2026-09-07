import { CategoryDefinition, ToolDefinition } from "@/types/tools";

export const CATEGORIES: CategoryDefinition[] = [
  {
    id: "network",
    name: "Network",
    description: "IP addresses, routing, DNS records, subnets, and connection diagnostics.",
    icon: "Network",
  },
  {
    id: "domain",
    name: "Domain",
    description: "WHOIS registry, DNS records, MX mail exchangers, and SSL/TLS certificates.",
    icon: "Globe",
  },
  {
    id: "web",
    name: "Web",
    description: "URL inspection, HTTP status codes, headers, OpenGraph metadata, and robots.txt.",
    icon: "Compass",
  },
  {
    id: "security",
    name: "Security",
    description: "Cryptographic hash generation, JWT decoding, security headers, and password utilities.",
    icon: "Shield",
  },
  {
    id: "phone",
    name: "Phone",
    description: "Phone number validation, carrier detection, E.164 formatting, and international dial codes.",
    icon: "Phone",
  },
  {
    id: "geo",
    name: "Geolocation",
    description: "IP geolocation, geographic coordinates, geohash, and country metadata.",
    icon: "MapPin",
  },
  {
    id: "developer",
    name: "Developer",
    description: "JSON tools, UUID/ULID generation, regular expressions, timestamps, and encoders.",
    icon: "Code2",
  },
];

export const TOOLS: ToolDefinition[] = [
  // NETWORK
  {
    slug: "ip-lookup",
    name: "IP Lookup",
    category: "network",
    description: "Look up geographical location, ISP, ASN, hostname, and network details for any IPv4 or IPv6 address.",
    longDescription:
      "Query accurate network intelligence for any public IP address or your current connection. Inspect ISP, organization, autonomous system number (ASN), geographical coordinates, and reverse DNS.",
    icon: "Activity",
    keywords: ["ip", "address", "ipv4", "ipv6", "isp", "location", "whois", "network"],
    popular: true,
    featured: true,
    apiSource: {
      name: "IP-API & IPAPI (Public APIs)",
      url: "https://ipapi.co/",
      type: "public-api",
    },
  },
  {
    slug: "dns-lookup",
    name: "DNS Lookup",
    category: "network",
    description: "Query DNS records (A, AAAA, CNAME, MX, TXT, NS, SOA, CAA, PTR) via DNS-over-HTTPS.",
    longDescription:
      "Perform high-precision DNS resolution using authoritative DNS-over-HTTPS providers (Cloudflare & Google Public DNS). Inspect record values, TTLs, and DNSSEC validation flags.",
    icon: "Server",
    keywords: ["dns", "a", "aaaa", "cname", "mx", "txt", "ns", "soa", "doh", "records"],
    popular: true,
    featured: true,
    apiSource: {
      name: "Cloudflare & Google DoH (RFC 8484)",
      url: "https://cloudflare-dns.com/dns-query",
      type: "standard-protocol",
    },
  },
  {
    slug: "asn-lookup",
    name: "ASN Lookup",
    category: "network",
    description: "Inspect Autonomous System Numbers, BGP routing prefixes, owner organization, and peering details.",
    longDescription:
      "Look up any Autonomous System (e.g. AS15169 Google, AS13335 Cloudflare). Retrieve allocated IP prefixes, registry information, upstream peers, and routing statistics.",
    icon: "Layers",
    keywords: ["asn", "bgp", "autonomous system", "routing", "prefix", "peering", "transit"],
    popular: true,
    apiSource: {
      name: "BGPView & RDAP (Public APIs)",
      url: "https://api.bgpview.io/",
      type: "public-api",
    },
  },
  {
    slug: "reverse-dns",
    name: "Reverse DNS (PTR)",
    category: "network",
    description: "Find the fully qualified domain name (FQDN) associated with an IP address via PTR record lookup.",
    longDescription:
      "Performs reverse DNS lookups on IPv4 and IPv6 addresses by querying in-addr.arpa and ip6.arpa PTR records using DNS-over-HTTPS.",
    icon: "CornerDownLeft",
    keywords: ["reverse dns", "ptr", "in-addr.arpa", "fqdn", "hostname", "ip to domain"],
    apiSource: {
      name: "Cloudflare DoH PTR Resolution",
      url: "https://cloudflare-dns.com/dns-query",
      type: "standard-protocol",
    },
  },
  {
    slug: "subnet-calculator",
    name: "Subnet & CIDR Calculator",
    category: "network",
    description: "Calculate network range, broadcast address, netmask, wildcard mask, and usable host counts for CIDR blocks.",
    longDescription:
      "Deterministic IPv4 CIDR and subnet mask calculator. Computes the network address, first and last usable host, broadcast address, total host count, wildcard mask, and binary representation.",
    icon: "Binary",
    keywords: ["subnet", "cidr", "mask", "netmask", "ip range", "ipv4", "broadcast", "calculator"],
    popular: true,
    apiSource: {
      name: "Local Bitwise Math",
      url: "https://tools.ietf.org/html/rfc4632",
      type: "client-side",
    },
  },
  {
    slug: "http-headers",
    name: "HTTP Headers Inspector",
    category: "network",
    description: "Inspect raw response headers, HTTP protocol version, status codes, and server signatures of any public endpoint.",
    longDescription:
      "Fetches any public HTTP/HTTPS endpoint securely and displays complete response headers, cache directives, server banners, and protocol metadata.",
    icon: "FileCode",
    keywords: ["headers", "http", "response", "server", "cache-control", "status", "web"],
    popular: true,
    apiSource: {
      name: "WTOOLS SSRF-Guarded Probe",
      url: "https://github.com/wyzuk",
      type: "server-probe",
    },
  },
  {
    slug: "ip-reputation",
    name: "IP Reputation & Bogon Check",
    category: "network",
    description: "Check whether an IP address belongs to reserved/bogon ranges, known cloud/datacenter networks, or public proxy lists.",
    longDescription:
      "Analyzes an IP address against IANA reserved blocks, RFC 1918/6598 allocations, known datacenter ranges, and public threat telemetry.",
    icon: "ShieldAlert",
    keywords: ["reputation", "bogon", "proxy", "vpn", "tor", "threat", "ip reputation"],
    apiSource: {
      name: "IANA & Public Intelligence Feeds",
      url: "https://www.iana.org/assignments/ipv4-address-space/",
      type: "public-api",
    },
  },
  {
    slug: "my-ip",
    name: "My Connection & IP",
    category: "network",
    description: "Instantly view your public IP address, User-Agent, approximate location, ISP, and connection properties.",
    longDescription:
      "Detects your incoming public IP address, ISP, location, TLS capabilities, and request headers sent by your browser.",
    icon: "Wifi",
    keywords: ["my ip", "what is my ip", "current ip", "client ip", "public ip"],
    popular: true,
    apiSource: {
      name: "Direct Client Request Analysis",
      url: "https://ipapi.co/",
      type: "public-api",
    },
  },

  // DOMAIN
  {
    slug: "whois",
    name: "WHOIS / RDAP Lookup",
    category: "domain",
    description: "Query domain registration records, registrar details, registration dates, expiration, and domain status.",
    longDescription:
      "Fetches authoritative Registration Data Access Protocol (RDAP) and WHOIS records for top-level domains. Displays registrar names, creation dates, expiration dates, nameservers, and domain status codes.",
    icon: "FileSearch",
    keywords: ["whois", "rdap", "domain", "registrar", "expiry", "created", "registration"],
    popular: true,
    featured: true,
    apiSource: {
      name: "ICANN RDAP / OpenRDAP",
      url: "https://rdap.org/",
      type: "standard-protocol",
    },
  },
  {
    slug: "dns-records",
    name: "DNS Records Explorer",
    category: "domain",
    description: "Simultaneously scan and inspect all primary DNS record types (A, AAAA, MX, TXT, NS, CNAME, SOA, CAA) for a domain.",
    longDescription:
      "Runs concurrent DoH queries across all major DNS record types to give an instant complete snapshot of a domain's DNS configuration.",
    icon: "Database",
    keywords: ["dns records", "all records", "dns explorer", "zone", "domain dns"],
    apiSource: {
      name: "Cloudflare DNS over HTTPS",
      url: "https://cloudflare-dns.com/dns-query",
      type: "standard-protocol",
    },
  },
  {
    slug: "mx-lookup",
    name: "MX & Mail Server Lookup",
    category: "domain",
    description: "Examine MX (Mail Exchange) records, server priorities, hostnames, and IP resolutions for email delivery.",
    longDescription:
      "Discovers all mail exchangers configured for a domain, sorted by priority. Shows hostnames, resolved IPv4 addresses, and common provider identifications (Google Workspace, Microsoft 365, ProtonMail, Fastmail).",
    icon: "Mail",
    keywords: ["mx", "mail", "email", "exchange", "smtp", "mailserver", "priority"],
    popular: true,
    apiSource: {
      name: "Cloudflare DoH",
      url: "https://cloudflare-dns.com/dns-query",
      type: "standard-protocol",
    },
  },
  {
    slug: "spf-dmarc-checker",
    name: "SPF & DMARC Checker",
    category: "domain",
    description: "Validate email authentication records (SPF, DMARC, and DKIM selectors) to safeguard email deliverability.",
    longDescription:
      "Parses and analyzes SPF (`v=spf1`) and DMARC (`v=DMARC1`) policy records from domain TXT entries. Highlights policy enforcement (`p=reject`, `p=quarantine`, `p=none`), mechanisms, and alignment configurations.",
    icon: "CheckSquare",
    keywords: ["spf", "dmarc", "dkim", "email security", "txt", "mail authentication"],
    popular: true,
    apiSource: {
      name: "Cloudflare DoH TXT Query",
      url: "https://cloudflare-dns.com/dns-query",
      type: "standard-protocol",
    },
  },
  {
    slug: "ssl-inspector",
    name: "SSL / TLS Certificate Inspector",
    category: "domain",
    description: "Inspect live SSL/TLS certificates, issuer CA, validity period, days remaining, Subject Alternative Names (SANs), and cipher suite.",
    longDescription:
      "Establishes a secure TLS handshake to extract real X.509 certificate data directly from the host. Verifies common name, issuer organization, expiration dates, serial number, fingerprints, and TLS protocol negotiation.",
    icon: "Lock",
    keywords: ["ssl", "tls", "certificate", "x509", "issuer", "san", "https", "expiry", "cipher"],
    popular: true,
    featured: true,
    apiSource: {
      name: "Live TLS Handshake Probe",
      url: "https://nodejs.org/api/tls.html",
      type: "server-probe",
    },
  },

  // WEB
  {
    slug: "url-analyzer",
    name: "URL Analyzer & Parser",
    category: "web",
    description: "Deconstruct URLs into protocol, hostname, port, pathname, search params, and hash fragments with encoding analysis.",
    longDescription:
      "Breaks down complex URLs according to RFC 3986. Decodes individual query parameters, verifies standard port assignments, and identifies tracking parameters.",
    icon: "Link2",
    keywords: ["url", "uri", "parser", "query params", "protocol", "port", "path", "query"],
    popular: true,
    apiSource: {
      name: "WHATWG URL Standard",
      url: "https://url.spec.whatwg.org/",
      type: "client-side",
    },
  },
  {
    slug: "http-status-checker",
    name: "HTTP Status & Redirect Checker",
    category: "web",
    description: "Test any URL to verify HTTP status codes, follow redirect chains (301/302/307/308), and measure response timing.",
    longDescription:
      "Performs a server-side request following redirects hop-by-hop. Displays each redirect status code, target location, and overall latency.",
    icon: "Share2",
    keywords: ["http status", "redirect", "301", "302", "status code", "redirect checker", "latency"],
    apiSource: {
      name: "WTOOLS SSRF-Guarded Fetch",
      url: "https://github.com/wyzuk",
      type: "server-probe",
    },
  },
  {
    slug: "metadata-inspector",
    name: "Website Metadata & OpenGraph",
    category: "web",
    description: "Extract meta titles, descriptions, canonical links, OpenGraph (og:image, og:title), and Twitter card tags.",
    longDescription:
      "Scrapes public HTML to inspect social sharing metadata, favicon links, viewport settings, robots meta tags, and structured data tags.",
    icon: "Eye",
    keywords: ["metadata", "opengraph", "og:image", "meta tags", "seo", "twitter card"],
    popular: true,
    apiSource: {
      name: "WTOOLS SSRF-Guarded Scraper",
      url: "https://github.com/wyzuk",
      type: "server-probe",
    },
  },
  {
    slug: "robots-checker",
    name: "Robots.txt & Sitemap Viewer",
    category: "web",
    description: "Fetch, view, and inspect robots.txt rules, crawl directives, user-agent restrictions, and declared XML sitemaps.",
    longDescription:
      "Retrieves `/robots.txt` from any web domain, parses User-agent rules, Disallow/Allow paths, Crawl-delay, and linked sitemap declarations.",
    icon: "FileText",
    keywords: ["robots.txt", "sitemap", "crawler", "disallow", "seo", "bot rules"],
    apiSource: {
      name: "WTOOLS SSRF-Guarded Fetch",
      url: "https://github.com/wyzuk",
      type: "server-probe",
    },
  },

  // SECURITY
  {
    slug: "hash-generator",
    name: "Cryptographic Hash Generator",
    category: "security",
    description: "Generate SHA-256, SHA-512, SHA-384, SHA-1, and MD5 hashes instantly in your browser via the Web Crypto API.",
    longDescription:
      "Computes cryptographic digests client-side with zero data sent over the network. Supports text inputs, hex and base64 outputs, and multiple hash algorithms simultaneously.",
    icon: "Hash",
    keywords: ["hash", "sha256", "sha512", "md5", "sha1", "crypto", "digest", "checksum"],
    popular: true,
    featured: true,
    apiSource: {
      name: "W3C Web Cryptography API",
      url: "https://www.w3.org/TR/WebCryptoAPI/",
      type: "client-side",
    },
  },
  {
    slug: "hash-identifier",
    name: "Hash Identifier",
    category: "security",
    description: "Analyze an unknown hash string by length, charset, and format to detect possible cryptographic hash algorithms.",
    longDescription:
      "Matches hash signatures against known algorithmic outputs including MD5, SHA-1, SHA-256, SHA-512, NTLM, bcrypt, CRC32, and RIPEMD-160.",
    icon: "Search",
    keywords: ["hash identifier", "detect hash", "identify hash", "md5", "sha256", "type"],
    apiSource: {
      name: "Local Algorithmic Signature Analyzer",
      url: "https://github.com/wyzuk",
      type: "client-side",
    },
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder & Inspector",
    category: "security",
    description: "Decode JSON Web Tokens (JWT) client-side to inspect headers, payload claims, expiration time, and issued dates.",
    longDescription:
      "Decodes Base64URL-encoded JSON Web Tokens without sending your sensitive token to any server. Formats headers, claims (sub, iss, aud, exp, iat, nbf), and calculates human-readable validity times.",
    icon: "KeyRound",
    keywords: ["jwt", "token", "json web token", "decode", "claims", "bearer", "auth"],
    popular: true,
    apiSource: {
      name: "RFC 7519 Client-Side Parser",
      url: "https://datatracker.ietf.org/doc/html/rfc7519",
      type: "client-side",
    },
  },
  {
    slug: "base64-codec",
    name: "Base64 & Hex Encoder / Decoder",
    category: "security",
    description: "Encode and decode plain text, UTF-8 strings, and hex formats to and from Base64 and URL-safe Base64.",
    longDescription:
      "Fast, bidirectional Base64, Hexadecimal, and URL-safe Base64 encoding and decoding. Handles multi-byte Unicode strings cleanly without byte corruption.",
    icon: "Binary",
    keywords: ["base64", "hex", "encode", "decode", "base64url", "binary", "text"],
    popular: true,
    apiSource: {
      name: "Client-Side Unicode Engine",
      url: "https://github.com/wyzuk",
      type: "client-side",
    },
  },
  {
    slug: "security-headers",
    name: "Security Headers Analyzer",
    category: "security",
    description: "Evaluate HTTP security headers: HSTS, CSP, X-Frame-Options, X-Content-Type-Options, and Referrer-Policy.",
    longDescription:
      "Performs an in-depth security scan of a site's HTTP response headers. Assesses Content-Security-Policy (CSP), Strict-Transport-Security (HSTS), X-Frame-Options, X-Content-Type-Options, and Permissions-Policy.",
    icon: "ShieldCheck",
    keywords: ["security headers", "csp", "hsts", "x-frame-options", "security check", "owasp"],
    popular: true,
    apiSource: {
      name: "WTOOLS Security Evaluator",
      url: "https://owasp.org/",
      type: "server-probe",
    },
  },
  {
    slug: "password-generator",
    name: "Secure Password Generator",
    category: "security",
    description: "Generate cryptographically secure passwords and passphrases with custom length, symbols, and entropy calculation.",
    longDescription:
      "Uses `crypto.getRandomValues()` to generate high-entropy passwords, pin codes, or multi-word passphrases with zero algorithmic bias.",
    icon: "Lock",
    keywords: ["password", "generator", "passphrase", "crypto", "entropy", "random", "secure"],
    apiSource: {
      name: "Web Crypto CSPRNG",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues",
      type: "client-side",
    },
  },

  // PHONE
  {
    slug: "phone-lookup",
    name: "Phone Number Intelligence & Lookup",
    category: "phone",
    description: "Look up phone number carrier, country dial code, geographic region, line type (mobile/VoIP/fixed), and format.",
    longDescription:
      "Performs deep telecom intelligence inspection on international telephone numbers using standard E.164 parsing. Detects country of origin, national destination codes, line type, and international formatting.",
    icon: "Phone",
    keywords: ["phone lookup", "phone number", "carrier", "telecom", "line type", "country code"],
    popular: true,
    featured: true,
    apiSource: {
      name: "Google libphonenumber standard",
      url: "https://github.com/google/libphonenumber",
      type: "client-side",
    },
  },
  {
    slug: "phone-validator",
    name: "Phone Number Validator & Lookup",
    category: "phone",
    description: "Validate international phone numbers, detect country code, carrier name, line type (mobile/fixed), and valid format.",
    longDescription:
      "Uses Google's standardized phone metadata library (`libphonenumber`) to validate international phone numbers. Parses country dial codes, checks national number lengths, identifies line types, and validates E.164 compliance.",
    icon: "PhoneCall",
    keywords: ["phone", "validator", "carrier", "mobile", "fixed line", "e164", "country code", "sms"],
    popular: true,
    featured: true,
    apiSource: {
      name: "libphonenumber & Public Telecom Metadata",
      url: "https://github.com/google/libphonenumber",
      type: "client-side",
    },
  },
  {
    slug: "phone-formatter",
    name: "Phone Number Formatter & Parser",
    category: "phone",
    description: "Format phone numbers across E.164, International, National, and RFC 3966 URI formats with dial code breakdown.",
    longDescription:
      "Transforms raw phone inputs into standard telecommunications formats: E.164 (+14155552671), International (+1 415 555 2671), National ((415) 555-2671), and URI (`tel:+1-415-555-2671`).",
    icon: "FileCheck",
    keywords: ["phone formatter", "e164", "rfc3966", "national format", "international format"],
    popular: true,
    apiSource: {
      name: "libphonenumber-js",
      url: "https://gitlab.com/catamphetamine/libphonenumber-js",
      type: "client-side",
    },
  },
  {
    slug: "country-calling-codes",
    name: "Country Calling Codes Directory",
    category: "phone",
    description: "Search international telephone country codes, ISO alpha-2/3 country codes, and international dialing prefixes.",
    longDescription:
      "Comprehensive, searchable directory of ITU-T E.164 country calling codes, ISO country codes, and international dial rules.",
    icon: "BookOpen",
    keywords: ["country codes", "dial code", "calling code", "itu", "e164", "prefixes"],
    apiSource: {
      name: "ITU-T E.164 Standard Data",
      url: "https://www.itu.int/oth/T0202.aspx",
      type: "client-side",
    },
  },

  // GEO
  {
    slug: "ip-geo",
    name: "IP Geolocation",
    category: "geo",
    description: "Locate public IP addresses on the world map: latitude, longitude, country, region, city, and timezone.",
    longDescription:
      "Pinpoint geographic locations associated with IP addresses or hostnames. Provides country names, ISO codes, coordinates, postal codes, and local timezone offsets.",
    icon: "MapPin",
    keywords: ["ip geolocation", "geo", "latitude", "longitude", "city", "country", "coordinates"],
    popular: true,
    apiSource: {
      name: "IP-API & IPAPI (Public APIs)",
      url: "https://ipapi.co/",
      type: "public-api",
    },
  },
  {
    slug: "coordinate-converter",
    name: "Coordinate & Geohash Converter",
    category: "geo",
    description: "Convert geographic coordinates between Decimal Degrees (DD), Degrees Minutes Seconds (DMS), and Geohash.",
    longDescription:
      "Convert latitude and longitude between Decimal Degrees (40.7128° N, 74.0060° W) and DMS format (40° 42' 46\" N, 74° 0' 21\" W), plus calculate Geohash bounding boxes.",
    icon: "Compass",
    keywords: ["coordinates", "geohash", "decimal degrees", "dms", "latitude", "longitude", "converter"],
    apiSource: {
      name: "Standard Geodetic Formulas",
      url: "https://en.wikipedia.org/wiki/Geohash",
      type: "client-side",
    },
  },
  {
    slug: "country-info",
    name: "Country Information Explorer",
    category: "geo",
    description: "Look up capital cities, currencies, top-level domains, languages, population, and timezones for any country.",
    longDescription:
      "Access global country data including ISO 3166 codes, currencies, capital cities, primary languages, regions, and ccTLDs.",
    icon: "Globe2",
    keywords: ["country", "capital", "currency", "iso", "tld", "languages", "flag"],
    popular: true,
    apiSource: {
      name: "REST Countries (Public APIs)",
      url: "https://restcountries.com/",
      type: "public-api",
    },
  },

  // DEVELOPER
  {
    slug: "json-formatter",
    name: "JSON Formatter & Validator",
    category: "developer",
    description: "Prettify, minify, validate, and inspect JSON payloads with line numbers, byte counts, and syntax checking.",
    longDescription:
      "Format messy JSON strings with customizable indentation (2 spaces, 4 spaces, tabs), validate syntax with pinpoint error offsets, and minify JSON payloads for production.",
    icon: "Code",
    keywords: ["json", "formatter", "validator", "prettify", "minify", "beautifier", "syntax"],
    popular: true,
    featured: true,
    apiSource: {
      name: "Native V8 JSON Engine",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON",
      type: "client-side",
    },
  },
  {
    slug: "json-diff",
    name: "JSON Structural Diff",
    category: "developer",
    description: "Compare two JSON documents to spot additions, deletions, modifications, and structural discrepancies.",
    longDescription:
      "Performs deep recursive comparison between two JSON inputs. Highlights added keys, removed keys, type mutations, and modified values.",
    icon: "Split",
    keywords: ["json diff", "diff", "compare json", "changes", "compare objects"],
    popular: true,
    apiSource: {
      name: "Client-Side Diff Engine",
      url: "https://github.com/wyzuk",
      type: "client-side",
    },
  },
  {
    slug: "uuid-generator",
    name: "UUID / ULID Generator",
    category: "developer",
    description: "Generate cryptographically secure UUID v4, v7 (timestamp-ordered), and ULIDs individually or in bulk.",
    longDescription:
      "Fast generator for RFC 4122 Version 4 UUIDs, time-ordered Version 7 UUIDs, and Lexicographically Sortable ULIDs with uppercase/lowercase and hyphen options.",
    icon: "Fingerprint",
    keywords: ["uuid", "v4", "v7", "ulid", "guid", "generator", "random id"],
    popular: true,
    apiSource: {
      name: "Crypto CSPRNG & RFC 9562",
      url: "https://datatracker.ietf.org/doc/html/rfc9562",
      type: "client-side",
    },
  },
  {
    slug: "regex-tester",
    name: "Regular Expression Tester",
    category: "developer",
    description: "Test JavaScript regular expressions against target strings with live match count, capture groups, and flag controls.",
    longDescription:
      "Interactive RegExp playground supporting global (g), case-insensitive (i), multiline (m), dotAll (s), and unicode (u) flags with capture group breakdown and timing.",
    icon: "Regex",
    keywords: ["regex", "regexp", "regular expression", "test", "match", "groups"],
    popular: true,
    apiSource: {
      name: "ECMAScript RegExp Engine",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions",
      type: "client-side",
    },
  },
  {
    slug: "unix-timestamp",
    name: "Unix Timestamp Converter",
    category: "developer",
    description: "Convert Unix epoch timestamps (seconds and milliseconds) to UTC and local human-readable date strings.",
    longDescription:
      "Bidirectional converter for Unix timestamps. Converts numeric epochs to ISO 8601, RFC 2822, UTC, and local timezone representations, and provides quick presets (now, start of day).",
    icon: "Clock",
    keywords: ["unix", "timestamp", "epoch", "date", "time", "converter", "utc"],
    popular: true,
    apiSource: {
      name: "ECMAScript Date Engine",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date",
      type: "client-side",
    },
  },
  {
    slug: "user-agent-parser",
    name: "User-Agent Parser",
    category: "developer",
    description: "Parse User-Agent strings to extract browser name, rendering engine, operating system, device family, and architecture.",
    longDescription:
      "Analyzes browser and bot User-Agent strings. Detects Chrome, Firefox, Safari, Edge, Linux, Windows, macOS, iOS, Android, and common bot crawlers.",
    icon: "Laptop",
    keywords: ["user agent", "ua", "browser", "os", "device", "parser", "client"],
    apiSource: {
      name: "Local UA Heuristics",
      url: "https://github.com/wyzuk",
      type: "client-side",
    },
  },
  {
    slug: "mime-types",
    name: "MIME Types Reference",
    category: "developer",
    description: "Search common MIME types by file extension or content-type string with standard RFC references.",
    longDescription:
      "Searchable catalog of standard IANA Media Types and file extensions across application, text, image, audio, video, and font types.",
    icon: "FileSpreadsheet",
    keywords: ["mime", "content-type", "extension", "file type", "iana"],
    apiSource: {
      name: "IANA Media Types Repository",
      url: "https://www.iana.org/assignments/media-types/media-types.xhtml",
      type: "client-side",
    },
  },
  {
    slug: "http-status-codes",
    name: "HTTP Status Codes Reference",
    category: "developer",
    description: "Complete reference of HTTP status codes (1xx Informational, 2xx Success, 3xx Redirection, 4xx Client Error, 5xx Server Error).",
    longDescription:
      "Full reference of official IETF and RFC-defined HTTP status codes with explanation, caching behavior, and typical scenarios.",
    icon: "ListChecks",
    keywords: ["http status codes", "200", "404", "500", "status reference", "rfc"],
    apiSource: {
      name: "RFC 9110 HTTP Semantics",
      url: "https://www.rfc-editor.org/rfc/rfc9110.html",
      type: "standard-protocol",
    },
  },
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: string): ToolDefinition[] {
  return TOOLS.filter((t) => t.category === category);
}

export function getPopularTools(): ToolDefinition[] {
  return TOOLS.filter((t) => t.popular);
}
