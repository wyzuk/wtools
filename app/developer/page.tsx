import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Terminal, Github, Globe, Code, Cpu, Server, Shield, Sparkles } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Developer — Wasee / Wyzuk | WTOOLS",
  description:
    "Learn about Wasee (Wyzuk), the developer and Linux enthusiast behind WTOOLS, a technical utility suite.",
};

export default function DeveloperPage() {
  const interests = [
    { title: "Web Development", desc: "Building performant, accessible web systems and developer tools with modern web standards.", icon: Code },
    { title: "Linux & Systems", desc: "Passionate about UNIX philosophies, shell automation, kernel experimentation, and minimalism.", icon: Terminal },
    { title: "Browser Games", desc: "Engineering lightweight interactive browser games and graphics prototypes.", icon: Sparkles },
    { title: "Discord Bots", desc: "Writing reliable, responsive automation bots and service integrations.", icon: Server },
    { title: "OS Development", desc: "Low-level system programming, exploring how computing hardware and kernels work from the ground up.", icon: Cpu },
    { title: "AI Experiments", desc: "Practical hands-on exploration of intelligence models without the corporate buzzwords.", icon: Shield },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 max-w-4xl mx-auto space-y-10">
      {/* Header Intro */}
      <section className="p-7 sm:p-8 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl space-y-6 shadow-sm dark:shadow-none transition-colors">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative w-20 h-20 rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden flex items-center justify-center shrink-0 shadow-sm p-2">
            <Image
              src="/assets/logo.png"
              alt="WTOOLS"
              width={64}
              height={64}
              className="object-contain"
            />
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/60 text-xs font-medium text-blue-600 dark:text-blue-400 font-mono">
              Developer &bull; Linux Enthusiast
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight font-sans">
              Wasee <span className="text-slate-400 dark:text-neutral-500 font-normal text-xl">/ Wyzuk</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-neutral-400 font-sans">
              Full-stack developer &bull; Linux enthusiast &bull; Independent maker
            </p>
          </div>
        </div>

        {/* Personal statement */}
        <div className="text-sm sm:text-base text-slate-700 dark:text-neutral-300 space-y-3.5 leading-relaxed border-t border-slate-100 dark:border-neutral-800 pt-6 font-sans">
          <p>
            Hi, I&apos;m <strong className="text-slate-900 dark:text-white font-semibold">Wasee</strong> &mdash; better known online as{" "}
            <strong className="text-blue-600 dark:text-blue-400 font-mono">Wyzuk</strong>.
          </p>
          <p>
            I built <strong className="text-slate-900 dark:text-white font-semibold">WTOOLS</strong> because I frequently found myself needing to inspect DNS
            records, verify phone number metadata, check SSL certificates, calculate subnet masks, and decode JWTs
            without wrestling with bloated ad-ridden websites, intrusive tracking scripts, or paywalls.
          </p>
          <p>
            WTOOLS is a collection of practical tools designed to make technical inspection straightforward,
            fast, and accessible to everyone &mdash; from network engineers and backend developers to curious hobbyists.
          </p>
        </div>

        {/* Action Links */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href="https://github.com/wyzuk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm"
          >
            <Github className="w-4 h-4" />
            <span>github.com/wyzuk</span>
            <ExternalLink className="w-3.5 h-3.5 text-white/70" />
          </a>
          <a
            href="https://www.wasee.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-800 text-slate-800 dark:text-white text-sm font-medium hover:border-blue-500 transition-colors"
          >
            <Globe className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            <span>wasee.dev</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-500" />
          </a>
        </div>
      </section>

      {/* Focus & Interests */}
      <section className="space-y-4">
        <div className="border-b border-slate-200 dark:border-neutral-800 pb-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Interests &amp; Focus Areas</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 mt-0.5">
            Technical areas and computing disciplines I explore
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {interests.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl flex items-start gap-3.5 hover:border-blue-500/50 shadow-sm dark:shadow-none transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 flex items-center justify-center text-blue-500 shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-sans">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-400 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Philosophy of WTOOLS */}
      <section className="p-7 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl space-y-4 shadow-sm dark:shadow-none transition-colors">
        <h2 className="text-base font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span>The Philosophy Behind WTOOLS</span>
        </h2>
        <div className="text-xs sm:text-sm text-slate-600 dark:text-neutral-400 space-y-3 leading-relaxed font-sans">
          <p>
            &bull; <strong className="text-slate-900 dark:text-white font-semibold">Honest Data:</strong> When an API or resolver returns an error, we report the actual service response. No fake mock results, no simulated 200s.
          </p>
          <p>
            &bull; <strong className="text-slate-900 dark:text-white font-semibold">Zero Bloat:</strong> No unnecessary marketing scroll animations, no decorative 3D models slowing down your computer, and no paywalls.
          </p>
          <p>
            &bull; <strong className="text-slate-900 dark:text-white font-semibold">Client-First Privacy:</strong> Whenever cryptographic operations, UUID generation, or regex parsing can run in your browser, they do so locally.
          </p>
          <p>
            &bull; <strong className="text-slate-900 dark:text-white font-semibold">Public APIs Integration:</strong> Built on open protocols and trusted community datasets referenced in the Public APIs directory.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline transition-colors"
          >
            <span>&larr; Explore the tools directory</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
