// Per-service angular compositions for the Services page blocks
// (docs/DESIGN.md §2.4 "abstract shapes echoing the logo's geometry").
//
// Replaces the previous treatment — a 320x320 bordered panel containing an
// 80x80 lucide icon, i.e. ~6% content and ~94% empty box, repeated six
// times down the page. Generic iconography is also the thing §2.4 asked to
// avoid in the first place.
//
// Same shard vocabulary as the hero (lib/hero-shards.ts), so the page reads
// as part of one system rather than a separate decorative idea. Each
// service is seeded from its own id, so its composition is stable across
// renders but distinct from its siblings.

import { seeded, seedFromString, stable } from "@/lib/seeded-random";

export interface ServiceShard {
  /** Polygon points in the composition's 0–100 coordinate space. */
  points: string;
  color: string;
  opacity: number;
}

// Same charcoal/brand-blue family as the hero. neutral-800 is excluded for
// the same reason it is there: it disappears against the dark surface.
const PALETTE = [
  { color: "#00ADEF", weight: 0.24 }, // brand-500
  { color: "#5FD0FF", weight: 0.12 }, // brand-300
  { color: "#8A8A8A", weight: 0.34 }, // neutral-400
  { color: "#4A4A4A", weight: 0.3 }, // neutral-600
];

const SHARD_COUNT = 17;

function pickColor(r: number): string {
  let acc = 0;
  for (const entry of PALETTE) {
    acc += entry.weight;
    if (r <= acc) return entry.color;
  }
  return PALETTE[PALETTE.length - 1].color;
}

/**
 * Every composition is built along a "grain" axis whose angle comes from
 * the service's own seed. That's what makes six compositions read as
 * siblings rather than six unrelated scatters: they share shard shape,
 * palette and density, and differ in direction and arrangement. Purely
 * random placement per service loses the family resemblance.
 */
export function createServiceComposition(serviceId: string): ServiceShard[] {
  const rand = seeded(seedFromString(serviceId));
  const grain = rand() * Math.PI;
  const dirX = Math.cos(grain);
  const dirY = Math.sin(grain);
  // Unit vector perpendicular to the grain, for lateral scatter.
  const perpX = -dirY;
  const perpY = dirX;

  const shards: ServiceShard[] = [];

  for (let i = 0; i < SHARD_COUNT; i++) {
    // Even progression along the grain with jitter, so the band reads as a
    // deliberate sweep rather than clumping.
    // Lateral scatter is kept well below the spread along the grain —
    // widen it and the shards stop reading as a directed band and start
    // looking like random confetti in a box.
    const along = ((i / (SHARD_COUNT - 1)) * 2 - 1) * 44 + (rand() - 0.5) * 10;
    const lateral = (rand() - 0.5) * 34;

    const cx = 50 + dirX * along + perpX * lateral;
    const cy = 50 + dirY * along + perpY * lateral;

    // Wide size range so the composition has depth rather than reading as
    // one uniform swarm.
    const length = 8 + rand() * 30;
    const width = 2.5 + rand() * 8;
    // Shards lean with the grain, but not rigidly — a fixed angle reads
    // mechanical rather than like fragments.
    const angle = grain + (rand() - 0.5) * 0.95;
    const ax = Math.cos(angle);
    const ay = Math.sin(angle);
    const bx = -ay;
    const by = ax;

    // Asymmetric triangle: a sliver with one long point, matching the
    // non-uniformly scaled tetrahedra the hero renders in 3D.
    const tipX = cx + ax * length * 0.55;
    const tipY = cy + ay * length * 0.55;
    const backX = cx - ax * length * 0.45;
    const backY = cy - ay * length * 0.45;

    shards.push({
      points: [
        `${stable(tipX)},${stable(tipY)}`,
        `${stable(backX + bx * width * 0.5)},${stable(backY + by * width * 0.5)}`,
        `${stable(backX - bx * width * 0.34)},${stable(backY - by * width * 0.34)}`,
      ].join(" "),
      color: pickColor(rand()),
      opacity: stable(0.45 + rand() * 0.55),
    });
  }

  return shards;
}
