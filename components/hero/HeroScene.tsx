"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useScroll } from "motion/react";
import * as THREE from "three";
import { createShards, SHARD_COUNT, type Shard } from "@/lib/hero-shards";
import type { HeroTier } from "@/lib/hero-capability";

// Homepage hero, Option C — "assembling geometric shard field"
// (docs/MOTION_REDESIGN.md §3). Angular shards fly in and assemble on load,
// drift idly, parallax to the cursor by depth layer, and disperse as the
// hero scrolls away.
//
// This module is only ever reached through a dynamic import from
// HeroVisual.tsx — nothing here belongs in the initial JS payload (§4.1).
//
// Everything animated below is written straight to Three.js objects inside
// `useFrame`. No React state changes per frame: the render loop must not
// cost main-thread work beyond the frame itself, since a heavy loop here is
// the realistic way this regresses INP (§4.2).

/** How far out shards start before assembling in, as a multiple of resting position. */
const SPAWN_SPREAD = 1.5;
/** Seconds for one shard's entrance; total entrance ≈ this + stagger. */
const ENTRANCE_DURATION = 1.15;
const ENTRANCE_STAGGER = 0.035;

type SceneProps = {
  shards: Shard[];
  tier: Exclude<HeroTier, "static">;
  /** -1..1 cursor position within the hero. Mutated outside React. */
  pointer: React.RefObject<{ x: number; y: number }>;
  /** 0..1 hero scroll progress, read per frame. */
  readScroll: () => number;
};

/**
 * `ease-confident` — cubic-bezier(0.16, 1, 0.3, 1) from tailwind.config.ts —
 * approximated as an exponential ease-out, so the entrance shares its
 * character with every other transition on the site.
 */
