// Structured content for the Services page process sequence
// (docs/DESIGN.md §3.2 "numbered step / tabbed sequence", §6.2).

/**
 * Stable identifier, separate from `step`. The scene lookup in
 * ProcessVignette keys on this rather than on the ordinal or on a lowercased
 * title: reordering the sequence would silently repoint every visual, and a
 * title is copy, which is edited without anyone thinking about what it keys.
 */
export type ProcessStepId = "discovery" | "design" | "build" | "launch";

export interface ProcessStep {
  id: ProcessStepId;
  step: number;
  title: string;
  description: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    id: "discovery",
    step: 1,
    title: "Discovery",
    description:
      "We start by understanding your business, users, and constraints — not by jumping straight to a solution.",
  },
  {
    id: "design",
    step: 2,
    title: "Design",
    description:
      "Wireframes and UI design grounded in what your users actually need, reviewed with you before any code is written.",
  },
  {
    id: "build",
    step: 3,
    title: "Build",
    description:
      "Iterative development with regular check-ins, so you see progress continuously instead of waiting for a big reveal.",
  },
  {
    id: "launch",
    step: 4,
    title: "Launch",
    description:
      "We ship, monitor, and support the handoff — launch is the start of the relationship, not the end of it.",
  },
];
