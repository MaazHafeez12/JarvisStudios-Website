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
    title: "The real problem is rarely the one in the brief",
    body: "You'll ask for a website. What's actually costing you money is usually somewhere else: missed calls, no follow-up, a quote that takes three days to send.",
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
    title: "We find it before we build anything",
    body: "Discovery isn't a formality. It's how we make sure the $1,000 project actually fixes the thing that's bleeding you money.",
    start: 0.42,
    end: 0.60,
    side: "right",
  },
  {
    id: "weave",
    title: "Then we build the smallest thing that fixes it",
    body: "Not a six-month platform. The fastest system that closes the gap.",
    start: 0.60,
    end: 0.78,
    side: "left",
  },
  {
    id: "signature",
    title: "And we hand it off working, not just shipped",
    body: "Launch means it's live and it's already doing the job, not \"here's your code, good luck.\"",
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
