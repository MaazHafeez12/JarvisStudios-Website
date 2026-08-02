import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Investors — Jarvis Studios",
  description: "Investor and partner information for Jarvis Studios.",
};

// Deliberately distinct, lower-key visual treatment from client-facing
// pages per docs/PRD.md — this audience's CTA should never compete with
// the primary client CTA for attention.
export default function InvestorsPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-widest text-[--text-secondary]">
          Investors &amp; Partners
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
          Building the studio behind the studio work.
        </h1>
        <p className="mt-4 text-[--text-secondary]">
          Jarvis Studios operates as a software agency today — web, app,
          SaaS, CRM, and design work for clients — with an eye toward
          building products of our own. If you're evaluating the studio for
          investment, partnership, or collaboration, we'd like to talk.
        </p>

        <Link
          href="/contact?type=investor"
          className="mt-8 inline-flex items-center gap-2 rounded-md border border-[--border] px-5 py-2.5 text-sm font-medium transition-colors duration-150 ease-confident hover:border-[--accent] hover:text-[--accent]"
        >
          Request investor info
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Reveal>
    </main>
  );
}
