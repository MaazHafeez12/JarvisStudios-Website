import type { SVGProps } from "react";

// Shared drawing kit for the ten authored scenes — ServiceVignette.tsx's six
// service lines and ProcessVignette.tsx's four process steps. Both files used
// to carry their own copy of `Frame`, `hair` and `hairSoft`; they now share
// this one so the family stays a family instead of drifting apart the next
// time one of them is touched.
//
// WHY THESE PRIMITIVES EXIST AT ALL. The scenes previously drew every piece of
// text as a grey rounded bar on an unfilled outline, which is the skeleton-
// loader idiom exactly — visitors read them as interfaces that hadn't finished
// loading rather than as pictures of software. The fix is not a different
// medium, it's the three things real UI has and a wireframe doesn't: type
// (`Label`), filled surfaces at more than one elevation (`Surface`), and
// furniture (`Glyph`, `Avatar`). Bars survive only where real UI genuinely
// shows blocks — runs of body copy, table cells, code — because at 480x320 a
// paragraph *is* a bar.
//
// Everything here is server-rendered and dependency-free. No `"use client"`:
// both scene files are imported by app/page.tsx and app/services/page.tsx and
// passed down as slots specifically to keep them out of the client bundle
// (see ServiceTour.tsx:37-51).

export const ACCENT = "#00ADEF";

/**
 * The accent as *text or a glyph*, which is a different problem from the
 * accent as a fill. docs/DESIGN.md §2.2 records that brand-500 on white is
 * 2.55:1 — it fails even the 3:1 UI-component minimum — which is why the
 * light theme maps `--accent` to brand-800 instead. A blue swatch, pill or
 * area fill is a mark and can stay the literal brand value in both themes; a
 * blue *word* has to follow the token or it dissolves in light mode.
 */
export const ACCENT_TEXT = "var(--accent)";

export const hair = { stroke: "currentColor", strokeOpacity: 0.32, strokeWidth: 1 };
export const hairSoft = { stroke: "currentColor", strokeOpacity: 0.18, strokeWidth: 1 };

/**
 * Elevation ladder, as tints of the current text colour.
 *
 * Deliberately relative rather than absolute: a scene is dropped onto
 * `--surface-raised` on the homepage stage and inside ServiceExplorer's cards,
 * but the tokens differ per theme, and a hard-coded panel colour that reads as
 * "raised" on the charcoal ground is invisible on the light one. A tint of
 * currentColor lightens against dark and darkens against light, so one number
 * is correct in both without the scene knowing which ground it landed on.
 */
export const FILL = {
  /** The ground inside a frame — a browser viewport, a phone screen. */
  base: 0.045,
  /** A card, a row, a sidebar: one step up from the ground. */
  panel: 0.085,
  /** Inset chrome — a search field, a selected row, an avatar disc. */
  inset: 0.13,
} as const;

