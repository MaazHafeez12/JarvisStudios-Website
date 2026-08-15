import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { RevealWords } from "@/components/ui/RevealWords";
import { Hairline } from "@/components/ui/Hairline";
import { ProcessTour } from "@/components/services/ProcessTour";
import { ProcessVignette } from "@/components/services/ProcessVignette";
import { ServiceExplorer } from "@/components/services/ServiceExplorer";
import { EngagementFacts } from "@/components/EngagementFacts";
import { ThreadFilm } from "@/components/motion/ThreadFilm";
import { SERVICES } from "@/content/services";
import { PROCESS_STEPS } from "@/content/process";
import { THREAD_BEATS } from "@/content/thread";

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
          {/* Word by word rather than as a block: the headline is a count
              ("six", "two") and reading it in cadence is the point. lcpSafe
              because this is the page's LCP candidate — it moves, it never
              fades. */}
          <h1 className="max-w-3xl text-balance font-display text-4xl font-semibold sm:text-5xl">
            <RevealWords text="Six ways we build. Usually you need two of them." lcpSafe />
          </h1>
          {/* Outcome only, no "pick one" instruction — ServiceExplorer's
              own prompt sits ~200px below and owns that language. Two
              choose-one instructions in a row read as the page asking the
              same question twice. */}
          <Reveal delay={0.45}>
            <p className="mt-5 max-w-xl text-balance text-[--text-secondary]">
              We&rsquo;ll tell you what it takes to get it live.
            </p>
          </Reveal>
        </div>
        <ServiceExplorer />
      </section>

      {/* Each seam is a Hairline rather than a border-t: the rule drawing
          across is how a section announces itself, and these three were
          already the only thing separating them. */}
      {/* The process as a scroll-scrubbed pinned timeline rather than a tab
          strip (docs/MOTION_REDESIGN.md §5.7). Wider than the rest of the
          page at max-w-6xl, because the pinned layout is two columns. The
          scenes are rendered here, on the server, and passed to the client
          component as slots so content/process.ts and ProcessVignette.tsx
          stay out of the client bundle — /services already ships six
          ServiceVignette scenes through ServiceExplorer. */}
      <section className="relative px-6 py-20">
        <Hairline className="absolute inset-x-0 top-0" />
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">
              However we get there, it goes like this
            </h2>
          </Reveal>
          <ProcessTour
            steps={PROCESS_STEPS}
            visuals={PROCESS_STEPS.map((step) => (
              <ProcessVignette key={step.id} step={step.id} />
            ))}
          />
        </div>
      </section>

      {/* The scroll-scrubbed film (docs/MOTION_REDESIGN.md §5.8). Sits between
          the process and the commercial terms deliberately: it is the one
          section on the page that argues for how the work feels rather than
          what it costs, and it needs the reader to have seen the mechanics
          first. Full-bleed — no px-6, no max-w — because the frame's whole
          move is growing past the content column into the viewport. */}
      <section className="relative">
        <Hairline className="absolute inset-x-0 top-0 z-10" />
        <ThreadFilm beats={THREAD_BEATS} />
      </section>

      {/* Commercial terms sit after the service lines and immediately before
          the CTA — by this point the reader knows what's on offer, and these
          are the questions they'd otherwise have to email to find out. */}
      <section className="relative px-6 py-20">
        <Hairline className="absolute inset-x-0 top-0" />
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

      <section className="relative px-6 py-24">
        <Hairline className="absolute inset-x-0 top-0" />
        <div className="mx-auto max-w-2xl text-center">
          {/* Four reveals rather than one: the close is an argument in four
              beats — offer, instruction, risk reversal, ask — and arriving as
              a single slab reads as a footer. */}
          <Reveal>
            <h2 className="text-balance font-display text-3xl font-semibold sm:text-4xl">
              Get a scoped project and a real price in 48 hours. Free.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mx-auto mt-4 max-w-md text-[--text-secondary]">
              Describe the problem in your own words. Working out which
              service it is happens to be our job, not yours.
            </p>
          </Reveal>
          {/* Risk reversal clears the objection immediately before the
              ask, not after it. Below the button it only reached readers
              who had already decided — the ones it exists to convince had
              passed it. */}
          <Reveal delay={0.16}>
            <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-[--text-secondary]">
              If discovery shows we&rsquo;re not the right fit, we&rsquo;ll
              tell you and point you elsewhere. You lose nothing but a phone
              call.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <Link
              href="/contact"
              className="group mt-8 inline-flex items-center gap-2 rounded-md bg-brand-500 px-6 py-3 text-sm font-medium text-neutral-950 transition-[background-color,transform] duration-200 ease-confident hover:bg-brand-300 motion-safe:hover:scale-[1.02]"
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
