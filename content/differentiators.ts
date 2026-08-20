// "Why Jarvis Studios" content for the About page alternating blocks
// (docs/DESIGN.md §6.4). General positioning copy — not factual claims
// about specific people, so safe to author directly (unlike team bios,
// see app/about/page.tsx).

export interface Differentiator {
  title: string;
  description: string;
}

export const DIFFERENTIATORS: Differentiator[] = [
  {
    title: "You'll know exactly what you're getting before you pay anything",
    description: "Real scope, real price, in 48 hours. No vague retainers.",
  },
  {
    title: "We build it, we launch it, we make sure it works",
    description:
      "Discovery, build, launch, and support after. Not a handoff into silence.",
  },
  {
    title: "You can reach a real person, not a ticket queue",
    description:
      "Direct line to who's actually building your project.",
  },
];
