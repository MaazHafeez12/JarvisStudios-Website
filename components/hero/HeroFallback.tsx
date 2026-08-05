import { createShards, SHARD_COUNT, type Shard } from "@/lib/hero-shards";

// Static equivalent of the 3D hero (docs/MOTION_REDESIGN.md §4.3 rows 1 & 4).
// Serves three jobs:
//   1. What `prefers-reduced-motion` and no-WebGL visitors get, permanently.
//   2. What paints first for everyone — this is server-rendered, so the hero
//      is never visually empty while the capability check and the Three.js
//      chunk resolve (§4.1).
//   3. Nothing animates and no listener is attached, so it costs nothing on
//      the devices that keep it.
//
// It draws the same shard data as the scene, so it's the formation the 3D
// version assembles into — not an unrelated placeholder.

// Matches the scene camera (position z=9, fov 45): visible half-height at
// z=0 is tan(22.5°) * 9 ≈ 3.73 world units.
const HALF_HEIGHT = 3.73;
const CAMERA_Z = 9;

/** Perspective foreshortening, so depth reads the same as it does in 3D. */
function perspective(z: number): number {
  return CAMERA_Z / (CAMERA_Z - z);
}

/**
 * Three decimals is well below one device pixel at this viewBox scale, and
 * it keeps ~30 shards' worth of coordinates from bloating the prerendered
 * HTML with 17-digit floats.
 */
function n(value: number): string {
  return value.toFixed(3);
}

function shardPath(shard: Shard): string {
  const [sx, sy] = shard.scale;
  // Asymmetric triangle — an angular sliver, matching the non-uniformly
  // scaled tetrahedra the scene renders.
  return [
    `M 0 ${n(-sy)}`,
    `L ${n(sx)} ${n(sy * 0.62)}`,
    `L ${n(-sx * 0.78)} ${n(sy * 0.88)}`,
    "Z",
  ].join(" ");
}

export function HeroFallback({ className = "" }: { className?: string }) {
  const shards = createShards(SHARD_COUNT.full);

  return (
    <svg
      className={`h-full w-full ${className}`}
      viewBox={`-9 ${-HALF_HEIGHT} 18 ${HALF_HEIGHT * 2}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      {shards.map((shard, i) => {
        const k = perspective(shard.position[2]);
        const x = shard.position[0] * k;
        // SVG's y axis points down; the scene's points up.
        const y = -shard.position[1] * k;
        const angle = (shard.rotation[2] * 180) / Math.PI;

        return (
          <g
            key={i}
            transform={`translate(${n(x)} ${n(y)}) rotate(${n(angle)}) scale(${n(k)})`}
          >
            <path
              d={shardPath(shard)}
              fill={shard.color}
              // Further shards sit back visually, the same way the scene's
              // lighting and foreshortening push them back.
              opacity={n(0.3 + shard.depth * 0.45)}
            />
          </g>
        );
      })}
    </svg>
  );
}
