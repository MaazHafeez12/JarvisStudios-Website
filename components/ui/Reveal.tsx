"use client";

import { motion, type Variants } from "motion/react";

// Shared scroll-reveal wrapper (docs/DESIGN.md §3.2 "scroll-triggered
// reveals") — fades/slides content in once as it enters the viewport.
// Reduced-motion support (docs/DESIGN.md §3.1) comes from <MotionConfig
// reducedMotion="user"> in app/layout.tsx, not from anything here.

/**
 * Which edge the content arrives from. `bottom` is the site default and the
 * only one most call sites should use; the horizontal pair exists for
 * [[DESIGN]] §3.2's alternating blocks, where the direction carries the
 * left/right rhythm of the layout (docs/MOTION_REDESIGN.md §5 item 2).
 *
 * **Horizontal reveals and `overflow`.** The offset is 20px, deliberately
 * under the site's 24px `px-6` gutter, so a full-width block sliding in
 * cannot push past the viewport edge. If a wider offset is ever needed, the
 * containing section needs `overflow-x: clip` — *never* `overflow-x: hidden`,
 * which creates a scroll container and silently kills `position: sticky` on
 * every descendant, including the homepage service tour's pinned stage.
 */
type Direction = "bottom" | "left" | "right";

// Precomputed rather than assembled in render: a stable object identity means
// Motion never re-diffs the variant set when a parent re-renders.
//
// The `lcp` rows exist because Chrome excludes opacity:0 elements from LCP
// candidacy until they become visible, so an opacity-animated hero headline
// delays its own LCP timestamp until the fade resolves. Those variants only
// move, never fade, letting an above-the-fold LCP candidate (e.g. a page H1)
// use Reveal for the "assembles into place" motion without that penalty.
const VARIANTS: Record<`${Direction}-${"fade" | "lcp"}`, Variants> = {
  "bottom-fade": { hidden: { opacity: 0, x: 0, y: 16 }, visible: { opacity: 1, x: 0, y: 0 } },
  "bottom-lcp": { hidden: { x: 0, y: 16 }, visible: { x: 0, y: 0 } },
  "left-fade": { hidden: { opacity: 0, x: -20, y: 0 }, visible: { opacity: 1, x: 0, y: 0 } },
  "left-lcp": { hidden: { x: -20, y: 0 }, visible: { x: 0, y: 0 } },
  "right-fade": { hidden: { opacity: 0, x: 20, y: 0 }, visible: { opacity: 1, x: 0, y: 0 } },
  "right-lcp": { hidden: { x: 20, y: 0 }, visible: { x: 0, y: 0 } },
};

export function Reveal({
  children,
  delay = 0,
  className,
  lcpSafe = false,
  from = "bottom",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  lcpSafe?: boolean;
  from?: Direction;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      // `bottom` reproduces the original variants exactly, so the call sites
      // that omit `from` — which is all of them but the About list — are
      // behaviourally unchanged. The explicit `x: 0` there is inert; Motion
      // writes translateX(0).
      variants={VARIANTS[`${from}-${lcpSafe ? "lcp" : "fade"}`]}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
