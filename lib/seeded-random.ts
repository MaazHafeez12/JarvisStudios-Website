// Shared deterministic-randomness helpers for the site's generated angular
// geometry (lib/hero-shards.ts, lib/service-shards.ts).
//
// Determinism matters for more than tidiness here: these compositions are
// server-rendered and then hydrated, so anything non-reproducible between
// Node and the browser surfaces as a hydration mismatch.

/** mulberry32 — small deterministic PRNG, plenty for layout jitter. */
export function seeded(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Math.sin/cos are implementation-defined in ECMAScript — Node and the
 * browser can disagree in the last ULP (e.g. …8462919 vs …8462923). In
 * server-rendered geometry that difference lands in an SVG `transform` or
 * `points` attribute and trips a hydration mismatch. Truncating to a
 * precision far below anything visible makes the output identical on both
 * sides. Only +-*\/ are used downstream, and IEEE 754 requires those to be
 * correctly rounded, so they stay stable.
 */
export function stable(value: number): number {
  return Math.round(value * 1e5) / 1e5;
}

/** Turns a string (e.g. a service id) into a seed, so ids give stable layouts. */
export function seedFromString(value: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}
