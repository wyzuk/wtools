import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Terminal, Github, Globe, Code, Cpu, Server, Shield, Sparkles } from "lucide-react";
import { Metadata } from "next";

import { MacTrafficLights } from "@/components/MacTrafficLights";

export const metadata: Metadata = {
  title: "About Developer — Wasee / Wyzuk | WTOOLS",
  description:
    "Learn about Wasee (Wyzuk), the developer and Linux enthusiast behind WTOOLS, a technical utility suite.",
};

export default function DeveloperPage() {
  const interests = [
    { title: "Web Architecture", desc: "Building fast, standards-compliant web systems and developer tools with modern frameworks.", icon: Code },
    { title: "UNIX & Systems", desc: "Passionate about UNIX philosophies, shell automation, kernel tuning, and minimal software design.", icon: Terminal },
    { title: "Browser Games", desc: "Engineering lightweight interactive browser games, canvas mechanics, and graphics prototypes.", icon: Sparkles },
    { title: "Automation Bots", desc: "Writing dependable, event-driven automation bots and service integrations.", icon: Server },
    { title: "OS & Systems Programming", desc: "Low-level system programming, exploring how computing hardware and kernels work from scratch.", icon: Cpu },
    { title: "Applied AI Research", desc: "Practical hands-on exploration of intelligence models and agentic computing architectures.", icon: Shield },
  ];

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 max-w-4xl mx-auto space-y-10">
      <section className="bg-white dark:bg-[#1c1c1e] border border-black/[0.08] dark:border-white/[0.1] rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_16px_40px_-8px_rgba(0,0,0,0.06)] overflow-hidden transition-all">
        <div className="px-6 py-3.5 border-b border-black/[0.06] dark:border-white/[0.08] bg-black/[0.015] dark:bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MacTrafficLights size="xs" />
            <span className="text-xs font-semibold text-[#86868b] dark:text-[#a1a1a6]">
              System Profile &bull; Developer Identity
            </span>
          </div>
          <span className="text-xs font-mono text-[#0071e3] dark:text-[#2997ff]">Developer Pro Edition</span>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative w-20 h-20 rounded-[20px] bg-gradient-to-b from-white to-[#f5f5f7] dark:from-neutral-800 dark:to-neutral-900 border border-black/[0.1] dark:border-white/[0.15] overflow-hidden flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-2">
              <Image
                src="/assets/logo.png"
                alt="WTOOLS"
                width={64}
                height={64}
                className="object-contain drop-shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full border border-[#0071e3]/20 bg-blue-500/10 text-xs font-semibold text-[#0071e3] dark:text-[#2997ff]">
                Developer &bull; Linux Enthusiast
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] dark:text-white tracking-tight">
                Wasee <span className="text-[#86868b] dark:text-[#a1a1a6] font-normal text-xl">/ Wyzuk</span>
              </h1>
              <p className="text-sm sm:text-base text-[#515154] dark:text-[#a1a1a6]">
                Full-stack developer &bull; Systems thinker &bull; Open source maker
              </p>
            </div>
          </div>

          <div className="text-sm sm:text-base text-[#333336] dark:text-[#d1d1d6] space-y-3.5 leading-relaxed border-t border-black/[0.06] dark:border-white/[0.08] pt-6">
            <p>
              Hi, I&apos;m <strong className="text-[#1d1d1f] dark:text-white font-semibold">Wasee</strong> &mdash; better known online as{" "}
              <strong className="text-[#0071e3] dark:text-[#2997ff] font-mono font-bold">Wyzuk</strong>.
            </p>
            <p>
              I built <strong className="text-[#1d1d1f] dark:text-white font-semibold">WTOOLS</strong> because I frequently found myself needing to inspect DNS
              records, verify phone number metadata, check SSL certificates, calculate subnet masks, and decode JWTs
              without wrestling with bloated ad-ridden websites, intrusive tracking scripts, or paywalls.
            </p>
            <p>
              WTOOLS is designed with the refinement, cleanliness, and instant responsiveness of a high-performance desktop application &mdash; providing high-contrast, easy-to-read diagnostic outputs for engineers and curious technologists alike.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="https://github.com/wyzuk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs sm:text-sm font-semibold active:scale-95 transition-all shadow-[0_2px_8px_rgba(0,113,227,0.3)]"
            >
              <Github className="w-4 h-4" />
              <span>github.com/wyzuk</span>
              <ExternalLink className="w-3.5 h-3.5 text-white/70" />
            </a>
            <a
              href="https://www.wasee.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-black/[0.1] dark:border-white/[0.15] bg-white dark:bg-neutral-800 text-[#1d1d1f] dark:text-white text-xs sm:text-sm font-semibold hover:border-[#0071e3] active:scale-95 transition-all shadow-sm"
            >
              <Globe className="w-4 h-4 text-[#0071e3] dark:text-[#2997ff]" />
              <span>wasee.dev</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-500" />
            </a>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="border-b border-black/[0.06] dark:border-white/[0.08] pb-3">
          <h2 className="text-base sm:text-lg font-bold text-[#1d1d1f] dark:text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0071e3]" />
            <span>Interests &amp; Disciplines</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#515154] dark:text-[#a1a1a6] mt-0.5">
            Technical areas and computing disciplines I explore
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {interests.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 bg-white dark:bg-[#1c1c1e] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl flex items-start gap-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-macos-hover hover:border-[#0071e3]/40 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-[12px] bg-gradient-to-b from-white to-[#f5f5f7] dark:from-neutral-800 dark:to-neutral-900 border border-black/[0.08] dark:border-white/[0.1] flex items-center justify-center text-[#0071e3] shrink-0 shadow-sm">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1d1d1f] dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#515154] dark:text-[#a1a1a6] mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="p-7 bg-white dark:bg-[#1c1c1e] border border-black/[0.08] dark:border-white/[0.1] rounded-3xl space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_-4px_rgba(0,0,0,0.06)] transition-all">
        <h2 className="text-base font-bold text-[#1d1d1f] dark:text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#0071e3]" />
          <span>The Philosophy Behind WTOOLS</span>
        </h2>
        <div className="text-xs sm:text-sm text-[#515154] dark:text-[#a1a1a6] space-y-3 leading-relaxed">
          <p>
            &bull; <strong className="text-[#1d1d1f] dark:text-white font-semibold">Honest Data:</strong> When an API or resolver returns an error, we report the actual service response. No fake mock results, no simulated 200s.
          </p>
          <p>
            &bull; <strong className="text-[#1d1d1f] dark:text-white font-semibold">Zero Bloat:</strong> No unnecessary marketing scroll animations, no decorative 3D models slowing down your computer, and no paywalls.
          </p>
          <p>
            &bull; <strong className="text-[#1d1d1f] dark:text-white font-semibold">Client-First Privacy:</strong> Whenever cryptographic operations, UUID generation, or regex parsing can run in your browser, they do so locally.
          </p>
          <p>
            &bull; <strong className="text-[#1d1d1f] dark:text-white font-semibold">Public APIs Integration:</strong> Built on open protocols and trusted community datasets referenced in the Public APIs directory.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0071e3] hover:underline transition-colors"
          >
            <span>&larr; Explore the tools directory</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
