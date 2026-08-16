import Link from "next/link";

/**
 * The Jarvis Studios monogram, inlined.
 *
 * This used to be an <img src="/logo.svg"> contained inside a fixed black
 * rounded box. Both of those existed for the same reason: the old asset was
 * ~250KB of auto-traced path data with a black rectangle baked in, which
 * could not safely be made transparent by hand (docs/DESIGN.md §2.1), and was
 * far too heavy to inline. The clean redraw closes docs/DESIGN.md §10, and
 * with it both workarounds go:
 *
 *  - **Inlined rather than fetched.** Three polygons is well under the weight
 *    of the extra request it replaces, and inlining is what makes the next
 *    point possible at all.
 *  - **The "J" is `currentColor`, so the mark follows the theme.** An SVG
 *    referenced through <img> is an isolated document — `currentColor` there
 *    resolves against the SVG's own root, not the page — so a themed mark is
 *    only reachable inline. The redraw ships its "J" white, which is correct
 *    for a standalone brand asset and invisible on this site's light surface.
 *  - **No container, and the real aspect ratio.** The old box cropped a
 *    square out of the mark with `object-cover`; the mark is 4:3.
 *
 * The blue stays literal rather than `--accent`: `--accent` darkens to
 * brand-800 in light mode for WCAG contrast on text, and a logo is not text.
 * Per DESIGN.md §2.1 the white/blue split between the letterforms is the
 * mark's signature detail and must never be swapped.
 */
function LogoMark() {
  return (
    <svg
      viewBox="0 0 285.06 214.44"
      // h-7, not h-9. At 36px the mark stood more than twice the height of
      // the 16px wordmark beside it and read as a badge with a caption rather
      // than as a lockup; 28px sits closer to cap-height-plus-a-bit, which is
      // the usual relationship.
      //
      // Safe for --nav-h *only* because the mark is not what sets it: the
      // header's height comes from py-4 (32) plus its tallest control (36),
      // which on desktop is the CTA's py-2/text-sm and on mobile the h-9 menu
      // button. Both still measure 36, so the nav stays 69px and every pinned
      // surface stays aligned (globals.css:95). Shrink those and this stops
      // being true — check the measurement, don't assume it.
      className="h-7 w-auto text-[--text-primary]"
      aria-hidden="true"
      focusable="false"
    >
      <polygon
        fill="#00ADEF"
        points="285.06 75.65 285.06 0 155.72 0 155.72 101.36 156.77 101.85 156.77 102.25 232.01 138.62 232.01 173.44 155.72 138.79 155.72 214.44 285.06 214.44 285.06 113.08 284 112.59 284 112.19 208.77 75.83 208.77 41.01 285.06 75.65"
      />
      <g fill="currentColor">
        <polygon points="90.33 171.81 53.05 171.81 53.05 150.23 0 150.23 0 171.81 0 214.36 0 214.44 53.05 214.44 53.05 214.36 90.33 214.36 90.33 214.44 143.38 214.44 143.38 214.36 143.38 171.81 143.38 107.22 90.33 107.22 90.33 171.81" />
        <polygon points="90.33 0 34.39 0 34.39 42.56 90.33 42.56 90.33 64.67 143.38 64.67 143.38 42.56 143.38 0 90.33 0" />
      </g>
    </svg>
  );
}

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 rounded-md"
      aria-label="Jarvis Studios — home"
    >
      <LogoMark />
      <span className="font-display text-base font-semibold tracking-tight text-[--text-primary]">
        Jarvis Studios
      </span>
    </Link>
  );
}
