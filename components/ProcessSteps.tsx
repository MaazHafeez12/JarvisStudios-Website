"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PROCESS_STEPS } from "@/content/process";

// Numbered step / tabbed sequence pattern (docs/DESIGN.md §3.2) — modeled
// structurally on senthora.ai's "4 steps" pattern (docs/DESIGN.md §9): a
// horizontal step indicator where the active step's detail animates in,
// rather than a static 4-column grid.
//
// The ARIA tab pattern here is implemented in full, which it previously
// wasn't: the buttons carried role="tab" and aria-selected but there was no
// role="tabpanel", no aria-controls/id wiring, no roving tabindex and no
// arrow-key handling. Announcing "tab" to a screen reader and then exposing
// nothing it controls is worse than using no roles at all, so the choice is
// to implement the pattern or drop the roles — not to leave it half-done.
// See the WAI-ARIA Authoring Practices "Tabs" pattern.

const TAB_ID = (step: number) => `process-tab-${step}`;

// A single panel whose contents swap, so its id is stable and every tab
// points at it. Giving each tab its own `process-panel-N` id would leave
// three of the four aria-controls dangling at elements that are never
// rendered — a broken reference is its own defect, not a smaller version
// of the missing-tabpanel problem this component previously had. The
// alternative (render all four panels, hide the inactive ones) would mean
// dropping the AnimatePresence crossfade for no accessibility gain.
const PANEL_ID = "process-panel";

export function ProcessSteps() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const step = PROCESS_STEPS[active];

  // Arrow/Home/End move selection *and* focus, per the APG's automatic-
  // activation tab pattern. Without this a keyboard user can reach the
  // tablist but can't move between tabs, since roving tabindex takes the
  // inactive ones out of the tab sequence.
  function onKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    const last = PROCESS_STEPS.length - 1;
    let next: number | null = null;

    if (event.key === "ArrowRight") next = active === last ? 0 : active + 1;
    else if (event.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;

    if (next === null) return;
    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div>
      <div className="flex gap-2" role="tablist" aria-label="Our process">
        {PROCESS_STEPS.map((s, i) => (
          <button
            key={s.step}
            ref={(node) => {
              tabRefs.current[i] = node;
            }}
            type="button"
            role="tab"
            id={TAB_ID(s.step)}
            aria-selected={active === i}
            aria-controls={PANEL_ID}
            // Roving tabindex: only the selected tab is in the tab
            // sequence; the rest are reached with arrow keys.
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={onKeyDown}
            className={`flex-1 border-b-2 pb-3 text-left transition-colors duration-150 ease-confident ${
              active === i
                ? "border-[--accent]"
                : "border-[--border] hover:border-[--text-secondary]"
            }`}
          >
            <span
              className={`font-mono text-xs ${
                active === i ? "text-[--accent]" : "text-[--text-secondary]"
              }`}
            >
              0{s.step}
            </span>
            <p
              className={`mt-1 text-sm font-medium ${
                active === i ? "text-[--text-primary]" : "text-[--text-secondary]"
              }`}
            >
              {s.title}
            </p>
          </button>
        ))}
      </div>

      {/* The panel element itself is stable; only its contents swap, and
          aria-labelledby re-points at whichever tab is active. Keying the
          panel per step instead would tear down and rebuild the very node
          AT is pointing at. */}
      <div
        role="tabpanel"
        id={PANEL_ID}
        aria-labelledby={TAB_ID(step.step)}
        tabIndex={0}
        className="mt-8 min-h-[4rem]"
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={step.step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl text-[--text-secondary]"
          >
            {step.description}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
