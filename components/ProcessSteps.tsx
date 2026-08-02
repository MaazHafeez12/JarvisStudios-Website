"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PROCESS_STEPS } from "@/content/process";

// Numbered step / tabbed sequence pattern (docs/DESIGN.md §3.2) — modeled
// structurally on senthora.ai's "4 steps" pattern (docs/DESIGN.md §9): a
// horizontal step indicator where the active step's detail animates in,
// rather than a static 4-column grid.
export function ProcessSteps() {
  const [active, setActive] = useState(0);
  const step = PROCESS_STEPS[active];

  return (
    <div>
      <div className="flex gap-2" role="tablist" aria-label="Our process">
        {PROCESS_STEPS.map((s, i) => (
          <button
            key={s.step}
            type="button"
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
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

      <div className="mt-8 min-h-[4rem]">
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
