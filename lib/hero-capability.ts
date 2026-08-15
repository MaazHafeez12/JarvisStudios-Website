// Capability tiers for the 3D hero (docs/MOTION_REDESIGN.md §4.3).
//
// Four states, not an on/off switch. This runs on the client *before* the
// R3F/Three.js chunk is requested, so a low-end device never downloads a
// bundle it's only going to discard — that's the whole point of the check
// being here rather than inside the scene.

export type HeroTier =
  /** prefers-reduced-motion, no WebGL, or too low-end: static SVG, zero JS animation. */
  | "static"
  /** Touch/mobile/mid-tier: fewer shards, no antialiasing, idle drift instead of cursor. */
  | "lite"
  /** Desktop with a capable GPU: full shard count, cursor + scroll reactive. */
  | "full";

// navigator.deviceMemory / connection are Chromium-only and untyped in lib.dom.
type MaybeConstrainedNavigator = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
};

const SLOW_CONNECTIONS = new Set(["slow-2g", "2g", "3g"]);

/**
 * The constraints that disqualify *any* heavy decoration, WebGL or not:
 * reduced motion, a metered or slow connection, and very low-end hardware.
 *
 * Split out so the scrubbed film (components/motion/ScrubVideo.tsx) can share
 * them without inheriting the WebGL probe below. A device with no WebGL
 * context plays H.264 perfectly well — gating video on `detectHeroTier() !==
 * "static"` would deny the film to visitors who could see it fine.
 */
export function isConstrainedClient(): boolean {
  if (typeof window === "undefined") return true;

  // Non-negotiable, checked first (docs/MOTION_REDESIGN.md §6).
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;

  const nav = navigator as MaybeConstrainedNavigator;

  // Don't spend a visitor's metered/slow connection on decoration.
  if (nav.connection?.saveData) return true;
  if (nav.connection?.effectiveType && SLOW_CONNECTIONS.has(nav.connection.effectiveType)) {
    return true;
  }

  // Very low-end: a per-frame render loop here would cost more in INP than
  // the visual is worth (docs/MOTION_REDESIGN.md §4.2). For the film the same
  // threshold stands for a different reason — an all-intra decode is the most
  // expensive thing on the page.
  const memory = nav.deviceMemory;
  const cores = nav.hardwareConcurrency;
  if (typeof memory === "number" && memory <= 2) return true;
  if (typeof cores === "number" && cores <= 2) return true;

  return false;
}

/**
 * Cheap heuristics run first; the WebGL probe (the only part that actually
 * allocates anything) runs last and only if everything else passed.
 */
export function detectHeroTier(): HeroTier {
  if (typeof window === "undefined") return "static";

  if (isConstrainedClient()) return "static";

  const nav = navigator as MaybeConstrainedNavigator;
  const memory = nav.deviceMemory;
  const cores = nav.hardwareConcurrency;

  if (!hasWebGL()) return "static";

  // Touch-primary, narrow, or merely mid-tier hardware gets the light scene.
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.innerWidth < 768;
  const midTier =
    (typeof memory === "number" && memory <= 4) ||
    (typeof cores === "number" && cores <= 4);

  if (coarsePointer || narrow || midTier) return "lite";

  return "full";
}

/**
 * Probe for a usable WebGL context, then immediately release it —
 * without WEBGL_lose_context this would hold a real GPU context open for
 * the life of the page, on top of the one the scene is about to create.
 */
function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") ||
      canvas.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}