function easeConfident(t: number): number {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function ShardField({ shards, tier, pointer, readScroll }: SceneProps) {
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  // Cursor is lerped toward rather than applied directly, so a fast mouse
  // flick glides instead of snapping.
  const smoothed = useRef({ x: 0, y: 0 });

  // Two shared geometries across every shard — each mesh differs only by
  // its non-uniform scale, so there's no reason to allocate per shard.
  const geometries = useMemo(
    () => [new THREE.TetrahedronGeometry(1), new THREE.OctahedronGeometry(1)],
    [],
  );

  // One material per distinct palette colour, shared across the shards that
  // use it — fewer material switches per frame than one material each.
  const materials = useMemo(() => {
    const byColor = new Map<string, THREE.MeshStandardMaterial>();
    for (const shard of shards) {
      if (byColor.has(shard.color)) continue;
      byColor.set(
        shard.color,
        new THREE.MeshStandardMaterial({
          color: new THREE.Color(shard.color),
          // Flat shading is the point: it's what makes the facets catch
          // light and read as angular fragments rather than blobs.
          flatShading: true,
          roughness: 0.42,
          metalness: 0.16,
        }),
      );
    }
    return byColor;
  }, [shards]);

  useEffect(() => {
    return () => {
      for (const geometry of geometries) geometry.dispose();
      for (const material of materials.values()) material.dispose();
    };
  }, [geometries, materials]);

  useFrame((state, delta) => {
    const elapsed = state.clock.elapsedTime;
    // Squared so the field holds its formation through the early scroll and
    // then falls away quickly, rather than smearing across the whole hero.
    const scroll = readScroll();
    const disperse = scroll * scroll;

    if (tier === "full") {
      // Frame-rate independent approach; clamped so a long frame can't
      // overshoot the target.
      const k = Math.min(1, delta * 3.5);
      smoothed.current.x += (pointer.current.x - smoothed.current.x) * k;
      smoothed.current.y += (pointer.current.y - smoothed.current.y) * k;
    }

    for (let i = 0; i < shards.length; i++) {
      const mesh = meshes.current[i];
      if (!mesh) continue;
      const shard = shards[i];

      const entrance = easeConfident(
        Math.max(0, (elapsed - i * ENTRANCE_STAGGER) / ENTRANCE_DURATION),
      );
      const incoming = 1 - entrance;

      // Idle drift — small, slow, out of phase per shard.
      const driftX = Math.sin(elapsed * shard.driftSpeed + shard.driftPhase) * 0.19;
      const driftY = Math.cos(elapsed * shard.driftSpeed * 0.8 + shard.driftPhase) * 0.24;

      // Nearer shards travel further with the cursor than distant ones —
      // that difference is what reads as depth.
      const parallax = tier === "full" ? 0.28 + shard.depth * 0.72 : 0;

      // Entrance and scroll-dispersal both push along the same outward
      // vector, so dispersing is visibly the entrance played in reverse.
      const outward = 1 + incoming * SPAWN_SPREAD + disperse * 0.95;

      mesh.position.set(
        shard.position[0] * outward + driftX + smoothed.current.x * parallax,
        shard.position[1] * outward + driftY + smoothed.current.y * parallax * 0.6,
        shard.position[2] - incoming * 5.5,
      );

      mesh.rotation.set(
        shard.rotation[0] + elapsed * shard.spin[0] + incoming * 1.4,
        shard.rotation[1] + elapsed * shard.spin[1] + incoming * 1.8,
        shard.rotation[2] + elapsed * shard.spin[2],
      );

      // Scaling down on dispersal (rather than fading) keeps every material
      // opaque — no transparency sorting, no extra draw cost.
      const k = entrance * (1 - disperse * 0.88);
      mesh.scale.set(shard.scale[0] * k, shard.scale[1] * k, shard.scale[2] * k);
    }
  });

  return (
    <group>
      {shards.map((shard, i) => (
        <mesh
          key={i}
          ref={(node) => {
            meshes.current[i] = node;
          }}
          geometry={geometries[shard.geometry]}
          material={materials.get(shard.color)}
          // Start collapsed — useFrame writes the real transform before the
          // first painted frame, so this is only the pre-mount state.
          scale={0}
        />
      ))}
    </group>
  );
}

/** Tracks the site's light/dark toggle so the lighting suits the backdrop. */
function useIsLightTheme(): boolean {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const read = () => setIsLight(root.getAttribute("data-theme") === "light");
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return isLight;
}

export default function HeroScene({
  containerRef,
  tier,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
  tier: Exclude<HeroTier, "static">;
}) {
  const shards = useMemo(
    () => createShards(tier === "full" ? SHARD_COUNT.full : SHARD_COUNT.lite),
    [tier],
  );
  const isLight = useIsLightTheme();
  const pointer = useRef({ x: 0, y: 0 });

  // Motion's useScroll rather than reading getBoundingClientRect per frame,
  // which would force a layout on every single frame (§4.1).
  const { scrollYProgress } = useScroll({
    target: containerRef as React.RefObject<HTMLElement>,
    offset: ["start start", "end start"],
  });

  // Nothing should render while the hero is off-screen — an idle render loop
  // behind the fold is pure battery and main-thread cost.
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "120px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [containerRef]);

  // Cursor listener is scoped to the hero element, not window (§4.1) — no
  // pointer work happens once the visitor has scrolled past the hero. Only
  // the full tier reacts to the cursor; the lite tier keeps its idle drift.
  useEffect(() => {
    const element = containerRef.current;
    if (!element || tier !== "full") return;

    const onMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      pointer.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.current.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };
    const onLeave = () => {
      pointer.current.x = 0;
      pointer.current.y = 0;
    };

    element.addEventListener("pointermove", onMove, { passive: true });
    element.addEventListener("pointerleave", onLeave, { passive: true });
    return () => {
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerleave", onLeave);
    };
  }, [containerRef, tier]);

  return (
    <Canvas
      // "never" fully parks the loop rather than throttling it.
      frameloop={inView ? "always" : "never"}
      // Capping DPR is the single biggest perf lever here — an uncapped
      // 3x retina buffer costs ~9x the fragments of a 1x one.
      dpr={[1, tier === "full" ? 1.75 : 1.25]}
      gl={{
        // Transparent so the page's own themed background shows through.
        alpha: true,
        antialias: tier === "full",
        powerPreference: tier === "full" ? "high-performance" : "low-power",
      }}
      camera={{ position: [0, 0, 9], fov: 45 }}
    >
      <ambientLight intensity={isLight ? 1.9 : 1.0} />
      <directionalLight position={[4, 6, 8]} intensity={isLight ? 2.1 : 2.7} />
      {/* Brand-blue rim from below-left, so charcoal shards pick up colour
          at their edges instead of going flat grey. */}
      <directionalLight position={[-6, -2, 3]} intensity={0.85} color="#00ADEF" />
      <ShardField
        shards={shards}
        tier={tier}
        pointer={pointer}
        readScroll={() => scrollYProgress.get()}
      />
    </Canvas>
  );
}
