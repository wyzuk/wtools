import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-black/[0.08] dark:border-white/[0.08] bg-white/70 dark:bg-[#161618]/70 backdrop-blur-xl text-[#515154] dark:text-[#a1a1a6] py-12 px-4 sm:px-6 transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand info */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[10px] bg-gradient-to-b from-white to-slate-100 dark:from-neutral-800 dark:to-neutral-900 border border-black/[0.1] dark:border-white/[0.15] p-1.5 flex items-center justify-center shadow-sm">
              <Image
                src="/assets/logo.png"
                alt="WTOOLS"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <span className="font-bold text-[#1d1d1f] dark:text-white text-base tracking-tight">
              WTOOLS
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#515154] dark:text-[#a1a1a6] max-w-md leading-relaxed">
            Fast, focused technical utilities for network, domain, security, phone, geolocation, and developer workflows. Built for clean execution with zero tracking.
          </p>
          <div className="pt-1">
            <p className="text-xs sm:text-sm text-[#86868b] dark:text-[#a1a1a6]">
              Created by{" "}
              <Link
                href="/developer"
                className="text-[#1d1d1f] dark:text-white hover:text-[#0071e3] font-semibold underline underline-offset-4 decoration-black/20 dark:decoration-white/20 hover:decoration-[#0071e3] transition-colors"
              >
                Wasee / Wyzuk
              </Link>
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1d1d1f] dark:text-white mb-3 font-mono">
            Navigation
          </h4>
          <ul className="space-y-2 text-xs sm:text-sm">
            <li>
              <Link href="/tools" className="hover:text-[#0071e3] dark:hover:text-white transition-colors">
                All Utilities Directory
              </Link>
            </li>
            <li>
              <Link href="/developer" className="hover:text-[#0071e3] dark:hover:text-white transition-colors">
                About Developer
              </Link>
            </li>
            <li>
              <Link href="/tools/ip-lookup" className="hover:text-[#0071e3] dark:hover:text-white transition-colors">
                IP Lookup
              </Link>
            </li>
            <li>
              <Link href="/tools/dns-lookup" className="hover:text-[#0071e3] dark:hover:text-white transition-colors">
                DNS Resolver
              </Link>
            </li>
            <li>
              <Link href="/tools/whois" className="hover:text-[#0071e3] dark:hover:text-white transition-colors">
                WHOIS / RDAP
              </Link>
            </li>
            <li>
              <Link href="/tools/ssl-inspector" className="hover:text-[#0071e3] dark:hover:text-white transition-colors">
                SSL / TLS Inspector
              </Link>
            </li>
          </ul>
        </div>

        {/* Developer & External */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1d1d1f] dark:text-white mb-3 font-mono">
            Source &amp; Author
          </h4>
          <ul className="space-y-2 text-xs sm:text-sm">
            <li>
              <a
                href="https://github.com/wyzuk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-[#0071e3] dark:hover:text-white transition-colors"
              >
                <span>GitHub (@wyzuk)</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-500" />
              </a>
            </li>
            <li>
              <a
                href="https://www.wasee.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-[#0071e3] dark:hover:text-white transition-colors"
              >
                <span>Website (wasee.dev)</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-500" />
              </a>
            </li>
            <li className="pt-1">
              <a
                href="https://github.com/public-apis/public-apis"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#0071e3] dark:text-[#2997ff] hover:underline transition-colors"
              >
                <span>Public APIs Directory</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom disclaimer */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-black/[0.06] dark:border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#86868b] dark:text-[#a1a1a6]">
        <div>
          &copy; {new Date().getFullYear()} WTOOLS &bull; Engineered like macOS with precision and care.
        </div>
        <div>
          Crafted for engineers, developers, and system administrators.
        </div>
      </div>
    </footer>
  );
}
