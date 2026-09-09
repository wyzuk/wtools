"use client";

import React, { useState, useMemo } from "react";
import { ResultCard } from "@/components/ResultCard";
import { useUsage } from "@/components/UsageContext";
import { UsageLimitBanner } from "@/components/UsageLimitBanner";

export function SubnetCalcTool() {
  const [ip, setIp] = useState("192.168.1.50");
  const [cidr, setCidr] = useState<number>(24);
  const { limitReached, recordToolUsage } = useUsage();
  const [calculated, setCalculated] = useState(false);

  const calculation = useMemo(() => {
    const cleanIp = ip.trim();
    const parts = cleanIp.split(".").map(Number);

    if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
      return { valid: false, error: "Invalid IPv4 address format (must be 4 octets between 0-255)." };
    }

    if (isNaN(cidr) || cidr < 0 || cidr > 32) {
      return { valid: false, error: "CIDR prefix must be between 0 and 32." };
    }

    // Convert IP to 32-bit uint
    const ipInt = ((parts[0] << 24) >>> 0) + ((parts[1] << 16) >>> 0) + ((parts[2] << 8) >>> 0) + (parts[3] >>> 0);

    // Compute mask
    const maskInt = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
    const wildcardInt = ~maskInt >>> 0;

    const netInt = (ipInt & maskInt) >>> 0;
    const bcastInt = (netInt | wildcardInt) >>> 0;

    const intToIp = (num: number) =>
      `${(num >>> 24) & 255}.${(num >>> 16) & 255}.${(num >>> 8) & 255}.${num & 255}`;

    const intToBin = (num: number) =>
      [
        ((num >>> 24) & 255).toString(2).padStart(8, "0"),
        ((num >>> 16) & 255).toString(2).padStart(8, "0"),
        ((num >>> 8) & 255).toString(2).padStart(8, "0"),
        (num & 255).toString(2).padStart(8, "0"),
      ].join(".");

    const totalHosts = Math.pow(2, 32 - cidr);
    const usableHosts = cidr >= 31 ? (cidr === 31 ? 2 : 1) : Math.max(0, totalHosts - 2);

    const firstUsableInt = cidr >= 31 ? netInt : netInt + 1;
    const lastUsableInt = cidr >= 31 ? bcastInt : bcastInt - 1;

    // IP Class
    const firstOctet = parts[0];
    let ipClass = "Class A";
    if (firstOctet >= 128 && firstOctet <= 191) ipClass = "Class B";
    else if (firstOctet >= 192 && firstOctet <= 223) ipClass = "Class C";
    else if (firstOctet >= 224 && firstOctet <= 239) ipClass = "Class D (Multicast)";
    else if (firstOctet >= 240) ipClass = "Class E (Experimental)";

    // Private check
    let type = "Public Routable";
    if (firstOctet === 10) type = "RFC 1918 Private (10.0.0.0/8)";
    else if (firstOctet === 172 && parts[1] >= 16 && parts[1] <= 31) type = "RFC 1918 Private (172.16.0.0/12)";
    else if (firstOctet === 192 && parts[1] === 168) type = "RFC 1918 Private (192.168.0.0/16)";
    else if (firstOctet === 127) type = "Loopback (127.0.0.0/8)";
    else if (firstOctet === 169 && parts[1] === 254) type = "Link-Local / APIPA (169.254.0.0/16)";

    return {
      valid: true,
      cidr: `/${cidr}`,
      ip: cleanIp,
      networkAddress: intToIp(netInt),
      broadcastAddress: intToIp(bcastInt),
      netmask: intToIp(maskInt),
      wildcardMask: intToIp(wildcardInt),
      firstUsable: intToIp(firstUsableInt),
      lastUsable: intToIp(lastUsableInt),
      totalHosts: totalHosts.toLocaleString(),
      usableHosts: usableHosts.toLocaleString(),
      binaryMask: intToBin(maskInt),
      binaryIp: intToBin(ipInt),
      ipClass,
      type,
    };
  }, [ip, cidr]);

  const handleCalculate = async () => {
    if (!calculation.valid || limitReached) return;
    setCalculated(true);
    await recordToolUsage();
  };

  const items = calculation.valid
    ? [
        { label: "CIDR Notation", value: `${calculation.networkAddress}${calculation.cidr}`, copyValue: `${calculation.networkAddress}${calculation.cidr}`, mono: true },
        { label: "Network Address", value: calculation.networkAddress, copyValue: calculation.networkAddress, mono: true },
        { label: "Usable Host Range", value: `${calculation.firstUsable} — ${calculation.lastUsable}`, copyValue: `${calculation.firstUsable} - ${calculation.lastUsable}`, mono: true },
        { label: "Broadcast Address", value: calculation.broadcastAddress, copyValue: calculation.broadcastAddress, mono: true },
        { label: "Subnet Netmask", value: calculation.netmask, copyValue: calculation.netmask, mono: true },
        { label: "Wildcard Mask", value: calculation.wildcardMask, copyValue: calculation.wildcardMask, mono: true },
        { label: "Usable Hosts", value: calculation.usableHosts, mono: true },
        { label: "Total Addresses", value: calculation.totalHosts, mono: true },
        { label: "Address Type", value: calculation.type },
        { label: "Class", value: calculation.ipClass, mono: true },
        { label: "Netmask (Binary)", value: calculation.binaryMask, copyValue: calculation.binaryMask, mono: true },
        { label: "IP (Binary)", value: calculation.binaryIp, copyValue: calculation.binaryIp, mono: true },
      ]
    : [];

  return (
    <div className="space-y-6">
      {limitReached && <UsageLimitBanner />}

      <div className="p-6 bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-white/10 rounded-2xl space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_-4px_rgba(0,0,0,0.05)] transition-colors">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label htmlFor="subnet-ip" className="block text-xs font-semibold text-slate-700 dark:text-white/70 mb-2 uppercase tracking-wider font-mono">
              IP Address
            </label>
            <input
              id="subnet-ip"
              type="text"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              placeholder="192.168.1.1"
              disabled={limitReached}
              className="w-full bg-white dark:bg-black border border-slate-300 dark:border-white/20 rounded-lg px-4 py-2.5 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/40 focus:border-blue-500 disabled:opacity-60"
            />
          </div>

          <div>
            <label htmlFor="subnet-cidr" className="block text-xs font-semibold text-slate-700 dark:text-white/70 mb-2 uppercase tracking-wider font-mono">
              Prefix / Mask (/0 - /32)
            </label>
            <select
              id="subnet-cidr"
              value={cidr}
              disabled={limitReached}
              onChange={(e) => setCidr(Number(e.target.value))}
              className="w-full bg-white dark:bg-black border border-slate-300 dark:border-white/20 rounded-lg px-3 py-2.5 text-sm font-mono text-slate-900 dark:text-white focus:border-blue-500 disabled:opacity-60"
            >
              {Array.from({ length: 33 }, (_, i) => 32 - i).map((prefix) => (
                <option key={prefix} value={prefix}>
                  /{prefix} &bull; {Math.pow(2, 32 - prefix).toLocaleString()} IPs
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-white/50">
            <span>Common:</span>
            {[8, 16, 24, 25, 26, 27, 28, 29, 30].map((c) => (
              <button
                key={c}
                type="button"
                disabled={limitReached}
                onClick={() => setCidr(c)}
                className={`px-2.5 py-1 rounded-md border text-xs font-mono transition-colors disabled:opacity-50 ${
                  cidr === c
                    ? "bg-blue-500 text-white border-blue-500 font-bold"
                    : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/70 hover:border-blue-500"
                }`}
              >
                /{c}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleCalculate}
            disabled={limitReached}
            className="px-6 py-2 rounded-lg bg-[#0071e3] hover:bg-[#0077ed] active:scale-95 disabled:opacity-50 text-white text-sm font-medium transition-colors shadow-sm"
          >
            Calculate Subnet
          </button>
        </div>
      </div>

      {!calculation.valid && (
        <div className="p-4 bg-white dark:bg-[#1c1c1e] border border-slate-300 dark:border-white/20 rounded-lg text-sm text-slate-800 dark:text-white">
          <span className="font-semibold text-slate-900 dark:text-white mr-2">Notice:</span>
          {calculation.error}
        </div>
      )}

      {calculation.valid && (calculated || !limitReached) && (
        <ResultCard
          title={`Subnet Range: ${calculation.networkAddress}${calculation.cidr}`}
          items={items}
        />
      )}
    </div>
  );
}
