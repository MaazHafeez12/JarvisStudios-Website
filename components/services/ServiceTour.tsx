"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useScrollProgress } from "@/lib/use-scroll-progress";
import type { Service } from "@/content/services";

// Homepage service tour (docs/MOTION_REDESIGN.md §5.5) — the six service
// lines as a scroll-linked pinned sequence: copy scrolls through six panels
// while one sticky stage hands off between the six ServiceVignette scenes.
// Below `lg` the same six panels become a horizontal snap rail.
//
// Two rules govern this file, and both are load-bearing:
//
//  1. **Every layout decision lives in CSS, none in JS.** The breakpoint and
//     reduced-motion branches are `@media` rules in globals.css, never a
//     render branch here. That is what makes the section shift-free: there is
//     no null-first measurement window like HeroVisual's tier detection, so
//     the server HTML and the hydrated tree are byte-identical. Moving any of
//     it into JS reintroduces CLS.
//  2. **Scroll position never becomes React state.** See the two channels
//     below. The continuous one is a motion value written straight to a
//     composited transform; the discrete one is an IntersectionObserver that
//     fires at most five times per pass. Nothing reads scroll offset during
//     render.
//
// The section only ever *reads* scroll — no wheel interception, no
// scrollTo(), no vertical snapping. Scroll-jacking across a ~420svh section
// traps slow scrollers and breaks Find-in-Page and PageDown.

