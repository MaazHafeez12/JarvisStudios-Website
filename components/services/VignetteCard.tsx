"use client";

import { useEffect, useRef, useState } from "react";
import type { ProjectType } from "@/lib/types/lead";
import { ServiceVignette } from "./ServiceVignette";

// The framed vignette, plus the one piece of state that makes it arrive
// rather than simply exist: the scene wipes in and its single brand-blue
// element lands a beat later (styles in app/globals.css, §5.6 block).
//
// The hidden state is ARMED, never the default, and that ordering is the
// whole design:
//
//   1. The served HTML is the finished vignette, so JS-disabled, Reader Mode
//      and a failed hydration all show complete illustrations. A default-
//      hidden vignette that waits for JS is a blank box for those visitors.
//   2. Arming only happens to cards that start fully below the fold. A card
//      already on screen would otherwise be painted, then hidden by the
//      effect, then re-revealed — a flash on first load, which is worse than
//      no animation at all.
//   3. Reduced motion bails before arming. The CSS is already wrapped in a
//      no-preference query, so this is belt-and-braces, but it also spares
//      those visitors an IntersectionObserver that can only ever be a no-op.

export function VignetteCard({ service }: { service: ProjectType }) {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (node.getBoundingClientRect().top < window.innerHeight) return;

    setArmed(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setEntered(true);
        // Once, and then it stops costing anything.
        observer.disconnect();
      },
      // Fires a little after the top edge crosses, so the wipe reads as the
      // scene arriving rather than as something already half-finished.
      { rootMargin: "0px 0px -12% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-vg={entered ? "in" : "out"}
      className={`overflow-hidden rounded-lg border border-[--border] bg-[--surface-raised] p-5 ${
        armed ? "vg-armed" : ""
      }`}
    >
      <ServiceVignette service={service} />
    </div>
  );
}
