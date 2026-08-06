import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { ProcessSteps } from "@/components/ProcessSteps";
import { ServiceExplorer } from "@/components/services/ServiceExplorer";
import { EngagementFacts } from "@/components/EngagementFacts";
import { SERVICES } from "@/content/services";

/*
  DIRECTION CONTRACT — /services  (impeccable, surface scope, seed d61330c2)

  THESIS: A services page that diagnoses before it sells. It refuses the
  category default this page shipped as — six alternating image/text blocks
  read top to bottom — because that arrangement only serves a visitor who
  already knows the name of what they need.

  OWN-WORLD: The established Jarvis system, unchanged: charcoal ground,
  #00ADEF as the only accent, Clash Display headings on Inter, hairline
  rules as the primary divider. Recognizable with all content removed by its
  rules and its single blue element per composition.

  STORY: The visitor names their own situation in their own words, watches
  six service lines reorganize around it, reads the two or three that apply,
  and leaves through a contact link that already knows which one they picked.

  FIRST VIEWPORT: A short title, then the diagnostic itself at full width —
  four situations as real choices, not decoration. The offer starts before
  the fold; the page does not open on a slogan.

  FORM: Diagnostic entry into a filtered service surface. Candidate 4 of the
  ordered grounded list; assigned by seed d61330c2.

  FINISH: unreviewed and undocumented is unfinished; this build ends with
  the finish review, the verdict, and DESIGN.md.
*/

// Derived from SERVICES rather than hand-written: the hand-written versions
// silently went stale the moment a sixth service line was added.
const SERVICE_NAMES = SERVICES.map((s) => s.name);

export const metadata: Metadata = {
  title: "Services — Jarvis Studios",
  description: `${SERVICE_NAMES.join(", ")} services from Jarvis Studios.`,
};

export default function ServicesPage() {
  return (
    <main>
      {/* The diagnostic is the opening, not a hero. A visitor who scrolls
          nothing has still been asked the question that sorts them. */}
      <section className="pb-16 pt-20 sm:pt-24">
        <div className="mx-auto mb-14 max-w-4xl px-6">
          <Reveal lcpSafe>
            <h1 className="max-w-3xl text-balance font-display text-4xl font-semibold sm:text-5xl">
              Six ways we build. Usually you need two of them.
            </h1>
            <p className="mt-5 max-w-xl text-balance text-[--text-secondary]">
              Tell us which. We&rsquo;ll tell you what it takes to get it live.
            </p>
          </Reveal>
        </div>
        <ServiceExplorer />
      </section>

      <section className="border-t border-[--border] px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">
              However we get there, it goes like this
            </h2>
          </Reveal>
          <div className="mt-10">
            <ProcessSteps />
          </div>
        </div>
      </section>

      {/* Commercial terms sit after the service lines and immediately before
          the CTA — by this point the reader knows what's on offer, and these
          are the questions they'd otherwise have to email to find out. */}
      <section className="border-t border-[--border] px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <h2 className="max-w-2xl text-balance font-display text-2xl font-semibold sm:text-3xl">
              No discovery fee, no retainer minimum, and a number before the
              work starts
            </h2>
          </Reveal>
          <div className="mt-12">
            <EngagementFacts />
          </div>
        </div>
      </section>

      <section className="border-t border-[--border] px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <h2 className="text-balance font-display text-3xl font-semibold sm:text-4xl">
              Get a scoped project and a real price in 48 hours. Free.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[--text-secondary]">
              Describe the problem in your own words. Working out which
              service it is happens to be our job, not yours.
            </p>
            <Link
              href="/contact"
              className="group mt-8 inline-flex items-center gap-2 rounded-md bg-brand-500 px-6 py-3 text-sm font-medium text-neutral-950 transition-colors duration-200 ease-confident hover:bg-brand-300"
            >
              Start a project
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 ease-confident motion-safe:group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
