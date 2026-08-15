"use client";

import { useEffect, useRef, useState } from "react";
import { isConstrainedClient } from "@/lib/hero-capability";

// Scroll-scrubbed film (docs/MOTION_REDESIGN.md §5.8). Scroll position drives
// `video.currentTime` — the film has no clock of its own, so it moves exactly
// as far as the visitor moved it and stops when they stop.
//
// THE RESTING FRAME IS THE REAL COMPONENT. Reduced motion, a metered
// connection, a low-end device, no JS, and a decode failure all land on
// whatever sits behind this element and stay there, so the section must read
// completely without the film. Nothing load-bearing may exist only in the
// moving footage. The beats around it are live text for the same reason.
//
// This element is therefore transparent until it has real frames to show
// (`data-ready`), rather than covering that resting frame with a black box
// while it loads.
//
// ON THE ENCODE. The source must be **all-intra** — every frame a keyframe.
// With a normal GOP, a seek decodes forward from the last keyframe, so
// scrubbing backwards decodes most of a group per frame and the whole thing
// stutters in a way no amount of JS can fix. This costs file size (an
// all-I 1080p60 clip runs several times its inter-frame equivalent), which is
// what the resolution ladder below is for. If the film ever looks janky, check
// the encode before touching this file.

type ScrubSource = {
  /** Public path to an all-intra encode. */
  src: string;
  /** Serve this encode at or above this viewport width, in px. */
  minWidth: number;
  type?: string;
};

export function ScrubVideo({
  progressRef,
  sources,
  poster,
  className,
}: {
  /** Progress 0→1, written by lib/use-scroll-progress.ts. */
  progressRef: React.RefObject<number>;
  /** Resolution ladder, any order — the widest match for the viewport wins. */
  sources: ScrubSource[];
  /**
   * Optional. Only worth setting if there is nothing behind this element —
   * the thread film has an authored still underneath, which is a better
   * resting frame than a captured one and costs 2KB instead of 200.
   */
  poster?: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  // null until the client has decided. Staying null means "no video at all",
  // which is also the server render — so the poster is what SSR emits and
  // there is no layout shift when the decision lands.
  const [source, setSource] = useState<ScrubSource | null>(null);

  useEffect(() => {
    if (isConstrainedClient()) return;
    const width = window.innerWidth * (window.devicePixelRatio || 1);
    // Widest encode the viewport earns. Sorting here rather than trusting the
    // caller's order keeps the ladder declaration readable at the call site.
    const match = [...sources]
      .sort((a, b) => b.minWidth - a.minWidth)
      .find((s) => width >= s.minWidth);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSource(match ?? null);
  }, [sources]);

  // Fetch gate. `preload="none"` until the section is close, so a visitor who
  // never scrolls this far never pays for the film at all.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !source) return;

    const load = () => {
      video.preload = "auto";
      video.load();
    };

    if (!("IntersectionObserver" in window)) {
      load();
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        load();
        io.disconnect();
      },
      // Roughly one and a half viewports of warning. Enough for the first
      // frames to arrive before the frame grows into view; not so much that
      // it competes with anything above the fold for bandwidth.
      { rootMargin: "160%" },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [source]);

  // The scrub itself.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !source) return;

    let frame: number | null = null;
    let seeking = false;
    let last = -1;

    const seek = () => {
      frame = null;
      if (seeking) return;
      if (video.readyState < HTMLMediaElement.HAVE_METADATA) return;
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;

      const target = Math.min(
        video.duration,
        Math.max(0, progressRef.current * video.duration),
      );
      // Below roughly one frame at 60fps there is nothing to show for the
      // seek, and issuing it anyway is how the element ends up permanently
      // behind the scroll.
      if (Math.abs(video.currentTime - target) <= 0.025) return;

      seeking = true;
      video.currentTime = target;

      // The lock is released when the new frame is actually presented, not
      // when the assignment returns. Without it, a fast scroll queues seeks
      // faster than the decoder retires them and the film falls behind and
      // then jumps. `onSeeked` below is the release path for browsers with no
      // requestVideoFrameCallback.
      if ("requestVideoFrameCallback" in video) {
        video.requestVideoFrameCallback(() => {
          seeking = false;
          // Progress almost certainly moved while that frame decoded, so
          // chase it rather than waiting for the next tick.
          seek();
        });
      }
    };

    // Only tick while the film is on screen. The body is a compare-and-return
    // when nothing has scrolled, so an idle visitor costs one branch a frame.
    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (progressRef.current === last) return;
      last = progressRef.current;
      seek();
    };

    let running = false;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting === running) return;
      running = entry.isIntersecting;
      if (running) {
        frame = requestAnimationFrame(tick);
      } else if (frame !== null) {
        cancelAnimationFrame(frame);
        frame = null;
      }
    });
    io.observe(video);

    const onSeeked = () => {
      seeking = false;
    };
    video.addEventListener("seeked", onSeeked);

    // Reveal only once there are real frames to show. Setting the attribute
    // directly rather than through state keeps this off React's critical path
    // and out of the scroll loop's way.
    const onReady = () => {
      video.dataset.ready = "true";
    };
    video.addEventListener("loadeddata", onReady);

    return () => {
      io.disconnect();
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("loadeddata", onReady);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [source, progressRef]);

  return (
    <video
      ref={videoRef}
      className={className}
      poster={poster}
      preload="none"
      muted
      playsInline
      // Decorative. The section's meaning lives in the beat copy beside it,
      // which is real text (docs/MOTION_REDESIGN.md §6).
      aria-hidden="true"
      tabIndex={-1}
    >
      {source ? <source src={source.src} type={source.type ?? "video/mp4"} /> : null}
    </video>
  );
}
