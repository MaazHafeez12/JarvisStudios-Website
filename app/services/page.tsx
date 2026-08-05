import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { ProcessSteps } from "@/components/ProcessSteps";
import { ServiceBlock } from "@/components/ServiceBlock";
import { EngagementFacts } from "@/components/EngagementFacts";
import { SERVICES } from "@/content/services";

// Both the meta description and the subhead below are derived from SERVICES
// rather than hand-written. They were hand-written, and adding a sixth
// service line (AI Automation) silently made both wrong — the page claimed
// "Five service lines" while rendering six, and the description omitted the
// new one. Deriving them means the next service line can't reintroduce that.
const SERVICE_NAMES = SERVICES.map((s) => s.name);

const COUNT_WORDS = [
  "Zero", "One", "Two", "Three", "Four", "Five",
  "Six", "Seven", "Eight", "Nine", "Ten",
];
const SERVICE_COUNT_WORD =
  COUNT_WORDS[SERVICES.length] ?? String(SERVICES.length);

export const metadata: Metadata = {
  title: "Services — Jarvis Studios",
  description: `${SERVICE_NAMES.join(", ")} services from Jarvis Studios.`,
};

export default function ServicesPage() {
  return (
    <main>
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <Reveal lcpSafe>
          <h1 className="font-display text-4xl font-semibold sm:text-5xl">
            What we do, and how we work.
          </h1>
          <p className="mt-4 text-[--text-secondary]">
            {SERVICE_COUNT_WORD} service lines, one consistent process from
            first conversation to launch.
          </p>
        </Reveal>
      </section>

      <section className="border-t border-[--border] px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            {/* An h2, not a styled <p>. The section had no heading at all,
                so the page outline jumped from the h1 straight to the
                service-name h2s with nothing marking the process section.
                Visual treatment is unchanged. */}
            <h2 className="font-mono text-xs font-normal uppercase tracking-widest text-[--text-secondary]">
              Our process
            </h2>
          </Reveal>
          <div className="mt-6">
            <ProcessSteps />
          </div>
        </div>
      </section>

      <section className="border-t border-[--border] px-6">
        <div className="mx-auto max-w-4xl divide-y divide-[--border]">
          {SERVICES.map((service, i) => (
            <ServiceBlock key={service.id} service={service} index={i} />
          ))}
        </div>
      </section>

      {/* Commercial terms sit after the service lines and immediately
          before the CTA — by this point the reader knows what's on offer,
          and these are the questions they'd otherwise have to email to
          find out. */}
      <section className="border-t border-[--border] px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold">
              What working with us looks like
            </h2>
            <p className="mt-3 max-w-xl text-[--text-secondary]">
              No retainer minimums, no discovery fee, and a number before the
              work starts rather than after.
            </p>
          </Reveal>
          <div className="mt-10">
            <EngagementFacts />
          </div>
        </div>
      </section>

      <section className="border-t border-[--border] px-6 py-20 text-center">
        <Reveal>
          <h2 className="font-display text-3xl font-semibold">
            Not sure which service you need?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[--text-secondary]">
            Tell us what you're working on and we'll help you figure it out.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-brand-500 px-6 py-3 text-sm font-medium text-neutral-950 transition-colors duration-150 ease-confident hover:bg-brand-300"
          >
            Start a project
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
