"use client";

import { useEffect, useRef, useState } from "react";
import { useScrollProgress } from "@/lib/use-scroll-progress";
import type { ProcessStep } from "@/content/process";

// The /services process sequence as a scroll-scrubbed pinned timeline
// (docs/MOTION_REDESIGN.md §5.7). Four steps of copy scroll past one sticky
// stage that hands off between four ProcessVignette scenes, with a horizontal
// four-node timeline beneath the stage marking position.
//
// This is components/services/ServiceTour.tsx applied to different content,
// and it deliberately reproduces that file's architecture rather than
// improvising a second one. Both of its governing rules carry over:
//
//  1. **Every layout decision lives in CSS, none in JS.** The breakpoint and
//     reduced-motion branches are `@media` rules in globals.css, never a
//     render branch here — the server HTML and the hydrated tree are
//     identical, so there is no measurement window to shift in.
//  2. **Scroll position never becomes React state.** The continuous channel
//     is a motion value written straight to a composited transform; the
//     discrete one is an IntersectionObserver that fires at most a handful of
//     times per pass. Nothing reads scroll offset during render.
//
// It replaces the ARIA tab implementation this section used to be. That was a
// complete, correct APG tabs pattern and it is not being dropped because it
// was hard to maintain — it is being dropped because the content no longer
// has a selector. The layout underneath this one shows all four steps and all
// four visuals at once, which is what the tabs' three hidden panels were
// costing.

