"use client";

import { useRef } from "react";
import { ScrollStage } from "./ScrollStage";
import { ScrubVideo } from "./ScrubVideo";
import { ThreadStill } from "./ThreadStill";
import type { ThreadBeat } from "@/content/thread";

// The scroll-scrubbed film on /services (docs/MOTION_REDESIGN.md §5.8).
//
// A frame that starts as a card and grows into the viewport as the visitor
// scrolls in — its corners melting from 34px to square as it fills — with four
// beats of copy fading through beside it, each on its own sub-range.
//
// Layout, timing, and the reduced-motion alternative are all CSS (the `.film-*`
// block in globals.css). This file contributes the DOM and the beat ranges as
// custom properties, nothing else — there is no breakpoint branch here and no
// scroll value in React state.
//
// The beats are real text, not overlay decoration: under reduced motion, with
// no JS, and on a constrained device they stack below the poster and the
// section reads normally. Only the frame chrome and the film itself are
// aria-hidden.

// Module scope, not inline: this array is a dependency of ScrubVideo's source
// selection, and a fresh literal every render would re-run it every render.
// EMPTY UNTIL THE FILM EXISTS, and deliberately so: an empty ladder means
// ScrubVideo renders no <source> and never issues a request, so the section is
// exactly ThreadStill with nothing 404ing behind it. Pointing at files that
// are not there would cost every visitor a failed request for no picture.
//
// To turn the film on, drop the encodes in public/media/thread/ and fill this
// in — nothing else changes:
//
//   const SOURCES = [
//     { src: "/media/thread/thread-720.mp4",  minWidth: 0 },
//     { src: "/media/thread/thread-1080.mp4", minWidth: 1280 },
//     { src: "/media/thread/thread-1440.mp4", minWidth: 2200 },
//   ];
//
// They must be encoded **all-intra** — every frame a keyframe. Read the note
// at the top of ScrubVideo.tsx before producing them; a normal GOP will make
// the scrub stutter in a way no amount of code here can fix.
const SOURCES: { src: string; minWidth: number; type?: string }[] = [];

export function ThreadFilm({ beats }: { beats: ThreadBeat[] }) {
  const progressRef = useRef(0);

  return (
    <ScrollStage
      length={800}
      progressRef={progressRef}
      className="film-track"
      pinClassName="stage-pin--bleed film-pin"
    >
      {/* Position indicator, not task progress — deliberately not
          role="progressbar", which would announce on every scroll tick
          (docs/MOTION_REDESIGN.md §6). */}
      <span aria-hidden="true" className="film-progress">
        <span className="film-progress-fill" />
      </span>

      {/* Fades out as the frame takes over, so the section introduces itself
          once and then gets out of the way. */}
      <div className="film-intro">
        <h2 className="font-display text-2xl font-semibold text-balance sm:text-3xl">
          Pull the thread
        </h2>
        <p className="mt-3 max-w-sm text-[--text-secondary]">
          Every project has one detail that explains all the others.
        </p>
      </div>

      <div aria-hidden="true" className="film-frame">
        {/* The section's resting picture, and what it stays as if the film
            never loads. The video fades in over the top of it once it has
            frames to show. */}
        <ThreadStill className="film-still" />
        <ScrubVideo
          progressRef={progressRef}
          sources={SOURCES}
          className="film-video"
        />
        {/* Darkens the edges and the lower third so beat copy keeps its
            contrast over any frame of the film — the footage is authored, but
            not authored per-beat, so legibility cannot depend on what happens
            to be on screen. */}
        <span className="film-veil" />
      </div>

      <div className="film-beats">
        {beats.map((beat) => (
          <article
            key={beat.id}
            className="film-beat"
            data-side={beat.side}
            style={
              {
                "--start": beat.start,
                "--end": beat.end,
                "--side": beat.side === "left" ? -1 : 1,
              } as React.CSSProperties
            }
          >
            <h3 className="font-display text-xl font-semibold sm:text-2xl">
              {beat.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[--text-secondary]">
              {beat.body}
            </p>
          </article>
        ))}
      </div>
    </ScrollStage>
  );
}
