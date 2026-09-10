# WTOOLS

A modern, fast, and practical developer utility platform featuring 35+ real network, domain, web, security, geolocation, phone, and developer tools.

Built with Next.js 14 App Router, TypeScript, and Tailwind CSS. Designed to be ultra-clean, high-performance, fully responsive, and deployable straight to Vercel with zero configuration.

---

## ✨ Features & Design System
- **Precision Modern UI**: High-contrast, clean typography, smooth glassmorphic panels, and intuitive keyboard navigation.
- **Instant Command Palette**: Fast Cmd+K / Ctrl+K search across all 35+ diagnostic utilities and developer protocols.
- **Dark & Light Modes**: First-class system theme synchronization with tailored contrast ratios.
- **Privacy First**: Zero trackers, zero ads, direct client & edge execution.

---

## 🛠️ Tool Suite

### 🌐 Network Tools
- **My IP Address**: Inspect your public IP, headers, and client network parameters.
- **IP Lookup**: Geolocation, ISP, ASN, reverse DNS, and threat intelligence.
- **DNS Lookup**: Query A, AAAA, CNAME, TXT, NS, MX, SOA, and SRV records.
- **Reverse DNS (PTR)**: Look up domain hostnames associated with an IP address.
- **ASN Lookup**: Query autonomous system details, CIDRs, and announcements.
- **HTTP Headers**: Inspect server response headers, status codes, and latency.
- **IP Reputation**: Check blocklists, threat score, proxy/VPN detection, and bogon status.
- **Subnet Calculator**: Calculate network masks, broadcast addresses, usable hosts, and CIDR notation.

### 🔍 Domain Tools
- **WHOIS Lookup**: Query registrar details, creation/expiration dates, and status codes.
- **DNS Records**: Full DNS record breakdown with formatted query outputs.
- **MX Lookup**: Mail exchanger records, server priorities, and hostnames.
- **SPF & DMARC**: Inspect email validation, SPF mechanisms, and DMARC enforcement policies.
- **SSL / TLS Certificate Inspector**: Verify validity, SANs, issuer, expiry, and handshake ciphers.

### 🕸️ Web Tools
- **HTTP Status Checker**: Test URL status, redirect chains, and response times.
- **Metadata & OpenGraph Inspector**: Inspect title, description, favicon, OpenGraph, and Twitter tags.
- **Robots.txt Validator**: Fetch, parse, and analyze robots.txt directives and sitemaps.
- **URL Parser & Analyzer**: Deconstruct query parameters, protocols, hashes, and encoding.

### 🛡️ Security Tools
- **Base64 Encoder / Decoder**: Safe UTF-8 and URL-safe Base64 conversion.
- **Hash Generator**: Real-time MD5, SHA-1, SHA-256, and SHA-512 calculation.
- **Hash Type Identifier**: Identify hash algorithms by length, charset, and format signatures.
- **JWT Decoder**: Decode header and payload claims with expiration checking.
- **Password Generator**: High-entropy cryptographically secure password generation.
- **Security Headers Analyzer**: Evaluate HSTS, CSP, X-Frame-Options, Permissions-Policy, and CORS.

### 📱 Phone & Geo Tools
- **Phone Number Validator**: E.164 formatting, country detection, carrier lookup, and validity.
- **Phone Number Formatter**: Local and international telephone format normalizer.
- **Country Calling Codes**: International telephone prefix directory and quick search.
- **IP Geolocation**: Coordinate lookup, timezone, city, and map coordinates.
- **Country Info**: Demographics, currencies, calling codes, and languages.
- **Coordinate Converter**: Convert between decimal degrees and DMS (Degrees, Minutes, Seconds).

### 💻 Developer Utilities
- **JSON Formatter & Validator**: Beautify, minify, validate, and inspect JSON structures.
- **JSON Diff**: Line-by-line comparison of two JSON objects.
- **UUID / GUID Generator**: Generate RFC 4122 v4 UUIDs in bulk.
- **Unix Timestamp Converter**: Convert timestamps to human-readable dates and vice versa.
- **Regex Tester**: Real-time regex pattern matcher with group extraction and flag support.
- **User-Agent Parser**: Deconstruct browser, OS, engine, device type, and CPU architecture.
- **HTTP Status Codes Directory**: Searchable reference of all official RFC HTTP status codes.
- **MIME Types Reference**: Comprehensive directory of MIME media types and file extensions.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17+ or later
- npm or yarn

### Installation
```bash
git clone https://github.com/wyzuk/wtools.git
cd wtools
npm install
```

### Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm start
```

---

## ☁️ Deploy to Vercel

WTOOLS is optimized for instant Vercel deployment:

1. Push or import the repository to GitHub.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Select `wtools` from your GitHub repositories.
4. Click **Deploy**. Vercel will automatically detect Next.js and build with zero extra configuration.

---

## 🧑‍💻 Author

Developed by **Wasee / Wyzuk**
- Website: [wasee.dev](https://www.wasee.dev)
- GitHub: [@wyzuk](https://github.com/wyzuk)