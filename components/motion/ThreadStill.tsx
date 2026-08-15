import { ACCENT } from "@/components/services/vignette-kit";

// The thread film's resting frame (docs/MOTION_REDESIGN.md §5.8).
//
// This is what the section *is* whenever the film isn't playing: before the
// video has loaded, on a constrained device, under reduced motion, with no JS,
// and in Reader Mode. It is authored rather than a captured poster frame so
// the section is complete on its own — the film adds motion to a picture that
// already works, instead of the picture being a placeholder for the film.
//
// Same rules as the ten vignette scenes: server-rendered, dependency-free, no
// `"use client"`, hairlines on currentColor, exactly one accent element.
//
// The drawing: a weave of level threads, one of which has been pulled — it
// diverges and climbs out of the frame, and its neighbours lift with it, less
// the further they sit from it. The whole cloth moves when you pull one thread.

const ROWS = 15;
const TOP = 108;
const GAP = 47;
const PULLED = 7;

/** How far row `i` is dragged upward at the right edge by the pulled thread. */
function lift(i: number) {
  const distance = Math.abs(i - PULLED);
  // Inverse-square falloff: the two neighbours move visibly, the rest barely.
  return 150 / (distance * distance + 1.35);
}

function weft(i: number) {
  const y = TOP + i * GAP;
  const end = y - lift(i);
  // Flat through the left half, so the divergence reads as something that
  // happens rather than a curve the thread always had.
  return `M0 ${y} C 520 ${y} 880 ${y} 1600 ${end}`;
}

// The pulled thread leaves the weave entirely and exits the top-right corner.
const PULLED_Y = TOP + PULLED * GAP;
const PULLED_PATH = `M0 ${PULLED_Y} C 460 ${PULLED_Y} 700 ${PULLED_Y} 940 ${PULLED_Y - 96} S 1320 ${PULLED_Y - 372} 1600 ${PULLED_Y - 452}`;

export function ThreadStill({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1600 900"
      // No colour of its own: it inherits currentColor from .film-frame, which
      // is a fixed dark stage in both themes. The ten vignette scenes take
      // --text-secondary instead because they sit on themed surfaces.
      className={`h-full w-full${className ? ` ${className}` : ""}`}
      fill="none"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Warp: the cloth the threads run through. Faint enough to read as
          texture rather than as a grid. */}
      <g stroke="currentColor" strokeOpacity={0.07} strokeWidth={1}>
        {Array.from({ length: 32 }, (_, i) => (
          <line key={i} x1={i * 50} y1={70} x2={i * 50} y2={830} />
        ))}
      </g>

      {/* Weft, minus the one being pulled. */}
      <g stroke="currentColor" strokeOpacity={0.26} strokeWidth={1.5}>
        {Array.from({ length: ROWS }, (_, i) =>
          i === PULLED ? null : <path key={i} d={weft(i)} />,
        )}
      </g>

      {/* The one accent element in the composition. */}
      <path d={PULLED_PATH} stroke={ACCENT} strokeWidth={2.5} strokeLinecap="round" />
      {/* Where it leaves the weave. */}
      <circle cx={940} cy={PULLED_Y - 96} r={5} fill={ACCENT} />
    </svg>
  );
}