export function ProcessTour({
  steps,
  visuals,
}: {
  steps: ProcessStep[];
  /**
   * One <ProcessVignette> per step, rendered on the server and passed through
   * as slots — the same trick ServiceTour and HeroVisual use. It keeps
   * content/process.ts and ProcessVignette.tsx out of the client bundle, and
   * that matters more on this page than on the homepage: /services already
   * ships ServiceVignette's six scenes client-side through ServiceExplorer,
   * and docs/MOTION_REDESIGN.md §4.2 treats a TBT regression as a blocker.
   *
   * Each element is rendered twice — once in its panel (mobile and
   * reduced-motion), once in the stage (desktop) — with CSS hiding whichever
   * copy the current layout does not use. React elements are immutable
   * descriptors, so one object in two tree positions is fine. Do not
   * "optimise" this into a conditional render; that is the layout branch
   * rule 1 forbids.
   */
  visuals: React.ReactNode[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Continuous channel — `--p`, 0 to 1 across the track, written onto the
  // stage by the shared hook (docs/MOTION_REDESIGN.md §5.8). Drives the
  // timeline fill and the active scene's drift, both composited transforms in
  // CSS. Never animate the fill's `width` instead of `scaleX` — that turns a
  // composited effect into per-frame layout work.
  useScrollProgress(trackRef, stageRef);

  // Discrete channel — which scene is showing. A 2px band at the pinned
  // stage's vertical centre; panels tile the track contiguously at `lg`, so
  // exactly one crosses it at any moment.
  //
  // Deriving this from scrollYProgress arithmetically is the obvious
  // alternative and it is subtly wrong for the reason ServiceTour records:
  // the stage centre sits below the viewport centre and the track's scroll
  // range is (n x panel) - 100svh rather than n x panel, so Math.round drifts
  // at the ends. Correcting for it means baking panel and nav height into
  // this file, where they rot silently the next time either changes.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    // MotionConfig governs Motion components only and does nothing for the
    // CSS driving this section. On the reduced-motion path the stage is
    // display:none and the panels are a plain stack, so there is no active
    // index to track — bail before attaching anything.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let observer: IntersectionObserver | null = null;

    const attach = () => {
      observer?.disconnect();
      const navH =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--nav-h",
          ),
        ) || 69;
      // The stage is inset from the nav by 1.5rem top and bottom, so its
      // centre is the midpoint of the space below the nav.
      const centre = navH + (window.innerHeight - navH) / 2;

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            // Panels tile with no gap, so on a boundary *two* of them
            // intersect the band and the callback receives both. Taking
            // whichever comes last would make the result depend on the
            // observer's iteration order, which is unspecified — and getting
            // it backwards means a spurious wipe to the wrong scene every
            // time a boundary is crossed. Re-test containment against the
            // centre line with a half-open interval instead: exactly one
            // panel in a contiguous stack satisfies top <= centre < bottom,
            // whatever order the entries arrive in. `boundingClientRect`
            // comes from the observer, so this reads no layout.
            const rect = entry.boundingClientRect;
            if (rect.top > centre || rect.bottom <= centre) continue;
            const index = Number((entry.target as HTMLElement).dataset.index);
            setActive((prev) => (prev === index ? prev : index));
          }
        },
        {
          rootMargin: `-${centre - 1}px 0px -${
            window.innerHeight - centre - 1
          }px 0px`,
        },
      );

      for (const panel of track.querySelectorAll("[data-index]")) {
        observer.observe(panel);
      }
    };

    attach();
    // The band is defined in viewport pixels, so it has to be rebuilt when
    // the viewport changes.
    window.addEventListener("resize", attach, { passive: true });
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", attach);
    };
  }, []);

  return (
    <div ref={trackRef} className="ptour-grid mt-10">
      {/* An ordered list, because the order is the content. DESIGN.md §5
          bans decorative 01/02/03 markers and names this sequence as the one
          exception, on exactly that grounds. */}
      {/* The explicit role is not redundant: Tailwind's preflight removes
          list-style, and Safari/VoiceOver drop list semantics when it is
          `none`. Same reason ServiceTour carries one. */}
      <ol role="list" className="ptour-list">
        {steps.map((step, i) => (
          <li
            key={step.id}
            data-index={i}
            className="ptour-panel rounded-lg border border-[--border] bg-[--surface-raised] p-6 motion-safe:lg:rounded-none motion-safe:lg:border-0 motion-safe:lg:bg-transparent motion-safe:lg:p-0"
          >
            <span
              // Accent everywhere in the stacked layout, where all four are
              // read at once. In the pinned layout only the step being
              // scrubbed is lit, so the numerals track the stage.
              className={`font-mono text-xs text-[--accent] transition-colors duration-300 ease-confident ${
                i === active
                  ? "motion-safe:lg:text-[--accent]"
                  : "motion-safe:lg:text-[--text-secondary]"
              }`}
            >
              0{step.step}
            </span>
            <h3 className="mt-2 font-display text-xl font-semibold sm:text-2xl">
              {step.title}
            </h3>
            <p className="mt-3 max-w-md text-[--text-secondary]">
              {step.description}
            </p>

            {/* The panel's own visual — what mobile and the reduced-motion
                stack show. Hidden once the stage takes over at `lg`. */}
            <div
              aria-hidden="true"
              className="ptour-panel-visual mt-6 overflow-hidden rounded-md border border-[--border] p-4 motion-safe:lg:hidden"
            >
              {visuals[i]}
            </div>
          </li>
        ))}
      </ol>

      {/* Decorative throughout — aria-hidden and pointer-events-none keep the
          stage out of the accessibility tree and the tab order entirely, the
          same treatment the hero canvas and the homepage stage get. The
          scenes stay aria-hidden at source too: they carry no real content by
          construction, so describing them would mean writing alt text for an
          interface that does not exist. */}
      <div
        ref={stageRef}
        aria-hidden="true"
        className="ptour-stage pointer-events-none"
        style={{ "--n": steps.length } as React.CSSProperties}
      >
        <div className="tour-stage-card">
          {visuals.map((visual, i) => (
            <div
              key={steps[i].id}
              className="tour-layer ptour-layer"
              data-state={i < active ? "past" : i > active ? "future" : "active"}
              // Its slice of the track, for the continuous drift in CSS. See
              // the matching note in ServiceTour on why the slice is
              // approximate and why that is fine for a few px of travel but
              // not for the discrete channel below.
              style={{ "--i": i } as React.CSSProperties}
            >
              {visual}
            </div>
          ))}
        </div>

        {/* Horizontal because that is what makes it read as a timeline rather
            than a second copy of the homepage tour's gutter rail. Position
            indicator, not task progress — deliberately not role="progressbar",
            which would announce on every scroll tick. */}
        <div className="ptour-rail">
          <span className="ptour-rail-track">
            <span className="ptour-rail-fill" />
          </span>
          {steps.map((step, i) => (
            <span
              key={step.id}
              className="ptour-node"
              data-state={i <= active ? "reached" : "ahead"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
