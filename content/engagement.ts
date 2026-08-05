// Commercial terms for the Services page (docs/MOTION_REDESIGN.md follow-up
// work on /services). Structured, typed content — not a database
// (docs/ARCHITECTURE.md §4.6), same as services.ts and process.ts.
//
// The figures here are supplied facts about the business, not generated
// copy: $1,000 entry point, 4–8 week typical timeline, both fixed-scope and
// retainer engagements, free discovery. Anything beyond those four facts is
// framing and should be reviewed before it ships.
//
// Note on ordering: the price and the timeline are deliberately NOT
// adjacent in the grid. Read side by side they imply a ~$125–250/week rate,
// which misrepresents the work — $1,000 is the floor for a small,
// well-defined scope, while 4–8 weeks describes a typical project. The
// `detail` on each says so explicitly rather than relying on the reader.

export interface EngagementFact {
  label: string;
  value: string;
  detail: string;
}

export const ENGAGEMENT_FACTS: EngagementFact[] = [
  {
    label: "Discovery",
    value: "Free",
    detail:
      "We'll dig into your business, users, and constraints before either side commits to anything. No charge, no obligation.",
  },
  {
    label: "Projects start from",
    value: "$1,000",
    detail:
      "That's the entry point for a small, well-defined scope. Larger builds are quoted against the actual work — we'll give you a number before we start, not after.",
  },
  {
    label: "How we work together",
    value: "Fixed scope or retainer",
    detail:
      "Fixed scope when the brief is clear and the finish line is known. A retainer when the work is ongoing. We'll tell you which one we think fits.",
  },
  {
    label: "Typical timeline",
    value: "4–8 weeks",
    detail:
      "Most projects run four to eight weeks from kickoff to launch. Larger scopes take longer, and we'll say so upfront rather than discovering it halfway through.",
  },
];
