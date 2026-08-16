"use client";

import { useMemo, useState } from "react";
import { flushSync } from "react-dom";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { SERVICES, type Service } from "@/content/services";
import { SITUATIONS } from "@/content/situations";
import { EASE } from "@/lib/motion";
import { ServiceStrip } from "./ServiceRail";
import { VignetteCard } from "./VignetteCard";

// The services surface as a comparison tool rather than a queue.
//
// WHY THIS IS A GRID (docs/MOTION_REDESIGN.md §5.9). PRODUCT.md:11 names
// three jobs this page has to do at once: fast wayfinding to one service,
// **side-by-side comparison across services**, and helping someone locate a
// problem before it has a name. The diagnostic below does the third and
// /services#<id> does the first. Comparison was the one that went unserved,
// and a vertical list is precisely the shape that cannot serve it — a reader
// can only ever hold one service in view. Six cards in one composition is
// what comparison means. The old arrangement's DIRECTION CONTRACT was
// reopened for that reason, not for a nicer look.
//
// NOTHING IS HIDDEN, AND THAT RULE OUTLIVED THE CONTRACT. Every card carries
// its name, summary, all three capabilities, its proof where one exists, its
// CTA and its vignette — at rest and in every filtered state. A visitor whose
// situation was mis-guessed must never be told the studio doesn't do the
// thing it does. This is stricter than the arrangement it replaces, which
// collapsed non-matching services to a compact row and needed a "Read anyway"
// escape hatch to undo itself; there is nothing to escape from now, so both
// the collapsed state and that control are gone.
//
// Answering *promotes* rather than filters: matching services move to the
// front and span the full width with a larger vignette, and everything else
// stays a complete card below. One DOM order, one list — the promotion is a
// `grid-column: 1 / -1` in CSS keyed off `data-promoted`, never a second
// branch rendered here.
//
// MOTION: two layers, and they must stay separable (§5.6 decision 1).
//
//   ANSWER — the set re-forming around the chosen situation. Now owned by the
//   View Transitions API (see `choose` below), which replaced a re-keyed
//   Motion stagger: with the browser animating the reorder, a stagger over
//   the top of it double-animates the same moment.
//
//   ARRIVAL — each card settling as it is scrolled to. Still inline
//   `initial`/`whileInView` objects rather than components/ui/Reveal. The
//   original reason (object-form children cannot be driven by a parent
//   variant label) no longer applies now that the parent variant tree is
//   gone, but Reveal is still wrong here for the plainer reason that it
//   declares no `animate` prop.

/**
 * Service names go into the CTA verbatim. Lowercasing them turned "SaaS"
 * into "saas" and "CRM" into "crm"; the article is chosen from the leading
 * vowel instead, which is correct for all six ("an App Development", "an AI
 * Automation", "a SaaS").
 */
function ctaLabel(name: string): string {
  const article = /^[AEIOU]/.test(name) ? "an" : "a";
  return `Start ${article} ${name} project`;
}

// The arrival layer. Shared object identity so Motion never re-diffs it, and
// `-12%` so a card settles once it is genuinely being read rather than the
// moment its first pixel clears the fold.
const ARRIVE_FROM = { opacity: 0, y: 14 };
const ARRIVE_TO = { opacity: 1, y: 0 };
const ARRIVE_VIEWPORT = { once: true, margin: "-12%" };

/** Not in lib.dom yet; the call below is feature-detected either way. */
type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => { finished: Promise<void> };
};