export function ServiceTour({
  services,
  visuals,
}: {
  services: Service[];
  /**
   * One <ServiceVignette> per service, rendered on the server and passed
   * through as slots — the same trick HeroVisual uses with `children`. This
   * keeps content/services.ts and ServiceVignette.tsx (~5KB gzip of SVG JSX)
   * out of the client bundle; importing them here instead, the way
   * ServiceExplorer does, would put that on every homepage load, and
   * docs/MOTION_REDESIGN.md §4.2 treats TBT regression as a blocker.
   *
   * Each element is rendered twice — once in its panel (mobile and
   * reduced-motion), once in the stage (desktop) — with CSS hiding whichever
   * copy the current layout doesn't use. React elements are immutable
   * descriptors, so one object in two tree positions is fine. The duplicate
   * ~110 SVG nodes are the price of a single DOM with no layout branch; see
   * rule 1. Do not "optimise" this back into a conditional render.
   */
  visuals: React.ReactNode[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Continuous channel — `--p`, 0 to 1 across the track, written onto the
  // stage (docs/MOTION_REDESIGN.md §5.8). It drives the progress rail and the
  // active scene's drift, both as composited transforms in CSS with nothing
  // rendering on scroll.
  //
  // This used to be Motion's useScroll feeding a motion value into the rail's
  // `scaleY`. It is the shared hook now for two reasons: the site has one
  // scroll-progress mechanism rather than two, and the same number is
  // available to every element under the stage instead of to the one
  // component Motion was told to style. Never animate the rail's `height`
  // instead of `scaleY` — that turns a composited effect into per-frame
  // layout work.
  useScrollProgress(trackRef, stageRef);

  // Discrete channel — which vignette is showing. A 2px band at the pinned
  // stage's vertical centre; panels tile the track contiguously at `lg`, so
  // exactly one crosses it at any moment.
  //
  // Deriving this arithmetically from scrollYProgress is the obvious
  // alternative and it is subtly wrong: the stage centre sits nav/2 + 24px
  // below the viewport centre, and the track's scroll range is
  // (6 x panel) - 100svh rather than 6 x panel, so Math.round(p * 5) drifts
  // by up to ~0.13 index units at the ends. Correcting for that means baking
  // panel height and nav height into this file, where they rot silently the
  // next time either changes. The observer is exact by construction and
  // fires on crossing rather than on every scroll tick.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    // MotionConfig governs Motion components only and does nothing for the
    // CSS that drives this section (docs/MOTION_REDESIGN.md §5 item 1). On
    // the reduced-motion path the stage is display:none and the panels are a
    // plain stack, so there is no active index to track — bail before
    // attaching anything.
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
            // Panels tile the track with no gap, so when the band sits on a
            // boundary *two* of them intersect it and the callback receives
            // both. Taking whichever comes last in `entries` would make the
            // result depend on the observer's iteration order, which is not
            // specified — and getting it backwards means a spurious 420ms
            // wipe to the wrong vignette every time you cross a boundary.
            //
            // Re-test containment against the centre line instead, with a
            // half-open interval: exactly one panel in a contiguous stack
            // can satisfy top <= centre < bottom, whatever order the entries
            // arrive in. `boundingClientRect` comes from the observer, so
            // this reads no layout.
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
    <div ref={trackRef} className="tour-grid mt-10">
      <ul role="list" className="tour-list" aria-label="Service lines">
        {services.map((service, i) => (
          <li
            key={service.id}
            data-index={i}
            className="tour-panel rounded-lg border border-[--border] bg-[--surface-raised] p-6 motion-safe:lg:rounded-none motion-safe:lg:border-0 motion-safe:lg:bg-transparent motion-safe:lg:p-0"
          >
            <h3 className="font-display text-xl font-semibold sm:text-2xl">
              {service.name}
            </h3>
            <p className="mt-3 max-w-md text-[--text-secondary]">
              {service.summary}
            </p>

            {/* Capabilities as hairline-separated statements, matching
                ServiceExplorer's treatment so the homepage and /services
                read as one system. No checkmarks: a tick beside a claim the
                studio wrote itself asserts a verification nobody did. */}
            <ul className="mt-6 max-w-md border-t border-[--border]">
              {service.capabilities.map((capability) => (
                <li
                  key={capability}
                  className="border-b border-[--border] py-3 text-sm"
                >
                  {capability}
                </li>
              ))}
            </ul>

            {/* The panel is no longer a click target the way ServiceCard was,
                so the route to /services#<id> needs to be an explicit link.
                Dropping it would be a silent conversion regression. */}
            <Link
              href={`/services#${service.id}`}
              className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-[--accent] transition-colors duration-200 ease-confident hover:text-[--accent-hover]"
            >
              Explore {service.name}
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 ease-confident motion-safe:group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>

            {/* The panel's own vignette — what mobile and the reduced-motion
                stack show. Hidden once the stage takes over at `lg`. */}
            <div
              aria-hidden="true"
              className="tour-panel-visual mt-6 overflow-hidden rounded-md border border-[--border] p-4 motion-safe:lg:hidden"
            >
              {visuals[i]}
            </div>
          </li>
        ))}
      </ul>

      {/* Decorative throughout — aria-hidden and pointer-events-none keep the
          stage out of the accessibility tree and the tab order entirely, the
          same treatment the hero canvas gets (HeroVisual.tsx:49-52). The
          vignettes stay aria-hidden at source too: they deliberately carry no
          real content (ServiceVignette.tsx:5-11), so describing them would
          mean writing alt text for a fabricated interface. */}
      <div
        ref={stageRef}
        aria-hidden="true"
        className="tour-stage pointer-events-none"
        style={{ "--n": services.length } as React.CSSProperties}
      >
        <div className="tour-stage-card">
          {visuals.map((visual, i) => (
            <div
              key={services[i].id}
              className="tour-layer"
              data-state={i < active ? "past" : i > active ? "future" : "active"}
              // Its slice of the track, for the continuous drift in CSS. The
              // slice is approximate — the track's scroll range is
              // (n x panel) - 100svh, not n x panel, so a layer's local
              // progress runs slightly ahead of its panel at the ends. That
              // drift is the reason the *discrete* channel below is an
              // observer rather than arithmetic; for a few px of travel it is
              // invisible, and paying for exactness here would mean baking
              // panel and nav height into this file.
              style={{ "--i": i } as React.CSSProperties}
            >
              {visual}
            </div>
          ))}
        </div>

        {/* Position indicator, not task progress — deliberately not
            role="progressbar", which would announce on every scroll tick. */}
        <span className="tour-rail">
          <span className="tour-rail-fill" />
        </span>
      </div>
    </div>
  );
}
