"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { SERVICES, type Service } from "@/content/services";
import { SITUATIONS } from "@/content/situations";
import { Hairline } from "@/components/ui/Hairline";
import { EASE } from "@/lib/motion";
import { ServiceListRail, ServiceStrip } from "./ServiceRail";
import { VignetteCard } from "./VignetteCard";

// The services surface as a decision tool rather than a brochure.
//
// Everything is expanded by default: the full offer is visible without
// touching a control, so a visitor who never interacts loses nothing, and
// /services#<id> deep links still land on a fully rendered service.
// Choosing a situation *narrows* rather than reveals — services that don't
// apply collapse to a compact row instead of disappearing, because a
// visitor whose situation was mis-guessed must never be told the studio
// doesn't do the thing it does.
//
// MOTION: two layers, and they must stay separable (docs/MOTION_REDESIGN.md
// §5.6).
//
//   ANSWER — the set re-forming around the chosen situation. A single
//   staggered settle of the whole list, driven by the LIST/ITEM variants
//   below and restarted by re-keying. This is the page's authored moment and
//   it predates everything else here.
//
//   ARRIVAL — each service line settling as it is scrolled to. Written as
//   inline `initial`/`whileInView` objects, deliberately NOT with
//   components/ui/Reveal: Reveal animates by variant *label* and declares no
//   `animate` prop, so nested inside this variant tree it would inherit the
//   parent's "visible" propagation and fire on the answer instead of on
//   scroll. Object-form children cannot be driven by a parent label, which is
//   the property being relied on.
//
// Neither layer is a hover flourish, and neither one moves layout.
//
// This deliberately does NOT use Motion's `layout`/FLIP to glide entries to
// new positions, which is the obvious way to build it. Two failures made
// that unshippable here: full `layout` animates size by scaling and left a
// stuck scaleY(3.3) on collapsed entries with 0.3 counter-scale on their
// text, and `layout="position"` then applied FLIP offsets up to 1400px that
// never animated back to zero, leaving every section visually displaced.
// Both were verified frozen seconds after the interaction. A transform that
// can strand content off-position is not worth a nicer reorder.
//
// What remains animates opacity and 12px of travel from an already-correct
// position, so the worst possible failure is that it doesn't move.

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

const LIST = {
  visible: { transition: { staggerChildren: 0.055 } },
};

const ITEM = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

// The arrival layer. Shared object identity so Motion never re-diffs it, and
// `-12%` so a line settles once it is genuinely being read rather than the
// moment its first pixel clears the fold.
const ARRIVE_FROM = { opacity: 0, y: 14 };
const ARRIVE_TO = { opacity: 1, y: 0 };
const ARRIVE_VIEWPORT = { once: true, margin: "-12%" };