/** Shared canvas. 3:2, generous inset, so every scene sits on one grid. */
export function Frame({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 480 320"
      className={`h-full w-full text-[--text-secondary]${className ? ` ${className}` : ""}`}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

const TONE = {
  /** Headings and the one or two labels the eye should land on first. */
  primary: { fill: "var(--text-primary)", fillOpacity: 0.92 },
  /** Ordinary interface labels — nav items, column headers, tab names. */
  secondary: { fill: "currentColor", fillOpacity: 0.85 },
  /** Metadata: timestamps, counts, captions. */
  muted: { fill: "currentColor", fillOpacity: 0.5 },
  accent: { fill: ACCENT_TEXT, fillOpacity: 1 },
} as const;

/**
 * Real text, which is the single biggest reason these no longer read as
 * loading states.
 *
 * Generic interface nouns only — "Overview", "Qualified", "Review". PRODUCT.md
 * :58 records that no client screenshots or delivered work exist, and :61 that
 * imagery here is authored and clearly generic; a scene that named a client or
 * showed a metric would be fabricating exactly the evidence the site has
 * consistently refused to invent.
 */
export function Label({
  x,
  y,
  size = 10,
  weight = 500,
  tone = "secondary",
  anchor,
  tracking,
  display = false,
  children,
}: {
  x: number;
  y: number;
  size?: number;
  weight?: number;
  tone?: keyof typeof TONE;
  anchor?: "start" | "middle" | "end";
  tracking?: number;
  /** Clash Display rather than Inter — headings, and the type specimen. */
  display?: boolean;
  children: React.ReactNode;
}) {
  return (
    <text
      x={x}
      y={y}
      fontSize={size}
      fontWeight={weight}
      fontFamily={
        display ? "var(--font-clash-display), sans-serif" : "var(--font-inter), sans-serif"
      }
      textAnchor={anchor}
      letterSpacing={tracking}
      {...TONE[tone]}
    >
      {children}
    </text>
  );
}

/** A filled, bordered rectangle: a card, a panel, a field. */
export function Surface({
  x,
  y,
  width,
  height,
  rx = 6,
  level = "panel",
  border = "soft",
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  rx?: number;
  level?: keyof typeof FILL;
  border?: "soft" | "hair" | "none";
}) {
  const box = { x, y, width, height, rx };
  return (
    <>
      <rect {...box} fill="currentColor" fillOpacity={FILL[level]} />
      {border === "none" ? null : <rect {...box} {...(border === "hair" ? hair : hairSoft)} />}
    </>
  );
}

/**
 * A person, at 16px. Rows of records in real software almost always carry one,
 * and its absence is part of what made the list scenes read as placeholder.
 */
export function Avatar({ cx, cy, r = 8 }: { cx: number; cy: number; r?: number }) {
  return (
    <g fill="currentColor">
      <circle cx={cx} cy={cy} r={r} fillOpacity={FILL.inset} />
      <circle cx={cx} cy={cy - r * 0.24} r={r * 0.3} fillOpacity="0.4" />
      <path
        d={`M${cx - r * 0.56} ${cy + r * 0.68} a ${r * 0.56} ${r * 0.5} 0 0 1 ${r * 1.12} 0 Z`}
        fillOpacity="0.4"
      />
    </g>
  );
}

// A small stroked icon set on a 16x16 grid. Stroked rather than filled so the
// glyphs sit at the same weight as the hairlines around them.
const ICONS = {
  search: "M7 2a5 5 0 1 0 0 10A5 5 0 0 0 7 2M10.6 10.6 14 14",
  home: "M2.5 7 8 2.5 13.5 7v6.5h-11Z",
  list: "M3 4h10M3 8h10M3 12h7",
  grid: "M2.5 2.5h4.5v4.5h-4.5Zm6.5 0h4.5v4.5h-4.5Zm-6.5 6.5h4.5v4.5h-4.5Zm6.5 0h4.5v4.5h-4.5Z",
  chart: "M2.5 13.5V9m3.5 4.5v-8m3.5 8V7m3.5 6.5V3.5",
  user: "M8 2.5a2.6 2.6 0 1 0 0 5.2 2.6 2.6 0 0 0 0-5.2M2.8 13.8a5.2 5.2 0 0 1 10.4 0",
  bolt: "M9 1.5 3.5 9H8l-1 5.5L12.5 7H8Z",
  gear: "M8 5.6a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8M8 1.5v2m0 9v2m6.5-6.5h-2m-9 0h-2m10.6-4.6-1.4 1.4m-6.4 6.4-1.4 1.4m9.2 0-1.4-1.4m-6.4-6.4L3.4 3.4",
  inbox: "M2 8.5h3.5l1 2h3l1-2H14M2 8.5 3.8 3h8.4L14 8.5v4.5H2Z",
  check: "M3 8.4 6.4 12 13 4",
} as const;

export function Glyph({
  name,
  x,
  y,
  size = 14,
  opacity = 0.5,
  color,
}: {
  name: keyof typeof ICONS;
  /** Top-left of the glyph's box, not its centre. */
  x: number;
  y: number;
  size?: number;
  opacity?: number;
  color?: string;
}) {
  const scale = size / 16;
  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale})`}
      stroke={color ?? "currentColor"}
      strokeOpacity={opacity}
      // Divided back out so every glyph draws at the same visual weight
      // regardless of the size it was placed at.
      strokeWidth={1.4 / scale}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    >
      <path d={ICONS[name]} />
    </g>
  );
}

/** A run of body copy. The one place a grey bar is still the honest drawing. */
export function TextRun({
  x,
  y,
  width,
  height = 6,
  opacity = 0.16,
  ...rest
}: {
  x: number;
  y: number;
  width: number;
  height?: number;
  opacity?: number;
} & Omit<SVGProps<SVGRectElement>, "x" | "y" | "width" | "height" | "opacity">) {
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      rx="2"
      fill="currentColor"
      fillOpacity={opacity}
      {...rest}
    />
  );
}

/**
 * Drop-in slot for a real screenshot.
 *
 * Painted *inside* the same `Frame`, as an SVG `<image>`, rather than swapped
 * in as a `next/image` sibling: the scene's box, aspect ratio and clip-path
 * wipe all come from that `<svg>`, and every consumer — the pinned tour stage,
 * ServiceExplorer's cards, the mobile snap rail — sizes itself against it.
 * Replacing the element would mean re-deriving all of that per surface.
 *
 * The CSP already allows it (`img-src 'self' data:`, next.config.ts:18). Put a
 * pre-optimised WebP in public/vignettes/, point the map in the scene file at
 * it, and that one scene becomes a photograph while the other nine stay drawn.
 */
export function SceneImage({ src }: { src: string }) {
  return (
    <image
      href={src}
      x="0"
      y="0"
      width="480"
      height="320"
      preserveAspectRatio="xMidYMid slice"
    />
  );
}
