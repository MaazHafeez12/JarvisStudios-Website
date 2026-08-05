import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/content/services";

// Service card hover treatment per docs/MOTION_REDESIGN.md §5.1 (revised to
// the bolder direction): an angular brand-blue wipe sweeps across the card
// and the content inverts, with a small burst of shards off the top-right
// corner echoing the hero's shard field at micro scale.
//
// The content is rendered twice — once normally, once inverted inside the
// wipe panel. See `.service-card-wipe` in globals.css for why that
// duplication is what keeps text contrast correct at every frame of the
// sweep. The duplicate is aria-hidden so the link's accessible name stays
// "<service name> <summary>" rather than doubling.

/**
 * Every shard is a triangle with one vertex pinned to a shared origin, so
 * at rest they're a single overlapping cluster and the burst genuinely
 * radiates from a point rather than reading as unrelated pieces drifting
 * apart. Angular slivers with varied opacity for depth — the same geometry
 * language as lib/hero-shards.ts, at micro scale.
 *
 * The burst is a short, wide band rather than a square corner cluster, and
 * that shape is load-bearing rather than aesthetic. The card is
 * `flex-col justify-between` with the arrow as its last child, so the
 * summary's final line always clears the card's bottom edge by at least
 * p-6 (24) + arrow h-5 (20) + arrow mt-6 (24) = 68px — and by more whenever
 * a card is stretched to match the tallest in its grid row. Keeping the
 * burst box 64px tall and pinned to the bottom therefore puts it inside
 * that gap by construction, at every breakpoint and for any summary length.
 * Positioning it by eye instead means it collides with copy as soon as the
 * card width changes the wrap points.
 *
 * Coordinates below are in the 144x64 viewBox, which renders 1:1 with CSS
 * pixels at `h-16 w-36`.
 */
const BURST_ORIGIN = "98,34";
const BURST_SHARDS = [
  { points: `${BURST_ORIGIN} 130,43 111,55`, x: -36, y: -4, r: -22, o: 1, delay: 150 },
  { points: `${BURST_ORIGIN} 126,22 112,37`, x: -16, y: -12, r: 34, o: 0.85, delay: 175 },
  { points: `${BURST_ORIGIN} 106,58 91,50`, x: -32, y: 2, r: 18, o: 0.7, delay: 200 },
  { points: `${BURST_ORIGIN} 124,33 110,45`, x: 22, y: 6, r: -14, o: 0.9, delay: 220 },
  { points: `${BURST_ORIGIN} 90,18 103,23`, x: -8, y: -10, r: 26, o: 0.75, delay: 245 },
];

function CardContent({
  service,
  inverted = false,
}: {
  service: Service;
  inverted?: boolean;
}) {
  // The inverted copy is a purely visual duplicate, so it renders with
  // non-semantic elements. aria-hidden on its wrapper is what keeps it out
  // of the accessibility tree; using div/span rather than h3/p additionally
  // keeps the *document* down to exactly one heading per card, which
  // matters for anything reading the DOM outline rather than the a11y tree
  // (crawlers, heading-navigation tooling).
  const Heading = inverted ? "div" : "h3";
  const Summary = inverted ? "div" : "p";

  return (
    <div
      className={`flex h-full flex-col justify-between p-6 ${
        inverted ? "text-neutral-950" : ""
      }`}
    >
      <div>
        <Heading className="font-display text-lg font-semibold">
          {service.name}
        </Heading>
        <Summary
          className={`mt-2 text-sm ${
            // 80% near-black on brand-500 lands at 5.2:1 — still AA for body
            // text, while keeping the summary subordinate to the heading the
            // way --text-secondary does in the resting state.
            inverted ? "text-neutral-950/80" : "text-[--text-secondary]"
          }`}
        >
          {service.summary}
        </Summary>
      </div>
      <ArrowUpRight
        className={`mt-6 h-5 w-5 ${
          inverted ? "text-neutral-950" : "text-[--text-secondary]"
        }`}
        aria-hidden="true"
      />
    </div>
  );
}

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services#${service.id}`}
      className="group relative block overflow-hidden rounded-lg border border-[--border] bg-[--surface-raised] transition-colors duration-200 ease-confident hover:border-[--accent] focus-visible:border-[--accent]"
    >
      <CardContent service={service} />

      {/* Wipe panel. Covers the full card and is revealed by clip-path, so
          the inverted copy inside it stays aligned with the real content. */}
      <div
        aria-hidden="true"
        className="service-card-wipe absolute inset-0 bg-brand-500"
      >
        <CardContent service={service} inverted />
      </div>

      {/* Burst sits above the wipe and is delayed past it, so the shards
          appear against blue that has already arrived. Pinned to the bottom
          edge, to the right of the arrow, inside the 68px band the layout
          guarantees is free of copy — see BURST_SHARDS. It's also the
          wipe's trailing edge, so it reads as debris kicked up by the sweep
          rather than an unrelated flourish. */}
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 144 64"
        className="pointer-events-none absolute bottom-0 right-0 h-16 w-36"
      >
        {BURST_SHARDS.map((shard, i) => (
          <polygon
            key={i}
            points={shard.points}
            fill="#141414"
            fillOpacity={shard.o}
            className="service-card-shard"
            style={
              {
                "--shard-x": `${shard.x}px`,
                "--shard-y": `${shard.y}px`,
                "--shard-r": `${shard.r}deg`,
                "--shard-delay": `${shard.delay}ms`,
              } as React.CSSProperties
            }
          />
        ))}
      </svg>
    </Link>
  );
}
