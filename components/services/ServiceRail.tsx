"use client";

import { useRef } from "react";
import { motion, useScroll } from "motion/react";
import type { Service } from "@/content/services";

// Two readouts of the same thing — where you are in the six service lines.
//
// Desktop gets a scroll-linked rail in the gutter. Phones get a swipeable
// strip of chips above the list, because a 1px line in a 24px gutter is not
// a touch target and a phone has no gutter to put it in.
//
// Both are always rendered; a Tailwind breakpoint decides which is visible.
// That is deliberate and matches docs/MOTION_REDESIGN.md §5.5 decision 3 —
// switching layouts with a JS media query means the first paint is wrong and
// the correction is a layout shift. Twelve nodes of hidden markup is the
// cheaper mistake.
//
// SCROLL IS READ, NEVER WRITTEN, AND NEVER BECOMES STATE. Both progress
// values go straight from useScroll into `style`, so scrolling never
// re-renders React. Routing them through useMotionValueEvent + setState
// would put a React render on every scroll frame for a 1px line.
//
// The chips are ordinary anchors to the section ids ServiceExplorer already
// renders, so tapping one is a native jump with no JS involved.

export function ServiceStrip({
  services,
  matchedIds,
}: {
  services: Service[];
  /** Service ids matching the chosen situation, or null when none is chosen. */
  matchedIds: string[] | null;
}) {
  const stripRef = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({ container: stripRef, axis: "x" });

  return (
    <nav aria-label="Jump to a service" className="mt-10 lg:hidden">
      <div
        ref={stripRef}
        // Bleeds to the viewport edge and re-pads, so chips rest on the page
        // gutter but travel edge to edge. Matches the section's px-6.
        className="svc-strip -mx-6 flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain px-6 pb-3"
      >
        {services.map((service) => {
          const matched = matchedIds ? matchedIds.includes(service.id) : true;
          return (
            <a
              key={service.id}
              href={`#${service.id}`}
              className={`flex shrink-0 snap-start items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors duration-200 ease-confident ${
                matched
                  ? "border-[--accent] text-[--text-primary]"
                  : "border-[--border] text-[--text-secondary]"
              }`}
            >
              {/* A dot rather than a colour-only distinction: the chips have
                  to be tellable apart without relying on hue. */}
              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 rounded-full ${
                  matched ? "bg-[--accent]" : "bg-[--border]"
                }`}
              />
              {service.name}
            </a>
          );
        })}
      </div>

      <div className="-mx-6 h-px bg-[--border]">
        <motion.div
          aria-hidden="true"
          style={{ scaleX: scrollXProgress }}
          className="svc-strip-fill h-full w-full origin-left bg-[--accent]"
        />
      </div>
    </nav>
  );
}

/**
 * Wraps the service list and reports scroll travel through it as a rail in
 * the gutter.
 *
 * The tracked element is rendered *here*, by the same component that runs
 * useScroll, and that is not a stylistic choice. An earlier version put the
 * ref on the list in ServiceExplorer and passed it down to a rail nested
 * inside it; React attaches a parent's ref only after its entire subtree has
 * committed, so the nested rail's layout effect saw `target.current === null`
 * and the fill sat at scaleY(0) forever. A component can rely on refs to
 * elements it renders itself — not on refs owned by an ancestor it sits
 * inside.
 */
export function ServiceListRail({ children }: { children: React.ReactNode }) {
  const listRef = useRef<HTMLDivElement>(null);

  // Starts filling once the list reaches mid-viewport and completes as its
  // end clears the fold, so the rail is full when the last service line is
  // read rather than when it is merely on screen.
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 0.6", "end 0.9"],
  });

  return (
    <div ref={listRef} className="relative mx-auto mt-12 max-w-4xl px-6">
      <div className="svc-rail" aria-hidden="true">
        {/* Written as a composited scaleY. Animating height here instead
            would put layout work on every scroll frame. */}
        <motion.div
          style={{ scaleY: scrollYProgress }}
          className="svc-rail-fill"
        />
      </div>
      {children}
    </div>
  );
}