export function ServiceExplorer() {
  const [situationId, setSituationId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<Service["id"] | null>(null);
  // Until the visitor answers, the list has nothing to re-form around, so
  // it renders in its final state rather than animating in from nothing.
  const [answered, setAnswered] = useState(false);

  const situation = SITUATIONS.find((s) => s.id === situationId) ?? null;

  const { ordered, matchCount } = useMemo(() => {
    if (!situation) return { ordered: SERVICES, matchCount: SERVICES.length };
    const matches = SERVICES.filter((s) => situation.services.includes(s.id));
    const rest = SERVICES.filter((s) => !situation.services.includes(s.id));
    return { ordered: [...matches, ...rest], matchCount: matches.length };
  }, [situation]);

  const isExpanded = (service: Service) =>
    !situation || situation.services.includes(service.id) || openId === service.id;

  function choose(id: string) {
    setSituationId((current) => (current === id ? null : id));
    setOpenId(null);
    setAnswered(true);
  }

  return (
    <div>
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="max-w-2xl text-balance font-display text-2xl font-semibold sm:text-3xl">
          Where are you right now?
        </h2>
        <p className="mt-4 max-w-xl text-[--text-secondary]">
          Pick whichever is closest and the work narrows to what applies.
          Nothing disappears — you can read all six either way.
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
            ? `Showing ${matchCount} of ${SERVICES.length} service lines for “${situation.label}”. The rest are collapsed below.`
            : `All ${SERVICES.length} service lines.`}
        </p>

        <ServiceStrip
          services={ordered}
          matchedIds={situation ? situation.services : null}
        />
      </div>

      <ServiceListRail>
        <motion.div
          // Re-keying restarts the stagger, so answering visibly re-forms the
          // set. Before the first answer there is nothing to re-form.
          key={situationId ?? "all"}
          initial={answered ? "hidden" : false}
          animate="visible"
          variants={LIST}
        >
          {ordered.map((service, index) => {
            const expanded = isExpanded(service);

            return (
              <motion.section
                key={service.id}
                id={service.id}
                variants={ITEM}
                transition={{ duration: 0.45, ease: EASE }}
                className="scroll-mt-24"
                aria-labelledby={`${service.id}-name`}
              >
                {/* The divider draws itself as the line is reached. It is a
                    Hairline rather than a border because the rule arriving is
                    what tells the reader a new service line has started. */}
                {index > 0 ? <Hairline /> : null}

                <motion.div
                  initial={ARRIVE_FROM}
                  whileInView={ARRIVE_TO}
                  viewport={ARRIVE_VIEWPORT}
                  transition={{ duration: 0.55, ease: EASE }}
                  className="py-10"
                >
                  <div className="flex items-baseline justify-between gap-6">
                    <h3
                      id={`${service.id}-name`}
                      className={`font-display font-semibold ${
                        expanded ? "text-2xl sm:text-3xl" : "text-xl"
                      }`}
                    >
                      {service.name}
                    </h3>
                    {!expanded ? (
                      <button
                        type="button"
                        onClick={() => setOpenId(service.id)}
                        className="shrink-0 text-sm text-[--text-secondary] underline decoration-[--border] underline-offset-4 transition-colors duration-200 ease-confident hover:text-[--accent] hover:decoration-[--accent]"
                      >
                        Read anyway
                      </button>
                    ) : null}
                  </div>

                  <p className="mt-3 max-w-xl text-[--text-secondary]">
                    {service.summary}
                  </p>

                  {expanded ? (
                    // The detail settles a beat after its own heading, so a
                    // service line reads as one thing arriving in order
                    // rather than two blocks landing together.
                    <motion.div
                      initial={ARRIVE_FROM}
                      whileInView={ARRIVE_TO}
                      viewport={ARRIVE_VIEWPORT}
                      transition={{ duration: 0.55, ease: EASE, delay: 0.08 }}
                      className="grid gap-10 pt-8 md:grid-cols-[1fr_1.1fr] md:items-start"
                    >
                      <div>
                        {/* Capabilities as hairline-separated statements. No
                            checkmarks: a tick beside a claim the studio wrote
                            itself asserts a verification nobody performed. */}
                        <ul className="border-t border-[--border]">
                          {service.capabilities.map((capability) => (
                            <li
                              key={capability}
                              className="border-b border-[--border] py-3 text-sm"
                            >
                              {capability}
                            </li>
                          ))}
                        </ul>

                        {/* Proof sits between what we do and the ask, and only
                            on the service lines that have it. No kicker above
                            it and no panel around it: the capability list ends
                            in a hairline that already separates them, and a
                            result this specific doesn't need a label telling
                            the reader it's a result. */}
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
                          className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-[--accent] transition-colors duration-200 ease-confident hover:text-[--accent-hover]"
                        >
                          {ctaLabel(service.name)}
                          <ArrowRight
                            className="h-4 w-4 transition-transform duration-200 ease-confident motion-safe:group-hover:translate-x-1"
                            aria-hidden="true"
                          />
                        </Link>
                      </div>

                      <VignetteCard service={service.id} />
                    </motion.div>
                  ) : null}
                </motion.div>
              </motion.section>
            );
          })}
        </motion.div>
      </ServiceListRail>
    </div>
  );
}
