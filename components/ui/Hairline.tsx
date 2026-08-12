"use client";

import { motion, type Variants } from "motion/react";
import { EASE } from "@/lib/motion";

// A hairline rule that draws itself left-to-right as it enters the viewport.
//
// Hairlines are this site's primary divider (docs/DESIGN.md §2), so they are
// the one element already present at every structural seam. Drawing them is
// how a section announces its own arrival without adding any new furniture.
//
// Call sites must REPLACE their `border-t`, not sit beside it — a border and
// a Hairline together render two lines 1px apart.
//
// Reduced motion needs nothing here: `scaleX` is a transform, so
// <MotionConfig reducedMotion="user"> (app/layout.tsx) strips it and the rule
// renders complete. That is only true because this animates a transform and
// not `width`, which would also put layout work on every frame.
//
// THE OBSERVER IS ON THE TRACK, NOT ON THE FILL, and it has to be. The fill
// starts at `scaleX(0)`, which collapses its box to zero width — and Motion's
// `whileInView` watches the element it animates, so putting the two on one
// node means observing a box with no area. The section seams never drew:
// their fill sat at `matrix(0, 0, 0, 1, 0, 0)` however far it was scrolled
// past. The full-width track is always observable, and the fill takes the
// state by variant propagation.
//
// The variant names are deliberately not "hidden"/"visible". A Hairline
// rendered inside another variant tree — which is exactly where the service
// lines put it — would otherwise inherit that tree's propagated label and
// redraw on every state change. Unmatched names are ignored, which is the
// isolation being relied on.
const TRACK: Variants = { hairIdle: {}, hairDrawn: {} };
const FILL: Variants = { hairIdle: { scaleX: 0 }, hairDrawn: { scaleX: 1 } };

export function Hairline({
  className,
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial="hairIdle"
      whileInView="hairDrawn"
      viewport={{ once: true, margin: "-80px" }}
      variants={TRACK}
      className={`h-px w-full bg-[--border] ${className ?? ""}`}
      aria-hidden="true"
    >
      <motion.div
        variants={FILL}
        transition={{ duration: 0.7, ease: EASE, delay }}
        className="h-full w-full origin-left bg-[--text-secondary] opacity-40"
      />
    </motion.div>
  );
}
