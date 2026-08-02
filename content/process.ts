// Structured content for the Services page process sequence
// (docs/DESIGN.md §3.2 "numbered step / tabbed sequence", §6.2).

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: 1,
    title: "Discovery",
    description:
      "We start by understanding your business, users, and constraints — not by jumping straight to a solution.",
  },
  {
    step: 2,
    title: "Design",
    description:
      "Wireframes and UI design grounded in what your users actually need, reviewed with you before any code is written.",
  },
  {
    step: 3,
    title: "Build",
    description:
      "Iterative development with regular check-ins, so you see progress continuously instead of waiting for a big reveal.",
  },
  {
    step: 4,
    title: "Launch",
    description:
      "We ship, monitor, and support the handoff — launch is the start of the relationship, not the end of it.",
  },
];
