import { useEffect } from "react";

// The site's one scroll-scrub mechanism (docs/MOTION_REDESIGN.md §5.8).
//
// Writes exactly one number — `--p`, a track's scroll progress from 0 to 1 —
// onto a pinned element. Everything else is derived in CSS off that number. A
// beat that should appear a third of the way in is:
//
//   --beat: clamp(0, calc((var(--p) - 0.33) / 0.05), 1);
//
// See the `.stage-*` block in globals.css for the remap convention.
//
// This is the hook rather than a component because the two service tours own
// their own DOM: their track is a two-column grid and the pinned stage is one
// of its children, so there is no wrapper element to hand them. Sections that
// don't have that constraint should use <ScrollStage>, which is a thin shell
// over this.
//
// Three rules govern this file. The first two are inherited from
// ServiceTour.tsx, which states them at length; they apply here unchanged:
//
//  1. **Every layout decision lives in CSS, none in JS.** No breakpoint or
//     reduced-motion render branch, so the server HTML and the hydrated tree
//     are byte-identical and there is no CLS window.
//  2. **Scroll position never becomes React state.** `--p` is written straight
//     to the element with setProperty. Nothing here renders on scroll.
//  3. **No layout reads inside the scroll callback.** The track's offset and
//     range are measured on mount, on resize, and when the track re-enters the
//     viewport — never per frame. The callback is arithmetic and one
//     setProperty. Calling getBoundingClientRect() in there instead would
//     force a synchronous layout on every scroll frame, which is the usual way
//     a section like this ends up janky for no visible reason.
//
// The mechanism only ever *reads* scroll: no wheel interception, no
// scrollTo(), no snapping (docs/MOTION_REDESIGN.md §5.5 decision 5).

export function useScrollProgress(
  /** The tall element that defines the scroll range. */
  trackRef: React.RefObject<HTMLElement | null>,
  /** The pinned element that receives `--p`. May be the track itself. */
  pinRef: React.RefObject<HTMLElement | null>,
  /**
   * Optional escape hatch for consumers that need progress as a JS number
   * rather than a CSS variable — currently only the R3F hero, whose useFrame
   * loop cannot read custom properties. Written on the same frame as `--p`.
   * A ref, not state, on purpose: see rule 2.
   */
  progressRef?: React.RefObject<number>,
) {
  useEffect(() => {
    const track = trackRef.current;
    const pin = pinRef.current;
    if (!track || !pin) return;

    // <MotionConfig reducedMotion="user"> governs Motion components and does
    // nothing for the CSS that drives these sections (docs/MOTION_REDESIGN.md
    // §5 item 1). On that path the track is height:auto and the pin is
    // static, so there is no progress to report — bail before attaching
    // anything, and leave `--p` at its @property initial value of 0.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let top = 0;
    let range = 1;
    let frame: number | null = null;

    const measure = () => {
      top = track.getBoundingClientRect().top + window.scrollY;
      // The pin travels for the track's height minus the one viewport it
      // occupies. Flooring at 1 keeps the division safe if the track is
      // shorter than the viewport (a mis-set length, or a very tall phone).
      range = Math.max(1, track.offsetHeight - window.innerHeight);
    };

    const write = () => {
      frame = null;
      const raw = (window.scrollY - top) / range;
      const p = raw < 0 ? 0 : raw > 1 ? 1 : raw;
      // Four decimals is finer than a single device pixel of travel across an
      // 800svh track, and keeps the string short — this value is re-parsed by
      // the style system on every frame it changes.
      pin.style.setProperty("--p", p.toFixed(4));
      if (progressRef) progressRef.current = p;
    };

    // Scroll events fire faster than frames on most trackpads, so coalesce.
    const schedule = () => {
      if (frame === null) frame = requestAnimationFrame(write);
    };

    const onResize = () => {
      measure();
      schedule();
    };

    // Park the listener while the track is off-screen — the same treatment
    // HeroScene gives its render loop. Re-measuring on entry also covers the
    // case where the track's offset moved while we weren't watching (a font
    // swap above it, a route-level layout settling).
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          measure();
          schedule();
          window.addEventListener("scroll", schedule, { passive: true });
        } else {
          window.removeEventListener("scroll", schedule);
        }
      },
      { rootMargin: "120px" },
    );
    io.observe(track);

    // Paint the correct state immediately: a visitor arriving on a deep link
    // or restoring a scroll position must not see frame zero before the first
    // scroll event.
    measure();
    write();
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [trackRef, pinRef, progressRef]);
}