export function ServiceExplorer() {
  const [situationId, setSituationId] = useState<string | null>(null);

  const situation = SITUATIONS.find((s) => s.id === situationId) ?? null;

  const { ordered, matchCount } = useMemo(() => {
    if (!situation) return { ordered: SERVICES, matchCount: SERVICES.length };
    const matches = SERVICES.filter((s) => situation.services.includes(s.id));
    const rest = SERVICES.filter((s) => !situation.services.includes(s.id));
    return { ordered: [...matches, ...rest], matchCount: matches.length };
  }, [situation]);

  const isPromoted = (service: Service) =>
    Boolean(situation && situation.services.includes(service.id));

  function choose(id: string) {
    const apply = () => setSituationId((current) => (current === id ? null : id));

    // THIS IS NOT A THIRD FLIP ATTEMPT, and the distinction is the whole
    // reason it is shippable. The two failures recorded in this file's
    // history were Motion's layout system computing transforms in JS and
    // leaving them stranded — a scaleY(3.3) that never unwound, offsets up to
    // 1400px that never animated back. Here the browser captures both states
    // and composites between them itself; there is no JS-held transform that
    // *can* strand. Where the API is missing the state change simply applies,
    // which is exactly the instant reorder this page shipped with.
    //
    // flushSync is required, not defensive: startViewTransition captures the
    // "after" state when its callback returns, and React's default batching
    // would not have committed by then, so the transition would capture the
    // old DOM twice and animate nothing.
    const doc = document as ViewTransitionDocument;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!doc.startViewTransition || reduce) {
      apply();
      return;
    }

    doc.startViewTransition(() => flushSync(apply));
  }

  return (
    <div>
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="max-w-2xl text-balance font-display text-2xl font-semibold sm:text-3xl">
          Where are you right now?
        </h2>
        <p className="mt-4 max-w-xl text-[--text-secondary]">
          Pick whichever is closest and the work that applies moves to the
          front. Nothing is hidden — all six stay readable either way.
        </p>

        <div
          className="mt-8 grid gap-3 sm:grid-cols-2"
          role="group"
          aria-label="Filter services by situation"
        >
          {SITUATIONS.map((option) => {
            const active = option.id === situationId;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={active}
                onClick={() => choose(option.id)}
                className={`relative isolate overflow-hidden rounded-lg border p-4 text-left transition-colors duration-200 ease-confident ${
                  active
                    ? "border-[--accent]"
                    : "border-[--border] hover:border-[--text-secondary]"
                }`}
              >
                {/* The selected fill arrives as an angular sweep rather than
                    appearing — the same leftward wipe the homepage tour uses
                    to hand one visual to the next, so the two pages share a
                    single gesture. Styles in globals.css. */}
                <span className="svc-wipe" aria-hidden="true" />
                <span
                  className={`block text-sm font-medium ${
                    active ? "text-[--accent]" : "text-[--text-primary]"
                  }`}
                >
                  {option.label}
                </span>
                <span className="mt-1 block text-sm text-[--text-secondary]">
                  {option.detail}
                </span>
              </button>
            );
          })}
        </div>

        {/* Announced, not just shown: the reflow is silent to a screen reader. */}
        <p aria-live="polite" className="mt-6 text-sm text-[--text-secondary]">
          {situation
            ? `${matchCount} of ${SERVICES.length} service lines match “${situation.label}” and are shown first. All six stay readable.`
            : `All ${SERVICES.length} service lines.`}
        </p>

        <ServiceStrip
          services={ordered}
          matchedIds={situation ? situation.services : null}
        />
      </div>

      <ul role="list" className="svc-grid mx-auto mt-12 max-w-6xl px-6">
        {ordered.map((service) => {
          const promoted = isPromoted(service);

          return (
            <li
              key={service.id}
              id={service.id}
              className="svc-item scroll-mt-24"
              data-promoted={promoted ? "true" : "false"}
              // Each card is its own transition subject, so the browser
              // animates six independent moves rather than cross-fading one
              // container. Names must be unique per document.
              style={
                { viewTransitionName: `svc-${service.id}` } as React.CSSProperties
              }
              aria-labelledby={`${service.id}-name`}
            >
              <motion.div
                initial={ARRIVE_FROM}
                whileInView={ARRIVE_TO}
                viewport={ARRIVE_VIEWPORT}
                transition={{ duration: 0.55, ease: EASE }}
                className="svc-item-body"
              >
                <h3
                  id={`${service.id}-name`}
                  className="svc-item-name font-display font-semibold"
                >
                  {service.name}
                </h3>

                <p className="mt-3 text-[--text-secondary]">{service.summary}</p>

                {/* Capabilities as hairline-separated statements. No
                    checkmarks: a tick beside a claim the studio wrote itself
                    asserts a verification nobody performed. Present on every
                    card in every state — this list is the only thing the six
                    services can actually be compared on. */}
                <ul className="mt-6 border-t border-[--border]">
                  {service.capabilities.map((capability) => (
                    <li
                      key={capability}
                      className="border-b border-[--border] py-3 text-sm"
                    >
                      {capability}
                    </li>
                  ))}
                </ul>

                {/* Proof sits between what we do and the ask, and only on the
                    service lines that have it. No kicker above it and no panel
                    around it: the capability list ends in a hairline that
                    already separates them, and a result this specific doesn't
                    need a label telling the reader it's a result. */}
                {service.proof ? (
                  <div className="mt-6 max-w-sm">
                    <p className="text-sm font-medium leading-relaxed">
                      {service.proof.result}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-[--text-secondary]">
                      {service.proof.detail}
                    </p>
                  </div>
                ) : null}

                <Link
                  href={`/contact?service=${service.id}`}
                  // No `mt-6`: the spacing is `.svc-item-cta`'s padding-top so
                  // it cannot fight that rule's `margin-top: auto`.
                  className="svc-item-cta group inline-flex items-center gap-2 self-start text-sm font-medium text-[--accent] transition-colors duration-200 ease-confident hover:text-[--accent-hover]"
                >
                  {ctaLabel(service.name)}
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-200 ease-confident motion-safe:group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </motion.div>

              <div className="svc-item-visual">
                <VignetteCard service={service.id} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
