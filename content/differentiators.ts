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
    title: "One team, the whole build",
    description:
      "Web, app, SaaS, CRM, and design under one roof — no hand-off gaps between an agency and a separate dev shop.",
  },
  {
    title: "Real software, not just a pitch deck",
    description:
      "We build what ships. Every engagement produces working software you can actually put in front of users.",
  },
  {
    title: "A process you can see",
    description:
      "Discovery, design, build, launch — you always know what stage your project is at and what's next.",
  },
];
