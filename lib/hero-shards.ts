// Shard field geometry for the homepage hero (docs/MOTION_REDESIGN.md §3
// Option C). Generated here rather than inside the 3D scene so the static
// fallback (components/hero/HeroFallback.tsx) can draw the *same*
// composition as SVG — the reduced-motion/no-WebGL visitor sees the same
// picture the 3D scene assembles into, not a different placeholder.
//
// Deterministic (seeded) so the layout is identical between server render,
// client render, and the 3D scene — no hydration mismatch, and the
// composition doesn't reshuffle on every reload.

import { seeded, stable } from "@/lib/seeded-random";

// Palette per docs/DESIGN.md §2.2 — charcoal/brand-blue family only.
// neutral-800 (#222) is deliberately absent: it's invisible against the
// dark surface (#141414). These four read on both themes.
const PALETTE = [
  { color: "#00ADEF", weight: 0.22 }, // brand-500
  { color: "#5FD0FF", weight: 0.12 }, // brand-300
  { color: "#8A8A8A", weight: 0.4 }, // neutral-400
  { color: "#4A4A4A", weight: 0.26 }, // neutral-600
];

export type Shard = {
  /** Resting position in world units — the formation it assembles into. */
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  /** Index into the scene's shared geometry array (tetra / octa). */
  geometry: 0 | 1;
  color: string;
  /** 0 = furthest back, 1 = closest. Drives cursor-parallax strength. */
  depth: number;
  /** Phase offset + rate for the idle drift, so shards don't move in sync. */
  driftPhase: number;
  driftSpeed: number;
  spin: [number, number, number];
};

function pickColor(r: number): string {
  let acc = 0;
  for (const entry of PALETTE) {
    acc += entry.weight;
    if (r <= acc) return entry.color;
  }
  return PALETTE[PALETTE.length - 1].color;
}

/**
 * Shards occupy two arched bands — above and below the hero copy — never
 * beside it. An annulus was the obvious first shape, but it puts shards to
 * the left and right of the headline, and at most viewport widths the
 * headline already fills that space; shards rendered straight through the
 * text. Banding vertically works at every aspect ratio, because the copy's
 * *height* is stable while its width is not.
 *
 * `.hero-shard-mask` in globals.css fades the same middle region as a
 * backstop, so text contrast holds even mid-animation (§6).
 */
/** Half-width of the field. Wide enough to reach the edges of an ultrawide hero. */
const X_SPAN = 7.4;
/** Closest a shard may come to the vertical middle, where the copy sits. */
const Y_INSET = 1.95;
/** Extra lift applied toward the center, arching the bands away from the copy. */
const Y_ARCH = 1.05;
const Y_JITTER = 0.7;

export function createShards(count: number): Shard[] {
  const rand = seeded(0x5a1e);
  const shards: Shard[] = [];

  for (let i = 0; i < count; i++) {
    // Alternating bands, so top and bottom stay evenly weighted regardless
    // of shard count.
    const band = i % 2 === 0 ? 1 : -1;
    // Even spread across the width with jitter, so the field reads as a
    // deliberate formation rather than random scatter.
    const spread = (i / (count - 1)) * 2 - 1;
    const x = (spread + (rand() - 0.5) * 0.32) * X_SPAN;
    // Shards near the middle sit highest, arching the band up and away from
    // the copy; toward the edges they relax back down toward the centerline.
    const arch = 1 - Math.min(1, Math.abs(x) / X_SPAN);
    const depth = rand();

    shards.push({
      position: [
        stable(x),
        stable(band * (Y_INSET + arch * Y_ARCH + rand() * Y_JITTER)),
        stable(-3.2 + depth * 4.6),
      ],
      rotation: [
        stable(rand() * Math.PI),
        stable(rand() * Math.PI),
        stable(rand() * Math.PI),
      ],
      // Non-uniform scaling is what turns a tetrahedron/octahedron into a
      // *shard* — an elongated sliver rather than a chunky solid.
      scale: [
        stable(0.14 + rand() * 0.17),
        stable(0.38 + rand() * 0.62),
        stable(0.1 + rand() * 0.13),
      ],
      geometry: rand() > 0.5 ? 1 : 0,
      color: pickColor(rand()),
      depth,
      driftPhase: rand() * Math.PI * 2,
      driftSpeed: 0.18 + rand() * 0.26,
      spin: [
        (rand() - 0.5) * 0.1,
        (rand() - 0.5) * 0.14,
        (rand() - 0.5) * 0.08,
      ],
    });
  }

  return shards;
}

/** Full desktop scene vs. the reduced mobile/low-end scene (§4.3). */
export const SHARD_COUNT = { full: 30, lite: 13 } as const;
