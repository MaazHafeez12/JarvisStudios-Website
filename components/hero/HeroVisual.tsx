"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { HeroFallback } from "./HeroFallback";
import { detectHeroTier, type HeroTier } from "@/lib/hero-capability";
import { useScrollProgress } from "@/lib/use-scroll-progress";

// Hero shell for the homepage (docs/MOTION_REDESIGN.md §4, §5.8). A pinned
// scroll track: the copy rides out and the shard field disperses as the
// visitor scrolls, then a hairline draws across as the seam into the section
// below. Owns the section element so that:
//   - the cursor listener can be scoped to the hero rather than window,
//   - the shared scroll hook has a pin to write `--p` onto,
//   - the hero copy stays a server component, passed through as children —
//     the headline is the LCP candidate and must not wait on this file's JS.
//
// LCP CONSTRAINT, and the reason the scrub only ever moves copy *out*.
// At `--p: 0` — which is the server render, the pre-hydration state, the
// reduced-motion state and the no-JS state alike — the copy is at full
// opacity and untransformed. Nothing here can delay or hide the headline,
// because every effect below is keyed on progress the visitor has to scroll
// to produce. An entrance keyed on `--p` would put the LCP element behind a
// scroll event, which §4.2 treats as a blocker rather than a tradeoff.
//
// `ssr: false` keeps Three.js out of the server render and out of the initial
// payload; because it's only *rendered* once detectHeroTier() has cleared the
// device, the chunk is never even requested on a device that can't use it
// (§4.3).
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

export function HeroVisual({ children }: { children: React.ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  // null until the client has measured the device. The static fallback
  // covers that window, so the hero is never blank.
  const [tier, setTier] = useState<HeroTier | null>(null);

  // The pin is the section, so `--p` lands where the copy and the closing
  // hairline can both read it, and HeroScene can read the same number as a
  // JS value for its useFrame loop.
  useScrollProgress(trackRef, sectionRef, progressRef);

  useEffect(() => {
    // Device capability is unknowable on the server, so this cannot move
    // into render without breaking hydration. The null-first window is
    // deliberate and covered by HeroFallback (see comment above).
    // useSyncExternalStore is the rule-clean version of this and is tracked
    // in TODO.md.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTier(detectHeroTier());
  }, []);

  const show3D = tier === "full" || tier === "lite";

  return (
    <div ref={trackRef} className="stage-track hero-track">
      <section
        ref={sectionRef}
        // overflow-hidden: dispersing shards travel well past the formation's
        // resting bounds and must not create a horizontal scrollbar. Safe on
        // the pin itself — only a scrolling *ancestor* breaks position:
        // sticky, which is why this is here and never on main or body.
        className="stage-pin stage-pin--bleed hero-pin relative flex items-center overflow-hidden px-6"
      >
        {/* Decorative only — aria-hidden and pointer-events-none keep the
            canvas out of the accessibility tree and out of the tab order
            entirely (docs/MOTION_REDESIGN.md §6). */}
        <div
          aria-hidden="true"
          className="hero-shard-mask pointer-events-none absolute inset-0 select-none"
        >
          {/* Kept mounted underneath so the swap to WebGL is a cross-fade
              rather than a flash of empty hero. No transition on the
              reduced-motion path — those visitors never reach show3D. */}
          <HeroFallback
            className={show3D ? "opacity-0 transition-opacity duration-700" : ""}
          />
          {show3D ? (
            <div className="absolute inset-0">
              <HeroScene
                containerRef={sectionRef}
                progressRef={progressRef}
                tier={tier}
              />
            </div>
          ) : null}
        </div>

        {/* Content sits above the canvas; shards are distributed on an annulus
            so nothing ever renders behind this copy. */}
        <div className="hero-copy relative z-10 mx-auto w-full max-w-4xl text-center">
          {children}
        </div>

        {/* The close: a hairline drawing across the emptied field, which is
            the same gesture Hairline.tsx uses to seam every other section on
            the site. Decorative — it marks the end of the hero, it does not
            say anything the copy above has not. */}
        <span aria-hidden="true" className="hero-seam" />
      </section>
    </div>
  );
}
