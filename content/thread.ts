// Copy for the scroll-scrubbed film on /services
// (docs/MOTION_REDESIGN.md §5.8).
//
// Four beats, each owning a sub-range of the film's scroll. The ranges are
// fractions of the track, so they stay correct if the track's length changes —
// but they must stay in order and must not overlap by more than the fade
// width, or two beats will be legible at once over the same frame.
//
// This is the section's actual content. The film behind it is decorative and
// may never load; every claim lives here, as text.

export interface ThreadBeat {
  id: string;
  title: string;
  body: string;
  /** Fraction of the track where the beat starts fading in. */
  start: number;
  /** Fraction where it has finished fading out. */
  end: number;
  /** Which side of the frame it sits on. */
  side: "left" | "right";
}

export const THREAD_BEATS: ThreadBeat[] = [
  {
    id: "thread",
    title: "The thread",
    body: "Every project has one detail that explains all the others. Usually it is not the one in the brief.",
    // Tuned against the measured handoff, not by eye. Each beat change leaves
    // a short stretch with nothing legible — about 110px of scroll, which
    // reads as a deliberate cut. At 0.24 this first one was 226px, twice the
    // others, and that reads as a stall instead. 0.22 brings it into line
    // while the intro is still only at ~0.2 opacity, so the two never compete.
    start: 0.22,
    end: 0.42,
    side: "left",
  },
  {
    id: "pull",
    title: "The pull",
    body: "We follow it past the obvious answer, because the obvious answer is the one you already tried.",
    start: 0.42,
    end: 0.60,
    side: "right",
  },
  {
    id: "weave",
    title: "The weave",
    body: "Design gives it a shape. Engineering makes it hold. Neither happens after the other is finished.",
    start: 0.60,
    end: 0.78,
    side: "left",
  },
  {
    id: "signature",
    title: "The signature",
    body: "What ships should be unmistakably yours — not a template with your logo dropped into it.",
    // Past 1 on purpose: an `end` inside the track leaves the last stretch of
    // scroll showing an empty frame with nothing to read, which is the one
    // place a pinned section feels broken rather than finished. Ending beyond
    // the track means the closing beat is still fully legible when the pin
    // releases.
    start: 0.78,
    end: 1.05,
    side: "right",
  },
];
