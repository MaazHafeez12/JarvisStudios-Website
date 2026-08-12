"use client";

import { useEffect } from "react";
import { motion } from "motion/react";

// Route transition (docs/MOTION_REDESIGN.md §5 item 4) — a brief cross-fade
// of the page body between routes.
//
// `template.tsx` rather than `layout.tsx`: Next remounts a template on every
// navigation and reuses a layout, and a remount is what gives the fade
// something to fire on. It also sits *inside* the layout, so Nav and Footer
// stay put and only the page content crosses over — which is the point. A
// header that fades with the page reads as a full reload.
//
// This is enter-only. App Router has no exit hook for a route leaving, and
// the machinery to fake one (freezing the outgoing tree while the incoming
// one mounts) costs more than a genuine cross-fade is worth at this scale.

// ─────────────────────────────────────────────────────────────────────────
// The first paint must never start at opacity 0.
//
// Chrome excludes opacity:0 elements from LCP candidacy until they become
// visible, so a template that fades in unconditionally would defer the LCP
// of *every* page by the length of its own animation — the exact penalty
// components/ui/Reveal.tsx's `lcpSafe` variant exists to dodge, reintroduced
// site-wide and at a higher level. Landing on a page must be instant; only
// moving between pages animates.
//
// Hence the flag. Two things about it that are load-bearing:
//
//  - It lives at module scope so it survives the template's own remount.
//    Component state cannot do this job: it is reset by the very remount
//    being detected.
//  - It is read through a `typeof window` guard because module scope on the
//    server is shared across requests. Without the guard, the second request
//    a server process handled would render `opacity: 0` into the HTML —
//    reinstating the LCP hit for everyone, and mismatching a client whose
//    own first render still says false. Server-side the answer is always
//    "no animation", which is both correct and the safe default.
let hasMountedOnce = false;

export default function Template({ children }: { children: React.ReactNode }) {
  const animateIn = typeof window !== "undefined" && hasMountedOnce;

  useEffect(() => {
    hasMountedOnce = true;
  }, []);

  return (
    <motion.div
      // `false` skips the enter animation outright rather than animating
      // from 1 to 1 — no style is written, so the initial HTML carries no
      // opacity at all.
      initial={animateIn ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      // Opacity only. A translate would be a transform, which
      // <MotionConfig reducedMotion="user"> strips anyway, and a page that
      // slides on every navigation is the kind of ambient motion
      // docs/MOTION_REDESIGN.md §2 asks to stay away from. A cross-fade is
      // also vestibular-safe, so it degrades to itself rather than to
      // nothing.
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
