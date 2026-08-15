"use client";

import { useRef } from "react";
import { useScrollProgress } from "@/lib/use-scroll-progress";

// Thin shell over useScrollProgress for sections that don't own their own
// track DOM: renders the tall `.stage-track` and the pinned `.stage-pin`, and
// hands the pin a `--p` from 0 to 1 across the track. See
// lib/use-scroll-progress.ts for the rules that govern the mechanism, and the
// `.stage-*` block in globals.css for how beats read `--p`.
//
// The two service tours use the hook directly instead — their track is a
// two-column grid and the pinned stage is one of its children, so there is no
// wrapper element to give them.

export function ScrollStage({
  length,
  progressRef,
  className,
  pinClassName,
  children,
}: {
  /**
   * Track height in `svh`. This is the scroll distance the section costs, so
   * it is the section's real budget: 380 is a hero, 800 is a four-beat film.
   * Beat sub-ranges in CSS are fractions of *this*, so changing it retimes
   * every beat proportionally rather than breaking them.
   */
  length: number;
  /** See useScrollProgress — for the R3F hero's useFrame loop only. */
  progressRef?: React.RefObject<number>;
  className?: string;
  /** Add `stage-pin--bleed` for a full-viewport pin with no nav inset. */
  pinClassName?: string;
  children: React.ReactNode;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useScrollProgress(trackRef, pinRef, progressRef);

  return (
    <div
      ref={trackRef}
      className={`stage-track${className ? ` ${className}` : ""}`}
      style={{ "--len": length } as React.CSSProperties}
    >
      <div
        ref={pinRef}
        className={`stage-pin${pinClassName ? ` ${pinClassName}` : ""}`}
      >
        {children}
      </div>
    </div>
  );
}
