import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-neutral-800 bg-white dark:bg-black text-slate-600 dark:text-neutral-400 py-12 px-4 sm:px-6 transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand info */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-950 border border-neutral-800 p-1 flex items-center justify-center">
              <Image
                src="/assets/logo.png"
                alt="WTOOLS"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <span className="font-black text-slate-900 dark:text-white text-base tracking-tight font-sans">
              WTOOLS
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-400 max-w-md leading-relaxed">
            Practical network, domain, web, security, phone, geolocation, and developer tools. Built for quick execution and daily technical utility.
          </p>
          <div className="pt-1">
            <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400">
              Created by{" "}
              <Link
                href="/developer"
                className="text-slate-900 dark:text-white hover:text-blue-500 font-medium underline underline-offset-4 decoration-slate-300 dark:decoration-neutral-700 hover:decoration-blue-500 transition-colors"
              >
                Wasee / Wyzuk
              </Link>
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3 font-mono">
            Navigation
          </h4>
          <ul className="space-y-2 text-xs sm:text-sm">
            <li>
              <Link href="/tools" className="hover:text-blue-500 dark:hover:text-white transition-colors">
                All Utilities Directory
              </Link>
            </li>
            <li>
              <Link href="/developer" className="hover:text-blue-500 dark:hover:text-white transition-colors">
                About Developer
              </Link>
            </li>
            <li>
              <Link href="/tools/ip-lookup" className="hover:text-blue-500 dark:hover:text-white transition-colors">
                IP Lookup
              </Link>
            </li>
            <li>
              <Link href="/tools/dns-lookup" className="hover:text-blue-500 dark:hover:text-white transition-colors">
                DNS Resolver
              </Link>
            </li>
            <li>
              <Link href="/tools/whois" className="hover:text-blue-500 dark:hover:text-white transition-colors">
                WHOIS / RDAP
              </Link>
            </li>
            <li>
              <Link href="/tools/ssl-inspector" className="hover:text-blue-500 dark:hover:text-white transition-colors">
                SSL / TLS Inspector
              </Link>
            </li>
          </ul>
        </div>

        {/* Developer & External */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3 font-mono">
            Source &amp; Author
          </h4>
          <ul className="space-y-2 text-xs sm:text-sm">
            <li>
              <a
                href="https://github.com/wyzuk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-blue-500 dark:hover:text-white transition-colors"
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
                className="inline-flex items-center gap-1.5 hover:text-blue-500 dark:hover:text-white transition-colors"
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
                className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:underline transition-colors"
              >
                <span>Public APIs Directory</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom disclaimer */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-neutral-500">
        <div>
          &copy; {new Date().getFullYear()} WTOOLS &bull; Fast, focused utilities.
        </div>
        <div>
          Designed for developers, engineers, and technical researchers.
        </div>
      </div>
    </footer>
  );
}
