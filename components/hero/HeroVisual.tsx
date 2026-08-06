"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { HeroFallback } from "./HeroFallback";
import { detectHeroTier, type HeroTier } from "@/lib/hero-capability";

// Hero shell for the homepage (docs/MOTION_REDESIGN.md §4). Owns the
// section element so that:
//   - the cursor listener can be scoped to the hero rather than window,
//   - Motion's useScroll has a target to measure hero progress against,
//   - the hero copy stays a server component, passed through as children —
//     the headline is the LCP candidate and must not wait on this file's JS.
//
// `ssr: false` keeps Three.js out of the server render and out of the
// initial payload; because it's only *rendered* once detectHeroTier() has
// cleared the device, the chunk is never even requested on a device that
// can't use it (§4.3).
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

export function HeroVisual({ children }: { children: React.ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  // null until the client has measured the device. The static fallback
  // covers that window, so the hero is never blank.
  const [tier, setTier] = useState<HeroTier | null>(null);

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
    <section
      ref={sectionRef}
      // overflow-hidden: dispersing shards travel well past the formation's
      // resting bounds and must not create a horizontal scrollbar.
      className="relative flex min-h-[80vh] items-center overflow-hidden px-6 py-24 sm:py-32"
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
            <HeroScene containerRef={sectionRef} tier={tier} />
          </div>
        ) : null}
      </div>

      {/* Content sits above the canvas; shards are distributed on an annulus
          so nothing ever renders behind this copy. */}
      <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
        {children}
      </div>
    </section>
  );
}
